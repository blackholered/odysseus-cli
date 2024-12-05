import {Command} from 'commander';
import {AppService} from '../services/AppService.js';
import {WebSocketHandler} from '../handlers/WebSocketHandler.js';
import {BuildEventProcessor} from '../processors/BuildEventProcessor.js';
import {logger} from '../utils/logger.js';
import {CommandInterface} from "./contracts/CommandInterface.js";

export class BuildAppCommand implements CommandInterface {
    private appService: AppService;
    private webSocketHandler: WebSocketHandler;

    constructor(appService: AppService) {
        this.appService = appService;
        this.webSocketHandler = new WebSocketHandler(new BuildEventProcessor());
    }

    register(program: Command): void {
        program
            .command('build-app')
            .description('Build an app by providing its ID')
            .argument('<appId>', 'The ID of the app to build')
            .action(async (appId: string) => {
                try {
                    logger.info(`Starting build for app ID: ${appId}...`);
                    const jobId = await this.appService.startBuild(appId);
                    logger.success('Build started successfully! Listening for updates...');
                    await this.webSocketHandler.listen(jobId, `build-status.${jobId}`);
                } catch (error: any) {
                    this.handleError(error, appId);
                }
            });
    }

    private handleError(error: any, appId: string): void {
        if (error.response?.status === 404) {
            logger.error(`App with ID ${appId} not found.`);
        } else {
            logger.error('An error occurred:', error.message);
        }
    }
}
