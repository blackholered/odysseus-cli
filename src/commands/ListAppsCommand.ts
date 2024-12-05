import {Command} from 'commander';
import {AppService} from '../services/AppService.js';
import {AppTableRenderer} from '../services/AppTableRenderer.js';
import {logger} from '../utils/logger.js';
import {CommandInterface} from "./contracts/CommandInterface.js";

export class ListAppsCommand implements CommandInterface {
    private appService: AppService;
    private appTableRenderer: AppTableRenderer;

    constructor(appService: AppService, appTableRenderer: AppTableRenderer) {
        this.appService = appService;
        this.appTableRenderer = appTableRenderer;
    }

    register(program: Command): void {
        program
            .command('list-apps')
            .description('List all apps for the current user and their attributes')
            .action(this.execute.bind(this));
    }

    private async execute(): Promise<void> {
        try {
            logger.info('Fetching apps...');
            const apps = await this.appService.getApps();

            if (!apps.length) {
                logger.warning('No apps found.');
                return;
            }

            this.appTableRenderer.render(apps);
        } catch (error: any) {
            logger.error('An error occurred while fetching apps:', error.message);
        }
    }
}
