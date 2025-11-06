// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { ShieldCheck } from "lucide-react";
// import axios from "axios";

// // ----------------------- API URLs -----------------------
// const LOGIN_URL = "http://127.0.0.1:8000/api/users/admin/login/";
// const REGISTER_URL = "http://127.0.0.1:8000/api/users/admin/register/";

// interface ApiResponse {
//   success?: boolean;
//   message?: string;
//   error?: string;
//   token?: string;
//   user?: { id: string; fullname?: string; email?: string };
// }

// export default function AuthPage() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
//   const [isLoading, setIsLoading] = useState(false);

//   // ----------------------- Login States -----------------------
//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   const [loginError, setLoginError] = useState("");

//   // ----------------------- Signup States -----------------------
//   const [signupName, setSignupName] = useState("");
//   const [signupEmail, setSignupEmail] = useState("");
//   const [signupPassword, setSignupPassword] = useState("");
//   const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
//   const [signupError, setSignupError] = useState("");

//   // ----------------------- Handle User Login -----------------------
//   // const handleLogin = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setIsLoading(true);
//   //   setLoginError("");

//   //   try {
//   //     const res = await axios.post(LOGIN_URL, {
//   //       email: loginEmail,
//   //       password: loginPassword,
//   //     });
 
//   //     // ✅ Check response
//   //     if (res.data.success) {
//   //       // Save user data in localStorage
//   //       localStorage.setItem("token", res.data.token);
//   //       console.log(res.data.token);
//   //       localStorage.setItem("user_id", res.data.user.id);
//   //       localStorage.setItem("user_name", res.data.user.fullname || "User");

//   //       // ✅ Redirect to dashboard
//   //       router.push("/categories");
//   //     } else {
//   //       setLoginError(res.data.message || "Invalid credentials");
//   //     }
//   //   } catch (err: any) {
//   //     console.error("Login Error:", err.response?.data || err.message);
//   //     setLoginError("Login failed. Please try again.");
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setLoginError("");
  
//     try {
//       const res = await axios.post(LOGIN_URL, {
//         email: loginEmail,
//         password: loginPassword,
//       });
  
//       if (res.data.success) {
//         // Save user data in localStorage
//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem("user_id", res.data.user.id);
//         localStorage.setItem("user_name", res.data.user.fullname || "User");
  
//         // ✅ Use Next.js router for navigation
//         router.push("/categories");
//       } else {
//         setLoginError(res.data.message || "Invalid credentials");
//       }
//     } catch (err: any) {
//       console.error("Login Error:", err.response?.data || err.message);
//       setLoginError("Login failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };
  

//   // ----------------------- Handle User Signup -----------------------
//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setSignupError("");

//     if (signupPassword !== signupConfirmPassword) {
//       setSignupError("Passwords do not match");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const res = await axios.post(REGISTER_URL, {
//         fullname: signupName,
//         email: signupEmail,
//         password: signupPassword,
//       });

//       if (res.data.success) {
//         alert("Registration successful! Please log in.");
//         setActiveTab("login");
//       } else {
//         setSignupError(res.data.message || "Signup failed");
//       }
//     } catch (err: any) {
//       console.error("Signup Error:", err.response?.data || err.message);
//       setSignupError("Something went wrong. Try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="container mx-auto max-w-4xl grid lg:grid-cols-2 gap-8">
//         {/* Left Side Info */}
//         <motion.div
//           initial={{ opacity: 0, x: -30 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="text-center lg:text-left"
//         >
//           <div className="inline-flex items-center gap-3 mb-6">
//             <div className="p-3 bg-blue-700 rounded-lg">
//               <ShieldCheck className="h-8 w-8 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold text-blue-800">
//               PrepTara{" "}
//               <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
//                 Portal
//               </span>
//             </h1>
//           </div>
//           <h2 className="text-4xl font-bold mb-4 text-gray-800">
//             Welcome Back!
//           </h2>
//           <p className="text-xl text-gray-500 mb-8">
//             Access your personalized dashboard and track your progress.
//           </p>
//         </motion.div>

//         {/* Right Side Auth Form */}
//         <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
//           <Card>
//             <CardContent className="p-8">
//               <Tabs
//                 value={activeTab}
//                 onValueChange={(value) => setActiveTab(value as "login" | "signup")}
//                 className="w-full"
//               >
//                 <TabsList className="grid w-full grid-cols-2 mb-8">
//                   <TabsTrigger value="login">Login</TabsTrigger>
//                   <TabsTrigger value="signup">Sign Up</TabsTrigger>
//                 </TabsList>

