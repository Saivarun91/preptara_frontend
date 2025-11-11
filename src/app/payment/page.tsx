"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useTest } from "@/contexts/TestContext";
import { useState, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, Lock, User, Mail, Crown, Sparkles, CheckCircle2 } from "lucide-react";

// Force dynamic rendering since this page depends on search params
export const dynamic = 'force-dynamic';

const PaymentContent = () => {
  const { user: UserProfile, isLoggedIn } = useAuth();
  const { unlockCourseAccess } = useTest();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Fetch plan, price, testId, courseId from query parameters
  const plan = searchParams.get("plan") || "Course Access";
  const price = searchParams.get("price") || "199";
  const courseId = searchParams.get("courseId") || null;

  const planDetails = {
    name: plan,
    price: `₹${price}`,
    icon: plan.includes("3") ? Crown : Sparkles,
    description: plan.includes("3") ? "3 months access" : "1 month access",
  };

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (courseId && isLoggedIn && unlockCourseAccess) {
      unlockCourseAccess(courseId, plan);
    }

    toast({
      title: "🎉 Payment Successful!",
      description: `You now have access to this course for ${plan}`,
      duration: 5000,
    });

    setProcessing(false);

    // Navigate to dashboard after a brief delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-16 pb-12 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-muted-foreground">Secure payment powered by industry-standard encryption</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - User Details */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xl font-bold">
                      {UserProfile?.fullname.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{UserProfile?.fullname}</p>
                      <p className="text-sm text-muted-foreground">{UserProfile?.email}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <planDetails.icon className="h-5 w-5 text-primary" />
                    Selected Plan
                  </h3>

                  <Card className="border-2 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-lg">{planDetails.name}</h4>
                          <p className="text-sm text-muted-foreground">{planDetails.description}</p>
                        </div>
                        <planDetails.icon className="h-6 w-6 text-primary" />
                      </div>

                      <div className="space-y-2 mb-4">
                        {[
                          "Unlimited test attempts",
                          "All questions unlocked",
                          "Detailed analytics",
                          "Certificate of completion",
                        ].map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      <Separator className="my-3" />

                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Amount</span>
                        <span className="text-2xl font-bold text-primary">{planDetails.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-start gap-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Secure Payment</p>
                    <p className="text-muted-foreground">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Side - Payment Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={19}
                        required
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                        className="mt-1.5"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          maxLength={5}
                          required
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          maxLength={3}
                          required
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{planDetails.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing Fee</span>
                      <span className="font-medium">₹0</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold text-lg">Total</span>
                      <span className="font-bold text-2xl text-primary">{planDetails.price}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:shadow-glow h-12 text-lg"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-2" />
                        Complete Payment
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By completing this purchase, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default function Payment() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-16 pb-12 flex items-center justify-center">
        <p className="text-center py-20">Loading...</p>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
