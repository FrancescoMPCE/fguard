
import { useState } from "react";
import { Settings as SettingsIcon, Shield, Key, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  masterPassword: string;
  hasPin: boolean;
  onPinSetup: (pin: string) => void;
  onPinChange: (newPin: string) => void;
  onPinRemove: () => void;
}

const Settings = ({
  open,
  onOpenChange,
  masterPassword,
  hasPin,
  onPinSetup,
  onPinChange,
  onPinRemove
}: SettingsProps) => {
  const [currentMasterPassword, setCurrentMasterPassword] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPins, setShowPins] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [action, setAction] = useState<"setup" | "change" | "remove" | null>(null);

  const verifyMasterPassword = () => {
    if (currentMasterPassword === masterPassword) {
      setIsVerified(true);
      toast.success("✅ Master password verified");
    } else {
      toast.error("❌ Invalid master password");
    }
  };

  const handlePinAction = () => {
    if (!isVerified) {
      toast.error("❌ Please verify your master password first");
      return;
    }

    if (action === "remove") {
      onPinRemove();
      toast.success("🔓 PIN removed successfully");
      resetForm();
      return;
    }

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      toast.error("❌ PIN must be exactly 4 digits");
      return;
    }

    if (newPin !== confirmPin) {
      toast.error("❌ PINs do not match");
      return;
    }

    if (action === "setup") {
      onPinSetup(newPin);
      toast.success("🔐 PIN set up successfully");
    } else if (action === "change") {
      onPinChange(newPin);
      toast.success("🔄 PIN changed successfully");
    }

    resetForm();
  };

  const resetForm = () => {
    setCurrentMasterPassword("");
    setNewPin("");
    setConfirmPin("");
    setIsVerified(false);
    setAction(null);
    setShowPins(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Security Settings
          </DialogTitle>
          <DialogDescription>
            Manage your security preferences and PIN authentication
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Master Password Verification */}
          {!isVerified && (
            <Card className="card-vault">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Verify Master Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  type="password"
                  placeholder="Enter master password"
                  value={currentMasterPassword}
                  onChange={(e) => setCurrentMasterPassword(e.target.value)}
                  className="input-secure"
                  onKeyDown={(e) => e.key === "Enter" && verifyMasterPassword()}
                />
                <Button 
                  onClick={verifyMasterPassword}
                  className="btn-secure w-full"
                  disabled={!currentMasterPassword}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Verify
                </Button>
              </CardContent>
            </Card>
          )}

          {/* PIN Management */}
          {isVerified && (
            <Card className="card-vault">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  PIN Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  {hasPin 
                    ? "✅ PIN is currently enabled for quick access"
                    : "🔒 No PIN set up - using master password only"
                  }
                </div>

                {!action && (
                  <div className="flex flex-col gap-2">
                    {!hasPin ? (
                      <Button 
                        onClick={() => setAction("setup")}
                        className="btn-secure"
                      >
                        <Key className="w-4 h-4 mr-2" />
                        Set Up PIN
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={() => setAction("change")}
                          variant="outline"
                        >
                          <Key className="w-4 h-4 mr-2" />
                          Change PIN
                        </Button>
                        <Button 
                          onClick={() => setAction("remove")}
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Remove PIN
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {(action === "setup" || action === "change") && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Input
                        type={showPins ? "text" : "password"}
                        placeholder="Enter 4-digit PIN"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="input-secure pr-10"
                        maxLength={4}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPins(!showPins)}
                      >
                        {showPins ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        type={showPins ? "text" : "password"}
                        placeholder="Confirm 4-digit PIN"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="input-secure pr-10"
                        maxLength={4}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPins(!showPins)}
                      >
                        {showPins ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handlePinAction}
                        className="btn-secure flex-1"
                        disabled={!newPin || !confirmPin}
                      >
                        {action === "setup" ? "Set PIN" : "Change PIN"}
                      </Button>
                      <Button 
                        onClick={() => setAction(null)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {action === "remove" && (
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                      ⚠️ This will remove PIN authentication. You'll need to use your master password to unlock the vault.
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handlePinAction}
                        variant="destructive"
                        className="flex-1"
                      >
                        Remove PIN
                      </Button>
                      <Button 
                        onClick={() => setAction(null)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
