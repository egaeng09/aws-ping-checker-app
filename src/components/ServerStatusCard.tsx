
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Server } from "lucide-react";
import { ServerStatus } from "@/utils/serverCheck";

interface ServerStatusCardProps {
  status: ServerStatus | null;
  isLoading: boolean;
  serverUrl: string;
}

export const ServerStatusCard = ({ status, isLoading, serverUrl }: ServerStatusCardProps) => {
  const getStatusIcon = () => {
    if (isLoading) return <Clock className="w-5 h-5 animate-spin text-blue-500" />;
    if (!status) return <Server className="w-5 h-5 text-gray-400" />;
    return status.isConnected ? 
      <CheckCircle className="w-5 h-5 text-green-500" /> : 
      <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (isLoading) return <Badge variant="secondary">확인 중...</Badge>;
    if (!status) return <Badge variant="outline">대기 중</Badge>;
    return status.isConnected ? 
      <Badge className="bg-green-500 hover:bg-green-600">연결 성공</Badge> : 
      <Badge variant="destructive">연결 실패</Badge>;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <CardTitle className="text-xl">AWS Spring Boot 서버 상태</CardTitle>
              <CardDescription className="mt-1">
                {serverUrl}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status && (
          <>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm font-medium mb-2">상태 메시지:</p>
              <p className="text-sm text-muted-foreground">{status.message}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg border">
                <p className="text-sm text-muted-foreground">응답 시간</p>
                <p className="text-lg font-semibold">
                  {status.responseTime ? `${status.responseTime}ms` : 'N/A'}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg border">
                <p className="text-sm text-muted-foreground">마지막 확인</p>
                <p className="text-lg font-semibold">{status.timestamp}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                테스트 기준
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                • 성공: 서버가 응답을 반환하는 경우 (404 포함)<br/>
                • 실패: 연결이 되지 않거나 타임아웃이 발생하는 경우
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
