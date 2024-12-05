import { ApiService } from './ApiService.js';
import inquirer from 'inquirer';
import { logger } from '../utils/logger.js';

export class WebsiteService {
    private apiService: ApiService;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }

    async fetchWebsites(): Promise<any[]> {
        try {
            const response = await this.apiService.get('websites');
            return response.data || [];
        } catch (error: any) {
            logger.error('Failed to fetch websites:', error.message);
            return [];
        }
    }

    async promptWebsiteSelection(websites: any[]): Promise<any> {
        const { selectedWebsite } = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedWebsite',
                message: 'Select a website to deploy:',
                choices: websites.map((site) => ({
                    name: `${site.domain.name} (${site.status})`,
                    value: site,
                })),
            },
        ]);
        return selectedWebsite;
    }
}
