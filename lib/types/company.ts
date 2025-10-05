export interface CompanyFormData {
  // General Information
  cui: string
  name: string
  typeId: number
  description: string

  // Contact
  contactEmail: string
  contactPhone?: string

  // Links
  linksWebsite?: string
  linksLinkedIn?: string
  linksFacebook?: string
  linksTwitter?: string
  linksInstagram?: string

  // Location
  locationAddress?: string
  locationCountryId: number
  locationCountyId: number
  locationCity: string
  locationPostalCode?: string
}

export interface CompanyType {
  id: number
  name: string
}

export interface Country {
  id: number
  name: string
}

export interface County {
  id: number
  name: string
  countryId: number
}
