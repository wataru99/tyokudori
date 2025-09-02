'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageLoading } from '@/components/ui/loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Link as LinkIcon, 
  Copy, 
  ExternalLink, 
  MousePointerClick,
  TrendingUp,
  BarChart3,
  Eye
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useLoading } from '@/contexts/loading-context'
import { useNavigation } from '@/hooks/use-navigation'

interface AffiliateLink {
  id: string
  offerId: string
  offerName: string
  advertiserName: string
  shortCode: string
  fullUrl: string
  clicks: number
  conversions: number
  conversionRate: number
  earnings: number
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED'
  createdAt: string
  lastClick?: string
}

export default function PublisherLinksPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { setLoading } = useLoading()
  const { navigate } = useNavigation()
  const [selectedLink, setSelectedLink] = useState<AffiliateLink | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Mock data
  const affiliateLinks: AffiliateLink[] = [
    {
      id: '1',
      offerId: 'offer1',
      offerName: '健康サプリメント定期購入',
      advertiserName: 'ヘルスケア株式会社',
      shortCode: 'hs2024',
      fullUrl: 'https://tyokudori.com/c/hs2024',
      clicks: 1250,
      conversions: 45,
      conversionRate: 3.6,
      earnings: 135000,
      status: 'ACTIVE',
      createdAt: '2024-01-15T09:00:00Z',
      lastClick: '2024-02-15T14:30:00Z'
    },
    {
      id: '2',
      offerId: 'offer2',
      offerName: '美容クリーム初回限定',
      advertiserName: 'ビューティー株式会社',
      shortCode: 'bc2024',
      fullUrl: 'https://tyokudori.com/c/bc2024',
      clicks: 890,
      conversions: 28,
      conversionRate: 3.1,
      earnings: 70000,
      status: 'ACTIVE',
      createdAt: '2024-01-20T10:00:00Z',
      lastClick: '2024-02-15T11:45:00Z'
    },
    {
      id: '3',
      offerId: 'offer3',
      offerName: 'クレジットカード新規発行',
      advertiserName: 'ファイナンス株式会社',
      shortCode: 'cc2024',
      fullUrl: 'https://tyokudori.com/c/cc2024',
      clicks: 450,
      conversions: 12,
      conversionRate: 2.7,
      earnings: 180000,
      status: 'ACTIVE',
      createdAt: '2024-01-25T11:00:00Z',
      lastClick: '2024-02-15T09:20:00Z'
    },
    {
      id: '4',
      offerId: 'offer4',
      offerName: 'オンライン英会話無料体験',
      advertiserName: '教育サービス株式会社',
      shortCode: 'eng2023',
      fullUrl: 'https://tyokudori.com/c/eng2023',
      clicks: 320,
      conversions: 8,
      conversionRate: 2.5,
      earnings: 24000,
      status: 'EXPIRED',
      createdAt: '2023-12-01T09:00:00Z',
      lastClick: '2024-01-31T16:00:00Z'
    }
  ]

  const filteredLinks = affiliateLinks.filter(link =>
    searchQuery === '' ||
    link.offerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.advertiserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: 'コピーしました',
      description: 'リンクがクリップボードにコピーされました。',
    })
  }

  const handleViewDetails = (link: AffiliateLink) => {
    setSelectedLink(link)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'PAUSED': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'EXPIRED': return 'bg-slate-50 text-slate-700 border-slate-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP')
  }

  // Calculate totals
  const totalClicks = filteredLinks.reduce((sum, link) => sum + link.clicks, 0)
  const totalConversions = filteredLinks.reduce((sum, link) => sum + link.conversions, 0)
  const totalEarnings = filteredLinks.reduce((sum, link) => sum + link.earnings, 0)
  const averageConversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(2) : '0'

  if (isPageLoading) {
    return <PageLoading text="アフィリエイトリンクを読み込んでいます..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-3 py-3">
        {/* Page Header */}
        <div className="bg-white rounded shadow-sm border p-2 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-gray-900">アフィリエイトリンク管理</h1>
            </div>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white h-6 text-xs"
              onClick={() => navigate('/publisher/offers')}
              size="sm"
            >
              <LinkIcon className="mr-1 h-3 w-3" />
              新しいリンクを作成
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-2 grid-cols-4 mb-2">
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">総クリック数</CardTitle>
              <MousePointerClick className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-foreground mr-1" />
                前月比 +18.5%
              </p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">総成果数</CardTitle>
              <BarChart3 className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">{totalConversions}</div>
              <p className="text-xs text-muted-foreground">
                CVR: {averageConversionRate}%
              </p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">合計報酬</CardTitle>
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">¥{totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-foreground mr-1" />
                前月比 +25.3%
              </p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">アクティブリンク</CardTitle>
              <LinkIcon className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">
                {affiliateLinks.filter(link => link.status === 'ACTIVE').length}
              </div>
              <p className="text-xs text-muted-foreground">
                全{affiliateLinks.length}件中
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-2">
          <CardHeader className="p-3">
            <CardTitle className="text-sm">リンクを検索</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <Input
              placeholder="案件名、広告主名、リンクコードで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md h-8 text-sm"
            />
          </CardContent>
        </Card>

        {/* Links Table */}
        <Card>
          <CardHeader className="p-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">アフィリエイトリンク一覧</CardTitle>
              <div className="text-xs text-gray-500">
                {filteredLinks.length} 件のリンク
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-xs">案件名</TableHead>
                    <TableHead className="text-xs">リンク</TableHead>
                    <TableHead className="text-xs">クリック数</TableHead>
                    <TableHead className="text-xs">成果</TableHead>
                    <TableHead className="text-xs">報酬</TableHead>
                    <TableHead className="text-xs">ステータス</TableHead>
                    <TableHead className="text-xs">アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.map((link) => (
                    <TableRow 
                      key={link.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedLink(link)}
                    >
                      <TableCell className="py-2">
                        <div>
                          <div className="font-medium text-xs">{link.offerName}</div>
                          <div className="text-xs text-gray-500">{link.advertiserName}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center space-x-1">
                          <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                            {link.shortCode}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopyLink(link.fullUrl)
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="font-medium text-xs">{link.clicks.toLocaleString()}</div>
                        {link.lastClick && (
                          <div className="text-xs text-gray-500">
                            最終: {formatDate(link.lastClick)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="font-medium text-xs">{link.conversions}</div>
                        <div className="text-xs text-gray-500">CVR: {link.conversionRate}%</div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="font-semibold text-xs">¥{link.earnings.toLocaleString()}</div>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge className={`${getStatusBadgeColor(link.status)} text-xs px-2 py-0.5`}>
                          {link.status === 'ACTIVE' ? 'アクティブ' :
                           link.status === 'PAUSED' ? '一時停止' : '期限切れ'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewDetails(link)
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-6 w-6 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <a href={link.fullUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Link Detail Modal */}
        <Dialog open={!!selectedLink} onOpenChange={() => setSelectedLink(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>リンク詳細</DialogTitle>
              <DialogDescription>
                {selectedLink?.offerName}のアフィリエイトリンク詳細
              </DialogDescription>
            </DialogHeader>
            {selectedLink && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">案件名</label>
                    <div className="mt-1 text-gray-900">{selectedLink.offerName}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">広告主</label>
                    <div className="mt-1 text-gray-900">{selectedLink.advertiserName}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">リンクコード</label>
                    <div className="mt-1">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {selectedLink.shortCode}
                      </code>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">ステータス</label>
                    <div className="mt-1">
                      <Badge className={getStatusBadgeColor(selectedLink.status)}>
                        {selectedLink.status === 'ACTIVE' ? 'アクティブ' :
                         selectedLink.status === 'PAUSED' ? '一時停止' : '期限切れ'}
                      </Badge>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">完全なURL</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <code className="text-sm bg-gray-100 px-3 py-2 rounded flex-1">
                        {selectedLink.fullUrl}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(selectedLink.fullUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">パフォーマンス統計</h4>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <label className="text-sm text-gray-600">クリック数</label>
                      <div className="text-lg font-semibold">{selectedLink.clicks.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">成果数</label>
                      <div className="text-lg font-semibold">{selectedLink.conversions}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">CVR</label>
                      <div className="text-lg font-semibold">{selectedLink.conversionRate}%</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">報酬</label>
                      <div className="text-lg font-semibold">¥{selectedLink.earnings.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm text-gray-600">作成日</label>
                      <div>{formatDateTime(selectedLink.createdAt)}</div>
                    </div>
                    {selectedLink.lastClick && (
                      <div>
                        <label className="text-sm text-gray-600">最終クリック</label>
                        <div>{formatDateTime(selectedLink.lastClick)}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setSelectedLink(null)}>
                    閉じる
                  </Button>
                  <Button asChild>
                    <a href={selectedLink.fullUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      リンクを開く
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}