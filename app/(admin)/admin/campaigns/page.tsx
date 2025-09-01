'use client'

import { useState, useEffect } from 'react'
import { PageLoading } from '@/components/ui/loading'
import { useLoading } from '@/contexts/loading-context'
import { useNavigation } from '@/hooks/use-navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Filter, MoreHorizontal, Edit, Eye, Trash2, Users, Link, BarChart3, Play, Pause, Ban } from 'lucide-react'
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
  advertiserId: string
  advertiser: {
    name: string
    email: string
  }
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED'
  commissionType: 'CPA' | 'CPS' | 'CPC' | 'CPM'
  commissionAmount: number
  commissionPercent?: number
  requireApproval: boolean
  isPrivate: boolean
  clickCount: number
  conversionCount: number
  approvalRate: number
  createdAt: string
  expiresAt?: string
  applications: Array<{
    id: string
    publisherId: string
    publisher: {
      name: string
      email: string
    }
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    appliedAt: string
  }>
  affiliateLinks: Array<{
    id: string
    publisherId: string
    publisher: {
      name: string
      email: string
    }
    trackingCode: string
    isActive: boolean
    clicks: number
    conversions: number
    createdAt: string
  }>
}

interface CampaignEditData {
  name: string
  description: string
  category: string
  status: string
  commissionType: string
  commissionAmount: number
  commissionPercent?: number
  requireApproval: boolean
  isPrivate: boolean
  terms: string
  prohibitedTerms: string
  landingPageUrl: string
  previewUrl: string
  expiresAt?: string
}