//                 {/* ---------------- LOGIN ---------------- */}
//                 <TabsContent value="login">
//                   <form onSubmit={handleLogin} className="space-y-4">
//                     {loginError && <p className="text-red-500">{loginError}</p>}
//                     <div>
//                       <Label>Email Address</Label>
//                       <Input
//                         type="email"
//                         value={loginEmail}
//                         onChange={(e) => setLoginEmail(e.target.value)}
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label>Password</Label>
//                       <Input
//                         type="password"
//                         value={loginPassword}
//                         onChange={(e) => setLoginPassword(e.target.value)}
//                         required
//                       />
//                     </div>
//                     <Button
//                       type="submit"
//                       className="w-full bg-blue-700 hover:bg-blue-800 text-white"
//                       disabled={isLoading}
//                     >
//                       {isLoading ? "Logging in..." : "Login"}
//                     </Button>
//                   </form>
//                 </TabsContent>

//                 {/* ---------------- SIGN UP ---------------- */}
//                 <TabsContent value="signup">
//                   <form onSubmit={handleSignup} className="space-y-4">
//                     {signupError && <p className="text-red-500">{signupError}</p>}

//                     <div>
//                       <Label>Full Name</Label>
//                       <Input
//                         type="text"
//                         value={signupName}
//                         onChange={(e) => setSignupName(e.target.value)}
//                         required
//                       />
//                     </div>

//                     <div>
//                       <Label>Email Address</Label>
//                       <Input
//                         type="email"
//                         value={signupEmail}
//                         onChange={(e) => setSignupEmail(e.target.value)}
//                         required
//                       />
//                     </div>

//                     <div>
//                       <Label>Password</Label>
//                       <Input
//                         type="password"
//                         value={signupPassword}
//                         onChange={(e) => setSignupPassword(e.target.value)}
//                         required
//                       />
//                     </div>

//                     <div>
//                       <Label>Confirm Password</Label>
//                       <Input
//                         type="password"
//                         value={signupConfirmPassword}
//                         onChange={(e) => setSignupConfirmPassword(e.target.value)}
//                         required
//                       />
//                     </div>

//                     <Button
//                       type="submit"
//                       className="w-full bg-blue-700 hover:bg-blue-800 text-white"
//                       disabled={isLoading}
//                     >
//                       {isLoading ? "Signing up..." : "Sign Up"}
//                     </Button>
//                   </form>
//                 </TabsContent>
//               </Tabs>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

// ----------------------- API URLs -----------------------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
const LOGIN_URL = `${API_BASE_URL}/api/users/admin/login/`;
const REGISTER_URL = `${API_BASE_URL}/api/users/admin/register/`;

interface ApiResponse {
  success?: boolean;
  message?: string;
  token?: string;
  admin?: { id: string; name?: string; email?: string; role?: string };
}

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);

  // ----------------------- Login States -----------------------
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // ----------------------- Signup States -----------------------
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  // ----------------------- Handle Login -----------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      const res = await axios.post<ApiResponse>(LOGIN_URL, {
        email: loginEmail,
        password: loginPassword,
      });
      console.log("data");
      console.log(res.data);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        console.log(res.data);
        localStorage.setItem("admin_id", res.data.admin?.id || "");
        localStorage.setItem("user_name", res.data.admin?.name || "Admin");
        localStorage.setItem("role", res.data.admin?.role || "admin");
        login(res.data.token);

        console.log("✅ Login success, redirecting...");

        // ✅ Redirect safely using a small delay
        setTimeout(() => {
          router.replace("/admin/categories"); // Use replace instead of push
        }, 500);
      } else {
        setLoginError(res.data.message || "Invalid credentials");
      }
    } catch (err: any) {
      console.error("Login Error:", err.response?.data || err.message);
      setLoginError("Login failed. Please try again.");
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
      const res = await axios.post<ApiResponse>(REGISTER_URL, {
        fullname: signupName,
        email: signupEmail,
        password: signupPassword,
      });

      if (res.data.success) {
        alert("Registration successful! Please log in.");
        setActiveTab("login");
      } else {
        setSignupError(res.data.message || "Signup failed");
      }
    } catch (err: any) {
      console.error("Signup Error:", err.response?.data || err.message);
      setSignupError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="container mx-auto max-w-4xl grid lg:grid-cols-2 gap-8">
        {/* Left Side Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-700 rounded-lg">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-blue-800">
              PrepTara{" "}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Portal
              </span>
            </h1>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Welcome Back!</h2>
          <p className="text-xl text-gray-500 mb-8">
            Access your personalized dashboard and manage your exam questions.
          </p>
        </motion.div>

        {/* Right Side Auth Form */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardContent className="p-8">
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as "login" | "signup")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* ---------------- LOGIN ---------------- */}
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
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </TabsContent>

                {/* ---------------- SIGN UP ---------------- */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
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

                    <Button
                      type="submit"
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white"
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
