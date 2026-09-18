import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

let io: SocketIOServer | null = null;

export const initSocketServer = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`[Socket] Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`[Socket] Client disconnected: ${socket.id}`);
    });

    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date().toISOString() });
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};
