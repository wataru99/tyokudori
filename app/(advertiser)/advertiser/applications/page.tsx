'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, X, Eye, User, Globe, BarChart3, Calendar, MessageSquare } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

type Application = {
  id: string
  publisherId: string
  publisherName: string
  publisherEmail: string
  publisherAvatar?: string
  offerId: string
  offerName: string
  status: 'pending' | 'approved' | 'rejected'
  message?: string
  rejectionReason?: string
  siteInfo: {
    name: string
    url: string
    category: string
    monthlyPV: number
    description: string
  }
  publisherStats: {
    totalRevenue: number
    conversionRate: number
    approvalRate: number
    activeOffers: number
  }
  appliedAt: Date
  reviewedAt?: Date
}

const mockApplications: Application[] = [
  {
    id: '1',
    publisherId: 'pub_001',
    publisherName: 'メディアA株式会社',
    publisherEmail: 'media-a@example.com',
    offerId: 'off_001',
    offerName: '健康サプリメント定期購入',
    status: 'pending',
    message: '弊社の健康系メディアで積極的にプロモーションさせていただきます。月間100万PVの実績があり、コンバージョン率も高い水準を維持しています。',
    siteInfo: {
      name: '健康情報メディア',
      url: 'https://health-media.example.com',
      category: '健康・美容',
      monthlyPV: 1000000,
      description: '30代〜50代の健康意識の高い女性をターゲットとした健康情報メディア',
    },
    publisherStats: {
      totalRevenue: 5280000,
      conversionRate: 4.2,
      approvalRate: 87,
      activeOffers: 12,
    },
    appliedAt: new Date('2024-01-18T10:30:00'),
  },
  {
    id: '2',
    publisherId: 'pub_002',
    publisherName: '個人ブロガーB',
    publisherEmail: 'blogger-b@example.com',
    offerId: 'off_001',
    offerName: '健康サプリメント定期購入',
    status: 'approved',
    siteInfo: {
      name: '美容ブログ',
      url: 'https://beauty-blog.example.com',
      category: '美容',
      monthlyPV: 50000,
      description: 'コスメや健康食品のレビューを中心としたブログ',
    },
    publisherStats: {
      totalRevenue: 320000,
      conversionRate: 3.8,
      approvalRate: 82,
      activeOffers: 5,
    },
    appliedAt: new Date('2024-01-15T14:20:00'),
    reviewedAt: new Date('2024-01-16T09:00:00'),
  },
]

const rejectionReasons = [
  { value: 'site_quality', label: 'サイト品質が基準に満たない' },
  { value: 'content_mismatch', label: 'コンテンツが商材と合わない' },
  { value: 'low_traffic', label: 'トラフィックが少ない' },
  { value: 'policy_violation', label: 'ポリシー違反' },
  { value: 'other', label: 'その他' },
]

