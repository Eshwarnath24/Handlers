import React, { useState } from "react";
import { User, Lock, Save, X } from "lucide-react";
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
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (name.trim()) {
      updateUser({ name: name.trim() });
      toast({ title: "Profile updated", description: "Your name has been updated." });
      setIsEditing(false);
    }
  };

  const handlePasswordChange = () => {
    if (newPassword.length >= 6) {
      // In production, verify current password and update
      toast({ title: "Password updated", description: "Your password has been changed." });
      setCurrentPassword("");
      setNewPassword("");
    } else {
      toast({ 
        title: "Invalid password", 
        description: "Password must be at least 6 characters.",
        variant: "destructive"
      });
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
                  />
                  <Button size="icon" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => {
                    setName(user?.name || "");
                    setIsEditing(false);
                  }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span>{user?.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
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
                />
              </div>
              <Button 
                onClick={handlePasswordChange} 
                disabled={!currentPassword || !newPassword}
                className="w-full"
              >
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
