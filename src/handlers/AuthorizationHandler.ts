import express, {Request, Response} from 'express';
import open from 'open';
import {ApiService} from '../services/ApiService.js';
import {logger} from '../utils/logger.js';

export class AuthorizationHandler {
    private apiService: ApiService;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }

    async handleAuthorization(appId: string, authUrl: string): Promise<void> {
        logger.warning('Authorization required! Opening browser...');
        await open(authUrl);

        return new Promise<void>((resolve, reject) => {
            const app = express();
            const port = process.env.AUTH_PORT || 5656;

            const server = app.listen(port, () =>
                logger.info(`Listening for authorization at http://localhost:${port}/callback`)
            );

            app.get('/callback', async (req: Request, res: Response) => {
                const {state, code, installation_id} = req.query;

                const stateString = state as string;
                const codeString = code as string;
                const installationIdString = installation_id as string;

                if (stateString !== appId || !codeString || !installationIdString) {
                    res.status(400).send('Invalid authorization response.');
                    reject(new Error('Invalid authorization response.'));
                    server.close();
                    return;
                }

                try {
                    const queryParams = new URLSearchParams({
                        code: codeString,
                        installation_id: installationIdString,
                        state: appId,
                    }).toString();

                    await this.apiService.get(`auth/callback?${queryParams}`);
                    res.send('Authorization completed! You can close this window.');
                    logger.success('Authorization successful!');
                    resolve();
                } catch (error: any) {
                    res.status(500).send('Authorization failed.');
                    logger.error('Failed to complete authorization:', error.message);
                    reject(error);
                } finally {
                    server.close();
                }
            });
        });
    }
}
