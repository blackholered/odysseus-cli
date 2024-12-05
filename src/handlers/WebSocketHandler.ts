import WebSocket from 'ws';
import { EventProcessor } from '../processors/contracts/EventProcessor.js';
import { logger } from '../utils/logger.js';

export class WebSocketHandler {
    private eventProcessor: EventProcessor;

    constructor(eventProcessor: EventProcessor) {
        this.eventProcessor = eventProcessor;
    }

    async listen(jobId: string, channel: string): Promise<void> {
        const wsUrl = `wss://reverb.alpira.net/reverb/app/yjl1eqvw0hbbnlelwjwg`;
        const ws = new WebSocket(wsUrl);

        let pongInterval: NodeJS.Timeout;

        ws.on('open', () => {
            logger.success('Connected to the WebSocket server.');
            this.subscribeToChannel(ws, channel);

            pongInterval = setInterval(() => {
                ws.ping();
                logger.debug('Ping sent to keep connection alive.');
            }, 30000);
        });

        ws.on('message', (data) => this.eventProcessor.processMessage(data, ws));

        ws.on('close', () => {
            clearInterval(pongInterval);
            logger.info('Disconnected from the WebSocket server.');
        });

        ws.on('error', (error) => {
            clearInterval(pongInterval);
            logger.error('WebSocket error:', error.message);
        });
    }

    private subscribeToChannel(ws: WebSocket, channel: string): void {
        const subscriptionMessage = JSON.stringify({
            event: 'pusher:subscribe',
            data: { channel },
        });
        ws.send(subscriptionMessage);
    }
}
