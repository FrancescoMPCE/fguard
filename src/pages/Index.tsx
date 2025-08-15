
import { useState } from "react";
import { Shield, Plus, Search, Key, Eye, EyeOff, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import PasswordGenerator from "@/components/PasswordGenerator";
import AddPasswordDialog from "@/components/AddPasswordDialog";

interface PasswordEntry {
  id: string;
  website: string;
  username: string;
  password: string;
  createdAt: Date;
}

const Index = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasSetupPassword, setHasSetupPassword] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [storedMasterPassword, setStoredMasterPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleSetupPassword = () => {
    if (masterPassword.length < 8) {
      toast.error("❌ Master password must be at least 8 characters long");
      return;
    }
    
    if (masterPassword !== confirmPassword) {
      toast.error("❌ Passwords do not match");
      return;
    }

    setStoredMasterPassword(masterPassword);
    setHasSetupPassword(true);
    setIsUnlocked(true);
    setMasterPassword("");
    setConfirmPassword("");
    toast.success("🔐 Master password set successfully! Your vault is now ready.");
  };

  const handleUnlock = () => {
    if (masterPassword === storedMasterPassword) {
      setIsUnlocked(true);
      toast.success("🔓 Vault unlocked successfully");
      setMasterPassword("");
    } else {
      toast.error("❌ Invalid master password");
    }
  };

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisiblePasswords(newVisible);
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`✅ ${type} copied to clipboard`);
  };

  const deletePassword = (id: string) => {
    setPasswords(passwords.filter(p => p.id !== id));
    toast.success("🗑️ Password deleted");
  };

  const addPassword = (entry: Omit<PasswordEntry, "id" | "createdAt">) => {
    const newEntry: PasswordEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setPasswords([...passwords, newEntry]);
    toast.success("✅ Password saved securely");
  };

  const filteredPasswords = passwords.filter(p => 
    p.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLockVault = () => {
    setIsUnlocked(false);
    setVisiblePasswords(new Set());
    setMasterPassword("");
  };

  if (!hasSetupPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card-vault p-8 w-full max-w-md animate-float">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary-muted rounded-full mb-4 animate-pulse-glow">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-hero mb-2">Welcome to SecureVault</h1>
            <p className="text-muted-foreground">Set up your master password to secure your vault</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Create Master Password (min 8 characters)"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                className="input-secure"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirm Master Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-secure"
                onKeyDown={(e) => e.key === "Enter" && handleSetupPassword()}
              />
            </div>
            <Button 
              onClick={handleSetupPassword} 
              className="btn-hero w-full"
              disabled={!masterPassword || !confirmPassword}
            >
              <Shield className="w-4 h-4 mr-2" />
              Create Vault
            </Button>
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>⚠️ Remember your master password - it cannot be recovered!</p>
              <p>Use a strong, unique password you'll remember.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card-vault p-8 w-full max-w-md animate-float">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary-muted rounded-full mb-4 animate-pulse-glow">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-hero mb-2">SecureVault</h1>
            <p className="text-muted-foreground">Enter your master password to unlock your vault</p>
          </div>
          
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Master Password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              className="input-secure"
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            />
            <Button onClick={handleUnlock} className="btn-hero w-full" disabled={!masterPassword}>
              <Shield className="w-4 h-4 mr-2" />
              Unlock Vault
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-muted rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">SecureVault</h1>
              <p className="text-sm text-muted-foreground">
                {passwords.length} passwords • Vault secured
              </p>
            </div>
          </div>
          <Button onClick={handleLockVault} variant="outline">
            Lock Vault
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="card-vault">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{passwords.length}</p>
                  <p className="text-sm text-muted-foreground">Stored Passwords</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-vault">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">Strong</p>
                  <p className="text-sm text-muted-foreground">Security Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <PasswordGenerator />
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search passwords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-secure pl-10"
            />
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="btn-secure">
            <Plus className="w-4 h-4 mr-2" />
            Add Password
          </Button>
        </div>

        {/* Password List */}
        <div className="space-y-3">
          {filteredPasswords.map((entry) => (
            <Card key={entry.id} className="card-vault">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-primary-muted/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {entry.website.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{entry.website}</h3>
                        <Badge variant="outline" className="text-xs">
                          {entry.username}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                          {visiblePasswords.has(entry.id) ? entry.password : "••••••••"}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePasswordVisibility(entry.id)}
                        >
                          {visiblePasswords.has(entry.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(entry.username, "Username")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(entry.password, "Password")}
                    >
                      <Key className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deletePassword(entry.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPasswords.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No passwords found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search terms" : "Add your first password to get started"}
            </p>
            <Button onClick={() => setShowAddDialog(true)} className="btn-secure">
              <Plus className="w-4 h-4 mr-2" />
              Add Password
            </Button>
          </div>
        )}

        <AddPasswordDialog 
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSave={addPassword}
        />
      </div>
    </div>
  );
};

export default Index;
