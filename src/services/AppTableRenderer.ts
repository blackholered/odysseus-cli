import Table from 'cli-table3';
import { App } from '../models/App.js';

export class AppTableRenderer {
    render(apps: App[]): void {
        const table = new Table({
            head: [
                'ID',
                'Name',
                'Website',
                'Source Control',
                'Type',
                'Repository URL',
                'Branch',
                'Build Status',
                'Created At',
                'Updated At',
            ],
        });

        apps.forEach((app) => {
            table.push(app.toTableRow());
        });

        console.log(table.toString());
    }
}
