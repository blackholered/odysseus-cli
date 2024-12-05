import {Command} from 'commander';
import {ApiService} from '../services/ApiService.js';
import {AppService} from '../services/AppService.js';
import {WebsiteService} from '../services/WebsiteService.js';
import {JobService} from '../services/JobService.js';
import {AuthorizationHandler} from '../handlers/AuthorizationHandler.js';
import {PromptService} from '../services/PromptService.js';
import {AppTableRenderer} from '../services/AppTableRenderer.js';
import {EditEnvCommand} from './EditEnvCommand.js';
import {LoginCommand} from './LoginCommand.js';
import {CreateAppCommand} from './CreateAppCommand.js';
import {BuildAppCommand} from './BuildAppCommand.js';
import {ViewJobsCommand} from './ViewJobsCommand.js';
import {ListAppsCommand} from './ListAppsCommand.js';
import {TokenService} from "../services/TokenService.js";
import {JobFormatter} from "../formatters/JobFormatter.js";
import {AuthService} from "../services/AuthService.js";
import {EditPostDeploymentCommand} from "./EditPostDeploymentCommand.js";
import {UpdateRepositoryCommand} from "./UpdateRepositoryCommand.js";
import {ExecuteCommandCommand} from "./ExecuteCommandCommand.js";
import {DeleteAppCommand} from "./DeleteAppCommand.js";
import {LogoutCommand} from "./LogoutCommand.js";

export const initializeCommands = (program: Command, apiService: ApiService): void => {
    const appService = new AppService(apiService);
    const authService = new AuthService(apiService);
    const websiteService = new WebsiteService(apiService);
    const jobService = new JobService(apiService);
    const authorizationHandler = new AuthorizationHandler(apiService);
    const promptService = new PromptService();
    const jobFormatter = new JobFormatter();
    const appTableRenderer = new AppTableRenderer();
    const tokenService = new TokenService();

    const commands = [
        new LoginCommand(authService, promptService, tokenService),
        new CreateAppCommand(websiteService, appService, authorizationHandler),
        new BuildAppCommand(appService),
        new ViewJobsCommand(jobService, jobFormatter, promptService),
        new ListAppsCommand(appService, appTableRenderer),
        new EditEnvCommand(appService),
        new EditPostDeploymentCommand(appService),
        new UpdateRepositoryCommand(appService),
        new ExecuteCommandCommand(appService),
        new DeleteAppCommand(appService),
        new LogoutCommand(authService, tokenService)
    ];

    for (const command of commands) {
        command.register(program);
    }
};