export default function AdvertiserApplicationsPage() {
  const { toast } = useToast()
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const handleApprove = async (applicationId: string) => {
    try {
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? { ...app, status: 'approved' as const, reviewedAt: new Date() }
            : app
        )
      )
      
      toast({
        title: '申請を承認しました',
        description: '媒体への通知メールが送信されました。',
      })
    } catch (error) {
      toast({
        title: 'エラー',
        description: '承認処理に失敗しました。',
        variant: 'destructive',
      })
    }
  }

  const handleReject = async () => {
    if (!selectedApplication) return
    
    if (!rejectionReason && !customReason) {
      toast({
        title: 'エラー',
        description: '否認理由を選択してください。',
        variant: 'destructive',
      })
      return
    }

    try {
      const reason = rejectionReason === 'other' ? customReason : rejectionReason
      
      setApplications(prev =>
        prev.map(app =>
          app.id === selectedApplication.id
            ? { 
                ...app, 
                status: 'rejected' as const, 
                rejectionReason: reason,
                reviewedAt: new Date() 
              }
            : app
        )
      )
      
      setRejectDialogOpen(false)
      setRejectionReason('')
      setCustomReason('')
      setSelectedApplication(null)
      
      toast({
        title: '申請を否認しました',
        description: '媒体への通知メールが送信されました。',
      })
    } catch (error) {
      toast({
        title: 'エラー',
        description: '否認処理に失敗しました。',
        variant: 'destructive',
      })
    }
  }

  const filteredApplications = applications.filter(app => {
    return filterStatus === 'all' || app.status === filterStatus
  })

  const pendingCount = applications.filter(a => a.status === 'pending').length
  const approvedCount = applications.filter(a => a.status === 'approved').length
  const rejectedCount = applications.filter(a => a.status === 'rejected').length

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">媒体申請管理</h1>
        <p className="text-muted-foreground mt-2">
          案件への提携申請を確認し、承認・否認を行います。
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">承認待ち</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              早めの対応をお願いします
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">承認済み</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">
              アクティブな提携
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">否認済み</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">
              基準に満たなかった申請
            </p>
          </CardContent>
        </Card>
      </div>

      {/* フィルタ */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Tabs value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">すべて</TabsTrigger>
              <TabsTrigger value="pending">承認待ち</TabsTrigger>
              <TabsTrigger value="approved">承認済み</TabsTrigger>
              <TabsTrigger value="rejected">否認済み</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* 申請一覧 */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>媒体情報</TableHead>
                <TableHead>案件</TableHead>
                <TableHead>サイト情報</TableHead>
                <TableHead>実績</TableHead>
                <TableHead>申請日</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead className="text-center">アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={application.publisherAvatar} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{application.publisherName}</div>
                        <div className="text-sm text-muted-foreground">
                          {application.publisherEmail}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{application.offerName}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{application.siteInfo.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {application.siteInfo.category} / {application.siteInfo.monthlyPV.toLocaleString()} PV
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div>CVR: {application.publisherStats.conversionRate}%</div>
                      <div>承認率: {application.publisherStats.approvalRate}%</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {application.appliedAt.toLocaleDateString('ja-JP')}
                  </TableCell>
                  <TableCell>
                    {application.status === 'pending' && (
                      <Badge variant="outline">承認待ち</Badge>
                    )}
                    {application.status === 'approved' && (
                      <Badge className="bg-green-100 text-green-800">承認済み</Badge>
                    )}
                    {application.status === 'rejected' && (
                      <Badge variant="destructive">否認済み</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedApplication(application)
                          setDetailDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {application.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(application.id)}
                          >
                            承認
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive"
                            onClick={() => {
                              setSelectedApplication(application)
                              setRejectDialogOpen(true)
                            }}
                          >
                            否認
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 詳細ダイアログ */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>申請詳細</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">媒体情報</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedApplication.publisherName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={selectedApplication.siteInfo.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {selectedApplication.siteInfo.url}
                      </a>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">実績データ</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>総売上:</span>
                      <span className="font-medium">
                        ¥{selectedApplication.publisherStats.totalRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>アクティブ案件数:</span>
                      <span className="font-medium">
                        {selectedApplication.publisherStats.activeOffers}件
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">サイト説明</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedApplication.siteInfo.description}
                </p>
              </div>
              
              {selectedApplication.message && (
                <div>
                  <h4 className="font-medium mb-2">申請メッセージ</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedApplication.message}
                  </p>
                </div>
              )}
              
              {selectedApplication.rejectionReason && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2 text-destructive">否認理由</h4>
                  <p className="text-sm">{selectedApplication.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 否認理由ダイアログ */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>申請を否認</DialogTitle>
            <DialogDescription>
              否認理由を選択してください。媒体への通知に使用されます。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">否認理由</Label>
              <Select value={rejectionReason} onValueChange={setRejectionReason}>
                <SelectTrigger>
                  <SelectValue placeholder="理由を選択" />
                </SelectTrigger>
                <SelectContent>
                  {rejectionReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {rejectionReason === 'other' && (
              <div className="space-y-2">
                <Label htmlFor="customReason">詳細理由</Label>
                <Textarea
                  id="customReason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="否認理由を入力してください"
                  rows={3}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              否認する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}