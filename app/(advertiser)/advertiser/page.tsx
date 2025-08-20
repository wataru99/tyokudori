'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Target,
  BarChart3,
  Eye,
  Plus
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { LoadingOverlay } from '@/components/ui/loading-overlay'

interface Campaign {
  id: string
  name: string
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT' | 'EXPIRED'
  clicks: number
  conversions: number
  revenue: number
  cvr: number
  createdAt: string
}

interface Conversion {
  id: string
  campaignName: string
  publisherName: string
  amount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  transactionId: string
}

export default function AdvertiserDashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [targetPath, setTargetPath] = useState<string | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [selectedConversion, setSelectedConversion] = useState<Conversion | null>(null)

  // Reset loading when route changes
  useEffect(() => {
    if (targetPath && pathname === targetPath) {
      setIsLoading(false)
      setTargetPath(null)
    }
  }, [pathname, targetPath])

  // Mock data
  const campaigns: Campaign[] = [
    {
      id: '1',
      name: '健康サプリメント定期購入',
      status: 'ACTIVE',
      clicks: 8764,
      conversions: 127,
      revenue: 381000,
      cvr: 1.45,
      createdAt: '2024-01-15'
    },
    {
      id: '2', 
      name: 'クレジットカード新規発行',
      status: 'ACTIVE',
      clicks: 5421,
      conversions: 89,
      revenue: 712000,
      cvr: 1.64,
      createdAt: '2024-02-01'
    },
    {
      id: '3',
      name: '美容クリーム初回限定',
      status: 'PAUSED',
      clicks: 3245,
      conversions: 45,
      revenue: 135000,
      cvr: 1.39,
      createdAt: '2024-01-20'
    }
  ]

  const recentConversions: Conversion[] = [
    {
      id: 'conv1',
      campaignName: '健康サプリメント定期購入',
      publisherName: 'メディアA',
      amount: 3000,
      status: 'PENDING',
      createdAt: '2024-02-15T14:30:00Z',
      transactionId: 'TXN001'
    },
    {
      id: 'conv2',
      campaignName: 'クレジットカード新規発行',
      publisherName: 'メディアB',
      amount: 8000,
      status: 'APPROVED',
      createdAt: '2024-02-15T12:15:00Z',
      transactionId: 'TXN002'
    },
    {
      id: 'conv3',
      campaignName: '美容クリーム初回限定',
      publisherName: 'メディアC',
      amount: 2500,
      status: 'PENDING',
      createdAt: '2024-02-14T16:45:00Z',
      transactionId: 'TXN003'
    }
  ]

  const handleCampaignClick = (campaign: Campaign) => {
    setIsLoading(true)
    setTimeout(() => {
      setSelectedCampaign(campaign)
      setIsLoading(false)
    }, 150)
  }

  const handleConversionClick = (conversion: Conversion) => {
    setIsLoading(true)
    setTimeout(() => {
      setSelectedConversion(conversion)
      setIsLoading(false)
    }, 150)
  }

  const handleNavigate = (path: string) => {
    if (pathname === path) return
    
    setIsLoading(true)
    setTargetPath(path)
    router.push(path)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'EXPIRED': return 'bg-red-100 text-red-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
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
  const totalRevenue = campaigns.reduce((sum, campaign) => sum + campaign.revenue, 0)
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0)
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0)
  const avgCVR = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0.00'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <LoadingOverlay isVisible={isLoading} />

        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">広告主ダッシュボード</h1>
              <p className="text-gray-600 mt-1">
                案件のパフォーマンスと最新の成果を確認できます
              </p>
            </div>
            <Button 
              onClick={() => handleNavigate('/advertiser/offers/new')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              新規案件作成
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総売上</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">¥{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-600 mr-1" />
                前月比 +12.5%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総成果数</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{totalConversions}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-600 mr-1" />
                前月比 +8.3%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総クリック数</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-600 mr-1" />
                前月比 +15.2%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">平均CVR</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{avgCVR}%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline h-3 w-3 text-red-600 mr-1" />
                前月比 -0.3%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Active Campaigns */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">アクティブな案件</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNavigate('/advertiser/campaigns')}
                >
                  すべて見る
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700">案件名</TableHead>
                    <TableHead className="font-semibold text-gray-700">ステータス</TableHead>
                    <TableHead className="font-semibold text-gray-700">成果数</TableHead>
                    <TableHead className="font-semibold text-gray-700">CVR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.slice(0, 3).map((campaign) => (
                    <TableRow 
                      key={campaign.id}
                      className="cursor-pointer hover:bg-blue-50 transition-colors"
                      onClick={() => handleCampaignClick(campaign)}
                    >
                      <TableCell className="py-4">
                        <div className="font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-sm text-gray-500">作成日: {formatDate(campaign.createdAt)}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={`${getStatusBadgeColor(campaign.status)} px-3 py-1`}>
                          {campaign.status === 'ACTIVE' ? 'アクティブ' :
                           campaign.status === 'PAUSED' ? '一時停止' :
                           campaign.status === 'DRAFT' ? '下書き' : '期限切れ'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-semibold text-gray-900">{campaign.conversions}</div>
                        <div className="text-sm text-gray-500">¥{campaign.revenue.toLocaleString()}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-semibold text-blue-600">{campaign.cvr}%</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Recent Conversions */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">最近の成果</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNavigate('/advertiser/conversions')}
                >
                  すべて見る
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700">案件名</TableHead>
                    <TableHead className="font-semibold text-gray-700">媒体</TableHead>
                    <TableHead className="font-semibold text-gray-700">金額</TableHead>
                    <TableHead className="font-semibold text-gray-700">ステータス</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentConversions.map((conversion) => (
                    <TableRow 
                      key={conversion.id}
                      className="cursor-pointer hover:bg-blue-50 transition-colors"
                      onClick={() => handleConversionClick(conversion)}
                    >
                      <TableCell className="py-4">
                        <div className="font-medium text-gray-900">{conversion.campaignName}</div>
                        <div className="text-sm text-gray-500">{conversion.transactionId}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-gray-900">{conversion.publisherName}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-semibold text-gray-900">¥{conversion.amount.toLocaleString()}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={`${getStatusBadgeColor(conversion.status)} px-3 py-1`}>
                          {conversion.status === 'APPROVED' ? '承認済み' :
                           conversion.status === 'PENDING' ? '承認待ち' : '拒否'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Campaign Detail Modal */}
        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>案件詳細</DialogTitle>
              <DialogDescription>
                {selectedCampaign?.name}の詳細情報
              </DialogDescription>
            </DialogHeader>
            {selectedCampaign && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">案件名</label>
                    <div className="mt-1 text-gray-900">{selectedCampaign.name}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">ステータス</label>
                    <div className="mt-1">
                      <Badge className={getStatusBadgeColor(selectedCampaign.status)}>
                        {selectedCampaign.status === 'ACTIVE' ? 'アクティブ' :
                         selectedCampaign.status === 'PAUSED' ? '一時停止' :
                         selectedCampaign.status === 'DRAFT' ? '下書き' : '期限切れ'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">総クリック数</label>
                    <div className="mt-1 text-gray-900">{selectedCampaign.clicks.toLocaleString()}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">総成果数</label>
                    <div className="mt-1 text-gray-900">{selectedCampaign.conversions}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">総売上</label>
                    <div className="mt-1 text-gray-900">¥{selectedCampaign.revenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">CVR</label>
                    <div className="mt-1 text-blue-600 font-semibold">{selectedCampaign.cvr}%</div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setSelectedCampaign(null)}>
                    閉じる
                  </Button>
                  <Button onClick={() => handleNavigate(`/advertiser/campaigns/${selectedCampaign.id}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    詳細管理
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Conversion Detail Modal */}
        <Dialog open={!!selectedConversion} onOpenChange={() => setSelectedConversion(null)}>
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
                    <label className="text-sm font-medium text-gray-700">案件名</label>
                    <div className="mt-1 text-gray-900">{selectedConversion.campaignName}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">媒体名</label>
                    <div className="mt-1 text-gray-900">{selectedConversion.publisherName}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">取引ID</label>
                    <div className="mt-1 text-gray-900">{selectedConversion.transactionId}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">金額</label>
                    <div className="mt-1 text-gray-900">¥{selectedConversion.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">ステータス</label>
                    <div className="mt-1">
                      <Badge className={getStatusBadgeColor(selectedConversion.status)}>
                        {selectedConversion.status === 'APPROVED' ? '承認済み' :
                         selectedConversion.status === 'PENDING' ? '承認待ち' : '拒否'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">発生日時</label>
                    <div className="mt-1 text-gray-900">{formatDateTime(selectedConversion.createdAt)}</div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setSelectedConversion(null)}>
                    閉じる
                  </Button>
                  <Button onClick={() => handleNavigate(`/advertiser/conversions/${selectedConversion.id}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    詳細管理
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