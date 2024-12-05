import {EventProcessor} from './contracts/EventProcessor.js';
import WebSocket from 'ws';
import {logger} from '../utils/logger.js';

export class BuildEventProcessor implements EventProcessor {
    processMessage(data: WebSocket.Data, ws: WebSocket): void {
        try {
            const event = JSON.parse(data.toString());
            logger.info(`Received Build Event: ${event.event}`);

            const eventData = event.data ? JSON.parse(event.data) : null;

            switch (event.event) {
                case 'App\\Events\\BuildStarted':
                    this.handleBuildStarted(eventData);
                    break;

                case 'App\\Events\\BuildStatusUpdated':
                    this.handleBuildStatusUpdate(eventData);
                    break;

                case 'App\\Events\\BuildCompleted':
                    this.handleBuildCompleted(eventData, ws);
                    break;

                case 'App\\Events\\BuildFailed':
                    this.handleBuildFailed(eventData, ws);
                    break;

                case 'pusher:connection_established':
                case 'pusher_internal:subscription_succeeded':
                    break;

                default:
                    logger.warning(`Unhandled build event type: ${event.event}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                logger.error('Error processing build message:', error.message);
            } else {
                logger.error('An unknown error occurred while processing the build message.');
            }
        }
    }

    /**
     * Handle the `BuildStarted` event.
     * @param {any} data - Event payload.
     */
    private handleBuildStarted(data: any): void {
        const jobId = data?.job_id || 'unknown';
        const message = data?.message || 'Build process has started.';
        logger.info(`Build Started for Job ID: ${jobId}`);
        logger.debug(`Details: ${message}`);
    }

    /**
     * Handle the `BuildStatusUpdated` event.
     * @param {any} data - Event payload.
     */
    private handleBuildStatusUpdate(data: any): void {
        const level = data?.level || 'info';
        const message = data?.message || 'No details provided';

        switch (level) {
            case 'success':
                logger.success(message);
                break;
            case 'error':
                logger.error(message);
                break;
            case 'warning':
                logger.warning(message);
                break;
            case 'info':
            default:
                logger.info(message);
        }
    }

    /**
     * Handle the `BuildCompleted` event.
     * @param {any} data - Event payload.
     * @param {WebSocket} ws - WebSocket connection.
     */
    private handleBuildCompleted(data: any, ws: WebSocket): void {
        const jobId = data?.job_id || 'unknown';
        const message = data?.message || 'Build completed successfully!';
        logger.success(`Build Completed for Job ID: ${jobId}`);
        logger.debug(`Details: ${message}`);
        ws.close();
    }

    /**
     * Handle the `BuildFailed` event.
     * @param {any} data - Event payload.
     * @param {WebSocket} ws - WebSocket connection.
     */
    private handleBuildFailed(data: any, ws: WebSocket): void {
        const jobId = data?.job_id || 'unknown';
        const message = data?.message || 'An internal error occurred. Please check build logs.';
        logger.error(`Build Failed for Job ID: ${jobId}`);
        logger.debug(`Error Details: ${message}`);
        ws.close();
    }
}
