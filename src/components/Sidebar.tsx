
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  FileText,
  Menu as MenuIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePageStore } from "@/stores/pageStore";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { pages, addPage } = usePageStore();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);

  const handleAddPage = () => {
    const newPage = addPage();
    navigate(`/page/${newPage.id}`);
  };
  
  return (
    <div 
      className={cn(
        "border-r bg-notion-sidebar transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0 overflow-hidden",
      )}
    >
      <div className="h-14 border-b px-4 flex items-center justify-between">
        <h1 className="font-semibold">BlockFlow</h1>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsOpen(false)}
          className="lg:hidden"
        >
          <MenuIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-2">
        <div className="flex items-center justify-between p-2 text-sm">
          <div 
            className="flex items-center gap-1 cursor-pointer" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span>Pages</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5"
            onClick={handleAddPage}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        {expanded && (
          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="pl-4">
              {pages.map((page) => (
                <Link 
                  key={page.id}
                  to={`/page/${page.id}`}
                  className="flex items-center gap-2 p-1 text-sm rounded-sm hover:bg-notion-hover my-1"
                >
                  <FileText className="h-4 w-4 text-notion-text-muted" />
                  <span className="truncate">{page.title || "Untitled"}</span>
                </Link>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
