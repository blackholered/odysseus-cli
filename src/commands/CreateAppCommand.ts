import { Command } from 'commander';
import { WebsiteService } from '../services/WebsiteService.js';
import { AppService } from '../services/AppService.js';
import { AuthorizationHandler } from '../handlers/AuthorizationHandler.js';
import { logger } from '../utils/logger.js';
import { CommandInterface } from "./contracts/CommandInterface.js";

export class CreateAppCommand implements CommandInterface {
    private websiteService: WebsiteService;
    private appService: AppService;
    private authorizationHandler: AuthorizationHandler;

    constructor(websiteService: WebsiteService, appService: AppService, authorizationHandler: AuthorizationHandler) {
        this.websiteService = websiteService;
        this.appService = appService;
        this.authorizationHandler = authorizationHandler;
    }

    register(program: Command): void {
        program
            .command('create-app')
            .description('Create a new app for your website')
            .action(this.execute.bind(this));
    }

    private async execute(): Promise<void> {
        try {
            logger.info('Fetching websites...');
            const websites = await this.websiteService.fetchWebsites();

            if (websites.length === 0) {
                logger.error('No websites found for your organization.');
                return;
            }

            const selectedWebsite = await this.websiteService.promptWebsiteSelection(websites);

            const type = await this.appService.promptAppType();
            const app = await this.appService.createApp(selectedWebsite.name, type);

            const appFields = this.appService.getFields(type, app);
            await this.appService.updateFields(app.id, appFields, app);

            const steps = this.appService.getSteps(type);
            await this.appService.executeSteps(steps, app);

            if (['react', 'angular', 'svelte'].includes(type)) {
                await this.appService.editEnv(app.id);
            }

            logger.success('App creation process completed successfully!');

            if (['react', 'laravel', 'angular', 'svelte'].includes(type)) {
                logger.info('Checking installation status for OAuth authorization...');
                await this.appService.checkInstallationStatus(app.id);
            }
        } catch (error: any) {
            logger.error('An error occurred during app creation:', error.message);
        }
    }
}
