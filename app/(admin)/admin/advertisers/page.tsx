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
import { 
  Building2, 
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
  Megaphone
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'

interface Advertiser {
  id: string
  name: string
  email: string
  companyName: string
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED'
  createdAt: string
  lastLogin?: string
  totalSpend: number
  totalCampaigns: number
  activeCampaigns: number
  totalConversions: number
  averageCPA: number
  industry: string
}

export default function AdvertisersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([])
  const [selectedAdvertiser, setSelectedAdvertiser] = useState<Advertiser | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [industryFilter, setIndustryFilter] = useState('all')

  useEffect(() => {
    const loadAdvertisers = async () => {
      setIsLoading(true)
      // Remove artificial delay
      
      // Mock data
      const mockAdvertisers: Advertiser[] = [
        {
          id: '1',
          name: '田中太郎',
          email: 'tanaka@example.com',
          companyName: '株式会社ヘルスケア',
          status: 'PENDING',
          createdAt: '2024-02-15T09:30:00Z',
          totalSpend: 0,
          totalCampaigns: 0,
          activeCampaigns: 0,
          totalConversions: 0,
          averageCPA: 0,
          industry: '美容・健康'
        },
        {
          id: '2',
          name: '高橋美咲',
          email: 'takahashi@company.co.jp',
          companyName: 'テックソリューション株式会社',
          status: 'ACTIVE',
          createdAt: '2024-02-10T11:20:00Z',
          lastLogin: '2024-02-15T10:15:00Z',
          totalSpend: 850000,
          totalCampaigns: 5,
          activeCampaigns: 3,
          totalConversions: 234,
          averageCPA: 3632,
          industry: 'テクノロジー'
        },
        {
          id: '3',
          name: '伊藤健太',
          email: 'ito@brand.jp',
          companyName: 'ブランドファッション株式会社',
          status: 'ACTIVE',
          createdAt: '2024-02-05T13:15:00Z',
          lastLogin: '2024-02-14T18:45:00Z',
          totalSpend: 1200000,
          totalCampaigns: 8,
          activeCampaigns: 5,
          totalConversions: 456,
          averageCPA: 2631,
          industry: 'ファッション'
        },
        {
          id: '4',
          name: '山本和子',
          email: 'yamamoto@finance.com',
          companyName: '山本ファイナンス株式会社',
          status: 'ACTIVE',
          createdAt: '2024-01-28T09:00:00Z',
          lastLogin: '2024-02-14T16:30:00Z',
          totalSpend: 2100000,
          totalCampaigns: 12,
          activeCampaigns: 7,
          totalConversions: 789,
          averageCPA: 2661,
          industry: '金融'
        },
        {
          id: '5',
          name: '佐々木純',
          email: 'sasaki@education.jp',
          companyName: '教育イノベーション株式会社',
          status: 'SUSPENDED',
          createdAt: '2024-01-20T14:30:00Z',
          lastLogin: '2024-02-01T11:20:00Z',
          totalSpend: 320000,
          totalCampaigns: 3,
          activeCampaigns: 0,
          totalConversions: 45,
          averageCPA: 7111,
          industry: '教育'
        }
      ]
      
      setAdvertisers(mockAdvertisers)
      setIsLoading(false)
    }

    loadAdvertisers()
  }, [])

  const filteredAdvertisers = advertisers.filter(advertiser => {
    const matchesSearch = searchTerm === '' || 
      advertiser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advertiser.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advertiser.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || advertiser.status === statusFilter
    const matchesIndustry = industryFilter === 'all' || advertiser.industry === industryFilter

    return matchesSearch && matchesStatus && matchesIndustry
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-2 py-0.5">アクティブ</Badge>
      case 'PENDING':
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs px-2 py-0.5">承認待ち</Badge>
      case 'SUSPENDED':
        return <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-xs px-2 py-0.5">停止中</Badge>
      default:
        return <Badge className="bg-slate-50 text-slate-700 border-slate-200 text-xs px-2 py-0.5">不明</Badge>
    }
  }

  const handleStatusChange = async (advertiserId: string, newStatus: string) => {
    toast({
      title: 'ステータス更新',
      description: `広告主のステータスを${newStatus === 'ACTIVE' ? 'アクティブ' : newStatus === 'SUSPENDED' ? '停止' : '承認待ち'}に変更しました。`
    })
    // Here you would call your API to update the status
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  if (isLoading) {
    return <PageLoading text="広告主管理を読み込んでいます..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-3 py-3">
        {/* Page Header */}
        <div className="bg-white rounded shadow-sm border p-2 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-gray-900 flex items-center gap-1">
                <Building2 className="h-4 w-4 text-blue-600" />
                広告主管理
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-center">
                <div className="text-xs text-gray-500">総数</div>
                <div className="text-sm font-bold text-blue-600">{advertisers.length}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">アクティブ</div>
                <div className="text-sm font-bold text-green-600">
                  {advertisers.filter(a => a.status === 'ACTIVE').length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">承認待ち</div>
                <div className="text-sm font-bold text-yellow-600">
                  {advertisers.filter(a => a.status === 'PENDING').length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-2 grid-cols-4 mb-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">総広告費</CardTitle>
              <DollarSign className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold">
                {formatCurrency(advertisers.reduce((sum, a) => sum + a.totalSpend, 0))}
              </div>
              <p className="text-xs text-muted-foreground">全広告主の合計</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">総案件数</CardTitle>
              <Megaphone className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold">
                {advertisers.reduce((sum, a) => sum + a.totalCampaigns, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                アクティブ: {advertisers.reduce((sum, a) => sum + a.activeCampaigns, 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">総コンバージョン数</CardTitle>
              <CheckCircle className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold">
                {advertisers.reduce((sum, a) => sum + a.totalConversions, 0)}
              </div>
              <p className="text-xs text-muted-foreground">今月実績</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">平均CPA</CardTitle>
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold">
                {advertisers.length > 0 
                  ? formatCurrency(Math.round(advertisers.reduce((sum, a) => sum + a.averageCPA, 0) / advertisers.filter(a => a.averageCPA > 0).length))
                  : formatCurrency(0)}
              </div>
              <p className="text-xs text-muted-foreground">全広告主平均</p>
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
              setIndustryFilter('all')
            }}>
              <Filter className="mr-1 h-3 w-3" />
              リセット
            </Button>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input
                placeholder="名前、メール、会社名で検索..."
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
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="h-8 text-xs border-gray-200 focus:border-blue-500">
                <SelectValue placeholder="業界" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="美容・健康">美容・健康</SelectItem>
                <SelectItem value="テクノロジー">テクノロジー</SelectItem>
                <SelectItem value="ファッション">ファッション</SelectItem>
                <SelectItem value="金融">金融</SelectItem>
                <SelectItem value="教育">教育</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs">
              <Plus className="mr-1 h-3 w-3" />
              新規追加
            </Button>
          </div>
        </div>

        {/* Advertisers Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">広告主一覧</h3>
                <p className="text-xs text-gray-600">
                  全{advertisers.length}件（{filteredAdvertisers.length}件表示中）
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-medium text-gray-700 text-xs py-1 text-center">広告主情報</TableHead>
                  <TableHead className="font-medium text-gray-700 text-xs py-1 text-center">ステータス</TableHead>
                  <TableHead className="font-medium text-gray-700 text-xs py-1 text-center">案件数</TableHead>
                  <TableHead className="font-medium text-gray-700 text-xs py-1 text-center">広告費</TableHead>
                  <TableHead className="font-medium text-gray-700 text-xs py-1 text-center">CPA</TableHead>
                  <TableHead className="font-medium text-gray-700 text-xs py-1 text-center">最終ログイン</TableHead>
                  <TableHead className="font-medium text-gray-700 text-xs py-1 w-[60px] text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdvertisers.map((advertiser) => (
                  <TableRow 
                    key={advertiser.id}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => setSelectedAdvertiser(advertiser)}
                  >
                    <TableCell className="py-1 px-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-2.5 w-2.5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 text-xs">{advertiser.name}</div>
                          <div className="text-xs text-gray-500 truncate">{advertiser.email}</div>
                          <div className="text-xs font-medium text-gray-700">{advertiser.companyName}</div>
                          <div className="text-xs text-gray-400">{advertiser.industry}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-3 text-center">
                      <Badge
                        className={`text-xs px-2 py-0.5 ${
                          advertiser.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          advertiser.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {advertiser.status === 'ACTIVE' ? 'アクティブ' :
                         advertiser.status === 'PENDING' ? '承認待ち' : '停止中'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-1 px-3 text-center">
                      <div className="space-y-0.5">
                        <div className="text-xs">
                          <span className="text-gray-500">総:</span>
                          <span className="font-medium ml-1">{advertiser.totalCampaigns}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">ア:</span>
                          <span className="font-medium ml-1 text-green-600">{advertiser.activeCampaigns}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-green-600 text-xs py-1 px-3 text-center">
                      <div>{formatCurrency(advertiser.totalSpend)}</div>
                    </TableCell>
                    <TableCell className="py-1 px-3 text-center">
                      {advertiser.averageCPA > 0 ? (
                        <span className={`font-medium text-xs ${
                          advertiser.averageCPA <= 3000 ? 'text-green-600' :
                          advertiser.averageCPA <= 5000 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(advertiser.averageCPA)}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="py-1 px-3 text-center">
                      <div className="text-xs text-gray-900">
                        {advertiser.lastLogin ? formatDate(advertiser.lastLogin) : '-'}
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
                          <DropdownMenuItem onClick={() => setSelectedAdvertiser(advertiser)}>
                            <Eye className="mr-2 h-4 w-4" />
                            詳細を見る
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            編集
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            メール送信
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {advertiser.status === 'ACTIVE' ? (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(advertiser.id, 'SUSPENDED')}
                              className="text-red-600"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              停止
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleStatusChange(advertiser.id, 'ACTIVE')}>
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
        <Dialog open={!!selectedAdvertiser} onOpenChange={() => setSelectedAdvertiser(null)}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>広告主詳細</DialogTitle>
              <DialogDescription>
                {selectedAdvertiser?.name}の詳細情報
              </DialogDescription>
            </DialogHeader>
            {selectedAdvertiser && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">担当者名</label>
                    <div className="mt-1 text-gray-900">{selectedAdvertiser.name}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">メールアドレス</label>
                    <div className="mt-1 text-gray-900">{selectedAdvertiser.email}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">会社名</label>
                    <div className="mt-1 text-gray-900">{selectedAdvertiser.companyName}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">ステータス</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedAdvertiser.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">業界</label>
                    <div className="mt-1 text-gray-900">{selectedAdvertiser.industry}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">登録日</label>
                    <div className="mt-1 text-gray-900">{formatDate(selectedAdvertiser.createdAt)}</div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">パフォーマンス統計</h4>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(selectedAdvertiser.totalSpend)}
                      </div>
                      <div className="text-sm text-gray-500">総広告費</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedAdvertiser.totalCampaigns}
                      </div>
                      <div className="text-sm text-gray-500">総案件数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedAdvertiser.totalConversions}
                      </div>
                      <div className="text-sm text-gray-500">総コンバージョン数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {selectedAdvertiser.averageCPA > 0 ? formatCurrency(selectedAdvertiser.averageCPA) : '-'}
                      </div>
                      <div className="text-sm text-gray-500">平均CPA</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setSelectedAdvertiser(null)}>
                    閉じる
                  </Button>
                  <Button onClick={() => {
                    router.push(`/admin/users/${selectedAdvertiser.id}`)
                    setSelectedAdvertiser(null)
                  }}>
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