import {ApiService} from './ApiService.js';

export class JobService {
    private apiService: ApiService;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }

    async fetchJobs(appId: string): Promise<any[]> {
        const response = await this.apiService.get(`apps/${appId}/jobs`);
        return response.data || [];
    }

    async fetchJobDetails(jobId: string): Promise<any> {
        const response = await this.apiService.get(`apps/jobs/${jobId}`);
        return response.data;
    }
}
