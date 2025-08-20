'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { useToast } from '@/components/ui/use-toast'

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
  const [selectedLink, setSelectedLink] = useState<AffiliateLink | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

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
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800'
      case 'EXPIRED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">アフィリエイトリンク管理</h1>
              <p className="text-gray-600 mt-1">
                生成したアフィリエイトリンクの管理とパフォーマンスを確認できます
              </p>
            </div>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => router.push('/publisher/offers')}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              新しいリンクを作成
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総クリック数</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-600 mr-1" />
                前月比 +18.5%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総成果数</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{totalConversions}</div>
              <p className="text-xs text-muted-foreground">
                CVR: {averageConversionRate}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">合計報酬</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">¥{totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-600 mr-1" />
                前月比 +25.3%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">アクティブリンク</CardTitle>
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {affiliateLinks.filter(link => link.status === 'ACTIVE').length}
              </div>
              <p className="text-xs text-muted-foreground">
                全{affiliateLinks.length}件中
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">リンクを検索</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="案件名、広告主名、リンクコードで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Links Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>アフィリエイトリンク一覧</CardTitle>
              <div className="text-sm text-gray-500">
                {filteredLinks.length} 件のリンク
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>案件名</TableHead>
                    <TableHead>リンク</TableHead>
                    <TableHead>クリック数</TableHead>
                    <TableHead>成果</TableHead>
                    <TableHead>報酬</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.map((link) => (
                    <TableRow 
                      key={link.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedLink(link)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{link.offerName}</div>
                          <div className="text-sm text-gray-500">{link.advertiserName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {link.shortCode}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyLink(link.fullUrl)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{link.clicks.toLocaleString()}</div>
                        {link.lastClick && (
                          <div className="text-xs text-gray-500">
                            最終: {formatDate(link.lastClick)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{link.conversions}</div>
                        <div className="text-xs text-gray-500">CVR: {link.conversionRate}%</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">¥{link.earnings.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(link.status)}>
                          {link.status === 'ACTIVE' ? 'アクティブ' :
                           link.status === 'PAUSED' ? '一時停止' : '期限切れ'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(link)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <a href={link.fullUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
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