import { apiClient } from './client';

export interface Category {
    id: string;
    name: string;
    description?: string;
    icon: string;
}

export async function getCategories(): Promise<Category[]> {
    const clusters = await apiClient.categories.getClusters();
    const categories: Category[] = [];

    clusters.forEach((cluster: any) => {
        if (cluster.categories) {
            cluster.categories.forEach((cat: any) => {
                categories.push({
                    id: cat.id,
                    name: cat.name,
                    description: cat.description,
                    icon: cat.icon,
                });
            });
        }
    });

    return categories;
}

export async function updateCompanyCategories(companyId: string, categoryIds: number[]) {
    // This would be implemented with a proper endpoint
    // For now, this is a placeholder
    return Promise.resolve();
}