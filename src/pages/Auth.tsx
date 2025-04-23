
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = isLogin 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: isLogin ? "Logged in successfully" : "Account created successfully"
      });
      
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });

      if (error) {
        toast({
          title: "Google Sign In Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-notion-text">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="mt-2 text-notion-text-muted">
            {isLogin 
              ? 'Sign in to continue to BlockFlow' 
              : 'Create a new account to get started'}
          </p>
        </div>
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <Button type="submit" className="w-full bg-notion-purple">
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleGoogleSignIn}
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>

        <p className="text-center text-sm text-notion-text-muted">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-notion-purple hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
