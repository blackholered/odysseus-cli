import {Command} from 'commander';
import {AppService} from '../services/AppService.js';
import {AppInputService} from '../services/AppInputService.js';
import {logger} from '../utils/logger.js';
import {CommandInterface} from "./contracts/CommandInterface.js";

export class UpdateRepositoryCommand implements CommandInterface {
    private appService: AppService;
    private appInputService: AppInputService;

    constructor(appService: AppService) {
        this.appService = appService;
        this.appInputService = new AppInputService();
    }

    register(program: Command): void {
        program
            .command('update-repository <appId>')
            .description('Update repository URL, branch, and source control provider for an app')
            .action(this.execute.bind(this));
    }

    private async execute(appId: string): Promise<void> {
        try {
            logger.info('Fetching app details...');
            const app = await this.appService.getApp(appId);

            if (!app) {
                logger.error('App not found.');
                return;
            }

            logger.success(`App found: ${app.name} (${app.website})`);

            const updates = await this.appInputService.getUpdateFields(app);

            if (Object.keys(updates).length > 0) {
                logger.info('Updating app repository information...');
                await this.appService.updateApp(appId, updates);

                if (updates.repository_url || updates.branch || updates.source_control_provider) {
                    logger.info('Checking installation status for re-authorization...');
                    await this.appService.checkInstallationStatus(appId);
                }

                logger.success('Repository update process completed successfully!');
            } else {
                logger.warning('No changes were made.');
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any): void {
        if (error.response?.status === 403) {
            logger.error('You do not have ownership of the app.');
        } else {
            logger.error('Failed to update repository:', error.message);
        }
    }
}
