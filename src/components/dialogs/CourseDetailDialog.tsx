import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  FileText,
  Clock,
  Star,
  BookOpen,
  Video,
  Download,
  Award,
} from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  students: number;
  tests: number;
  price: number;
  category: string;
  rating: number;
}

interface CourseDetailDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CourseDetailDialog = ({
  course,
  open,
  onOpenChange,
}: CourseDetailDialogProps) => {
  if (!course) return null;

  const materials = [
    { icon: Video, title: "Video Lectures", count: "120+ hours" },
    { icon: BookOpen, title: "Study Material", count: "500+ pages" },
    { icon: FileText, title: "Practice Tests", count: `${course.tests} tests` },
    { icon: Download, title: "Downloadable PDFs", count: "100+ files" },
  ];

  const features = [
    "Live doubt-solving sessions",
    "Expert faculty guidance",
    "Previous year question analysis",
    "Regular mock tests",
    "Performance analytics",
    "Mobile app access",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-3xl mb-2">{course.title}</DialogTitle>
              <p className="text-muted-foreground">{course.description}</p>
            </div>
            <Badge variant="secondary" className="bg-highlight text-highlight-foreground">
              {course.category}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <div className="font-semibold">{course.students.toLocaleString()}</div>
                <div className="text-muted-foreground text-xs">Students</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-primary" />
              <div>
                <div className="font-semibold">{course.tests}</div>
                <div className="text-muted-foreground text-xs">Tests</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-highlight fill-highlight" />
              <div>
                <div className="font-semibold">{course.rating}</div>
                <div className="text-muted-foreground text-xs">Rating</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <div className="font-semibold">12 months</div>
                <div className="text-muted-foreground text-xs">Duration</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Study Materials */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Study Materials Included
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {materials.map((material, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-card rounded-lg border border-primary/10"
                >
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <material.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">{material.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {material.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div>
            <h3 className="text-xl font-bold mb-4">Course Features</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price & Enroll */}
          <div className="flex items-center justify-between bg-primary/5 p-6 rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Course Price</div>
              <div className="text-3xl font-bold text-primary">
                ₹{course.price.toLocaleString()}
              </div>
            </div>
            <Button size="lg" className="bg-gradient-primary hover:shadow-glow">
              Enroll Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
