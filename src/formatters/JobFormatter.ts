import chalk from 'chalk';

export class JobFormatter {
    formatJobListForSelection(jobList: any[]): { name: string; value: string }[] {
        return jobList.map((job, index) => ({
            name: `#${index + 1} - ${chalk.green(job.type)} (${chalk.yellow(job.job_status)}) - Created: ${new Date(
                job.created_at
            ).toLocaleString()}`,
            value: job.id,
        }));
    }

    displayJobDetails(jobDetails: any): void {
        console.log(chalk.blue(`Job ID: ${jobDetails.id}`));
        console.log(chalk.blue(`Type: ${jobDetails.type}`));
        console.log(chalk.blue(`Status: ${jobDetails.job_status}`));
        console.log(chalk.blue(`Created At: ${new Date(jobDetails.created_at).toLocaleString()}`));
        console.log(chalk.blue(`Updated At: ${new Date(jobDetails.updated_at).toLocaleString()}`));
        console.log(chalk.blue(`Error Message: ${jobDetails.error_message || 'None'}`));
        console.log(chalk.blue(`Output Log: \n${jobDetails.output_log || 'None'}`));
    }
}
