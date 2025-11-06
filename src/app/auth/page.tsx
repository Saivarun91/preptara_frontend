"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

// ----------------------- API URLs -----------------------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
const USER_LOGIN_URL = `${API_BASE_URL}/api/users/login/`;
const USER_REGISTER_URL = `${API_BASE_URL}/api/users/register/`;

interface ApiResponse {
  message?: string;
  error?: string;
  token?: string;
  user?: any;
}

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);

  // ----------------------- Login states -----------------------
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // ----------------------- Signup states -----------------------
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupError, setSignupError] = useState("");

  // ----------------------- Handle Login -----------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      const res = await fetch(USER_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data: ApiResponse = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user?.fullname || "");
        localStorage.setItem("email", data.user?.email || "");
        localStorage.setItem("role", data.user?.role || "student");

        router.push("/"); // ✅ Redirect after successful login
      } else {
        setLoginError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setLoginError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------- Handle Signup -----------------------
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSignupError("");

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(USER_REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: signupName,
          email: signupEmail,
          password: signupPassword,
          phone_number: signupPhone,
        }),
      });

      const data: ApiResponse = await res.json();

      if (res.ok) {
        // ✅ Redirect to login after successful registration
        alert("Registration successful! Please login now.");
        setActiveTab("login");
      } else {
        setSignupError(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setSignupError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 p-4">
      <div className="container mx-auto max-w-4xl grid lg:grid-cols-2 gap-8">
        {/* Left side info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-lg shadow-md">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Prep
              <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
                Tara
              </span>
            </h1>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Start Your Success Journey Today
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of students preparing for their dream exams
          </p>
        </motion.div>

        {/* Right side Auth forms */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-8">
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as "login" | "signup")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 rounded-lg">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    {loginError && <p className="text-red-500">{loginError}</p>}

                    <div>
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Signup Form */}
                <TabsContent value="signup">
                  <form className="space-y-4" onSubmit={handleSignup}>
                    {signupError && <p className="text-red-500">{signupError}</p>}

                    <div>
                      <Label>Full Name</Label>
                      <Input
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label>Confirm Password</Label>
                      <Input
                        type="password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label>Phone Number</Label>
                      <Input
                        type="tel"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing up..." : "Sign Up"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
