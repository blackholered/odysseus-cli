import inquirer from 'inquirer';
import { SourceControlFields, SourceControlField } from '../fields/SourceControlFields.js';

export class AppInputService {
    /**
     * Collects user inputs for updating app fields and identifies changes.
     * @param app - The current app data.
     * @returns {Promise<Record<string, any>>} - The updated fields to be sent to the API.
     */
    async getUpdateFields(app: any): Promise<Record<string, any>> {
        const updates: Record<string, any> = {};

        const fields: SourceControlField[] = SourceControlFields.getGenericFields(app);
        const questions = fields.map((field) => ({
            type: field.type,
            name: field.name,
            message: field.message,
            choices: field.choices,
            default: field.default,
        }));

        const responses = await inquirer.prompt(questions);

        for (const field of fields) {
            if (responses[field.name] !== app[field.name]) {
                updates[field.name] = responses[field.name];
            }
        }

        return updates;
    }
}
