'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { PageLoading } from '@/components/ui/loading'
import { useLoading } from '@/contexts/loading-context'
import { useNavigation } from '@/hooks/use-navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  TrendingUp, 
  DollarSign,
  MousePointerClick,
  Target,
  Eye,
  ArrowRight,
  Clock,
  CheckCircle
} from 'lucide-react'

interface CampaignStats {
  id: string
  name: string
  advertiserName: string
  clicks: number
  conversions: number
  conversionRate: number
  earnings: number
  status: 'ACTIVE' | 'PAUSED' | 'ENDED'
  lastConversion?: string
}

interface RecentConversion {
  id: string
  campaignName: string
  amount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export default function PublisherDashboard() {
  const pathname = usePathname()
  const { setLoading } = useLoading()
  const { navigate } = useNavigation()
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignStats | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Add a short delay for smoother transition
    const loadData = async () => {
      setLoading(true, 'データを読み込んでいます...')
      await new Promise(resolve => setTimeout(resolve, 300))
      setIsLoading(false)
      setLoading(false)
    }
    loadData()
  }, [])

  // Mock data
  const campaignStats: CampaignStats[] = [
    {
      id: '1',
      name: '健康サプリメント定期購入',
      advertiserName: 'ヘルスケア株式会社',
      clicks: 1250,
      conversions: 45,
      conversionRate: 3.6,
      earnings: 135000,
      status: 'ACTIVE',
      lastConversion: '2024-02-15T14:30:00Z'
    },
    {
      id: '2',
      name: '美容クリーム初回限定',
      advertiserName: 'ビューティー株式会社',
      clicks: 890,
      conversions: 28,
      conversionRate: 3.1,
      earnings: 70000,
      status: 'ACTIVE',
      lastConversion: '2024-02-15T11:45:00Z'
    },
    {
      id: '3',
      name: 'クレジットカード新規発行',
      advertiserName: 'ファイナンス株式会社',
      clicks: 450,
      conversions: 12,
      conversionRate: 2.7,
      earnings: 180000,
      status: 'ACTIVE'
    }
  ]

  const recentConversions: RecentConversion[] = [
    {
      id: '1',
      campaignName: '健康サプリメント定期購入',
      amount: 3000,
      status: 'APPROVED',
      createdAt: '2024-02-15T14:30:00Z'
    },
    {
      id: '2',
      campaignName: 'クレジットカード新規発行',
      amount: 15000,
      status: 'PENDING',
      createdAt: '2024-02-15T12:15:00Z'
    },
    {
      id: '3',
      campaignName: '美容クリーム初回限定',
      amount: 2500,
      status: 'APPROVED',
      createdAt: '2024-02-15T11:45:00Z'
    },
    {
      id: '4',
      campaignName: '健康サプリメント定期購入',
      amount: 3000,
      status: 'PENDING',
      createdAt: '2024-02-15T10:30:00Z'
    }
  ]


  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'PAUSED': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'ENDED': return 'bg-slate-50 text-slate-700 border-slate-200'
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-200'
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
  const totalClicks = campaignStats.reduce((sum, campaign) => sum + campaign.clicks, 0)
  const totalConversions = campaignStats.reduce((sum, campaign) => sum + campaign.conversions, 0)
  const totalEarnings = campaignStats.reduce((sum, campaign) => sum + campaign.earnings, 0)
  const averageConversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(2) : '0'

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageLoading text="ダッシュボードを読み込んでいます..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-3 py-3">
        {/* Page Header */}
        <div className="bg-white rounded shadow-sm border p-2 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-gray-900">アフィリエイターダッシュボード</h1>
            </div>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => navigate('/publisher/offers')}
              size="sm"
            >
              <Eye className="mr-1 h-3 w-3" />
              案件を探す
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-2 grid-cols-4 mb-2">
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">今月のクリック数</CardTitle>
              <MousePointerClick className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-foreground mr-1" />
                前月比 +15.3%
              </p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">今月の成果数</CardTitle>
              <Target className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">{totalConversions}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-gray-600">CVR: {averageConversionRate}%</span>
              </p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">今月の報酬</CardTitle>
              <DollarSign className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">¥{totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-foreground mr-1" />
                前月比 +22.5%
              </p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">承認待ち</CardTitle>
              <Clock className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">
                {recentConversions.filter(c => c.status === 'PENDING').length}
              </div>
              <p className="text-xs text-muted-foreground">
                合計: ¥{recentConversions
                  .filter(c => c.status === 'PENDING')
                  .reduce((sum, c) => sum + c.amount, 0)
                  .toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance */}
        <div className="bg-white rounded shadow-sm border mb-2">
          <div className="px-3 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">案件別パフォーマンス</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/publisher/campaigns')}
                className="h-6 text-xs"
              >
                詳細レポート
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-700 text-xs">案件名</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-xs">クリック数</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-xs">成果数</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-xs">CVR</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-xs">報酬</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-xs">ステータス</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaignStats.map((campaign) => (
                  <TableRow 
                    key={campaign.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedCampaign(campaign)
                      setIsDialogOpen(true)
                    }}
                  >
                    <TableCell className="py-2">
                      <div>
                        <div className="font-medium text-gray-900 text-xs">{campaign.name}</div>
                        <div className="text-xs text-gray-500">{campaign.advertiserName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className="text-gray-900">{campaign.clicks.toLocaleString()}</div>
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className="font-semibold text-gray-900">{campaign.conversions}</div>
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className="text-gray-900">{campaign.conversionRate}%</div>
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className="font-semibold text-gray-900">¥{campaign.earnings.toLocaleString()}</div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge className={`${getStatusBadgeColor(campaign.status)} px-2 py-0.5 text-xs`}>
                        {campaign.status === 'ACTIVE' ? 'アクティブ' :
                         campaign.status === 'PAUSED' ? '一時停止' : '終了'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Recent Conversions */}
        <div className="bg-white rounded shadow-sm border">
          <div className="px-3 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">最近の成果</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/publisher/conversions')}
                className="h-6 text-xs"
              >
                すべて見る
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-700 text-xs">案件名</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-xs">報酬額</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-xs">ステータス</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-xs">発生日時</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentConversions.map((conversion) => (
                  <TableRow key={conversion.id} className="hover:bg-gray-50">
                    <TableCell className="py-2 text-xs">
                      <div className="font-medium text-gray-900">{conversion.campaignName}</div>
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className="font-semibold text-gray-900">¥{conversion.amount.toLocaleString()}</div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge className={`${getStatusBadgeColor(conversion.status)} px-2 py-0.5 text-xs`}>
                        {conversion.status === 'APPROVED' && (
                          <CheckCircle className="mr-0.5 h-2.5 w-2.5" />
                        )}
                        {conversion.status === 'PENDING' && (
                          <Clock className="mr-0.5 h-2.5 w-2.5" />
                        )}
                        {conversion.status === 'APPROVED' ? '承認済み' :
                         conversion.status === 'PENDING' ? '承認待ち' : '否認'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className="text-gray-600">{formatDateTime(conversion.createdAt)}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Campaign Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedCampaign && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {selectedCampaign.name}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {selectedCampaign.advertiserName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">ステータス</span>
                  <Badge className={`${getStatusBadgeColor(selectedCampaign.status)} px-3 py-1`}>
                    {selectedCampaign.status === 'ACTIVE' ? 'アクティブ' :
                     selectedCampaign.status === 'PAUSED' ? '一時停止' : '終了'}
                  </Badge>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">クリック数</span>
                      <MousePointerClick className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{selectedCampaign.clicks.toLocaleString()}</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">成果数</span>
                      <Target className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{selectedCampaign.conversions}</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">CVR</span>
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{selectedCampaign.conversionRate}%</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">報酬総額</span>
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-2xl font-bold mt-2">¥{selectedCampaign.earnings.toLocaleString()}</p>
                  </Card>
                </div>

                {/* Last Conversion */}
                {selectedCampaign.lastConversion && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">最終成果発生</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDateTime(selectedCampaign.lastConversion)}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setIsDialogOpen(false)
                      navigate(`/publisher/campaigns/${selectedCampaign.id}/report`)
                    }}
                  >
                    詳細レポートを見る
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false)
                      navigate(`/publisher/campaigns/${selectedCampaign.id}/links`)
                    }}
                  >
                    アフィリエイトリンク
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}