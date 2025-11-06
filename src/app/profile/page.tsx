"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Camera,
  Book,
} from "lucide-react";


interface UserData {
  id?: string;
  fullname: string;
  email: string;
  phone_number: string;
  role?: string;
  avatar?: string;
  enrolled_courses?: string[];
}

interface ProfileResponse {
  success: boolean;
  role: string;
  profile: UserData;
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
const BACKEND_URL = `${API_BASE_URL}/api/users`;

const Profile = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editData, setEditData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/auth");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  // Fetch profile
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BACKEND_URL}/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          router.push("/auth");
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Profile fetch failed: ${text}`);
        }

        const data: ProfileResponse = await res.json();
        console.log("data:", data);
        setUserData(data.profile);
        setEditData(data.profile);
      } catch (err: unknown) {
  console.error(err);
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Something went wrong");
  }
}
 finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, router]);

  const handleSave = async () => {
    if (!editData || !token) return;

    try {
      const res = await fetch(`${BACKEND_URL}/profile/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editData),
      });

      if (res.status === 401) {
        router.push("/auth");
        return;
      }

      if (!res.ok) throw new Error("Failed to update profile");

      setUserData(editData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editData) {
      const reader = new FileReader();
      reader.onloadend = () => setEditData({ ...editData, avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <p className="text-center py-20 text-gray-500">Loading profile...</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;
  if (!userData || !editData) return null;

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Your Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow border border-gray-200">
            <CardHeader className="relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden border-4 border-white shadow">
                      {editData.avatar ? (
                        <img src={editData.avatar} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        userData.fullname.charAt(0).toUpperCase()
                      )}
                    </div>
                    <label
                      htmlFor="photo-upload"
                      className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <Camera className="h-6 w-6 text-white" />
                      <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold text-gray-800">{userData.fullname}</CardTitle>
                    <Badge variant="secondary">{userData.role || "Student"}</Badge>
                  </div>
                </div>

                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center gap-2">
                    <Edit2 className="h-4 w-4" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" className="flex items-center gap-2 bg-blue-600 text-white">
                      <Save className="h-4 w-4" /> Save
                    </Button>
                    <Button onClick={handleCancel} size="sm" variant="outline" className="flex items-center gap-2 border-gray-300">
                      <X className="h-4 w-4" /> Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
             {([
  { label: "Full Name", icon: User, key: "fullname" },
  { label: "Email", icon: Mail, key: "email" },
  { label: "Phone Number", icon: Phone, key: "phone_number" },
] as const).map((field) => {
  type Key = typeof field.key;
  return (
    <div key={field.key} className="space-y-2">
      <Label className="flex items-center gap-2 text-gray-700">
        <field.icon className="h-4 w-4 text-blue-500" /> {field.label}
      </Label>
      {isEditing ? (
        <Input
          value={editData[field.key] ?? ""}
          onChange={(e) =>
            setEditData({ ...editData, [field.key]: e.target.value } as UserData)
          }
        />
      ) : (
        <p className="text-gray-800 font-medium">{editData[field.key]}</p>
      )}
    </div>
  );
})}

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
