"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { motion } from "framer-motion"
import { Shield, Lock, Eye, FileText, UserCheck, Server } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function GDPRPage() {
  const { language } = useLanguage()

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
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
            <Shield className="mx-auto mb-6 h-16 w-16 text-primary" />
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              {language === "ro" ? "Politica de Confidențialitate & GDPR" : "Privacy Policy & GDPR"}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
              {language === "ro" 
                ? "Ne angajăm să protejăm datele dumneavoastră personale și să asigurăm transparența totală în modul în care le procesăm."
                : "We are committed to protecting your personal data and ensuring full transparency in how we process it."}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Key Principles Grid */}
        <motion.div 
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mb-20 grid gap-8 md:grid-cols-3"
        >
          <motion.div variants={fadeIn}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <Lock className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>{language === "ro" ? "Securitate Avansată" : "Advanced Security"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "ro"
                    ? "Utilizăm criptare de ultimă generație și protocoale de securitate stricte pentru a vă proteja datele împotriva accesului neautorizat."
                    : "We use state-of-the-art encryption and strict security protocols to protect your data against unauthorized access."}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <Eye className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>{language === "ro" ? "Transparență Totală" : "Full Transparency"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "ro"
                    ? "Vă informăm clar despre ce date colectăm, de ce le colectăm și cum le folosim. Nu există clauze ascunse."
                    : "We clearly inform you about what data we collect, why we collect it, and how we use it. No hidden clauses."}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <UserCheck className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>{language === "ro" ? "Controlul Dumneavoastră" : "Your Control"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "ro"
                    ? "Aveți control deplin asupra datelor dumneavoastră. Puteți solicita oricând accesul, rectificarea sau ștergerea acestora."
                    : "You have full control over your data. You can request access, rectification, or deletion at any time."}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Detailed Content */}
        <div className="mx-auto max-w-4xl">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-semibold">
                  {language === "ro" ? "1. Ce date colectăm?" : "1. What data do we collect?"}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {language === "ro" ? (
                    <div className="space-y-4">
                      <p>Colectăm următoarele tipuri de informații:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Informații de identificare:</strong> Nume, prenume, adresă de email, număr de telefon.</li>
                        <li><strong>Informații profesionale:</strong> CV-uri, istoric profesional, educație, competențe (pentru candidați).</li>
                        <li><strong>Informații despre companie:</strong> Date de facturare, CUI, descrierea companiei (pentru parteneri).</li>
                        <li><strong>Date tehnice:</strong> Adresa IP, tipul browserului, cookie-uri necesare funcționării platformei.</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p>We collect the following types of information:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Identification information:</strong> Name, surname, email address, phone number.</li>
                        <li><strong>Professional information:</strong> CVs, work history, education, skills (for candidates).</li>
                        <li><strong>Company information:</strong> Billing data, VAT number, company description (for partners).</li>
                        <li><strong>Technical data:</strong> IP address, browser type, cookies necessary for platform operation.</li>
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl font-semibold">
                  {language === "ro" ? "2. Cum folosim datele?" : "2. How do we use the data?"}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {language === "ro" ? (
                    <div className="space-y-4">
                      <p>Datele dumneavoastră sunt utilizate exclusiv pentru:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Furnizarea serviciilor platformei HRMarket (conectarea candidaților cu companiile).</li>
                        <li>Îmbunătățirea experienței utilizatorului și personalizarea conținutului.</li>
                        <li>Comunicări administrative (confirmări, notificări importante).</li>
                        <li>Respectarea obligațiilor legale și fiscale.</li>
                      </ul>
                      <p>Nu vindem și nu închiriem datele dumneavoastră către terți.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p>Your data is used exclusively for:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Providing HRMarket platform services (connecting candidates with companies).</li>
                        <li>Improving user experience and personalizing content.</li>
                        <li>Administrative communications (confirmations, important notifications).</li>
                        <li>Compliance with legal and fiscal obligations.</li>
                      </ul>
                      <p>We do not sell or rent your data to third parties.</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-xl font-semibold">
                  {language === "ro" ? "3. Drepturile dumneavoastră" : "3. Your Rights"}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {language === "ro" ? (
                    <div className="space-y-4">
                      <p>Conform GDPR, beneficiați de următoarele drepturi:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Dreptul de acces:</strong> Puteți solicita o copie a datelor pe care le deținem despre dumneavoastră.</li>
                        <li><strong>Dreptul la rectificare:</strong> Puteți corecta datele inexacte sau incomplete.</li>
                        <li><strong>Dreptul la ștergere ("dreptul de a fi uitat"):</strong> Puteți solicita ștergerea datelor dumneavoastră din sistemele noastre.</li>
                        <li><strong>Dreptul la portabilitate:</strong> Puteți primi datele într-un format structurat pentru a le transfera altui operator.</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p>Under GDPR, you have the following rights:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Right of access:</strong> You can request a copy of the data we hold about you.</li>
                        <li><strong>Right to rectification:</strong> You can correct inaccurate or incomplete data.</li>
                        <li><strong>Right to erasure ("right to be forgotten"):</strong> You can request the deletion of your data from our systems.</li>
                        <li><strong>Right to portability:</strong> You can receive your data in a structured format to transfer to another controller.</li>
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-xl font-semibold">
                  {language === "ro" ? "4. Contact DPO" : "4. Contact DPO"}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {language === "ro" ? (
                    <p>
                      Pentru orice întrebări legate de protecția datelor sau pentru a vă exercita drepturile, puteți contacta Responsabilul nostru cu Protecția Datelor (DPO) la adresa: <a href="mailto:dpo@hrmarket.ro" className="text-primary hover:underline">dpo@hrmarket.ro</a>.
                    </p>
                  ) : (
                    <p>
                      For any questions regarding data protection or to exercise your rights, you can contact our Data Protection Officer (DPO) at: <a href="mailto:dpo@hrmarket.ro" className="text-primary hover:underline">dpo@hrmarket.ro</a>.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
