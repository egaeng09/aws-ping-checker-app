
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface ServerSettingsProps {
  serverUrl: string;
  onUrlChange: (url: string) => void;
}

export const ServerSettings = ({ serverUrl, onUrlChange }: ServerSettingsProps) => {
  const [tempUrl, setTempUrl] = useState(serverUrl);

  const handleSave = () => {
    onUrlChange(tempUrl);
  };

  const setPresetUrl = (url: string) => {
    setTempUrl(url);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <CardTitle>서버 설정</CardTitle>
        </div>
        <CardDescription>
          확인할 AWS Spring Boot 서버의 URL을 설정하세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="server-url">서버 URL</Label>
          <Input
            id="server-url"
            placeholder="http://your-aws-server.com:8080"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>빠른 설정</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPresetUrl('http://localhost:8080')}
            >
              로컬 테스트
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPresetUrl('http://your-ec2-ip:8080')}
            >
              EC2 :8080
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPresetUrl('http://your-domain.com')}
            >
              도메인 :80
            </Button>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          설정 저장
        </Button>
      </CardContent>
    </Card>
  );
};
