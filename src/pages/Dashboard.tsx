
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageStore } from "@/stores/pageStore";

const Dashboard = () => {
  const { pages, addPage } = usePageStore();
  const navigate = useNavigate();
  
  const handleAddPage = () => {
    const newPage = addPage();
    navigate(`/dashboard/page/${newPage.id}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Pages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="h-32 border-dashed flex flex-col gap-2"
          onClick={handleAddPage}
        >
          <Plus className="h-6 w-6" />
          <span>New Page</span>
        </Button>
        
        {pages.map(page => (
          <div 
            key={page.id} 
            className="border rounded-md h-32 p-4 hover:border-notion-purple cursor-pointer shadow-sm hover:shadow transition-all"
            onClick={() => navigate(`/dashboard/page/${page.id}`)}
          >
            <h3 className="font-medium truncate">{page.title || "Untitled"}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
