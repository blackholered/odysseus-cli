import {exec} from 'child_process';
import util from 'util';
import chalk from 'chalk';
import {logger} from "../utils/logger.js";

const execPromise = util.promisify(exec);

export class FileEditorHelper {
    /**
     * Opens the specified file in the system's default editor.
     * @param filePath The path to the file to open.
     */
    async openFileInEditor(filePath: string): Promise<void> {
        const isWindows = process.platform === 'win32';
        const editor = process.env.EDITOR || (isWindows ? 'notepad' : 'nano');

        try {
            if (isWindows) {
                await execPromise(`start ${editor} ${filePath}`, {shell: 'cmd.exe'});
            } else {
                await execPromise(`${editor} ${filePath}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                logger.error('Error opening file in editor:');
            } else {
                logger.error('Unknown error occurred while opening editor.');
            }
        }
    }
}
