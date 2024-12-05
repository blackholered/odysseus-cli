import {Command} from 'commander';
import {JobService} from '../services/JobService.js';
import {JobFormatter} from '../formatters/JobFormatter.js';
import {PromptService} from '../services/PromptService.js';
import {logger} from '../utils/logger.js';
import {CommandInterface} from "./contracts/CommandInterface.js";

export class ViewJobsCommand implements CommandInterface {
    private jobService: JobService;
    private jobFormatter: JobFormatter;
    private promptService: PromptService;

    constructor(jobService: JobService, jobFormatter: JobFormatter, promptService: PromptService) {
        this.jobService = jobService;
        this.jobFormatter = jobFormatter;
        this.promptService = promptService;
    }

    register(program: Command): void {
        program
            .command('view-jobs <appId>')
            .description('View all jobs for a specific app and check job details')
            .action(this.execute.bind(this));
    }

    private async execute(appId: string): Promise<void> {
        try {
            logger.info(`Fetching jobs for app ID: ${appId}...`);
            const jobList = await this.jobService.fetchJobs(appId);

            if (!jobList.length) {
                logger.warning('No jobs found for the specified app.');
                return;
            }

            const selectedJobId = await this.promptService.promptJobSelection(jobList);

            logger.info(`Fetching details for job ID: ${selectedJobId}...`);
            const jobDetails = await this.jobService.fetchJobDetails(selectedJobId);

            logger.success('Job Details:');
            this.jobFormatter.displayJobDetails(jobDetails);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any): void {
        if (error.response?.status === 404) {
            logger.error('The specified job or app could not be found.');
        } else if (error.code === 'ENOTFOUND') {
            logger.error('Network error: Unable to reach the server.');
        } else {
            logger.error('An unexpected error occurred:', error.message);
        }
    }
}
