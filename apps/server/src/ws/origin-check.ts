import type { FastifyReply, FastifyRequest } from 'fastify';
import { ALLOWED_ORIGINS } from '../config.ts';

/** Refuses browser pages from other origins before the WebSocket upgrade. */
export async function originCheck(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const origin = request.headers.origin;
  if (origin !== undefined && ALLOWED_ORIGINS.includes(origin)) return;
  request.log.warn({ origin: origin ?? null }, 'websocket origin refused');
  await reply.code(403).send({ error: 'forbidden_origin' });
}
