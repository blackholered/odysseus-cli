import {ApiService} from './ApiService.js';
import inquirer from 'inquirer';
import {logger} from '../utils/logger.js';

interface Alias {
    id: string;
    name: string;
    document_root: string;
    kind: string;
    cloudflare_status: string;
}

interface Domain {
    id: string;
    name: string;
    document_root: string;
    kind: string;
    cloudflare_status: string;
}

interface Website {
    id: string;
    domain: Domain;
    aliases: Alias[];
    status: string;
    created_at: string;
    php_version: string;
}

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

    async promptWebsiteSelection(websites: any[]): Promise<{ id: string; name: string; isAlias: boolean }> {
        const domainEntries = websites.flatMap((site: any) => {
            const primaryDomainEntry = {
                id: site.domain?.id,
                name: site.domain?.name ?? 'No domain',
                status: site.status,
                isAlias: false,
            };

            const aliasEntries = (site.aliases ?? []).map((alias: any) => ({
                id: alias.id,
                name: alias.name,
                status: site.status,
                isAlias: true,
            }));

            return [primaryDomainEntry, ...aliasEntries];
        });

        const {selectedEntry} = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedEntry',
                message: 'Select a website to deploy:',
                choices: domainEntries.map((entry: any) => ({
                    name: `${entry.name} (${entry.status})`,
                    value: entry,
                })),
            },
        ]);
        return {
            id: selectedEntry.id,
            name: selectedEntry.name,
            isAlias: selectedEntry.isAlias,
        };
    }


}
