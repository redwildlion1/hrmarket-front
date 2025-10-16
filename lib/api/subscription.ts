import { apiClient } from './client';

export interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    priceMonthly: number;
    priceYearly: number;
    stripePriceIdMonthly: string;
    stripePriceIdYearly: string;
    isPopular: boolean;
    features: string[];
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return apiClient.subscriptions.getPlans();
}

export async function createCheckoutSession(
    companyId: string,
    priceId: string,
    isYearly: boolean = false
) {
    return apiClient.subscriptions.createCheckoutSession({
        firmId: companyId,
        priceId,
        isYearly,
    });
}

export async function getSubscriptionStatus(firmId: string) {
    return apiClient.subscriptions.getSubscriptionStatus(firmId);
}
