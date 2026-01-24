"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { adminApi, ContactForm } from "@/lib/api/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Trash2, Mail, User, Building2, Calendar } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function ContactFormsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [forms, setForms] = useState<ContactForm[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [hasMore, setHasMore] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchForms = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getContactForms(page, pageSize)
      setForms(response || [])
      setHasMore(response.length === pageSize)
    } catch (error) {
      console.error("Failed to fetch contact forms:", error)
      toast({
        title: t("common.error"),
        description: "Failed to load contact forms",
        variant: "destructive",
      })
      setForms([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchForms()
  }, [page, pageSize])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await adminApi.deleteContactForm(id)
      toast({
        title: t("common.success"),
        description: "Contact form deleted successfully",
      })
      fetchForms()
    } catch (error) {
      console.error("Failed to delete contact form:", error)
      toast({
        title: t("common.error"),
        description: "Failed to delete contact form",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Forms</h1>
          <p className="text-muted-foreground">Manage contact form submissions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>
            Showing page {page}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No contact forms found.
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Context</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(form.submittedAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground ml-6">
                            {new Date(form.submittedAt).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{form.name}</TableCell>
                      <TableCell>
                        <a href={`mailto:${form.email}`} className="flex items-center gap-2 hover:underline">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {form.email}
                        </a>
                      </TableCell>
                      <TableCell className="max-w-md truncate" title={form.message}>
                        {form.message}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                            {form.personId && (
                                <Badge variant="outline" className="w-fit">
                                    <User className="h-3 w-3 mr-1" /> Person
                                </Badge>
                            )}
                            {form.companyId && (
                                <Badge variant="outline" className="w-fit">
                                    <Building2 className="h-3 w-3 mr-1" /> Company
                                </Badge>
                            )}
                            {form.accountEmail && form.accountEmail !== form.email && (
                                <div className="text-xs text-muted-foreground" title="Account Email">
                                    Auth: {form.accountEmail}
                                </div>
                            )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this message from {form.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(form.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deletingId === form.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Delete"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2 text-sm">
                  Page {page}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasMore}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
