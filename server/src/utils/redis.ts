import { createClient } from 'redis';
import { logger } from './logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const CHAT_HISTORY_TTL = 60 * 60 * 24 * 7; // 7 days
const AI_RESPONSE_TTL = 60 * 60 * 24; // 24 hours

const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
  },
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

redisClient.on('reconnecting', () => {
  logger.info('Redis Client Reconnecting');
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('Redis Connection Error:', error);
    throw error;
  }
};

export const cacheAIResponse = async (key: string, response: string) => {
  try {
    await redisClient.setEx(`ai_${key}`, AI_RESPONSE_TTL, response);
    logger.debug('Cached AI response:', { key });
  } catch (error) {
    logger.error('Error caching AI response:', error);
  }
};

export const getCachedAIResponse = async (key: string) => {
  try {
    const cached = await redisClient.get(`ai_${key}`);
    if (cached) {
      logger.debug('Cache hit for AI response:', { key });
    }
    return cached;
  } catch (error) {
    logger.error('Error getting cached AI response:', error);
    return null;
  }
};

export const cacheChatHistory = async (userId: string, chatId: string, messages: any[]) => {
  try {
    const key = `chat_${userId}_${chatId}`;
    await redisClient.setEx(key, CHAT_HISTORY_TTL, JSON.stringify(messages));
    logger.debug('Cached chat history:', { userId, chatId });
  } catch (error) {
    logger.error('Error caching chat history:', error);
  }
};

export const getCachedChatHistory = async (userId: string, chatId: string) => {
  try {
    const key = `chat_${userId}_${chatId}`;
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    logger.error('Error getting cached chat history:', error);
    return null;
  }
};

export const monitorRedis = async () => {
  const info = await redisClient.info();
  const metrics = {
    connectedClients: await redisClient.clientList().then(clients => clients.length),
    memoryUsage: await redisClient.info('memory').then(info => info.split('\r\n').find(line => line.startsWith('used_memory_human'))),
    hitRate: await redisClient.info('stats').then(info => {
      const lines = info.split('\r\n');
      const hits = parseInt(lines.find(line => line.startsWith('keyspace_hits'))?.split(':')[1] || '0');
      const misses = parseInt(lines.find(line => line.startsWith('keyspace_misses'))?.split(':')[1] || '0');
      return hits / (hits + misses);
    }),
  };

  logger.info('Redis Metrics:', metrics);
  return metrics;
};

export { redisClient };