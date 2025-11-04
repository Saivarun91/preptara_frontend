"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner"; // toast notifications

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [defaultUserRole, setDefaultUserRole] = useState("user");
  const [sessionTimeout, setSessionTimeout] = useState<number>(30);

  // ✅ Fetch settings on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/settings/get/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          const d = res.data.data;
          setSiteName(d.site_name || "");
          setAdminEmail(d.admin_email || "");
          setEmailNotifications(d.email_notifications || false);
          setMaintenanceMode(d.maintenance_mode || false);
          setDefaultUserRole(d.default_user_role || "user");
          setSessionTimeout(Number(d.session_timeout) || 30);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        toast.error("❌ Failed to fetch settings");
      }
    };

    fetchSettings();
  }, []);

  // ✅ Common reusable function to update settings
  const updateSettings = async (
    updatedFields: Record<string, any>,
    successMessage: string
  ) => {
    try {
      const payload = {
        site_name: siteName,
        admin_email: adminEmail,
        email_notifications: emailNotifications,
        maintenance_mode: maintenanceMode,
        default_user_role: defaultUserRole,
        session_timeout: sessionTimeout,
        ...updatedFields, // override only the changed fields
      };

      const res = await axios.post(
        "http://127.0.0.1:8000/api/settings/update/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        // ✅ Show the emoji with message as JSX so it doesn't get stripped
        toast.success(<div className="text-green-600 font-medium">{successMessage}</div>);
      } else {
        toast.error(res.data.message || "⚠️ Failed to update settings");
      }
    } catch (err) {
      console.error("Error updating settings:", err);
      toast.error("❌ Something went wrong while saving");
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Admin Settings</h1>
        <p className="text-gray-500">Manage platform-wide admin configurations.</p>
      </motion.div>

      {/* General Settings */}
      <Card className="border hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="w-40 font-medium text-gray-700">Site Name:</label>
            <Input
              className="flex-1"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Enter site name"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="w-40 font-medium text-gray-700">Admin Email:</label>
            <Input
              className="flex-1"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="Enter admin email"
            />
          </div>

          <Button
            className="w-fit mt-2"
            onClick={() =>
              updateSettings(
                { site_name: siteName, admin_email: adminEmail },
                "✅ General settings saved successfully!"
              )
            }
          >
            Save General Settings
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Email Notifications</span>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Maintenance Mode</span>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
          </div>

          <Button
            className="w-fit mt-2"
            onClick={() =>
              updateSettings(
                {
                  email_notifications: emailNotifications,
                  maintenance_mode: maintenanceMode,
                },
                "📢 Notification settings saved successfully!"
              )
            }
          >
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card className="border hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="w-40 font-medium text-gray-700">Default User Role:</label>
            <select
              className="flex-1 border border-gray-300 rounded-lg p-2"
              value={defaultUserRole}
              onChange={(e) => setDefaultUserRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="w-40 font-medium text-gray-700">
              Session Timeout (mins):
            </label>
            <Input
              type="number"
              className="flex-1"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              placeholder="Enter minutes"
            />
          </div>

          <Button
            className="w-fit mt-2"
            onClick={() =>
              updateSettings(
                {
                  default_user_role: defaultUserRole,
                  session_timeout: sessionTimeout,
                },
                "⚙️ Advanced settings saved successfully!"
              )
            }
          >
            Save Advanced Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
