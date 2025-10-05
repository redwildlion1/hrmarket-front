"use client"

import { useLanguage } from "@/lib/i18n/language-context"

export default function GDPRPage() {
  const { language } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">GDPR</h1>
        <div className="prose prose-gray max-w-none dark:prose-invert">
          {language === "ro" ? (
            <>
              <h2>Politica de Confidențialitate</h2>
              <p>
                Această politică de confidențialitate descrie modul în care HRMarket colectează, utilizează și
                protejează informațiile personale ale utilizatorilor.
              </p>
              <h3>Colectarea Datelor</h3>
              <p>
                Colectăm informații pe care ni le furnizați direct, cum ar fi numele, adresa de email și alte detalii.
              </p>
              <h3>Utilizarea Datelor</h3>
              <p>Utilizăm datele pentru a furniza și îmbunătăți serviciile noastre.</p>
              <h3>Protecția Datelor</h3>
              <p>Implementăm măsuri de securitate pentru a proteja informațiile dumneavoastră personale.</p>
            </>
          ) : (
            <>
              <h2>Privacy Policy</h2>
              <p>
                This privacy policy describes how HRMarket collects, uses, and protects users' personal information.
              </p>
              <h3>Data Collection</h3>
              <p>We collect information you provide directly to us, such as name, email address, and other details.</p>
              <h3>Data Usage</h3>
              <p>We use data to provide and improve our services.</p>
              <h3>Data Protection</h3>
              <p>We implement security measures to protect your personal information.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
