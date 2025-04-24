
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { usePageStore } from "@/stores/pageStore";
import { debounce } from "@/lib/utils";

// Define EditorJS and its tools without direct imports to avoid SSR issues
interface EditorJSProps {
  pageId: string;
  content: any;
}

const EditorComponent = ({ pageId, content }: EditorJSProps) => {
  const editorRef = useRef<any>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const { updatePage, getPage } = usePageStore();
  const { toast } = useToast();
  const initializedRef = useRef<boolean>(false);
  
  // Use debounced save to prevent too frequent updates
  const debouncedSave = useRef(
    debounce(async (savedData: any) => {
      try {
        const currentPage = getPage(pageId);
        if (currentPage) {
          updatePage(pageId, { content: savedData });
        }
      } catch (e) {
        console.error('Failed to save editor data', e);
      }
    }, 500)
  ).current;
  
  useEffect(() => {
    // Only initialize the editor once to prevent cursor reset issues
    if (initializedRef.current) return;
    
    let EditorJS: any;
    let Header: any;
    let Paragraph: any;
    let Checklist: any;
    let Table: any;
    let ImageTool: any;
    
    // Dynamically import EditorJS and tools
    const loadEditorJS = async () => {
      try {
        const EditorJSModule = await import('@editorjs/editorjs');
        const HeaderModule = await import('@editorjs/header');
        const ParagraphModule = await import('@editorjs/paragraph');
        const ChecklistModule = await import('@editorjs/checklist');
        const TableModule = await import('@editorjs/table');
        const ImageModule = await import('@editorjs/image');
        
        EditorJS = EditorJSModule.default;
        Header = HeaderModule.default;
        Paragraph = ParagraphModule.default;
        Checklist = ChecklistModule.default;
        Table = TableModule.default;
        ImageTool = ImageModule.default;

        // Clear previous editor instance if exists
        if (editorRef.current) {
          editorRef.current.destroy();
          editorRef.current = null;
        }

        // Initialize editor
        const editor = new EditorJS({
          holder: 'editorjs',
          tools: {
            header: {
              class: Header,
              inlineToolbar: true,
              config: {
                levels: [1, 2, 3],
                defaultLevel: 1
              }
            },
            paragraph: {
              class: Paragraph,
              inlineToolbar: true
            },
            checklist: {
              class: Checklist,
              inlineToolbar: true
            },
            table: {
              class: Table,
              inlineToolbar: true
            },
            image: {
              class: ImageTool,
              config: {
                uploader: {
                  uploadByFile(file: File) {
                    // For now, we'll use a placeholder image since we don't have Supabase storage yet
                    return Promise.resolve({
                      success: 1,
                      file: {
                        url: URL.createObjectURL(file),
                      }
                    });
                  }
                }
              }
            }
          },
          data: content || {},
          onChange: async () => {
            try {
              const savedData = await editor.save();
              debouncedSave(savedData);
            } catch (e) {
              console.error('Failed to save editor data', e);
            }
          },
          autofocus: true,
        });
        
        editorRef.current = editor;
        setEditorInstance(editor);
        initializedRef.current = true;
      } catch (error) {
        console.error('Failed to initialize editor', error);
        toast({
          title: "Error",
          description: "Failed to initialize editor",
          variant: "destructive",
        });
      }
    };
    
    loadEditorJS();
    
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
        initializedRef.current = false;
      }
    };
  }, [pageId]);
  
  return (
    <div className="min-h-[500px] prose max-w-none">
      <div id="editorjs" className="min-h-[300px]"></div>
    </div>
  );
};

export default EditorComponent;
