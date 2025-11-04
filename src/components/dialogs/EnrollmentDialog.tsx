import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface Course {
  id: number;
  title: string;
  price: number;
  category: string;
}

interface EnrollmentDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnrollmentDialog = ({
  course,
  open,
  onOpenChange,
}: EnrollmentDialogProps) => {
  const [enrolled, setEnrolled] = useState(false);

  if (!course) return null;

  const handleEnroll = () => {
    setEnrolled(true);
    setTimeout(() => {
      setEnrolled(false);
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {!enrolled ? (
          <>
            <DialogHeader>
              <DialogTitle>Enroll in {course.title}</DialogTitle>
              <DialogDescription>
                Complete the form below to enroll in this course
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" placeholder="Enter your full name" />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" />
              </div>

              <Separator />

              <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Course</span>
                  <span className="font-semibold">{course.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-semibold">{course.category}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-xl font-bold text-primary">
                    ₹{course.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-primary hover:shadow-glow"
                size="lg"
                onClick={handleEnroll}
              >
                Complete Enrollment
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By enrolling, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Enrollment Successful!</h3>
            <p className="text-muted-foreground">
              Welcome to {course.title}. Check your email for course access details.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
