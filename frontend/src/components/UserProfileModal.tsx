import React, { useState, useEffect } from "react";
import { User, Lock, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserProfileModal = ({ open, onOpenChange }: UserProfileModalProps) => {
  const { user, updateUser, token } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Keep local name in sync with auth user
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    if (!token) {
      toast({
        title: "Session expired",
        description: "Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // ✅ FIX: URL changed from /auth/profile to /profile
      const res = await fetch("http://localhost:3000/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      // Update global context
      updateUser({ name: trimmed });
      
      toast({
        title: "Profile updated",
        description: "Your name has been updated.",
      });
      setIsEditing(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      toast({
        title: "Session expired",
        description: "Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // ✅ FIX: URL changed from /auth/password to /profile/password
      const res = await fetch("http://localhost:3000/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password update failed");

      toast({
        title: "Password updated",
        description: "Your password has been changed.",
      });

      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> User Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    disabled={isLoading}
                  />
                  <Button size="icon" onClick={handleSave} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => {
                      setName(user?.name || "");
                      setIsEditing(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span>{user?.name || "No Name Set"}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="p-3 rounded-lg bg-muted text-muted-foreground">
                {user?.email}
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Lock className="h-4 w-4" /> Change Password
            </h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handlePasswordChange}
                disabled={!currentPassword || !newPassword || isLoading}
                className="w-full"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Password
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;