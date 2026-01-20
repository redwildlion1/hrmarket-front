"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { motion } from "framer-motion"
import { FileText, CheckCircle, AlertCircle, Scale, Users, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermsPage() {
  const { language } = useLanguage()

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-primary/5 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FileText className="mx-auto mb-6 h-16 w-16 text-primary" />
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              {language === "ro" ? "Termeni și Condiții" : "Terms & Conditions"}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
              {language === "ro" 
                ? "Vă rugăm să citiți cu atenție acești termeni înainte de a utiliza platforma HRMarket."
                : "Please read these terms carefully before using the HRMarket platform."}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl space-y-12">
          
          {/* Introduction Card */}
          <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Scale className="h-6 w-6 text-primary" />
                  {language === "ro" ? "1. Introducere" : "1. Introduction"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {language === "ro" ? (
                  <p>
                    Acești Termeni și Condiții guvernează utilizarea site-ului web HRMarket și a serviciilor conexe. Prin accesarea sau utilizarea platformei noastre, sunteți de acord să respectați acești termeni. Dacă nu sunteți de acord cu oricare dintre acești termeni, vă rugăm să nu utilizați serviciile noastre.
                  </p>
                ) : (
                  <p>
                    These Terms and Conditions govern your use of the HRMarket website and related services. By accessing or using our platform, you agree to comply with these terms. If you do not agree with any of these terms, please do not use our services.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* User Accounts */}
          <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <Users className="h-6 w-6 text-primary" />
                  {language === "ro" ? "2. Conturi Utilizator" : "2. User Accounts"}
                </h2>
                <p className="text-muted-foreground">
                  {language === "ro"
                    ? "Pentru a accesa anumite funcționalități, trebuie să vă creați un cont. Sunteți responsabil pentru menținerea confidențialității datelor de autentificare."
                    : "To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your login credentials."}
                </p>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-1 h-5 w-5 text-green-500 shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {language === "ro" ? "Informații reale și actualizate" : "Accurate and up-to-date information"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-1 h-5 w-5 text-green-500 shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {language === "ro" ? "Securitatea parolei" : "Password security"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-1 h-5 w-5 text-green-500 shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {language === "ro" ? "Notificarea accesului neautorizat" : "Notification of unauthorized access"}
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <Separator />

          {/* Acceptable Use */}
          <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
              <AlertCircle className="h-6 w-6 text-primary" />
              {language === "ro" ? "3. Utilizare Acceptabilă" : "3. Acceptable Use"}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg text-green-600">
                    {language === "ro" ? "Permis" : "Allowed"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>{language === "ro" ? "Căutarea de locuri de muncă" : "Searching for jobs"}</li>
                    <li>{language === "ro" ? "Publicarea de anunțuri de angajare legitime" : "Posting legitimate job ads"}</li>
                    <li>{language === "ro" ? "Networking profesional" : "Professional networking"}</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg text-red-600">
                    {language === "ro" ? "Interzis" : "Prohibited"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>{language === "ro" ? "Spam sau conținut înșelător" : "Spam or misleading content"}</li>
                    <li>{language === "ro" ? "Colectarea datelor altor utilizatori" : "Scraping other users' data"}</li>
                    <li>{language === "ro" ? "Activități ilegale" : "Illegal activities"}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <Separator />

          {/* Liability & Changes */}
          <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }} className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">{language === "ro" ? "4. Limitarea Răspunderii" : "4. Limitation of Liability"}</h3>
              <p className="text-muted-foreground">
                {language === "ro"
                  ? "HRMarket nu garantează că serviciile vor fi neîntrerupte sau fără erori. Nu suntem responsabili pentru conținutul postat de utilizatori sau pentru rezultatul interacțiunilor dintre angajatori și candidați."
                  : "HRMarket does not guarantee that services will be uninterrupted or error-free. We are not responsible for user-posted content or the outcome of interactions between employers and candidates."}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{language === "ro" ? "5. Modificări ale Termenilor" : "5. Changes to Terms"}</h3>
              <p className="text-muted-foreground">
                {language === "ro"
                  ? "Ne rezervăm dreptul de a modifica acești termeni în orice moment. Continuarea utilizării platformei după modificări constituie acceptarea noilor termeni."
                  : "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms."}
              </p>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <HelpCircle className="mb-4 h-10 w-10" />
                <h2 className="mb-2 text-2xl font-bold">
                  {language === "ro" ? "Aveți întrebări?" : "Have Questions?"}
                </h2>
                <p className="mb-6 max-w-md opacity-90">
                  {language === "ro"
                    ? "Echipa noastră legală este aici pentru a vă ajuta să înțelegeți mai bine termenii noștri."
                    : "Our legal team is here to help you better understand our terms."}
                </p>
                <a 
                  href="mailto:legal@hrmarket.ro" 
                  className="rounded-full bg-background px-8 py-3 font-semibold text-primary transition-transform hover:scale-105"
                >
                  legal@hrmarket.ro
                </a>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
