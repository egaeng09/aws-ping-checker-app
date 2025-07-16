
export interface ServerStatus {
  isConnected: boolean;
  status: 'success' | 'failed' | 'checking';
  message: string;
  responseTime?: number;
  timestamp: string;
}

export const checkServerStatus = async (serverUrl: string): Promise<ServerStatus> => {
  const startTime = Date.now();
  const timestamp = new Date().toLocaleString('ko-KR');
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
    
    const response = await fetch(serverUrl, {
      method: 'GET',
      signal: controller.signal,
      mode: 'no-cors' // CORS 이슈 방지
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    // no-cors 모드에서는 상태 코드를 확인할 수 없으므로, 응답이 오면 연결 성공으로 간주
    return {
      isConnected: true,
      status: 'success',
      message: '서버가 정상적으로 응답하고 있습니다 (연결 성공)',
      responseTime,
      timestamp
    };
    
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    if (error.name === 'AbortError') {
      return {
        isConnected: false,
        status: 'failed',
        message: '연결 시간 초과 (10초) - 서버가 응답하지 않습니다',
        responseTime,
        timestamp
      };
    }
    
    return {
      isConnected: false,
      status: 'failed',
      message: `연결 실패: ${error.message}`,
      responseTime,
      timestamp
    };
  }
};