export default function AdminCampaignsPage() {
  const { toast } = useToast()
  const { setLoading } = useLoading()
  const { navigate } = useNavigation()
  const [isLoading, setIsLoading] = useState(true)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [editData, setEditData] = useState<CampaignEditData | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const fetchCampaigns = async () => {
    setLoading(true)
    // モックデータのみを使用
    setCampaigns([
      {
        id: '1',
        name: '健康サプリメント定期購入キャンペーン',
        description: '自然由来の健康サプリメント定期購入',
        category: '美容・健康',
        advertiserId: 'adv1',
        advertiser: { name: '株式会社ヘルスケア', email: 'contact@healthcare.com' },
        status: 'ACTIVE',
        commissionType: 'CPA',
        commissionAmount: 3000,
        requireApproval: true,
        isPrivate: false,
        clickCount: 12450,
        conversionCount: 156,
        approvalRate: 85.2,
        createdAt: '2024-01-15T09:00:00Z',
        expiresAt: '2024-06-30T23:59:59Z',
        applications: [
          {
            id: 'app1',
            publisherId: 'pub1',
            publisher: { name: 'メディアA', email: 'media-a@example.com' },
            status: 'APPROVED',
            appliedAt: '2024-01-20T10:00:00Z'
          },
          {
            id: 'app2',
            publisherId: 'pub2',
            publisher: { name: 'メディアB', email: 'media-b@example.com' },
            status: 'PENDING',
            appliedAt: '2024-02-01T14:30:00Z'
          }
        ],
        affiliateLinks: [
          {
            id: 'link1',
            publisherId: 'pub1',
            publisher: { name: 'メディアA', email: 'media-a@example.com' },
            trackingCode: 'TRK001ABC',
            isActive: true,
            clicks: 8760,
            conversions: 102,
            createdAt: '2024-01-22T11:00:00Z'
          }
        ]
      },
      {
        id: '2',
        name: 'クレジットカード新規発行',
        description: '年会費無料のクレジットカード新規発行',
        category: '金融',
        advertiserId: 'adv2',
        advertiser: { name: '○○銀行', email: 'affiliate@bank.com' },
        status: 'ACTIVE',
        commissionType: 'CPA',
        commissionAmount: 8000,
        requireApproval: true,
        isPrivate: false,
        clickCount: 9850,
        conversionCount: 98,
        approvalRate: 78.5,
        createdAt: '2024-02-01T09:00:00Z',
        applications: [],
        affiliateLinks: []
      },
      {
        id: '3',
        name: '美容クリーム初回限定',
        description: '高品質美容クリーム初回限定価格',
        category: '美容・健康',
        advertiserId: 'adv3',
        advertiser: { name: 'ビューティー株式会社', email: 'beauty@example.com' },
        status: 'ACTIVE',
        commissionType: 'CPA',
        commissionAmount: 2500,
        requireApproval: true,
        isPrivate: false,
        clickCount: 6420,
        conversionCount: 89,
        approvalRate: 91.2,
        createdAt: '2024-01-25T09:00:00Z',
        expiresAt: '2024-07-31T23:59:59Z',
        applications: [
          {
            id: 'app3',
            publisherId: 'pub3',
            publisher: { name: 'メディアC', email: 'media-c@example.com' },
            status: 'APPROVED',
            appliedAt: '2024-02-05T11:00:00Z'
          }
        ],
        affiliateLinks: [
          {
            id: 'link2',
            publisherId: 'pub3',
            publisher: { name: 'メディアC', email: 'media-c@example.com' },
            trackingCode: 'TRK002DEF',
            isActive: true,
            clicks: 4520,
            conversions: 67,
            createdAt: '2024-02-06T12:00:00Z'
          }
        ]
      }
    ])
    setLoading(false)
  }

  useEffect(() => {
    // Initialize data
    const loadData = async () => {
      setLoading(true, 'データを読み込んでいます...')
      // Add a short delay for smoother transition
      await new Promise(resolve => setTimeout(resolve, 300))
      setIsLoading(false)
      setLoading(false)
      fetchCampaigns()
    }
    loadData()
  }, [])

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = searchQuery === '' || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.advertiser.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || campaign.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setEditData({
      name: campaign.name,
      description: campaign.description,
      category: campaign.category,
      status: campaign.status,
      commissionType: campaign.commissionType,
      commissionAmount: campaign.commissionAmount,
      commissionPercent: campaign.commissionPercent,
      requireApproval: campaign.requireApproval,
      isPrivate: campaign.isPrivate,
      terms: '',
      prohibitedTerms: '',
      landingPageUrl: '',
      previewUrl: '',
      expiresAt: campaign.expiresAt
    })
  }

  const handleSaveEdit = async () => {
    if (!editingCampaign || !editData) return

    toast({
      title: '更新完了',
      description: 'キャンペーンが正常に更新されました。'
    })
    setEditingCampaign(null)
    setEditData(null)
    fetchCampaigns()
  }

  const handleStatusChange = async (campaignId: string, newStatus: string) => {
    toast({
      title: 'ステータス更新',
      description: `キャンペーンステータスを${newStatus}に変更しました。`
    })
    fetchCampaigns()
  }

  const handleApplicationAction = async (applicationId: string, action: 'APPROVED' | 'REJECTED') => {
    toast({
      title: `申請${action === 'APPROVED' ? '承認' : '拒否'}`,
      description: `申請を${action === 'APPROVED' ? '承認' : '拒否'}しました。`
    })
    fetchCampaigns()
  }

  const handleLinkToggle = async (linkId: string, isActive: boolean) => {
    toast({
      title: `リンク${isActive ? '有効化' : '無効化'}`,
      description: `アフィリエイトリンクを${isActive ? '有効' : '無効'}にしました。`
    })
    fetchCampaigns()
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'EXPIRED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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

  if (isLoading) {
    return <PageLoading text="案件管理を読み込んでいます..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-4">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-gray-900">案件管理</h1>
              <p className="text-xs text-gray-600 mt-1">
                アフィリエイト案件の管理、申請処理、リンク管理を行います
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm text-gray-500">総案件数</div>
                <div className="text-base font-bold text-blue-600">{campaigns.length}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">アクティブ</div>
                <div className="text-base font-bold text-green-600">
                  {campaigns.filter(c => c.status === 'ACTIVE').length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* フィルタセクション */}
        <div className="bg-white rounded-lg shadow-sm border p-3 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">検索・フィルタ</h3>
            <Button variant="outline" size="sm" className="text-gray-600">
              <Filter className="mr-2 h-4 w-4" />
              フィルタリセット
            </Button>
          </div>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="案件名、広告主で検索..."
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
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">案件一覧</h3>
                <p className="text-sm text-gray-600">
                  全{campaigns.length}件の案件（{filteredCampaigns.length}件表示中）
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  アクティブ
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>
                  一時停止
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                  下書き
                </span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600">読み込み中...</span>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="hover:bg-gray-50">
                    <TableHead className="font-medium text-gray-700 py-2 px-3 text-xs min-w-[180px]">案件情報</TableHead>
                    <TableHead className="font-medium text-gray-700 py-2 px-3 text-xs hidden sm:table-cell">ステータス</TableHead>
                    <TableHead className="font-medium text-gray-700 py-2 px-3 text-xs hidden md:table-cell">報酬</TableHead>
                    <TableHead className="font-medium text-gray-700 py-2 px-3 text-xs hidden lg:table-cell">パフォーマンス</TableHead>
                    <TableHead className="font-medium text-gray-700 py-2 px-3 text-xs hidden xl:table-cell">申請数</TableHead>
                    <TableHead className="font-medium text-gray-700 py-2 px-3 text-xs hidden xl:table-cell">リンク数</TableHead>
                    <TableHead className="font-medium text-gray-700 py-2 px-3 text-xs w-[80px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow 
                      key={campaign.id}
                      className="cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100"
                      onClick={() => {
                        setSelectedCampaign(campaign)
                        setActiveTab('overview')
                      }}
                    >
                      <TableCell className="py-3 px-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-xs">
                              {campaign.category.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 text-sm">{campaign.name}</div>
                            <div className="text-xs text-gray-500">
                              {campaign.advertiser.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {campaign.category}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 px-4 sm:px-6 hidden sm:table-cell">
                        <Badge className={`${getStatusBadgeColor(campaign.status)} px-2 py-0.5 text-xs`}>
                          {campaign.status === 'ACTIVE' ? 'アクティブ' :
                           campaign.status === 'PAUSED' ? '一時停止' :
                           campaign.status === 'DRAFT' ? '下書き' : '期限切れ'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-5 px-4 sm:px-6 hidden md:table-cell">
                        <div className="font-medium text-gray-900 text-sm">{getCommissionText(campaign)}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">{campaign.commissionType}</div>
                      </TableCell>
                      <TableCell className="py-5 px-4 sm:px-6 hidden lg:table-cell">
                        <div className="space-y-1">
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
                        </div>
                      </TableCell>
                      <TableCell className="py-5 px-4 sm:px-6 hidden xl:table-cell">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-3 w-3 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{campaign.applications.length}</div>
                            {campaign.applications.some(app => app.status === 'PENDING') && (
                              <div className="text-xs text-orange-600 font-medium">新規あり</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 px-4 sm:px-6 hidden xl:table-cell">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <Link className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{campaign.affiliateLinks.length}</div>
                            <div className="text-xs text-green-600">
                              {campaign.affiliateLinks.filter(link => link.isActive).length}件有効
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full">
                              <MoreHorizontal className="h-3 w-3 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
                            <Edit className="mr-2 h-4 w-4" />
                            編集
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedCampaign(campaign)}>
                            <Eye className="mr-2 h-4 w-4" />
                            詳細を見る
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, 'ACTIVE')}>
                            <Play className="mr-2 h-4 w-4" />
                            有効化
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, 'PAUSED')}>
                            <Pause className="mr-2 h-4 w-4" />
                            一時停止
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, 'EXPIRED')}>
                            <Ban className="mr-2 h-4 w-4" />
                            停止
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
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

      {/* 編集ダイアログ */}
      <Dialog open={!!editingCampaign} onOpenChange={() => setEditingCampaign(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>案件編集</DialogTitle>
          </DialogHeader>
          {editData && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">案件名</label>
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">カテゴリ</label>
                  <Select value={editData.category} onValueChange={(value) => setEditData({...editData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="美容・健康">美容・健康</SelectItem>
                      <SelectItem value="金融">金融</SelectItem>
                      <SelectItem value="EC・通販">EC・通販</SelectItem>
                      <SelectItem value="教育">教育</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">ステータス</label>
                  <Select value={editData.status} onValueChange={(value) => setEditData({...editData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">アクティブ</SelectItem>
                      <SelectItem value="PAUSED">一時停止</SelectItem>
                      <SelectItem value="DRAFT">下書き</SelectItem>
                      <SelectItem value="EXPIRED">期限切れ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">報酬タイプ</label>
                  <Select value={editData.commissionType} onValueChange={(value) => setEditData({...editData, commissionType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CPA">CPA（成果報酬）</SelectItem>
                      <SelectItem value="CPS">CPS（売上報酬）</SelectItem>
                      <SelectItem value="CPC">CPC（クリック報酬）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">報酬額</label>
                  <Input
                    type="number"
                    value={editData.commissionAmount}
                    onChange={(e) => setEditData({...editData, commissionAmount: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">説明</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingCampaign(null)}>
                  キャンセル
                </Button>
                <Button onClick={handleSaveEdit}>
                  保存
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 詳細ダイアログ */}
      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCampaign?.name}</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">概要</TabsTrigger>
                <TabsTrigger value="applications">申請管理</TabsTrigger>
                <TabsTrigger value="links">リンク管理</TabsTrigger>
                <TabsTrigger value="analytics">分析</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-lg font-bold">{selectedCampaign.clickCount.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground mt-1">総クリック数</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-lg font-bold">{selectedCampaign.conversionCount}</div>
                      <p className="text-xs text-muted-foreground mt-1">総コンバージョン数</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-lg font-bold">{selectedCampaign.approvalRate}%</div>
                      <p className="text-xs text-muted-foreground mt-1">承認率</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="applications" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">申請一覧</h3>
                  <Badge variant="outline">{selectedCampaign.applications.length}件</Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>媒体</TableHead>
                      <TableHead>ステータス</TableHead>
                      <TableHead>申請日</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCampaign.applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{application.publisher.name}</div>
                            <div className="text-sm text-muted-foreground">{application.publisher.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            application.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            application.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {application.status === 'APPROVED' ? '承認済み' :
                             application.status === 'PENDING' ? '承認待ち' : '拒否'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(application.appliedAt)}</TableCell>
                        <TableCell>
                          {application.status === 'PENDING' && (
                            <div className="space-x-2">
                              <Button size="sm" onClick={() => handleApplicationAction(application.id, 'APPROVED')}>
                                承認
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleApplicationAction(application.id, 'REJECTED')}>
                                拒否
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="links" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">リンク管理</h3>
                  <Badge variant="outline">{selectedCampaign.affiliateLinks.length}件</Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>媒体</TableHead>
                      <TableHead>トラッキングコード</TableHead>
                      <TableHead>状態</TableHead>
                      <TableHead>パフォーマンス</TableHead>
                      <TableHead>作成日</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCampaign.affiliateLinks.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{link.publisher.name}</div>
                            <div className="text-sm text-muted-foreground">{link.publisher.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">{link.trackingCode}</code>
                        </TableCell>
                        <TableCell>
                          <Badge className={link.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {link.isActive ? 'アクティブ' : '停止中'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>クリック: {link.clicks}</div>
                            <div>CV: {link.conversions}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(link.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={link.isActive ? "outline" : "default"}
                            onClick={() => handleLinkToggle(link.id, !link.isActive)}
                          >
                            {link.isActive ? '停止' : '有効化'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>パフォーマンスサマリー</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>CVR</span>
                          <span>{getCVR(selectedCampaign.clickCount, selectedCampaign.conversionCount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>承認率</span>
                          <span>{selectedCampaign.approvalRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>アクティブリンク数</span>
                          <span>{selectedCampaign.affiliateLinks.filter(link => link.isActive).length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>収益情報</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>総収益</span>
                          <span>¥{(selectedCampaign.conversionCount * selectedCampaign.commissionAmount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>平均単価</span>
                          <span>{getCommissionText(selectedCampaign)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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