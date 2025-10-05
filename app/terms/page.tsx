"use client"

import { useLanguage } from "@/lib/i18n/language-context"

export default function TermsPage() {
  const { language } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">{language === "ro" ? "Termeni și Condiții" : "Terms & Conditions"}</h1>
        <div className="prose prose-gray max-w-none dark:prose-invert">
          {language === "ro" ? (
            <>
              <h2>1. Acceptarea Termenilor</h2>
              <p>Prin utilizarea platformei HRMarket, acceptați acești termeni și condiții.</p>
              <h2>2. Utilizarea Serviciilor</h2>
              <p>Vă angajați să utilizați serviciile în conformitate cu legile aplicabile.</p>
              <h2>3. Proprietate Intelectuală</h2>
              <p>Tot conținutul platformei este protejat de drepturi de autor.</p>
            </>
          ) : (
            <>
              <h2>1. Acceptance of Terms</h2>
              <p>By using the HRMarket platform, you accept these terms and conditions.</p>
              <h2>2. Use of Services</h2>
              <p>You agree to use the services in accordance with applicable laws.</p>
              <h2>3. Intellectual Property</h2>
              <p>All platform content is protected by copyright.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
