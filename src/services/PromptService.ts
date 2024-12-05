import inquirer from 'inquirer';

export class PromptService {
    async promptEmail(): Promise<string> {
        const {email} = await inquirer.prompt([
            {
                type: 'input',
                name: 'email',
                message: 'Enter your email:',
                validate: (input: string) => input.includes('@') || 'Invalid email format',
            },
        ]);
        return email;
    }

    async promptVerificationCode(): Promise<string> {
        const {code} = await inquirer.prompt([
            {
                type: 'input',
                name: 'code',
                message: 'Enter the verification code:',
                validate: (input: string) => input.trim() !== '' || 'Code cannot be empty',
            },
        ]);
        return code;
    }

    /**
     * Prompts the user to select a job from a list of jobs.
     * @param jobList - The list of jobs to select from.
     * @returns {Promise<string>} - The selected job ID.
     */
    async promptJobSelection(jobList: any[]): Promise<string> {
        const formattedChoices = jobList.map((job, index) => ({
            name: `#${index + 1} - ${job.type} (${job.job_status}) - Created: ${new Date(job.created_at).toLocaleString()}`,
            value: job.id,
        }));

        const {selectedJobId} = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedJobId',
                message: 'Select a job to view details:',
                choices: formattedChoices,
            },
        ]);

        return selectedJobId;
    }
}
