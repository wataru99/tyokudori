'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PageLoading } from '@/components/ui/loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Calendar, Check, X, AlertCircle, Download, Filter, Search } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { useLoading } from '@/contexts/loading-context'
import { useNavigation } from '@/hooks/use-navigation'

type Conversion = {
  id: string
  clickId: string
  publisherId: string
  publisherName: string
  offerId: string
  offerName: string
  transactionId: string
  amount: number
  quantity: number
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  createdAt: Date
  ip: string
  userAgent: string
  subId?: string
}

const mockConversions: Conversion[] = [
  {
    id: '1',
    clickId: 'clk_123456',
    publisherId: 'pub_001',
    publisherName: 'メディアA',
    offerId: 'off_001',
    offerName: '健康サプリメント定期購入',
    transactionId: 'txn_789012',
    amount: 3000,
    quantity: 1,
    status: 'pending',
    createdAt: new Date('2024-01-20T10:30:00'),
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    subId: 'campaign_001',
  },
  {
    id: '2',
    clickId: 'clk_123457',
    publisherId: 'pub_002',
    publisherName: 'メディアB',
    offerId: 'off_001',
    offerName: '健康サプリメント定期購入',
    transactionId: 'txn_789013',
    amount: 3000,
    quantity: 2,
    status: 'approved',
    createdAt: new Date('2024-01-19T15:45:00'),
    ip: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
  {
    id: '3',
    clickId: 'clk_123458',
    publisherId: 'pub_003',
    publisherName: 'メディアC',
    offerId: 'off_002',
    offerName: 'クレジットカード新規発行',
    transactionId: 'txn_789014',
    amount: 8000,
    quantity: 1,
    status: 'rejected',
    rejectionReason: '重複申込',
    createdAt: new Date('2024-01-18T09:15:00'),
    ip: '192.168.1.3',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  },
]

const rejectionReasons = [
  { value: 'duplicate', label: '重複申込' },
  { value: 'fraud', label: '不正疑い' },
  { value: 'cancelled', label: 'キャンセル' },
  { value: 'invalid', label: '無効な申込' },
  { value: 'other', label: 'その他' },
]

export default function AdvertiserConversionsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { setLoading } = useLoading()
  const { navigate } = useNavigation()
  const [conversions, setConversions] = useState<Conversion[]>(mockConversions)
  const [selectedConversions, setSelectedConversions] = useState<string[]>([])
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversion, setSelectedConversion] = useState<Conversion | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)

  // Initial page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const handleConversionClick = (conversion: Conversion) => {
    setLoading(true)
    setTimeout(() => {
      setSelectedConversion(conversion)
      setIsDetailDialogOpen(true)
      setLoading(false)
    }, 150)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pendingIds = conversions
        .filter(c => c.status === 'pending')
        .map(c => c.id)
      setSelectedConversions(pendingIds)
    } else {
      setSelectedConversions([])
    }
  }

  const handleSelectConversion = (conversionId: string, checked: boolean) => {
    if (checked) {
      setSelectedConversions([...selectedConversions, conversionId])
    } else {
      setSelectedConversions(selectedConversions.filter(id => id !== conversionId))
    }
  }

  const handleApprove = async (conversionIds: string[]) => {
    setLoading(true)
    try {
      // API呼び出し（仮）
      setConversions(prev =>
        prev.map(conv =>
          conversionIds.includes(conv.id)
            ? { ...conv, status: 'approved' as const }
            : conv
        )
      )
      setSelectedConversions([])
      
      toast({
        title: '成果を承認しました',
        description: `${conversionIds.length}件の成果を承認しました。`,
      })
    } catch (error) {
      toast({
        title: 'エラー',
        description: '承認処理に失敗しました。',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedReason && !customReason) {
      toast({
        title: 'エラー',
        description: '否認理由を選択してください。',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const reason = selectedReason === 'other' ? customReason : selectedReason
      
      setConversions(prev =>
        prev.map(conv =>
          selectedConversions.includes(conv.id)
            ? { ...conv, status: 'rejected' as const, rejectionReason: reason }
            : conv
        )
      )
      
      setSelectedConversions([])
      setRejectionDialogOpen(false)
      setSelectedReason('')
      setCustomReason('')
      
      toast({
        title: '成果を否認しました',
        description: `${selectedConversions.length}件の成果を否認しました。`,
      })
    } catch (error) {
      toast({
        title: 'エラー',
        description: '否認処理に失敗しました。',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredConversions = conversions.filter(conv => {
    const matchesStatus = filterStatus === 'all' || conv.status === filterStatus
    const matchesSearch = searchQuery === '' || 
      conv.publisherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.offerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.clickId.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  const pendingCount = conversions.filter(c => c.status === 'pending').length
  const approvedCount = conversions.filter(c => c.status === 'approved').length
  const rejectedCount = conversions.filter(c => c.status === 'rejected').length

  if (isPageLoading) {
    return <PageLoading text="成果承認管理を読み込んでいます..." />
  }

  return (
    <div className="w-full px-3 py-3">

      <div className="bg-white rounded shadow-sm border p-2 mb-2">
        <h1 className="text-sm font-bold">成果承認管理</h1>
      </div>

      {/* 統計カード */}
      <div className="grid gap-2 grid-cols-4 mb-2">
        <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
            <CardTitle className="text-xs font-medium">承認待ち</CardTitle>
            <AlertCircle className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="text-sm font-bold whitespace-nowrap">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              即時承認をおすすめします
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
            <CardTitle className="text-xs font-medium">承認済み</CardTitle>
            <Check className="h-3 w-3 text-green-600" />
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="text-sm font-bold whitespace-nowrap">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">
              今月の承認数
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
            <CardTitle className="text-xs font-medium">否認済み</CardTitle>
            <X className="h-3 w-3 text-red-600" />
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="text-sm font-bold whitespace-nowrap">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">
              今月の否認数
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
            <CardTitle className="text-xs font-medium">承認率</CardTitle>
            <Calendar className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="text-sm font-bold whitespace-nowrap">
              {approvedCount + rejectedCount > 0
                ? Math.round((approvedCount / (approvedCount + rejectedCount)) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              今月の承認率
            </p>
          </CardContent>
        </Card>
      </div>

      {/* フィルタとアクション */}
      <Card className="mb-2">
        <CardHeader className="p-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="媒体名、案件名、取引IDで検索"
                className="pl-9 h-8 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs">すべて</TabsTrigger>
                <TabsTrigger value="pending" className="text-xs">承認待ち</TabsTrigger>
                <TabsTrigger value="approved" className="text-xs">承認済み</TabsTrigger>
                <TabsTrigger value="rejected" className="text-xs">否認済み</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
      </Card>

      {/* 一括アクション */}
      {selectedConversions.length > 0 && (
        <Card className="mb-2 border-primary">
          <CardContent className="flex items-center justify-between py-2">
            <span className="text-xs">
              {selectedConversions.length}件を選択中
            </span>
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={() => handleApprove(selectedConversions)}
                className="h-6 text-xs"
              >
                一括承認
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setRejectionDialogOpen(true)}
                className="h-6 text-xs"
              >
                一括否認
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedConversions([])}
                className="h-6 text-xs"
              >
                選択解除
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 成果一覧テーブル */}
      <Card className="rounded shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[30px] py-2">
                    <Checkbox
                      checked={
                        filteredConversions.filter(c => c.status === 'pending').length > 0 &&
                        selectedConversions.length === filteredConversions.filter(c => c.status === 'pending').length
                      }
                      onCheckedChange={handleSelectAll}
                      disabled={filteredConversions.filter(c => c.status === 'pending').length === 0}
                      className="h-3 w-3"
                    />
                  </TableHead>
                  <TableHead className="text-xs py-2">成果ID</TableHead>
                  <TableHead className="text-xs py-2">媒体</TableHead>
                  <TableHead className="text-xs py-2">案件</TableHead>
                  <TableHead className="text-xs py-2">取引ID</TableHead>
                  <TableHead className="text-right text-xs py-2">金額</TableHead>
                  <TableHead className="text-center text-xs py-2">数量</TableHead>
                  <TableHead className="text-xs py-2">発生日時</TableHead>
                  <TableHead className="text-xs py-2">ステータス</TableHead>
                  <TableHead className="text-center text-xs py-2">アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConversions.map((conversion) => (
                  <TableRow 
                    key={conversion.id}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => handleConversionClick(conversion)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()} className="py-2">
                      <Checkbox
                        checked={selectedConversions.includes(conversion.id)}
                        onCheckedChange={(checked) => handleSelectConversion(conversion.id, checked as boolean)}
                        disabled={conversion.status !== 'pending'}
                        className="h-3 w-3"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs py-2">{conversion.id}</TableCell>
                    <TableCell className="text-xs py-2">{conversion.publisherName}</TableCell>
                    <TableCell className="text-xs py-2">{conversion.offerName}</TableCell>
                    <TableCell className="font-mono text-xs py-2">{conversion.transactionId}</TableCell>
                    <TableCell className="text-right text-xs py-2">¥{conversion.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-center text-xs py-2">{conversion.quantity}</TableCell>
                    <TableCell className="text-xs py-2">
                      {conversion.createdAt.toLocaleDateString('ja-JP')}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {conversion.createdAt.toLocaleTimeString('ja-JP')}
                      </span>
                    </TableCell>
                    <TableCell className="py-2">
                      {conversion.status === 'pending' && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5">承認待ち</Badge>
                      )}
                      {conversion.status === 'approved' && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-2 py-0.5">承認済み</Badge>
                      )}
                      {conversion.status === 'rejected' && (
                        <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-xs px-2 py-0.5">
                          否認済み
                          {conversion.rejectionReason && (
                            <span className="ml-1">({conversion.rejectionReason})</span>
                          )}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()} className="py-2">
                      {conversion.status === 'pending' && (
                        <div className="flex gap-1 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove([conversion.id])}
                            className="h-6 text-xs px-2"
                          >
                            承認
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive h-6 text-xs px-2"
                            onClick={() => {
                              setSelectedConversions([conversion.id])
                              setRejectionDialogOpen(true)
                            }}
                          >
                            否認
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 否認理由ダイアログ */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>成果の否認</DialogTitle>
            <DialogDescription>
              {selectedConversions.length}件の成果を否認します。否認理由を選択してください。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">否認理由</Label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
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
            {selectedReason === 'other' && (
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
            <Button variant="outline" onClick={() => setRejectionDialogOpen(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              否認する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 成果詳細ダイアログ */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>成果詳細</DialogTitle>
            <DialogDescription>
              {selectedConversion?.transactionId}の詳細情報
            </DialogDescription>
          </DialogHeader>
          {selectedConversion && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">成果ID</label>
                  <div className="mt-1 text-gray-900 font-mono text-sm">{selectedConversion.id}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">クリックID</label>
                  <div className="mt-1 text-gray-900 font-mono text-sm">{selectedConversion.clickId}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">媒体名</label>
                  <div className="mt-1 text-gray-900">{selectedConversion.publisherName}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">案件名</label>
                  <div className="mt-1 text-gray-900">{selectedConversion.offerName}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">取引ID</label>
                  <div className="mt-1 text-gray-900 font-mono text-sm">{selectedConversion.transactionId}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">成果金額</label>
                  <div className="mt-1 text-gray-900 font-semibold">¥{selectedConversion.amount.toLocaleString()}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">数量</label>
                  <div className="mt-1 text-gray-900">{selectedConversion.quantity}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">ステータス</label>
                  <div className="mt-1">
                    {selectedConversion.status === 'pending' && (
                      <Badge variant="outline">承認待ち</Badge>
                    )}
                    {selectedConversion.status === 'approved' && (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">承認済み</Badge>
                    )}
                    {selectedConversion.status === 'rejected' && (
                      <Badge variant="destructive">
                        否認済み
                        {selectedConversion.rejectionReason && (
                          <span className="ml-1">({selectedConversion.rejectionReason})</span>
                        )}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">発生日時</label>
                  <div className="mt-1 text-gray-900">
                    {selectedConversion.createdAt.toLocaleDateString('ja-JP')}
                    <br />
                    <span className="text-sm text-gray-500">
                      {selectedConversion.createdAt.toLocaleTimeString('ja-JP')}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">IPアドレス</label>
                  <div className="mt-1 text-gray-900 font-mono text-sm">{selectedConversion.ip}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">ユーザーエージェント</label>
                  <div className="mt-1 text-gray-900 text-sm break-all">{selectedConversion.userAgent}</div>
                </div>
                {selectedConversion.subId && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">サブID</label>
                    <div className="mt-1 text-gray-900 font-mono text-sm">{selectedConversion.subId}</div>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  閉じる
                </Button>
                {selectedConversion.status === 'pending' && (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        handleApprove([selectedConversion.id])
                        setIsDetailDialogOpen(false)
                      }}
                    >
                      承認
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        setSelectedConversions([selectedConversion.id])
                        setRejectionDialogOpen(true)
                        setIsDetailDialogOpen(false)
                      }}
                    >
                      否認
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}