import fs from 'fs';
import path from 'path';
import os from 'os';
import {logger} from '../utils/logger.js';

export class TokenService {
    private configPath: string;

    constructor() {
        const homeDir = os.homedir();
        const configDir = path.join(homeDir, '.odysseus');

        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, {recursive: true});
            logger.info(`Configuration directory created: ${configDir}`);
        }

        this.configPath = path.join(configDir, 'config.json');
    }

    saveToken(data: Record<string, any>): void {
        const config = {
            token: data.token,
            expiresAt: data.expires_at,
            user: data.user,
        };

        try {
            fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
            logger.info('Configuration saved at:', this.configPath);
        } catch (err: any) {
            logger.error('Failed to save configuration:', err.message);
        }
    }

    getToken(): Record<string, any> | null {
        if (!fs.existsSync(this.configPath)) {
            logger.warning('Configuration file not found.');
            return null;
        }

        try {
            return JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
        } catch (err: any) {
            logger.error('Failed to read configuration:', err.message);
            return null;
        }
    }

    deleteToken(): void {
        if (fs.existsSync(this.configPath)) {
            try {
                fs.unlinkSync(this.configPath);
                logger.info('Configuration file deleted.');
            } catch (err: any) {
                logger.error('Failed to delete configuration:', err.message);
            }
        } else {
            logger.warning('Configuration file does not exist.');
        }
    }
}
