import { apiClient } from './client';

export type MediaType = 'logo' | 'cover';

export async function uploadCompanyMedia(
    companyId: string,
    type: MediaType,
    file: File
) {
    return apiClient.firms.uploadMedia(companyId, file, type);
}
