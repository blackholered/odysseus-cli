import {Command} from 'commander';
import {AppService} from '../services/AppService.js';
import {logger} from '../utils/logger.js';
import {CommandInterface} from './contracts/CommandInterface.js';

export class DeleteAppCommand implements CommandInterface {
    private appService: AppService;

    constructor(appService: AppService) {
        this.appService = appService;
    }

    register(program: Command): void {
        program
            .command('delete-app <appId>')
            .description('Delete an app and its related resources')
            .action(this.execute.bind(this));
    }

    private async execute(appId: string): Promise<void> {
        try {
            logger.info(`Deleting app with ID: ${appId}...`);
            await this.appService.removeApp(appId);
            logger.success('App deleted successfully.');
        } catch (error: any) {
            logger.error(`Failed to delete app: ${error.message}`);
        }
    }
}
