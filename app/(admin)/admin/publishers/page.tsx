'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageLoading } from '@/components/ui/loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { 
  UserCheck, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Eye,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Ban,
  Mail,
  UserX,
  Send,
  Briefcase,
  CreditCard
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'

interface Publisher {
  id: string
  name: string
  email: string
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED'
  createdAt: string
  lastLogin?: string
  totalRevenue: number
  totalClicks: number
  totalConversions: number
  approvalRate: number
  websiteUrl?: string
  category: string
  monthlyRevenue: number
  revenueDetails: Array<{
    campaignName: string
    revenue: number
    conversions: number
    commissionAmount: number
  }>
  activeCampaigns: Array<{
    id: string
    name: string
    status: 'ACTIVE' | 'PAUSED'
    startDate: string
    monthlyData?: Array<{
      month: string
      revenue: number
      conversions: number
      clicks: number
    }>
  }>
  bankInfo: {
    bankName: string
    branchName: string
    accountType: '普通' | '当座'
    accountNumber: string
    accountHolder: string
  }
}

export default function PublishersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [publishers, setPublishers] = useState<Publisher[]>([])
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null)
  const [isRevenueDetailOpen, setIsRevenueDetailOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isAccountSuspendOpen, setIsAccountSuspendOpen] = useState(false)
  const [suspendPublisher, setSuspendPublisher] = useState<Publisher | null>(null)
  const [isRecommendCampaignOpen, setIsRecommendCampaignOpen] = useState(false)
  const [recommendPublisher, setRecommendPublisher] = useState<Publisher | null>(null)
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])
  const [isCampaignDetailOpen, setIsCampaignDetailOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editPublisher, setEditPublisher] = useState<Publisher | null>(null)

  useEffect(() => {
    const loadPublishers = async () => {
      setIsLoading(true)
      // Remove artificial delay
      
      // Mock data
      const mockPublishers: Publisher[] = [
        {
          id: '1',
          name: '佐藤花子',
          email: 'sato@example.com',
          status: 'ACTIVE',
          createdAt: '2024-02-14T14:15:00Z',
          lastLogin: '2024-02-15T08:30:00Z',
          totalRevenue: 245000,
          totalClicks: 12450,
          totalConversions: 156,
          approvalRate: 89.5,
          websiteUrl: 'https://sato-blog.com',
          category: '美容・健康',
          monthlyRevenue: 48000,
          revenueDetails: [
            { campaignName: '健康サプリメント定期購入', revenue: 30000, conversions: 10, commissionAmount: 3000 },
            { campaignName: '美容クリーム初回限定', revenue: 12500, conversions: 5, commissionAmount: 2500 },
            { campaignName: 'プロテイン購入', revenue: 5500, conversions: 2, commissionAmount: 2750 }
          ],
          activeCampaigns: [
            { 
              id: 'c1', 
              name: '健康サプリメント定期購入', 
              status: 'ACTIVE', 
              startDate: '2024-02-01T00:00:00Z',
              monthlyData: [
                { month: '2024-02', revenue: 30000, conversions: 10, clicks: 1200 },
                { month: '2024-01', revenue: 25000, conversions: 8, clicks: 980 },
                { month: '2023-12', revenue: 18000, conversions: 6, clicks: 750 }
              ]
            },
            { 
              id: 'c2', 
              name: '美容クリーム初回限定', 
              status: 'ACTIVE', 
              startDate: '2024-01-15T00:00:00Z',
              monthlyData: [
                { month: '2024-02', revenue: 12500, conversions: 5, clicks: 600 },
                { month: '2024-01', revenue: 8000, conversions: 3, clicks: 450 }
              ]
            }
          ],
          bankInfo: {
            bankName: 'みずほ銀行',
            branchName: '新宿支店',
            accountType: '普通',
            accountNumber: '1234567',
            accountHolder: 'サトウ ハナコ'
          }
        },
        {
          id: '2',
          name: '鈴木一郎',
          email: 'suzuki@example.com',
          status: 'PENDING',
          createdAt: '2024-02-13T16:45:00Z',
          totalRevenue: 0,
          totalClicks: 0,
          totalConversions: 0,
          approvalRate: 0,
          websiteUrl: 'https://suzuki-media.net',
          category: 'テクノロジー',
          monthlyRevenue: 0,
          revenueDetails: [],
          activeCampaigns: [],
          bankInfo: {
            bankName: '',
            branchName: '',
            accountType: '普通',
            accountNumber: '',
            accountHolder: ''
          }
        },
        {
          id: '3',
          name: '山田次郎',
          email: 'yamada@blog.net',
          status: 'ACTIVE',
          createdAt: '2024-02-12T09:45:00Z',
          lastLogin: '2024-02-15T07:30:00Z',
          totalRevenue: 189000,
          totalClicks: 8760,
          totalConversions: 92,
          approvalRate: 92.1,
          websiteUrl: 'https://yamada-review.com',
          category: 'ライフスタイル',
          monthlyRevenue: 35000,
          revenueDetails: [
            { campaignName: 'ライフスタイル雑誌定期購読', revenue: 20000, conversions: 8, commissionAmount: 2500 },
            { campaignName: '家具・インテリア', revenue: 15000, conversions: 3, commissionAmount: 5000 }
          ],
          activeCampaigns: [
            { 
              id: 'c3', 
              name: 'ライフスタイル雑誌定期購読', 
              status: 'ACTIVE', 
              startDate: '2024-01-20T00:00:00Z',
              monthlyData: [
                { month: '2024-02', revenue: 20000, conversions: 8, clicks: 900 },
                { month: '2024-01', revenue: 15000, conversions: 6, clicks: 700 }
              ]
            }
          ],
          bankInfo: {
            bankName: '三菱UFJ銀行',
            branchName: '渋谷支店',
            accountType: '普通',
            accountNumber: '9876543',
            accountHolder: 'ヤマダ ジロウ'
          }
        },
        {
          id: '4',
          name: '中村真理',
          email: 'nakamura@media.com',
          status: 'SUSPENDED',
          createdAt: '2024-02-08T14:30:00Z',
          lastLogin: '2024-02-10T16:20:00Z',
          totalRevenue: 67000,
          totalClicks: 3200,
          totalConversions: 23,
          approvalRate: 45.2,
          websiteUrl: 'https://nakamura-news.com',
          category: 'ニュース',
          monthlyRevenue: 8000,
          revenueDetails: [
            { campaignName: 'ニュースサイト広告', revenue: 8000, conversions: 4, commissionAmount: 2000 }
          ],
          activeCampaigns: [
            { id: 'c4', name: 'ニュースサイト広告', status: 'PAUSED', startDate: '2024-02-08T00:00:00Z' }
          ],
          bankInfo: {
            bankName: 'ゆうちょ銀行',
            branchName: '本店',
            accountType: '当座',
            accountNumber: '5554321',
            accountHolder: 'ナカムラ マリ'
          }
        },
        {
          id: '5',
          name: '高橋美咲',
          email: 'takahashi@affiliate.jp',
          status: 'ACTIVE',
          createdAt: '2024-02-05T11:20:00Z',
          lastLogin: '2024-02-14T19:45:00Z',
          totalRevenue: 312000,
          totalClicks: 15680,
          totalConversions: 201,
          approvalRate: 94.3,
          websiteUrl: 'https://takahashi-style.com',
          category: 'ファッション',
          monthlyRevenue: 62000,
          revenueDetails: [
            { campaignName: 'ファッションアイテム', revenue: 40000, conversions: 16, commissionAmount: 2500 },
            { campaignName: 'アクセサリー・小物', revenue: 15000, conversions: 5, commissionAmount: 3000 },
            { campaignName: 'シューズ・バッグ', revenue: 7000, conversions: 2, commissionAmount: 3500 }
          ],
          activeCampaigns: [
            { id: 'c5', name: 'ファッションアイテム', status: 'ACTIVE', startDate: '2024-01-10T00:00:00Z' },
            { id: 'c6', name: 'アクセサリー・小物', status: 'ACTIVE', startDate: '2024-02-01T00:00:00Z' }
          ],
          bankInfo: {
            bankName: '三井住友銀行',
            branchName: '青山支店',
            accountType: '普通',
            accountNumber: '7778888',
            accountHolder: 'タカハシ ミサキ'
          }
        }
      ]
      
      setPublishers(mockPublishers)
      setIsLoading(false)
    }

    loadPublishers()
  }, [])

  const filteredPublishers = publishers.filter(publisher => {
    const matchesSearch = searchTerm === '' || 
      publisher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publisher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (publisher.websiteUrl && publisher.websiteUrl.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || publisher.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || publisher.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">アクティブ</Badge>
      case 'PENDING':
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200">承認待ち</Badge>
      case 'SUSPENDED':
        return <Badge className="bg-rose-50 text-rose-700 border-rose-200">停止中</Badge>
      default:
        return <Badge className="bg-slate-50 text-slate-700 border-slate-200">不明</Badge>
    }
  }

  const handleStatusChange = async (publisherId: string, newStatus: string) => {
    toast({
      title: 'ステータス更新',
      description: `アフィリエイターのステータスを${newStatus === 'ACTIVE' ? 'アクティブ' : newStatus === 'SUSPENDED' ? '停止' : '承認待ち'}に変更しました。`
    })
    // Here you would call your API to update the status
  }

  const handleAccountSuspend = async (reason: string) => {
    if (!suspendPublisher) return
    
    // Update publisher status to SUSPENDED
    setPublishers(prev => prev.map(p => 
      p.id === suspendPublisher.id 
        ? { ...p, status: 'SUSPENDED' as const }
        : p
    ))
    
    toast({
      title: 'アカウント停止完了',
      description: `${suspendPublisher.name}のアカウントを停止しました。`
    })
    
    setIsAccountSuspendOpen(false)
    setSuspendPublisher(null)
  }

  const handleRecommendCampaigns = async () => {
    if (!recommendPublisher || selectedCampaigns.length === 0) return
    
    toast({
      title: 'おすすめ案件送信完了',
      description: `${recommendPublisher.name}に${selectedCampaigns.length}件のおすすめ案件を送信しました。`
    })
    
    setIsRecommendCampaignOpen(false)
    setRecommendPublisher(null)
    setSelectedCampaigns([])
  }

  const handleEditPublisher = async (updatedData: any) => {
    if (!editPublisher) return

    // Update publisher in state
    setPublishers(prev => prev.map(p => 
      p.id === editPublisher.id 
        ? { ...p, ...updatedData }
        : p
    ))

    toast({
      title: '更新完了',
      description: `${updatedData.name}の情報を更新しました。`
    })

    setIsEditModalOpen(false)
    setEditPublisher(null)
  }

  const availableCampaigns = [
    { id: 'rec1', name: '新・健康サプリメントキャンペーン', category: '美容・健康', commission: 3500 },
    { id: 'rec2', name: '春のファッション特集', category: 'ファッション', commission: 2800 },
    { id: 'rec3', name: 'テクノロジー商品レビュー', category: 'テクノロジー', commission: 4000 },
    { id: 'rec4', name: 'ライフスタイル提案企画', category: 'ライフスタイル', commission: 3200 },
    { id: 'rec5', name: 'ニュース記事広告', category: 'ニュース', commission: 1500 }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  if (isLoading) {
    return <PageLoading text="アフィリエイター管理を読み込んでいます..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-3 py-3">
        {/* Page Header */}
        <div className="bg-white rounded shadow-sm border p-2 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-gray-900 flex items-center gap-1">
                <UserCheck className="h-4 w-4 text-blue-600" />
                アフィリエイター管理
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-center">
                <div className="text-xs text-gray-500">総数</div>
                <div className="text-sm font-bold text-blue-600">{publishers.length}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">アクティブ</div>
                <div className="text-sm font-bold text-green-600">
                  {publishers.filter(p => p.status === 'ACTIVE').length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">承認待ち</div>
                <div className="text-sm font-bold text-yellow-600">
                  {publishers.filter(p => p.status === 'PENDING').length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-2 grid-cols-6 mb-2">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow duration-150 col-span-2"
            onClick={() => {
              // 総収益の詳細を表示するために適当なアフィリエイターを選択
              const topRevenue = publishers.reduce((max, p) => p.totalRevenue > max.totalRevenue ? p : max, publishers[0])
              if (topRevenue) {
                setSelectedPublisher(topRevenue)
                setIsRevenueDetailOpen(true)
              }
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">総収益</CardTitle>
              <DollarSign className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold">
                {formatCurrency(publishers.reduce((sum, p) => sum + p.totalRevenue, 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                詳細
              </p>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">今月売上</CardTitle>
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold">
                {formatCurrency(publishers.reduce((sum, p) => sum + p.monthlyRevenue, 0))}
              </div>
              <p className="text-xs text-muted-foreground">2月実績</p>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">総CV数</CardTitle>
              <CheckCircle className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold">
                {publishers.reduce((sum, p) => sum + p.totalConversions, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {(publishers.reduce((sum, p) => sum + p.totalClicks, 0) / 1000).toFixed(0)}k クリック
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-3 mb-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">検索・フィルタ</h3>
            <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
              setCategoryFilter('all')
            }}>
              <Filter className="mr-1 h-3 w-3" />
              リセット
            </Button>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input
                placeholder="名前、メール、サイトで検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-8 text-xs border-gray-200 focus:border-blue-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-xs border-gray-200 focus:border-blue-500">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="ACTIVE">アクティブ</SelectItem>
                <SelectItem value="PENDING">承認待ち</SelectItem>
                <SelectItem value="SUSPENDED">停止中</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-8 text-xs border-gray-200 focus:border-blue-500">
                <SelectValue placeholder="カテゴリ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="美容・健康">美容・健康</SelectItem>
                <SelectItem value="テクノロジー">テクノロジー</SelectItem>
                <SelectItem value="ライフスタイル">ライフスタイル</SelectItem>
                <SelectItem value="ファッション">ファッション</SelectItem>
                <SelectItem value="ニュース">ニュース</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs">
              <Plus className="mr-1 h-3 w-3" />
              新規追加
            </Button>
          </div>
        </div>

        {/* Publishers Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">アフィリエイター一覧</h3>
                <p className="text-xs text-gray-600">
                  全{publishers.length}件（{filteredPublishers.length}件表示中）
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-medium text-gray-700 text-xs py-1 text-center">情報</TableHead>
                  <TableHead className="font-medium text-gray-700 text-xs py-1 text-center">ステータス</TableHead>
                  <TableHead className="font-medium text-gray-700 text-xs py-1 text-center">パフォーマンス</TableHead>
                  <TableHead className="font-medium text-gray-700 text-xs py-1 text-center">収益</TableHead>
                  <TableHead className="font-medium text-gray-700 text-xs py-1 text-center">最終ログイン</TableHead>
                  <TableHead className="font-medium text-gray-700 text-xs py-1 w-[60px] text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPublishers.map((publisher) => (
                  <TableRow 
                    key={publisher.id}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => setSelectedPublisher(publisher)}
                  >
                    <TableCell className="py-1 px-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <UserCheck className="h-2.5 w-2.5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 text-xs">{publisher.name}</div>
                          <div className="text-xs text-gray-500 truncate">{publisher.email}</div>
                          <div className="text-xs text-gray-400">{publisher.category}</div>
                          {publisher.websiteUrl && (
                            <div className="text-xs text-blue-600 truncate max-w-[120px]">
                              {publisher.websiteUrl.replace('https://', '')}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-3 text-center">
                      <Badge
                        className={`text-xs px-2 py-0.5 ${
                          publisher.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          publisher.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {publisher.status === 'ACTIVE' ? 'アクティブ' :
                         publisher.status === 'PENDING' ? '承認待ち' : '停止中'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-1 px-3 text-center">
                      <div className="space-y-0.5">
                        <div className="text-xs">
                          <span className="text-gray-500">C:</span>
                          <span className="font-medium ml-1">{(publisher.totalClicks / 1000).toFixed(1)}k</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">CV:</span>
                          <span className="font-medium ml-1">{publisher.totalConversions}</span>
                        </div>
                        <div className="text-xs text-blue-600">
                          CVR: {publisher.totalClicks > 0 ? ((publisher.totalConversions / publisher.totalClicks) * 100).toFixed(1) : '0'}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-green-600 text-xs py-1 px-3 text-center">
                      <div>{formatCurrency(publisher.totalRevenue)}</div>
                      <div className="text-xs text-gray-500">
                        月: {formatCurrency(publisher.monthlyRevenue)}
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-3 text-center">
                      <div className="text-xs text-gray-900">
                        {publisher.lastLogin ? formatDate(publisher.lastLogin) : '-'}
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-6 w-6 p-0 mx-auto">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedPublisher(publisher)}>
                            <Eye className="mr-2 h-4 w-4" />
                            詳細を見る
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditPublisher(publisher)
                              setIsEditModalOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            編集
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setRecommendPublisher(publisher)
                              setIsRecommendCampaignOpen(true)
                            }}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            おすすめ案件送信
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            メール送信
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {publisher.status === 'ACTIVE' ? (
                            <DropdownMenuItem 
                              onClick={() => {
                                setSuspendPublisher(publisher)
                                setIsAccountSuspendOpen(true)
                              }}
                              className="text-red-600"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              アカウント停止
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleStatusChange(publisher.id, 'ACTIVE')}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              有効化
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Detail Modal */}
        <Dialog open={!!selectedPublisher} onOpenChange={() => setSelectedPublisher(null)}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>アフィリエイター詳細</DialogTitle>
              <DialogDescription>
                {selectedPublisher?.name}の詳細情報
              </DialogDescription>
            </DialogHeader>
            {selectedPublisher && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">名前</label>
                    <div className="mt-1 text-gray-900">{selectedPublisher.name}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">メールアドレス</label>
                    <div className="mt-1 text-gray-900">{selectedPublisher.email}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">ステータス</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedPublisher.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">カテゴリ</label>
                    <div className="mt-1 text-gray-900">{selectedPublisher.category}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Webサイト</label>
                    <div className="mt-1 text-blue-600">
                      {selectedPublisher.websiteUrl || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">登録日</label>
                    <div className="mt-1 text-gray-900">{formatDate(selectedPublisher.createdAt)}</div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">パフォーマンス統計</h4>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(selectedPublisher.totalRevenue)}
                      </div>
                      <div className="text-sm text-gray-500">総収益</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedPublisher.totalClicks.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">総クリック数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedPublisher.totalConversions}
                      </div>
                      <div className="text-sm text-gray-500">総コンバージョン数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {selectedPublisher.approvalRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500">承認率</div>
                    </div>
                  </div>
                </div>

                {/* 取り組み案件 */}
                <div className="border-t pt-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Briefcase className="mr-2 h-5 w-5" />
                    取り組み案件
                  </h4>
                  {selectedPublisher.activeCampaigns.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {selectedPublisher.activeCampaigns.map((campaign, idx) => (
                        <div 
                          key={idx} 
                          className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            setSelectedCampaign({
                              ...campaign,
                              publisherName: selectedPublisher.name
                            })
                            setIsCampaignDetailOpen(true)
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm">{campaign.name}</h5>
                            <Badge 
                              className={campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                            >
                              {campaign.status === 'ACTIVE' ? 'アクティブ' : '停止中'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            開始日: {formatDate(campaign.startDate)}
                          </div>
                          <div className="text-xs text-blue-600 mt-2">
                            クリックして詳細を見る →
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      現在取り組んでいる案件はありません
                    </div>
                  )}
                </div>

                {/* 口座情報 */}
                <div className="border-t pt-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    口座情報
                  </h4>
                  {selectedPublisher.bankInfo.bankName ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-gray-700">金融機関</label>
                          <div className="mt-1 text-gray-900">{selectedPublisher.bankInfo.bankName}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">支店名</label>
                          <div className="mt-1 text-gray-900">{selectedPublisher.bankInfo.branchName}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">口座種別</label>
                          <div className="mt-1 text-gray-900">{selectedPublisher.bankInfo.accountType}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">口座番号</label>
                          <div className="mt-1 text-gray-900">{selectedPublisher.bankInfo.accountNumber}</div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">口座名義</label>
                          <div className="mt-1 text-gray-900">{selectedPublisher.bankInfo.accountHolder}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      口座情報が登録されていません
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setSelectedPublisher(null)}>
                    閉じる
                  </Button>
                  <Button onClick={() => {
                    router.push(`/admin/users/${selectedPublisher.id}`)
                    setSelectedPublisher(null)
                  }}>
                    詳細管理
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Revenue Detail Modal */}
        <Dialog open={isRevenueDetailOpen} onOpenChange={() => setIsRevenueDetailOpen(false)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>収益詳細</DialogTitle>
              <DialogDescription>
                {selectedPublisher?.name}の案件別収益詳細
              </DialogDescription>
            </DialogHeader>
            {selectedPublisher && (
              <div className="space-y-6">
                {/* 収益サマリー */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">総収益</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(selectedPublisher.totalRevenue)}
                      </div>
                      <p className="text-xs text-muted-foreground">累計収益</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">今月の売上</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(selectedPublisher.monthlyRevenue)}
                      </div>
                      <p className="text-xs text-muted-foreground">2024年2月</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">平均単価</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedPublisher.totalConversions > 0 
                          ? formatCurrency(Math.round(selectedPublisher.totalRevenue / selectedPublisher.totalConversions))
                          : formatCurrency(0)
                        }
                      </div>
                      <p className="text-xs text-muted-foreground">1コンバージョンあたり</p>
                    </CardContent>
                  </Card>
                </div>

                {/* 案件別収益詳細テーブル */}
                <Card>
                  <CardHeader>
                    <CardTitle>案件別収益詳細</CardTitle>
                    <CardDescription>各案件の収益内訳と成果</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedPublisher.revenueDetails && selectedPublisher.revenueDetails.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>案件名</TableHead>
                            <TableHead className="text-right">単価</TableHead>
                            <TableHead className="text-right">コンバージョン数</TableHead>
                            <TableHead className="text-right">収益</TableHead>
                            <TableHead className="text-right">収益率</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedPublisher.revenueDetails.map((detail, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{detail.campaignName}</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(detail.commissionAmount)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {detail.conversions}
                              </TableCell>
                              <TableCell className="text-right font-medium text-green-600">
                                {formatCurrency(detail.revenue)}
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="text-sm text-muted-foreground">
                                  {selectedPublisher.totalRevenue > 0 
                                    ? ((detail.revenue / selectedPublisher.totalRevenue) * 100).toFixed(1)
                                    : 0}%
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="border-t-2 font-medium">
                            <TableCell>合計</TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-right">
                              {selectedPublisher.revenueDetails.reduce((sum, detail) => sum + detail.conversions, 0)}
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                              {formatCurrency(selectedPublisher.revenueDetails.reduce((sum, detail) => sum + detail.revenue, 0))}
                            </TableCell>
                            <TableCell className="text-right">100%</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        収益データがありません
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setIsRevenueDetailOpen(false)}>
                    閉じる
                  </Button>
                  <Button onClick={() => {
                    router.push(`/admin/users/${selectedPublisher.id}`)
                    setIsRevenueDetailOpen(false)
                    setSelectedPublisher(null)
                  }}>
                    ユーザー詳細へ
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Account Suspend Modal */}
        <Dialog open={isAccountSuspendOpen} onOpenChange={() => setIsAccountSuspendOpen(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">アカウント停止</DialogTitle>
              <DialogDescription>
                {suspendPublisher?.name}のアカウントを停止しますか？
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                アカウントが停止されると、アフィリエイターはログインできなくなり、全ての案件への参加が停止されます。
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsAccountSuspendOpen(false)}>
                  キャンセル
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleAccountSuspend('管理者による停止')}
                >
                  停止する
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Recommend Campaign Modal */}
        <Dialog open={isRecommendCampaignOpen} onOpenChange={() => setIsRecommendCampaignOpen(false)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>おすすめ案件送信</DialogTitle>
              <DialogDescription>
                {recommendPublisher?.name}におすすめの案件を選択してください
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                選択した案件の詳細情報がアフィリエイターにメールで送信されます。
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {availableCampaigns
                  .filter(campaign => !recommendPublisher?.category || campaign.category === recommendPublisher.category || selectedCampaigns.includes(campaign.id))
                  .map((campaign) => (
                  <label key={campaign.id} className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.includes(campaign.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCampaigns([...selectedCampaigns, campaign.id])
                        } else {
                          setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaign.id))
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{campaign.name}</div>
                      <div className="text-xs text-gray-500 flex items-center justify-between">
                        <span>カテゴリ: {campaign.category}</span>
                        <span className="font-medium text-green-600">報酬: ¥{campaign.commission.toLocaleString()}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm text-gray-600">
                  {selectedCampaigns.length}件選択中
                </span>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setIsRecommendCampaignOpen(false)}>
                    キャンセル
                  </Button>
                  <Button 
                    onClick={handleRecommendCampaigns}
                    disabled={selectedCampaigns.length === 0}
                  >
                    送信する
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Campaign Detail Modal */}
        <Dialog open={isCampaignDetailOpen} onOpenChange={() => setIsCampaignDetailOpen(false)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>案件詳細</DialogTitle>
              <DialogDescription>
                {selectedCampaign?.publisherName} - {selectedCampaign?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedCampaign && (
              <div className="space-y-6">
                {/* 案件概要 */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">累計売上</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        ¥{selectedCampaign.monthlyData?.reduce((sum: number, m: any) => sum + m.revenue, 0).toLocaleString() || 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">累計CV数</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedCampaign.monthlyData?.reduce((sum: number, m: any) => sum + m.conversions, 0) || 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">累計クリック数</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedCampaign.monthlyData?.reduce((sum: number, m: any) => sum + m.clicks, 0).toLocaleString() || 0}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 月次データテーブル */}
                <div className="border rounded-lg">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <h4 className="text-sm font-medium">月別パフォーマンス</h4>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">月</TableHead>
                        <TableHead className="text-xs text-right">売上</TableHead>
                        <TableHead className="text-xs text-right">CV数</TableHead>
                        <TableHead className="text-xs text-right">クリック数</TableHead>
                        <TableHead className="text-xs text-right">CVR</TableHead>
                        <TableHead className="text-xs text-right">平均単価</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCampaign.monthlyData?.map((data: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell className="text-xs font-medium">{data.month}</TableCell>
                          <TableCell className="text-xs text-right text-green-600 font-medium">
                            ¥{data.revenue.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-xs text-right">{data.conversions}</TableCell>
                          <TableCell className="text-xs text-right">{data.clicks.toLocaleString()}</TableCell>
                          <TableCell className="text-xs text-right text-blue-600">
                            {data.clicks > 0 ? ((data.conversions / data.clicks) * 100).toFixed(2) : '0.00'}%
                          </TableCell>
                          <TableCell className="text-xs text-right">
                            ¥{data.conversions > 0 ? Math.round(data.revenue / data.conversions).toLocaleString() : '0'}
                          </TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            月次データがありません
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setIsCampaignDetailOpen(false)}>
                    閉じる
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Publisher Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={() => setIsEditModalOpen(false)}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>アフィリエイター編集</DialogTitle>
              <DialogDescription>
                {editPublisher?.name}の情報を編集
              </DialogDescription>
            </DialogHeader>
            {editPublisher && (
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleEditPublisher({
                  name: formData.get('name'),
                  email: formData.get('email'),
                  websiteUrl: formData.get('websiteUrl'),
                  category: formData.get('category'),
                  status: formData.get('status'),
                  bankInfo: {
                    bankName: formData.get('bankName'),
                    branchName: formData.get('branchName'),
                    accountType: formData.get('accountType'),
                    accountNumber: formData.get('accountNumber'),
                    accountHolder: formData.get('accountHolder')
                  }
                })
              }} className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">名前</Label>
                    <Input id="name" name="name" defaultValue={editPublisher.name} required />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input id="email" name="email" type="email" defaultValue={editPublisher.email} required />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="websiteUrl">Webサイト</Label>
                    <Input id="websiteUrl" name="websiteUrl" defaultValue={editPublisher.websiteUrl} />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="category">カテゴリ</Label>
                    <Select name="category" defaultValue={editPublisher.category}>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="美容・健康">美容・健康</SelectItem>
                        <SelectItem value="テクノロジー">テクノロジー</SelectItem>
                        <SelectItem value="ライフスタイル">ライフスタイル</SelectItem>
                        <SelectItem value="ファッション">ファッション</SelectItem>
                        <SelectItem value="ニュース">ニュース</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="status">ステータス</Label>
                    <Select name="status" defaultValue={editPublisher.status}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">アクティブ</SelectItem>
                        <SelectItem value="PENDING">承認待ち</SelectItem>
                        <SelectItem value="SUSPENDED">停止中</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">口座情報</h4>
                    <div className="grid gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="bankName">金融機関</Label>
                        <Input id="bankName" name="bankName" defaultValue={editPublisher.bankInfo.bankName} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="branchName">支店名</Label>
                        <Input id="branchName" name="branchName" defaultValue={editPublisher.bankInfo.branchName} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="accountType">口座種別</Label>
                        <Select name="accountType" defaultValue={editPublisher.bankInfo.accountType}>
                          <SelectTrigger id="accountType">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="普通">普通</SelectItem>
                            <SelectItem value="当座">当座</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="accountNumber">口座番号</Label>
                        <Input id="accountNumber" name="accountNumber" defaultValue={editPublisher.bankInfo.accountNumber} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="accountHolder">口座名義</Label>
                        <Input id="accountHolder" name="accountHolder" defaultValue={editPublisher.bankInfo.accountHolder} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    キャンセル
                  </Button>
                  <Button type="submit">
                    更新する
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}