export class App {
    id: string;
    name: string;
    website: string;
    sourceControlProvider?: string | null;
    type: string;
    repositoryUrl?: string | null;
    branch?: string | null;
    buildType?: string;
    step?: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.website = data.website;
        this.sourceControlProvider = data.source_control_provider || null;
        this.type = data.type;
        this.repositoryUrl = data.repository_url || null;
        this.branch = data.branch || null;
        this.buildType = data.build_type || null;
        this.step = data.step || 0;
        this.createdAt = new Date(data.created_at);
        this.updatedAt = new Date(data.updated_at);
    }

    /**
     * Computes the build status of the app.
     * @returns {string} - The human-readable build status.
     */
    getBuildStatus(): string {
        if (this.buildType === 'initial_deployment') {
            return 'Never Built';
        }
        if (this.step === 1) {
            return 'Not Deployed';
        }
        return 'Deployed';
    }

    /**
     * Formats the creation date for display.
     * @returns {string} - The formatted creation date.
     */
    getFormattedCreatedAt(): string {
        return this.createdAt.toLocaleString();
    }

    /**
     * Formats the updated date for display.
     * @returns {string} - The formatted updated date.
     */
    getFormattedUpdatedAt(): string {
        return this.updatedAt.toLocaleString();
    }

    /**
     * Provides a clean, printable object for CLI display.
     * @returns {any} - The printable representation of the app.
     */
    toTableRow(): any[] {
        return [
            this.id,
            this.name,
            this.website,
            this.sourceControlProvider || 'N/A',
            this.type,
            this.repositoryUrl || 'N/A',
            this.branch || 'N/A',
            this.getBuildStatus(),
            this.getFormattedCreatedAt(),
            this.getFormattedUpdatedAt(),
        ];
    }
}
