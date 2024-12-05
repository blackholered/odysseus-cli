import axios, {AxiosInstance} from 'axios';
import {TokenService} from './TokenService.js';
import {logger} from '../utils/logger.js';

export class ApiService {
    private client: AxiosInstance;
    private tokenService: TokenService;

    constructor(baseUrl: string, tokenService: TokenService) {
        this.client = axios.create({
            baseURL: baseUrl,
            timeout: 5000,
        });
        this.tokenService = tokenService;
    }

    private getAuthHeader(): Record<string, string> {
        const tokenData = this.tokenService.getToken();
        if (tokenData && tokenData.token) {
            return {Authorization: `Bearer ${tokenData.token}`};
        }
        logger.warning('No token found for authentication.');
        return {};
    }

    async get(
        endpoint: string,
        options: { params?: Record<string, any>; responseType?: 'json' | 'stream' } = {}
    ): Promise<any> {
        try {
            const response = await this.client.get(endpoint, {
                params: options.params,
                headers: this.getAuthHeader(),
                responseType: options.responseType || 'json',
            });

            if (options.responseType === 'stream') {
                return response;
            }
            if (response.status === 204) {
                return null;
            }
            return response.data;
        } catch (error: any) {
            logger.error(`Failed to perform GET request to ${endpoint}:`, error.message);
            throw new Error(error.response?.data?.message || 'API request failed');
        }
    }


    async post(endpoint: string, data: Record<string, any>): Promise<any> {
        try {
            const response = await this.client.post(endpoint, data, {headers: this.getAuthHeader()});
            return response.data;
        } catch (error: any) {
            logger.error(`Failed to perform POST request to ${endpoint}:`, error.message);
            throw new Error(error.response?.data?.message || 'API request failed');
        }
    }

    async patch(endpoint: string, data: Record<string, any>): Promise<any> {
        try {
            const response = await this.client.patch(endpoint, data, {headers: this.getAuthHeader()});
            return response.data;
        } catch (error: any) {
            logger.error(`Failed to perform PATCH request to ${endpoint}:`, error.message);
            throw new Error(error.response?.data?.message || 'API request failed');
        }
    }

    async delete(endpoint: string): Promise<void> {
        try {
            await this.client.delete(endpoint, {headers: this.getAuthHeader()});
        } catch (error: any) {
            logger.error(`Failed to perform DELETE request to ${endpoint}:`, error.message);
            throw new Error(error.response?.data?.message || 'API request failed');
        }
    }
}
