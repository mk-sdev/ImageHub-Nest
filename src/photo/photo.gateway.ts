import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
// TODO: wysyłać dane tylko do konkretnego usera, a nie do wszystkich
@WebSocketGateway({
  cors: {
    origin: '*', // tylko jeśli potrzebujesz CORS
  },
})
export class PhotoGateway {
  @WebSocketServer()
  server: Server;

  sendUpdateLog(count: number) {
    this.server.emit('photosUpdated', {
      message: `Zaktualizowano ${count} zdjęć`,
      count,
    });
  }

  sendDeleteLog(count: number) {
    this.server.emit('photosDeleted', {
      message: `Usunięto ${count} zdjęć`,
      count,
    });
  }
}
