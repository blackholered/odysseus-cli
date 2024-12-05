import {EventProcessor} from './contracts/EventProcessor.js';
import WebSocket from 'ws';
import {logger} from '../utils/logger.js';

export class CommandEventProcessor implements EventProcessor {
    processMessage(data: WebSocket.Data, ws: WebSocket): void {
        try {
            const event = JSON.parse(data.toString());

            if (event.event === 'App\\Events\\CommandStatusUpdated') {
                const eventData = JSON.parse(event.data);
                this.handleCommandStatusUpdated(eventData, ws);
            } else {
                logger.warning(`Unhandled WebSocket event: ${event.event}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                logger.error('Error processing WebSocket message:', error.message);
            } else {
                logger.error('An unknown error occurred while processing the WebSocket message.');
            }
        }
    }
    /**
     * Handles the `CommandStatusUpdated` event.
     * @param eventData - The parsed data from the event.
     * @param ws - The WebSocket instance.
     */
    private handleCommandStatusUpdated(eventData: any, ws: WebSocket): void {
        const level = eventData.level || 'info';
        const message = eventData.message || '';

        switch (level) {
            case 'success':
                logger.success(this.formatMessage(message));
                break;

            case 'error':
                logger.error(this.formatMessage(message));
                break;

            case 'info':
            default:
                logger.info(this.formatMessage(message));
                break;
        }
        if (message.includes('Command execution process has ended.')) {
            logger.success('Execution process completed.');
            ws.close();
        }
    }

    /**
     * Formats a raw message for better readability.
     * @param rawMessage - The raw message string.
     * @returns The formatted message.
     */
    private formatMessage(rawMessage: string): string {
        return rawMessage.replace(/\\n/g, '\n');
    }
}
