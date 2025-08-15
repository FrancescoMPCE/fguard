
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

interface AddPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: { website: string; username: string; password: string }) => void;
}

const AddPasswordDialog = ({ open, onOpenChange, onSave }: AddPasswordDialogProps) => {
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const generatePassword = () => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let newPassword = "";
    for (let i = 0; i < 16; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
  };

  const handleSave = () => {
    if (website && username && password) {
      onSave({ website, username, password });
      setWebsite("");
      setUsername("");
      setPassword("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="card-vault border-border">
        <DialogHeader>
          <DialogTitle>Add New Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              placeholder="e.g., github.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="input-secure"
            />
          </div>
          
          <div>
            <Label htmlFor="username">Username/Email</Label>
            <Input
              id="username"
              placeholder="your.email@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-secure"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="flex gap-2">
              <Input
                id="password"
                type="password"
                placeholder="Enter or generate password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-secure flex-1"
              />
              <Button onClick={generatePassword} variant="outline" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="btn-secure flex-1">
              Save Password
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPasswordDialog;
