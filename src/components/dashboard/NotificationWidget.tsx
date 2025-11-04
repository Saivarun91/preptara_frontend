import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, BookOpen, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "test" | "deadline" | "announcement";
  title: string;
  message: string;
  date: string;
  countdown?: string;
  urgent?: boolean;
}

const upcomingNotifications: Notification[] = [
  {
    id: "1",
    type: "test",
    title: "UPSC Prelims Mock Test",
    message: "Comprehensive test covering all subjects",
    date: "2025-01-15",
    countdown: "2 hours left",
    urgent: true,
  },
  {
    id: "2",
    type: "deadline",
    title: "SSC CGL Assignment Submission",
    message: "Complete and submit your weekly assignment",
    date: "2025-01-16",
    countdown: "1 day left",
    urgent: true,
  },
  {
    id: "3",
    type: "announcement",
    title: "New Course: Banking Preparation 2025",
    message: "Comprehensive banking exam preparation course now available",
    date: "2025-01-14",
  },
  {
    id: "4",
    type: "test",
    title: "Railway Group D Practice Test",
    message: "Practice test based on latest pattern",
    date: "2025-01-20",
    countdown: "5 days left",
  },
];

export const NotificationWidget = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case "test":
        return <BookOpen className="h-5 w-5" />;
      case "deadline":
        return <Clock className="h-5 w-5" />;
      case "announcement":
        return <Calendar className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getIconColor = (type: string, urgent?: boolean) => {
    if (urgent) return "text-destructive";
    switch (type) {
      case "test":
        return "text-primary";
      case "deadline":
        return "text-accent";
      case "announcement":
        return "text-highlight";
      default:
        return "text-primary";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {upcomingNotifications.length} new
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                notification.urgent
                  ? "bg-destructive/5 border-destructive/20 hover:border-destructive/40"
                  : "bg-card/50 border-primary/10 hover:border-primary/30"
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`p-2 rounded-lg h-fit ${
                    notification.urgent
                      ? "bg-destructive/10"
                      : "bg-primary/10"
                  }`}
                >
                  <div className={getIconColor(notification.type, notification.urgent)}>
                    {getIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                    {notification.urgent && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                  {notification.countdown && (
                    <div className="flex items-center gap-1 text-xs font-medium text-primary">
                      <Clock className="h-3 w-3" />
                      {notification.countdown}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          <Button variant="outline" className="w-full mt-4">
            View All Notifications
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
