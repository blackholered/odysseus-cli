import {spawn} from 'child_process';
import {logger} from "../utils/logger.js";

export class FileEditorHelper {
    /**
     * Opens the specified file in the system's default editor and waits for it to close.
     * @param filePath The path to the file to open.
     */
    openFileInEditor(filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const editor = process.env.EDITOR || (process.platform === 'win32' ? 'notepad' : 'nano');
            logger.info(`Opening with editor: ${editor}`);

            const child = spawn(editor, [filePath], {
                stdio: 'inherit',
                shell: process.platform === 'win32',
            });

            child.on('exit', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Editor exited with code ${code}`));
                }
            });

            child.on('error', (err) => {
                reject(err);
            });
        });
    }
}
