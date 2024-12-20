import {ApiService} from './ApiService.js';
import inquirer from 'inquirer';
import {SourceControlFields, SourceControlField} from '../fields/SourceControlFields.js';
import {EditEnvCommand} from '../commands/EditEnvCommand.js';
import {logger} from '../utils/logger.js';
import {App} from "../models/App.js";
import fs from "fs";
import axios from "axios";
import {AuthorizationHandler} from "../handlers/AuthorizationHandler.js";

export class AppService {
    private apiService: ApiService;
    private authorizationHandler: AuthorizationHandler;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
        this.authorizationHandler = new AuthorizationHandler(apiService);
    }

    async promptAppType(): Promise<string> {
        const {type} = await inquirer.prompt([
            {
                type: 'list',
                name: 'type',
                message: 'Select the app type:',
                choices: ['laravel', 'react', 'angular', 'svelte'],
            },
        ]);
        return type;
    }

    async createApp(website: string, type: string): Promise<any> {
        const response = await this.apiService.post('apps/create', {website, type});
        logger.success('App created successfully!');
        return response.data;
    }

    getFields(type: string, app: any): SourceControlField[] {
        const commonFields: SourceControlField[] = [
            {
                name: 'name',
                message: 'Enter a name for the app:',
                type: 'input',
                default: app.name || '',
            },
        ];
        const sourceControlFields = SourceControlFields.getGenericFields(app);
        return [...commonFields, ...sourceControlFields];
    }

    async updateFields(appId: string, fields: SourceControlField[], app: any): Promise<void> {
        const fieldsToUpdate: Record<string, any> = {};

        for (const field of fields) {
            const response = await inquirer.prompt([
                {
                    type: field.type,
                    name: field.name,
                    message: field.message,
                    choices: field.choices,
                    default: field.default,
                },
            ]);

            if (response[field.name] !== app[field.name]) {
                fieldsToUpdate[field.name] = response[field.name];
            }
        }

        if (Object.keys(fieldsToUpdate).length > 0) {
            logger.info('Updating app fields...');
            await this.apiService.patch(`apps/${appId}`, fieldsToUpdate);
            logger.success('App fields updated successfully!');
        } else {
            logger.warning('No changes were made to app fields.');
        }
    }

    async executeSteps(steps: Array<(appId: string, app: any) => Promise<void>>, app: any): Promise<void> {
        for (const step of steps) {
            try {
                await step(app.id, app);
            } catch (error: any) {
                logger.error('Error executing step:', error.message);
                break;
            }
        }
    }

    getSteps(type: string): Array<(appId: string, app: any) => Promise<void>> {
        const commonSteps = [
            async (appId: string) => logger.info('Executing common steps...'),
        ];

        const laravelSteps = [
            ...commonSteps,
            async (appId: string) => logger.info('Handling Laravel-specific tasks...'),
        ];

        const reactSteps = [
            ...commonSteps,
            async (appId: string) => logger.info('Handling React-specific tasks...'),
        ];

        const angularSteps = [
            ...commonSteps,
            async (appId: string) => logger.info('Handling Angular-specific tasks...'),
        ];

        const svelteSteps = [
            ...commonSteps,
            async (appId: string) => logger.info('Handling Svelte-specific tasks...'),
        ];

        switch (type) {
            case 'laravel':
                return laravelSteps;
            case 'react':
                return reactSteps;
            case 'angular':
                return angularSteps;
            case 'svelte':
                return svelteSteps;
            default:
                return commonSteps;
        }
    }

    async getApp(appId: string): Promise<any> {
        const response = await this.apiService.get(`apps/${appId}`);
        return response.data || null;
    }

    async updateApp(appId: string, updates: Record<string, any>): Promise<void> {
        await this.apiService.patch(`apps/${appId}`, updates);
    }

    async reauthorizeApp(appId: string): Promise<void> {
        await this.apiService.post(`apps/${appId}/reauthorize`, {});
    }

    async editEnv(appId: string): Promise<void> {
        logger.info('Prompting to edit the .env file...');
        const envCommand = new EditEnvCommand(this);
        await envCommand.editFile(appId, 'env', '.env');
    }

    async getApps(): Promise<App[]> {
        try {
            const response = await this.apiService.get('apps');
            return (response.data || []).map((appData: any) => new App(appData));
        } catch (error: any) {
            logger.error('Failed to fetch apps:', error.message);
            throw error;
        }
    }

    async executeCommand(appId: string, command: string, directory: string): Promise<string> {
        try {
            const response = await this.apiService.post(`apps/exec-cmd/${appId}`, {
                command,
                directory,
            });
            logger.success('Command execution triggered successfully!');
            return response.data.id;
        } catch (error: any) {
            logger.error('Failed to execute command:', error.message);
            throw error;
        }
    }

    async downloadFile(appId: string, fileType: string, filePath: string): Promise<void> {
        const endpoint = `apps/edit-file/${appId}`;

        try {
            const response = await this.apiService.get(endpoint, {
                params: {type: fileType},
                responseType: 'stream',
            });

            if (!response.data || typeof response.data.pipe !== 'function') {
                throw new Error('Invalid response: Expected a stream');
            }

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            return new Promise<void>((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (error: any) {
            logger.error(`Failed to download file from ${endpoint}:`, error.message);
            throw new Error('Failed to download file');
        }
    }

    async checkInstallationStatus(appId: string): Promise<void> {
        try {
            logger.info('Checking installation status...');
            const response = await this.apiService.get(`apps/${appId}/installation-status`);

            if (response === null) {
                logger.success('App installation status OK.');
                return;
            }
            const {status, authorization_url, message} = response.data;

            if (status === 'incomplete' && authorization_url) {
                logger.warning('Authorization required. Redirecting to authorization URL...');
                await this.authorizationHandler.handleAuthorization(appId, authorization_url);
                logger.info('Authorization process completed.');
            } else {
                throw new Error(message || 'Unexpected installation status response.');
            }
        } catch (error: any) {
            logger.error('Failed to check installation status:', error.message);
            throw error;
        }
    }


    async uploadFile(appId: string, fileType: string, content: string): Promise<void> {
        await this.apiService.patch(`apps/upload-file/${appId}`, {type: fileType, content});
    }


    async removeApp(appId: string): Promise<void> {
        try {
            await this.apiService.delete(`apps/${appId}`);
        } catch (error: any) {
            throw new Error(`Failed to delete app: ${error.message}`);
        }
    }


    async startBuild(appId: string): Promise<string> {
        try {
            const response = await this.apiService.post(`apps/build/${appId}`, {});
            return response.data.id;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to start build for app ID ${appId}: ${error.message}`);
            } else {
                throw new Error(`Failed to start build for app ID ${appId}: Unknown error occurred.`);
            }
        }
    }

}
