import fs from 'fs';
import os from 'os';
import path from 'path';
import {ApiService} from '../services/ApiService.js';

export class FileManager {
    getTemporaryFilePath(fileName: string, appId: string): string {
        return path.join(os.tmpdir(), `${fileName}_${appId}`);
    }

    readFile(filePath: string): string {
        return fs.readFileSync(filePath, 'utf-8');
    }

    cleanupFile(filePath: string): void {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}