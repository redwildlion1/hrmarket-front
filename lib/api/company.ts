import type { CompanyFormData, CompanyType, Country, County } from "@/lib/types/company"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function getCompanyTypes(): Promise<CompanyType[]> {
  const response = await fetch(`${API_BASE_URL}/company-types`)
  if (!response.ok) throw new Error("Failed to fetch company types")
  return response.json()
}

export async function getCountries(): Promise<Country[]> {
  const response = await fetch(`${API_BASE_URL}/countries`)
  if (!response.ok) throw new Error("Failed to fetch countries")
  return response.json()
}

export async function getCounties(countryId: number): Promise<County[]> {
  const response = await fetch(`${API_BASE_URL}/counties?countryId=${countryId}`)
  if (!response.ok) throw new Error("Failed to fetch counties")
  return response.json()
}

export async function createCompany(data: CompanyFormData, token: string): Promise<{ id: string }> {
  const response = await fetch(`${API_BASE_URL}/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error("Failed to create company")
  return response.json()
}
