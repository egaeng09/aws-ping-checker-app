
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ServerStatusCard } from "@/components/ServerStatusCard";
import { ServerSettings } from "@/components/ServerSettings";
import { checkServerStatus, ServerStatus } from "@/utils/serverCheck";
import { RefreshCw, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [serverUrl, setServerUrl] = useState('http://localhost:8080');
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoCheck, setAutoCheck] = useState(false);
  const { toast } = useToast();

  const performCheck = async () => {
    if (!serverUrl.trim()) {
      toast({
        title: "오류",
        description: "백엔드 서버 URL을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await checkServerStatus(serverUrl);
      setStatus(result);
      
      toast({
        title: result.isConnected ? "백엔드 연결 성공!" : "백엔드 연결 실패",
        description: result.message,
        variant: result.isConnected ? "default" : "destructive",
      });
    } catch (error) {
      console.error('백엔드 상태 확인 중 오류:', error);
      toast({
        title: "오류",
        description: "백엔드 상태 확인 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 자동 체크 기능
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoCheck) {
      interval = setInterval(performCheck, 30000); // 30초마다 체크
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoCheck, serverUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Spring Boot 백엔드 모니터
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AWS에 배포된 Spring Boot 백엔드 서버의 연결 상태를 실시간으로 확인하세요. 
            프론트엔드와 백엔드가 같은 서버에서 실행됩니다.
          </p>
        </div>

        <div className="space-y-6">
          <ServerSettings 
            serverUrl={serverUrl} 
            onUrlChange={setServerUrl}
          />
          
          <div className="flex justify-center gap-4">
            <Button 
              onClick={performCheck} 
              disabled={isLoading}
              size="lg"
              className="min-w-32"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isLoading ? '확인 중...' : '백엔드 상태 확인'}
            </Button>
            
            <Button
              variant={autoCheck ? "destructive" : "outline"}
              onClick={() => setAutoCheck(!autoCheck)}
              size="lg"
            >
              {autoCheck ? '자동 체크 중지' : '자동 체크 시작'}
            </Button>
          </div>
          
          <ServerStatusCard 
            status={status} 
            isLoading={isLoading}
            serverUrl={serverUrl}
          />

          <div className="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">AWS 동일 서버 배포 가이드</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">1. EC2 보안 그룹 설정:</strong>
                <p>• 인바운드 규칙에 포트 80 (HTTP) 추가</p>
                <p>• 포트 8080은 <span className="text-red-600 font-medium">열지 않음</span> (내부 통신만 사용)</p>
              </div>
              <div>
                <strong className="text-foreground">2. 프론트엔드 배포 (포트 80):</strong>
                <p>• npm run build로 빌드</p>
                <p>• nginx 설치: sudo apt install nginx</p>
                <p>• /var/www/html에 빌드된 파일 복사</p>
                <p>• sudo systemctl start nginx</p>
              </div>
              <div>
                <strong className="text-foreground">3. Spring Boot 실행 (포트 8080):</strong>
                <p>• nohup java -jar your-app.jar --server.port=8080 &</p>
                <p>• 또는 systemd 서비스로 등록</p>
              </div>
              <div>
                <strong className="text-foreground">4. 내부 통신 확인:</strong>
                <p>• 서버 내에서 curl http://localhost:8080 테스트</p>
                <p>• 404 오류가 나오면 Spring Boot 정상 실행 중</p>
              </div>
              <div>
                <strong className="text-foreground">5. 접속 테스트:</strong>
                <p>• 프론트엔드: http://your-ec2-ip (포트 80)</p>
                <p>• 백엔드는 외부에서 직접 접속 불가 (보안 강화)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
