import {Command} from 'commander';
import {AppService} from '../services/AppService.js';
import {WebSocketHandler} from '../handlers/WebSocketHandler.js';
import {CommandEventProcessor} from '../processors/CommandEventProcessor.js';
import {logger} from '../utils/logger.js';
import {CommandInterface} from "./contracts/CommandInterface.js";

export class ExecuteCommandCommand implements CommandInterface {
    private appService: AppService;
    private webSocketHandler: WebSocketHandler;

    constructor(appService: AppService) {
        this.appService = appService;
        this.webSocketHandler = new WebSocketHandler(new CommandEventProcessor());
    }

    register(program: Command): void {
        program
            .command('exec-cmd <appId> <command>')
            .description('Execute a command on an app')
            .option('--directory <directory>', 'Directory for the command', 'odysseus_root')
            .action(this.execute.bind(this));
    }

    private async execute(appId: string, command: string, options: { directory: string }): Promise<void> {
        try {
            logger.info(`Triggering command execution for app ID: ${appId}...`);
            const jobId = await this.appService.executeCommand(appId, command, options.directory);

            logger.success('Command execution started. Listening for updates...');
            await this.webSocketHandler.listen(jobId, `command-status.${jobId}`);
        } catch (error: any) {
            logger.error(`Error executing command: ${error.message}`);
        }
    }
}
