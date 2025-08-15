
import { useState } from "react";
import { RefreshCw, Copy, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("Ag7$kL9@mN2#");
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (charset === "") {
      toast.error("Please select at least one character type");
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length[0]; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    toast.success("🔑 New password generated");
  };

  const copyPassword = async () => {
    await navigator.clipboard.writeText(password);
    toast.success("✅ Password copied to clipboard");
  };

  return (
    <Card className="card-vault">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          Password Generator
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-muted p-2 rounded text-sm font-mono break-all">
            {password}
          </code>
          <Button size="sm" onClick={copyPassword} variant="ghost">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={generatePassword} className="btn-secure flex-1">
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate
          </Button>
        </div>

        {showSettings && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div>
              <Label className="text-sm font-medium">Length: {length[0]}</Label>
              <Slider
                value={length}
                onValueChange={setLength}
                max={50}
                min={8}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                />
                <Label htmlFor="uppercase" className="text-sm">A-Z</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="lowercase"
                  checked={includeLowercase}
                  onCheckedChange={setIncludeLowercase}
                />
                <Label htmlFor="lowercase" className="text-sm">a-z</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                />
                <Label htmlFor="numbers" className="text-sm">0-9</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                />
                <Label htmlFor="symbols" className="text-sm">!@#</Label>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordGenerator;
