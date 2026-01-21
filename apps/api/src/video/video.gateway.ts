import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtAccessPayload, VideoProgressMessage } from "@repo/types";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

@WebSocketGateway({
  // CORS 설정
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "*",
    credentials: true,
  },
})
export class VideoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(VideoGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // 웹 소켓 클라이언트 연결 시 호출
  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = this.extractToken(client);
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync<JwtAccessPayload>(
        token,
        { secret: this.configService.getOrThrow<string>("jwt.accessSecret") },
      );

      (client.data as { user: JwtAccessPayload }).user = payload;
      await client.join(`user:${payload.sub}`);
      this.logger.log(`Client connected: ${client.id}, userId: ${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }

  // 웹 소켓 클라이언트 연결 해제 시 호출
  handleDisconnect(client: Socket): void {
    const userId = (client.data as { user?: JwtAccessPayload }).user?.sub;
    if (userId) {
      this.logger.log(`Client disconnected: ${client.id}, userId: ${userId}`);
    }
  }

  // 특정 사용자에게 영상 생성 상태를 전송
  sendVideoStatus(userId: number, data: VideoProgressMessage): void {
    this.logger.log("[Socket.IO] " + data.message);
    this.server.to(`user:${userId}`).emit("video-status", data);
  }

  // 클라이언트로부터 토큰 추출 (auth.token 방식만 지원)
  private extractToken(client: Socket): string | null {
    return (client.handshake.auth?.token as string) || null;
  }
}
