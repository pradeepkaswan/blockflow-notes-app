
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-6">
        <h1 className="text-4xl font-bold mb-4 text-notion-text">BlockFlow</h1>
        <p className="text-xl text-notion-text-muted mb-8">
          A Notion-style block editor for your notes
        </p>
        <Button 
          onClick={() => navigate("/dashboard")}
          className="bg-notion-purple hover:bg-notion-purple/90 text-white"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
