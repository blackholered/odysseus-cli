export interface SourceControlField {
    name: string;
    type: 'input' | 'list';
    message: string;
    choices?: Array<{ name: string; value: string }>;
    default?: string;
}

export class SourceControlFields {
    static getGenericFields(app: any): SourceControlField[] {
        return [
            {
                name: 'repository_url',
                type: 'input',
                message: 'Enter the repository URL:',
                default: app.repository_url || '',
            },
            {
                name: 'branch',
                type: 'input',
                message: 'Enter the branch name:',
                default: app.branch || 'main',
            },
            {
                name: 'source_control_provider',
                type: 'list',
                message: 'Select the source control provider:',
                choices: [
                    {name: 'GitHub', value: 'github'},
                ],
                default: app.source_control_provider || 'github',
            },
        ];
    }
}
