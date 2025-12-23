import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, User } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple authentication
    if (username === "nany" && password === "123") {
      // Store token in localStorage
      const token = btoa(`${username}:${password}`);
      localStorage.setItem("adminToken", token);
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("adminUsername", username);

      toast.success("Login successful!", {
        description: "Welcome to the admin dashboard",
      });
      navigate("/admin/dashboard");
    } else if (username === "ram@123" && password === "123") {
      // Delivery Boy Login
      const token = btoa(`${username}:${password}`);
      localStorage.setItem("deliveryToken", token);
      localStorage.setItem("userRole", "delivery");
      localStorage.setItem("adminUsername", "Ram"); // Display name

      toast.success("Login successful!", {
        description: "Welcome to the delivery dashboard",
      });
      navigate("/delivery/dashboard");
    } else {
      toast.error("Login failed", {
        description: "Invalid username or password",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Cycle Harmony</h1>
          <p className="text-muted-foreground">Admin Portal</p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Demo Credentials:</p>
              <p className="font-mono mt-1">Admin: nany | 123</p>
              <p className="font-mono mt-1">Delivery: ram@123 | 123</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground transition-colors">
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}


