
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
          <CardTitle>백엔드 서버 설정</CardTitle>
        </div>
        <CardDescription>
          Spring Boot 백엔드 서버의 URL을 설정하세요 (내부 통신용)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="server-url">백엔드 서버 URL</Label>
          <Input
            id="server-url"
            placeholder="http://localhost:8080"
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
              로컬 백엔드 (8080)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPresetUrl('http://127.0.0.1:8080')}
            >
              내부 IP (8080)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPresetUrl('http://localhost:8081')}
            >
              대체 포트 (8081)
            </Button>
          </div>
        </div>

        <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            배포 환경 주의사항
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">
            • 같은 서버 내에서 프론트엔드(80)와 백엔드(8080) 실행<br/>
            • 8080 포트는 인바운드에 열지 않고 내부 통신만 사용<br/>
            • 프론트엔드에서 백엔드로의 요청은 localhost:8080 사용
          </p>
        </div>

        <Button onClick={handleSave} className="w-full">
          설정 저장
        </Button>
      </CardContent>
    </Card>
  );
};
