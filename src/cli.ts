#!/usr/bin/env node

import {Command} from 'commander';
import * as dotenv from 'dotenv';
import {initializeCommands} from './commands/index.js';
import {ApiService} from './services/ApiService.js';
import {TokenService} from './services/TokenService.js';
import {logger} from './utils/logger.js';

dotenv.config();

const CURRENT_VERSION = '1.0.0';

export async function checkVersion(apiService: ApiService): Promise<void> {
    try {
        logger.info('Checking CLI version...');
        const response = await apiService.get('cli/version');
        const latestVersion = response.latest;

        if (latestVersion !== CURRENT_VERSION) {
            logger.error(
                `Your CLI version (${CURRENT_VERSION}) is outdated. Please update to the latest version (${latestVersion}).`
            );
            process.exit(1);
        }

        logger.success('CLI version is up to date.');
    } catch (error: any) {
        logger.error('Failed to check CLI version. Please try again later.', error.message);
        process.exit(1);
    }
}

(async () => {
    const program = new Command();
    const tokenService = new TokenService();
    const apiService = new ApiService('https://odysseus.alpira.net/api/', tokenService);

    await checkVersion(apiService);

    initializeCommands(program, apiService);

    program
        .name('odysseus-cli')
        .description('A CLI tool for app management and deployment to Alpira hosting')
        .version(CURRENT_VERSION);

    program.parse(process.argv);
})();
