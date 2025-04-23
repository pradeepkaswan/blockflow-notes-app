
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SummaryButtonProps {
  content: any;
}

export function SummaryButton({ content }: SummaryButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string>("");

  const handleSummarize = async () => {
    try {
      setIsLoading(true);
      
      // Extract text content from EditorJS blocks
      const textContent = content.blocks
        .map((block: any) => {
          if (block.type === 'paragraph') {
            return block.data.text;
          }
          if (block.type === 'header') {
            return block.data.text;
          }
          return '';
        })
        .join('\n\n');

      if (!textContent.trim()) {
        toast({
          title: "No content to summarize",
          description: "Please add some text content first.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('summarize', {
        body: { content: textContent },
      });

      if (error) throw error;

      setSummary(data.summary);
      toast({
        title: "Summary generated",
        description: "Your content has been summarized successfully.",
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error generating summary",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleSummarize}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Summarizing...
          </>
        ) : (
          'Summarize'
        )}
      </Button>
      
      {summary && (
        <div className="mt-4 p-4 bg-secondary rounded-md">
          <h3 className="font-semibold mb-2">Summary</h3>
          <p className="text-sm">{summary}</p>
        </div>
      )}
    </div>
  );
}
