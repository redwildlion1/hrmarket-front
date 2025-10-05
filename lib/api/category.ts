const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function getCategories(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/categories`)
  if (!response.ok) throw new Error("Failed to fetch categories")
  return response.json()
}

export async function updateCompanyCategories(companyId: string, categoryIds: number[], token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/companies/${companyId}/categories`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ categoryIds }),
  })

  if (!response.ok) throw new Error("Failed to update categories")
}
