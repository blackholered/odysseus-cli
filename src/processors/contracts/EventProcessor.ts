import WebSocket from 'ws';

/**
 * Interface for processing WebSocket events.
 * All event processors must implement this interface.
 */
export interface EventProcessor {
    /**
     * Processes a WebSocket message.
     * @param data - The WebSocket message data.
     * @param ws - The WebSocket instance.
     */
    processMessage(data: WebSocket.Data, ws: WebSocket): void;
}
