"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useAllJobPostsForManagement,
  useExpiredJobPostsForManagement,
  useDeletedJobPostsForManagement,
  useReactivateDeletedJobPost,
  useReactivateExpiredJobPost,
  useDeleteJobPost
} from "@/lib/hooks/use-jobs"
import { Loader2, Eye, Trash2, RefreshCw, ArrowLeft, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"

export default function ManageJobsPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: allJobs, isLoading: loadingAll } = useAllJobPostsForManagement({ page, pageSize })
  const { data: expiredJobs, isLoading: loadingExpired } = useExpiredJobPostsForManagement({ page, pageSize })
  const { data: deletedJobs, isLoading: loadingDeleted } = useDeletedJobPostsForManagement({ page, pageSize })

  const { mutate: deleteJob } = useDeleteJobPost()
  const { mutate: reactivateDeleted } = useReactivateDeletedJobPost()
  const { mutate: reactivateExpired } = useReactivateExpiredJobPost()

  const handleDelete = (id: string) => {
    deleteJob(id, {
      onSuccess: () => {
        toast({
          title: t("common.success"),
          description: t("jobs.manage.deleteSuccess"),
        })
      },
      onError: () => {
        toast({
          title: t("common.error"),
          description: t("jobs.manage.deleteError"),
          variant: "destructive",
        })
      }
    })
  }

  const handleReactivateDeleted = (id: string) => {
    reactivateDeleted(id, {
      onSuccess: () => {
        toast({
          title: t("common.success"),
          description: t("jobs.manage.reactivateSuccess"),
        })
      },
      onError: () => {
        toast({
          title: t("common.error"),
          description: t("jobs.manage.reactivateError"),
          variant: "destructive",
        })
      }
    })
  }

  const handleReactivateExpired = (id: string) => {
    reactivateExpired(id, {
      onSuccess: () => {
        toast({
          title: t("common.success"),
          description: t("jobs.manage.renewSuccess"),
        })
      },
      onError: () => {
        toast({
          title: t("common.error"),
          description: t("jobs.manage.renewError"),
          variant: "destructive",
        })
      }
    })
  }

  const JobList = ({ jobs, type }: { jobs: any, type: 'all' | 'expired' | 'deleted' }) => {
    // Handle potential different response structures
    const jobList = Array.isArray(jobs) ? jobs : (jobs?.documents || jobs?.items || []);

    if (!jobList || jobList.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">{t("jobs.noResults")}</div>
    }

    return (
      <div className="space-y-4">
        {jobList.map((job: any) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    {job.isExpired && <Badge variant="secondary">{t("firm.status.expired") || "Expired"}</Badge>}
                    {job.isDeleted && <Badge variant="destructive">{t("firm.status.deleted") || "Deleted"}</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{t("jobs.postedOn")}: {new Date(job.postedDate).toLocaleDateString()}</p>
                    <p>{t("jobs.sort.mostViewed")}: {job.views} • {t("jobs.sort.mostApplied")}: {job.applicationsCount}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/firm/manage/jobs/management/${job.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t("common.view")}
                  </Button>

                  {type === 'deleted' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReactivateDeleted(job.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t("jobs.manage.reactivate")}
                    </Button>
                  )}

                  {type === 'expired' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReactivateExpired(job.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t("jobs.manage.renew")}
                    </Button>
                  )}

                  {type !== 'deleted' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t("admin.confirmDelete")}</DialogTitle>
                          <DialogDescription>
                            {t("admin.confirmDelete")}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">{t("common.cancel")}</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button variant="destructive" onClick={() => handleDelete(job.id)}>
                                {t("common.delete")}
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/firm/manage")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Button>
          <h1 className="text-2xl font-bold">{t("firm.manageJobs")}</h1>
        </div>
        <Button onClick={() => router.push("/firm/manage/jobs/create")}>
          <Plus className="mr-2 h-4 w-4" />
          {t("firm.postJob")}
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="all">{t("jobs.manage.activeJobs")}</TabsTrigger>
          <TabsTrigger value="expired">{t("jobs.manage.expiredJobs")}</TabsTrigger>
          <TabsTrigger value="deleted">{t("jobs.manage.deletedJobs")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {loadingAll ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <JobList jobs={allJobs || []} type="all" />
          )}
        </TabsContent>

        <TabsContent value="expired">
          {loadingExpired ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <JobList jobs={expiredJobs || []} type="expired" />
          )}
        </TabsContent>

        <TabsContent value="deleted">
          {loadingDeleted ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <JobList jobs={deletedJobs || []} type="deleted" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
