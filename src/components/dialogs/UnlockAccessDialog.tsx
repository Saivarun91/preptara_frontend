"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation"; 
import { useAuth } from "@/contexts/AuthContext";

interface UnlockAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testId: string; // ← change this from number to string
}


export const UnlockAccessDialog = ({ open, onOpenChange, testId }: UnlockAccessDialogProps) => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const handlePlanClick = (planType: "3months" | "1month") => {
    if (!isLoggedIn) {
      router.push("/auth");
      return;
    }

    // Navigate to /payment with query parameters
    router.push(
      `/payment?plan=${planType === "3months" ? "3 Months Access" : "1 Month Access"}&price=${planType === "3months" ? 199 : 99}&testId=${testId}&courseId=${testId}`
    );

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Unlock Full Access
            </span>
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            Continue your test journey with unlimited access to all questions
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* 3 Months Plan */}
          <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">3 Months Access</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Access to all 4 tests in this course
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-primary">₹199</span>
              <span className="text-muted-foreground ml-2">3 months</span>
            </div>
            <ul className="space-y-3 mb-6">
              {[
                "All 4 test sets",
                "Performance analytics",
                "Detailed explanations",
                "Progress tracking",
                "Priority support",
                "Regular updates"
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-gradient-primary hover:shadow-glow"
              onClick={() => handlePlanClick("3months")}
            >
              <Crown className="h-4 w-4 mr-2" />
              Get 3 Months Access
            </Button>
          </Card>

          {/* 1 Month Plan */}
          <Card className="p-6 border-2 border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">1 Month Access</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Access to all 4 tests in this course
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-accent">₹99</span>
              <span className="text-muted-foreground ml-2">1 month</span>
            </div>
            <ul className="space-y-3 mb-6">
              {[
                "All 4 test sets",
                "Basic analytics",
                "Answer explanations",
                "Test results tracking",
                "Email support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full border-accent text-accent hover:bg-accent/10"
              onClick={() => handlePlanClick("1month")}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Get 1 Month Access
            </Button>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
