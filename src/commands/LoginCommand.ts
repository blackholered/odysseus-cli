import {Command} from 'commander';
import {PromptService} from '../services/PromptService.js';
import {TokenService} from '../services/TokenService.js';
import {AuthService} from '../services/AuthService.js';
import {logger} from '../utils/logger.js';
import {CommandInterface} from "./contracts/CommandInterface.js";

export class LoginCommand implements CommandInterface {
    private authService: AuthService;
    private promptService: PromptService;
    private tokenService: TokenService;

    constructor(authService: AuthService, promptService: PromptService, tokenService: TokenService) {
        this.authService = authService;
        this.promptService = promptService;
        this.tokenService = tokenService;
    }

    register(program: Command): void {
        program
            .command('login')
            .description('Authenticate user with email and verification code')
            .action(this.execute.bind(this));
    }

    private async execute(): Promise<void> {
        try {
            const email = await this.promptService.promptEmail();
            await this.authService.requestVerificationCode(email);

            const code = await this.promptService.promptVerificationCode();
            const authData = await this.authService.validateLogin(email, code);

            this.tokenService.saveToken(authData);
            logger.success('Login successful. Token saved!');
        } catch (error: any) {
            logger.error(error.message || 'An unexpected error occurred.');
        }
    }
}
