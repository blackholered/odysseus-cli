import {Command} from 'commander';
import {AppService} from '../services/AppService.js';
import {FileManager} from '../helpers/FileManager.js';
import {logger} from '../utils/logger.js';
import {FileEditorHelper} from "../helpers/FileEditorHelper.js";
import {CommandInterface} from "./contracts/CommandInterface.js";

export class EditEnvCommand implements CommandInterface {
    private appService: AppService;
    private fileManager: FileManager;
    private fileEditor: FileEditorHelper;

    constructor(appService: AppService) {
        this.appService = appService;
        this.fileManager = new FileManager();
        this.fileEditor = new FileEditorHelper();
    }

    register(program: Command): void {
        program
            .command('edit-env <appId>')
            .description('Edit the .env file of an app')
            .action(async (appId: string) => {
                try {
                    await this.editFile(appId, 'env', '.env');
                } catch (error: any) {
                    logger.error('Error during .env file editing process:', error.message);
                }
            });
    }

    async editFile(appId: string, fileType: string, fileName: string): Promise<void> {
        const tempFilePath = this.fileManager.getTemporaryFilePath(fileName, appId);

        try {
            logger.info(`Fetching ${fileName} file...`);
            await this.appService.downloadFile(appId, fileType, tempFilePath);

            logger.info(`Opening ${fileName} file in default editor...`);
            await this.fileEditor.openFileInEditor(tempFilePath);

            logger.info(`Uploading the edited ${fileName} file...`);
            const updatedContent = this.fileManager.readFile(tempFilePath);
            await this.appService.uploadFile(appId, fileType, updatedContent);

            logger.success(`${fileName} file updated successfully!`);
        } finally {
            this.fileManager.cleanupFile(tempFilePath);
        }
    }
}
