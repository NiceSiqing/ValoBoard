import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, {useState} from "react";
import {supabase} from "@/supabase"

interface LoginTabsProps {
  onLoginSuccess: () => void;
}

export default function LoginTabs({onLoginSuccess}:LoginTabsProps) {
  const [activeTab, setActiveTab] = useState("register");
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem("register-email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("register-password") as HTMLInputElement).value;
    const confirm = (form.elements.namedItem("confirm-password") as HTMLInputElement).value;
    if (!email || !password) {
      alert("Please fill all fields.");
      return;
    }
    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert("Registration failed: " + error.message);
    } else {
      alert("Registration successful! Please check your email for the verification link.");
      setActiveTab("login");
    }
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem("login-email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("login-password") as HTMLInputElement).value;
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Login failed: " + error.message);
    } else {
      onLoginSuccess();
    }
  }


  return (
      <div className="w-full">
        {/* 自定义Tab切换器 */}
        <div className="relative mb-5">
          <div className="relative bg-gray-50 p-1 rounded-xl h-14 border border-gray-200">
            {/* 滑动指示器 */}
            <div 
              className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 ease-out ${
                activeTab === "register" ? "left-1" : "left-1/2"
              }`}
            />
            
            {/* Tab按钮 */}
            <div className="relative grid grid-cols-2 h-full">
              <button
                onClick={() => setActiveTab("register")}
                className={`relative z-10 flex items-center justify-center h-full rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "register" 
                    ? "text-gray-700" 
                    : "text-gray-500 hover:text-gray-600"
                }`}
              >
                Register
              </button>
              <button
                onClick={() => setActiveTab("login")}
                className={`relative z-10 flex items-center justify-center h-full rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "login" 
                    ? "text-gray-700" 
                    : "text-gray-500 hover:text-gray-600"
                }`}
              >
                Login
              </button>
            </div>
          </div>
        </div>

        {/* 表单内容区域 */}
        {activeTab === "register" ? (
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-xl">Register</CardTitle>
              <CardDescription className="text-gray-600">
                Register your account here. Click sign up when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input 
                    id="register-email" 
                    type="email"
                    placeholder="Enter your email."
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Input 
                    id="register-password" 
                    type="password"
                    placeholder="Enter your password."
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    placeholder="Re-enter your password."
                    className="h-11"
                  />
                </div>
                <CardFooter className="flex flex-col space-y-4 pt-4 pb-2">
                  <button className="w-full h-11 rounded-2xl bg-gray-200 hover:bg-gray-300 transition-colors duration-200" type="submit">
                    Sign Up
                  </button>
                </CardFooter>
              </form>

            </CardContent>

          </Card>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-xl">Login</CardTitle>
              <CardDescription className="text-gray-600">
                Enter your email and password to log in. If you don't have an account, please register first.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input 
                    id="login-email" 
                    type="email"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Input 
                    id="login-password" 
                    type="password"
                    className="h-11"
                  />
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe((v) => !v)}
                      className="w-5 h-5 border-2 border-gray-400 bg-gray-100 rounded-xl accent-blue-600 focus:ring-2 focus:ring-blue-300 transition"
                    />
                    <label htmlFor="remember-me" className="text-sm font-medium text-gray-700 select-none">
                      Remember me
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={() => setAcceptTerms((v) => !v)}
                      className="w-5 h-5 border-2 rounded-xl border-gray-400 bg-gray-100 rounded-2xl accent-blue-600 focus:ring-2 focus:ring-blue-300 transition"
                    />
                    <label htmlFor="terms" className="text-sm font-medium text-gray-700 select-none">
                      Accept terms and conditions
                    </label>
                  </div>
                </div>
                <CardFooter className="flex flex-col space-y-4 pt-4 ">
                  <button 
                    className="w-full h-11 rounded-2xl bg-gray-200 hover:bg-gray-300 transition-colors duration-200" 
                    type="submit"
                    >
                    Login
                  </button>
                </CardFooter>
              </form>

            </CardContent>

          </Card>
        )}
      </div>
  );
}