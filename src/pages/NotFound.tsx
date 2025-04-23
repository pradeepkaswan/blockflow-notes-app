
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-notion-purple">404</h1>
        <p className="text-xl text-notion-text-muted mb-6">
          Oops! This page doesn't exist
        </p>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="border-notion-border"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
