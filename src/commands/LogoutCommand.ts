import {Command} from 'commander';
import {AuthService} from '../services/AuthService.js';
import {TokenService} from '../services/TokenService.js';
import {logger} from '../utils/logger.js';
import {CommandInterface} from './contracts/CommandInterface.js';

export class LogoutCommand implements CommandInterface {
    private authService: AuthService;
    private tokenService: TokenService;

    constructor(authService: AuthService, tokenService: TokenService) {
        this.authService = authService;
        this.tokenService = tokenService;
    }

    register(program: Command): void {
        program
            .command('logout')
            .description('Log out the current user and clear the local config file')
            .action(this.execute.bind(this));
    }

    private async execute(): Promise<void> {
        try {
            logger.info('Logging out...');
            await this.authService.logout();
            this.tokenService.deleteToken();
            logger.success('Logout successful. Configuration cleared.');
        } catch (error: any) {
            logger.error(error.message || 'An unexpected error occurred during logout.');
        }
    }
}
