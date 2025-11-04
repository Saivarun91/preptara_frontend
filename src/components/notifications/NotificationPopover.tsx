"use client";

import { useState } from "react";
import { Bell, Clock, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface Notification {
  id: string;
  type: "test" | "deadline" | "announcement";
  title: string;
  message: string;
  time: string;
  urgent?: boolean;
  read?: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "test",
    title: "UPSC Prelims Mock Test",
    message: "New mock test available - starts in 2 hours",
    time: "2h",
    urgent: true,
    read: false,
  },
  {
    id: "2",
    type: "deadline",
    title: "SSC CGL Assignment",
    message: "Assignment deadline is tomorrow",
    time: "1d",
    urgent: true,
    read: false,
  },
  {
    id: "3",
    type: "announcement",
    title: "New Course: Banking Preparation",
    message: "Complete banking preparation course added",
    time: "2d",
    read: false,
  },
  {
    id: "4",
    type: "test",
    title: "Railway Exam Practice",
    message: "Practice test scheduled for next week",
    time: "3d",
    read: true,
  },
];

export const NotificationPopover = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "test":
        return <BookOpen className="h-4 w-4" />;
      case "deadline":
        return <Clock className="h-4 w-4" />;
      case "announcement":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-semibold animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-7"
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                    notification.read
                      ? "bg-background hover:bg-muted/50"
                      : "bg-primary/5 hover:bg-primary/10 border border-primary/20"
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`p-2 rounded-lg h-fit ${
                        notification.urgent
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-tight">
                          {notification.title}
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      {notification.urgent && (
                        <Badge
                          variant="destructive"
                          className="text-xs px-1.5 py-0"
                        >
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
