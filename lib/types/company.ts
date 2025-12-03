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
  locationCountryId: string
  locationCountyId: string
  locationCityId: string
  locationPostalCode?: string
}

export interface CompanyType {
  id: number
  name: string
}

export interface Country {
  id: string
  name: string
}

export interface County {
  id: string
  name: string
  countryId: string
}

export interface City {
  id: string
  name: string
  countyId: string
}
