
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { usePageStore } from "@/stores/pageStore";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import EditorComponent from "@/components/EditorComponent";
import { debounce } from "@/lib/utils";

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const { pages, updatePage } = usePageStore();
  const { toast } = useToast();
  const page = pages.find(p => p.id === id);
  const [title, setTitle] = useState(page?.title || "");
  
  const debouncedUpdate = useRef(
    debounce((title: string) => {
      if (!page || !id) return;
      updatePage(id, { ...page, title });
      
      toast({
        title: "Saved",
        description: "Your changes have been saved",
        duration: 2000,
      });
    }, 1000)
  ).current;
  
  useEffect(() => {
    if (page) {
      setTitle(page.title);
    }
  }, [page?.id]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedUpdate(newTitle);
  };
  
  if (!page) {
    return <div className="p-6">Page not found</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled"
          className="text-3xl font-bold border-none p-0 h-auto focus-visible:ring-0 bg-transparent"
        />
      </div>
      <EditorComponent pageId={id} content={page.content} />
    </div>
  );
};

export default Editor;
