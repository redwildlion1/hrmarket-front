import { apiClient } from './client';

export interface CompanyType {
    id: string;
    name: string;
}

export interface Country {
    id: number;
    name: string;
}

export interface County {
    id: number;
    name: string;
}

export interface CompanyFormData {
    cui: string;
    name: string;
    typeId: number;
    description: string;
    contactEmail: string;
    contactPhone?: string;
    linksWebsite?: string;
    linksLinkedIn?: string;
    linksFacebook?: string;
    linksTwitter?: string;
    linksInstagram?: string;
    locationAddress?: string;
    locationCountryId: number;
    locationCountyId: number;
    locationCity: string;
    locationPostalCode?: string;
}

export async function getCompanyTypes(): Promise<CompanyType[]> {
    // For now, return static data. You can create an endpoint for this later
    return [
        { id: 'Srl', name: 'SRL' },
        { id: 'Sa', name: 'SA' },
        { id: 'Pfa', name: 'PFA' },
        { id: 'Ii', name: 'II' },
        { id: 'Ong', name: 'ONG' },
        { id: 'Other', name: 'Other' },
    ];
}

export async function getCountries(): Promise<Country[]> {
    return apiClient.location.getCountries();
}

export async function getCounties(countryId: number): Promise<County[]> {
    return apiClient.location.getCounties(countryId);
}

export async function createCompany(data: CompanyFormData) {
    return apiClient.firms.create(data);
}
