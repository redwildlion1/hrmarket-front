import { apiClient } from './client';

export type MediaType = 'logo' | 'banner';

export async function uploadCompanyMedia(
    type: MediaType,
    file: File
) {
    const backendType = type === 'logo' ? 'Logo' : 'Banner';
    return apiClient.firms.uploadMedia(file, backendType);
}
