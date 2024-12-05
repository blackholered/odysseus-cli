import {ApiService} from './ApiService.js';
import {logger} from '../utils/logger.js';

export class AuthService {
    private apiService: ApiService;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }

    /**
     * Sends a login request to the API.
     * @param email - The user's email address.
     */
    async requestVerificationCode(email: string): Promise<void> {
        logger.info('Sending verification code...');
        await this.apiService.post('auth/login', {email});
        logger.success('Verification code sent to your email.');
    }

    /**
     * Validates the login using a verification code.
     * @param email - The user's email address.
     * @param code - The verification code.
     * @returns {Promise<any>} - The authentication response.
     */
    async validateLogin(email: string, code: string): Promise<any> {
        logger.info('Validating verification code...');
        const response = await this.apiService.post('auth/validate', {email, code});
        logger.success('Validation successful!');
        return response.data;
    }

    /**
     * Logs out the current user by sending a request to the logout endpoint.
     */
    async logout(): Promise<void> {
        logger.info('Sending logout request...');
        await this.apiService.post('auth/logout', {});
        logger.success('Logout request completed.');
    }
}
