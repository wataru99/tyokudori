'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PageLoading } from '@/components/ui/loading'
import { useLoading } from '@/contexts/loading-context'
import { useNavigation } from '@/hooks/use-navigation'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2, 
  Users, 
  BarChart3, 
  Play, 
  Pause,
  Plus,
  Ban
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'

interface Campaign {
  id: string
  name: string
  description: string
  category: string
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED'
  commissionType: 'CPA' | 'CPS' | 'CPC' | 'CPM'
  commissionAmount: number
  commissionPercent?: number
  clickCount: number
  conversionCount: number
  revenue: number
  approvalRate: number
  applicationCount: number
  activeLinks: number
  createdAt: string
  expiresAt?: string
}

export default function AdvertiserCampaignsPage() {
  const pathname = usePathname()
  const { toast } = useToast()
  const { setLoading: setGlobalLoading } = useLoading()
  const { navigate } = useNavigation()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [targetPath, setTargetPath] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  // Initial page loading
  useEffect(() => {
    const loadData = async () => {
      setGlobalLoading(true, 'データを読み込んでいます...')
      // Add a short delay for smoother transition
      await new Promise(resolve => setTimeout(resolve, 300))
      setIsLoading(false)
      setIsPageLoading(false)
      setGlobalLoading(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    fetchCampaigns()
  }, [])


  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      setTimeout(() => {
        setCampaigns([
          {
            id: '1',
            name: '健康サプリメント定期購入キャンペーン',
            description: '自然由来の健康サプリメント定期購入プログラム',
            category: '美容・健康',
            status: 'ACTIVE',
            commissionType: 'CPA',
            commissionAmount: 3000,
            clickCount: 12450,
            conversionCount: 156,
            revenue: 468000,
            approvalRate: 85.2,
            applicationCount: 23,
            activeLinks: 18,
            createdAt: '2024-01-15T09:00:00Z',
            expiresAt: '2024-06-30T23:59:59Z'
          },
          {
            id: '2',
            name: 'クレジットカード新規発行',
            description: '年会費無料のクレジットカード新規発行キャンペーン',
            category: '金融',
            status: 'ACTIVE',
            commissionType: 'CPA',
            commissionAmount: 8000,
            clickCount: 9850,
            conversionCount: 98,
            revenue: 784000,
            approvalRate: 78.5,
            applicationCount: 15,
            activeLinks: 12,
            createdAt: '2024-02-01T09:00:00Z'
          },
          {
            id: '3',
            name: '美容クリーム初回限定特価',
            description: '高級美容クリーム初回限定50%OFFキャンペーン',
            category: '美容・健康',
            status: 'PAUSED',
            commissionType: 'CPS',
            commissionAmount: 15,
            commissionPercent: 15,
            clickCount: 5420,
            conversionCount: 67,
            revenue: 167500,
            approvalRate: 92.3,
            applicationCount: 31,
            activeLinks: 0,
            createdAt: '2024-01-20T09:00:00Z'
          }
        ])
        setLoading(false)
      }, 200)
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
      setLoading(false)
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = searchQuery === '' || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || campaign.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleCampaignClick = (campaign: Campaign) => {
    setIsLoading(true)
    setTimeout(() => {
      setSelectedCampaign(campaign)
      setActiveTab('overview')
      setIsLoading(false)
    }, 150)
  }

  const handleStatusChange = async (campaignId: string, newStatus: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      setTimeout(() => {
        setCampaigns(prev => prev.map(campaign => 
          campaign.id === campaignId 
            ? { ...campaign, status: newStatus as any }
            : campaign
        ))
        toast({
          title: 'ステータス更新',
          description: `キャンペーンステータスを${newStatus}に変更しました。`
        })
        setIsLoading(false)
      }, 300)
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'ステータスの更新に失敗しました。',
        variant: 'destructive'
      })
      setIsLoading(false)
    }
  }


  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'PAUSED': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'DRAFT': return 'bg-slate-50 text-slate-700 border-slate-200'
      case 'EXPIRED': return 'bg-rose-50 text-rose-700 border-rose-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getCommissionText = (campaign: Campaign) => {
    if (campaign.commissionType === 'CPS' && campaign.commissionPercent) {
      return `${campaign.commissionPercent}%`
    }
    return `¥${campaign.commissionAmount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  const getCVR = (clicks: number, conversions: number) => {
    if (clicks === 0) return '0%'
    return `${((conversions / clicks) * 100).toFixed(2)}%`
  }

  if (isPageLoading) {
    return <PageLoading text="案件管理を読み込んでいます..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-3 py-3">

        {/* Page Header */}
        <div className="bg-white rounded shadow-sm border p-2 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-gray-900">案件管理</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-xs text-gray-500">総案件数</div>
                <div className="text-sm font-bold text-blue-600">{campaigns.length}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">アクティブ</div>
                <div className="text-sm font-bold text-green-600">
                  {campaigns.filter(c => c.status === 'ACTIVE').length}
                </div>
              </div>
              <Button 
                onClick={() => navigate('/advertiser/offers/new')}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Plus className="mr-2 h-3 w-3" />
                新規作成
              </Button>
            </div>
          </div>
        </div>

        {/* フィルタセクション */}
        <div className="bg-white rounded shadow-sm border p-3 mb-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">検索・フィルタ</h3>
            <Button variant="outline" size="sm" className="text-gray-600 h-6 text-xs">
              <Filter className="mr-1 h-3 w-3" />
              フィルタリセット
            </Button>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input
                placeholder="案件名、説明で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500">
                <SelectValue placeholder="カテゴリで絞り込み" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのカテゴリ</SelectItem>
                <SelectItem value="美容・健康">美容・健康</SelectItem>
                <SelectItem value="金融">金融</SelectItem>
                <SelectItem value="EC・通販">EC・通販</SelectItem>
                <SelectItem value="教育">教育</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500">
                <SelectValue placeholder="ステータスで絞り込み" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのステータス</SelectItem>
                <SelectItem value="ACTIVE">アクティブ</SelectItem>
                <SelectItem value="PAUSED">一時停止</SelectItem>
                <SelectItem value="DRAFT">下書き</SelectItem>
                <SelectItem value="EXPIRED">期限切れ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 案件テーブル */}
        <div className="bg-white rounded shadow-sm border">
          <div className="px-3 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">案件一覧</h3>
                <p className="text-xs text-gray-600">
                  全{campaigns.length}件の案件（{filteredCampaigns.length}件表示中）
                </p>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border-emerald-200">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1"></div>
                  アクティブ
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border-amber-200">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-1"></div>
                  一時停止
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-slate-50 text-slate-700 border-slate-200">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-1"></div>
                  下書き
                </span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600 text-xs">読み込み中...</span>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 py-2 text-xs">案件情報</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-2 text-xs">ステータス</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-2 text-xs">報酬</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-2 text-xs">パフォーマンス</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-2 text-xs">申請・リンク</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-2 text-xs w-[60px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow 
                      key={campaign.id}
                      className="cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100"
                      onClick={() => handleCampaignClick(campaign)}
                    >
                      <TableCell className="py-2">
                        <div className="flex items-start space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xs">
                              {campaign.category.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 truncate text-xs">{campaign.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5 truncate">
                              {campaign.description}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {campaign.category} • {formatDate(campaign.createdAt)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge className={`${getStatusBadgeColor(campaign.status)} px-2 py-0.5 text-xs`}>
                          {campaign.status === 'ACTIVE' ? 'アクティブ' :
                           campaign.status === 'PAUSED' ? '一時停止' :
                           campaign.status === 'DRAFT' ? '下書き' : '期限切れ'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="font-semibold text-gray-900 text-xs">{getCommissionText(campaign)}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">{campaign.commissionType}</div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">CV:</span>
                            <span className="font-medium text-gray-900 text-xs">{campaign.conversionCount}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">CVR:</span>
                            <span className="text-xs font-medium text-blue-600">
                              {getCVR(campaign.clickCount, campaign.conversionCount)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">売上:</span>
                            <span className="text-xs font-medium text-green-600">
                              ¥{campaign.revenue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-2.5 w-2.5 text-blue-600" />
                            </div>
                            <span className="text-xs text-gray-900">{campaign.applicationCount}件申請</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                              <BarChart3 className="h-2.5 w-2.5 text-green-600" />
                            </div>
                            <span className="text-xs text-gray-900">{campaign.activeLinks}件有効</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full">
                              <MoreHorizontal className="h-3 w-3 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/advertiser/campaigns/${campaign.id}/edit`)} className="text-xs">
                              <Edit className="mr-1.5 h-3 w-3" />
                              編集
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCampaignClick(campaign)} className="text-xs">
                              <Eye className="mr-1.5 h-3 w-3" />
                              詳細を見る
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, 'ACTIVE')} className="text-xs">
                              <Play className="mr-1.5 h-3 w-3" />
                              有効化
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, 'PAUSED')} className="text-xs">
                              <Pause className="mr-1.5 h-3 w-3" />
                              一時停止
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, 'EXPIRED')} className="text-xs">
                              <Ban className="mr-1.5 h-3 w-3" />
                              停止
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 text-xs">
                              <Trash2 className="mr-1.5 h-3 w-3" />
                              削除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* 詳細ダイアログ */}
        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedCampaign?.name}</DialogTitle>
              <DialogDescription>案件の詳細情報と管理</DialogDescription>
            </DialogHeader>
            {selectedCampaign && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="overview">概要</TabsTrigger>
                  <TabsTrigger value="performance">パフォーマンス</TabsTrigger>
                  <TabsTrigger value="applications">申請管理</TabsTrigger>
                  <TabsTrigger value="publishers">媒体管理</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
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
                      <label className="text-sm font-medium text-gray-700">カテゴリ</label>
                      <div className="mt-1 text-gray-900">{selectedCampaign.category}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">報酬</label>
                      <div className="mt-1 text-gray-900">{getCommissionText(selectedCampaign)} ({selectedCampaign.commissionType})</div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">説明</label>
                      <div className="mt-1 text-gray-900">{selectedCampaign.description}</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{selectedCampaign.clickCount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">総クリック数</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{selectedCampaign.conversionCount}</div>
                      <div className="text-sm text-gray-600">総コンバージョン数</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-lg font-bold text-green-600">¥{selectedCampaign.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">総売上</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{selectedCampaign.approvalRate}%</div>
                      <div className="text-sm text-gray-600">承認率</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="applications" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">申請一覧</h3>
                    <Badge variant="outline">{selectedCampaign.applicationCount}件</Badge>
                  </div>
                  <div className="text-gray-600">
                    この案件への申請管理は /advertiser/applications ページで行えます。
                  </div>
                  <Button onClick={() => navigate('/advertiser/applications')}>
                    申請管理ページへ
                  </Button>
                </TabsContent>

                <TabsContent value="publishers" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">提携媒体管理</h3>
                    <Badge variant="outline">{selectedCampaign.activeLinks}件アクティブ</Badge>
                  </div>
                  <div className="text-gray-600">
                    提携済み媒体の管理とパフォーマンス確認を行えます。
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}