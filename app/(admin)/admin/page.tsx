'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { PageLoading } from '@/components/ui/loading'
import { useLoading } from '@/contexts/loading-context'
import { useNavigation } from '@/hooks/use-navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Megaphone, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'ADVERTISER' | 'PUBLISHER'
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED'
  createdAt: string
  lastLogin?: string
}

interface Campaign {
  id: string
  name: string
  advertiserName: string
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT'
  conversions: number
  revenue: number
  createdAt: string
}

interface Conversion {
  id: string
  campaignName: string
  publisherName: string
  amount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export default function AdminDashboard() {
  const pathname = usePathname()
  const { setLoading } = useLoading()
  const { navigate } = useNavigation()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [selectedConversion, setSelectedConversion] = useState<Conversion | null>(null)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null)

  useEffect(() => {
    // Initialize data
    const loadData = async () => {
      setLoading(true, 'データを読み込んでいます...')
      // Add a short delay for smoother transition
      await new Promise(resolve => setTimeout(resolve, 300))
      setIsLoading(false)
      setLoading(false)
    }
    loadData()
    
    setCurrentTime(new Date().toLocaleString('ja-JP'))
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString('ja-JP'))
    }, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])


  // Mock data
  const recentUsers: User[] = [
    {
      id: '1',
      name: '田中太郎',
      email: 'tanaka@example.com',
      role: 'ADVERTISER',
      status: 'PENDING',
      createdAt: '2024-02-15T09:30:00Z'
    },
    {
      id: '2',
      name: '佐藤花子',
      email: 'sato@example.com',
      role: 'PUBLISHER',
      status: 'ACTIVE',
      createdAt: '2024-02-14T14:15:00Z',
      lastLogin: '2024-02-15T08:30:00Z'
    },
    {
      id: '3',
      name: '鈴木一郎',
      email: 'suzuki@example.com',
      role: 'PUBLISHER',
      status: 'PENDING',
      createdAt: '2024-02-13T16:45:00Z'
    },
    {
      id: '4',
      name: '高橋美咲',
      email: 'takahashi@company.co.jp',
      role: 'ADVERTISER',
      status: 'ACTIVE',
      createdAt: '2024-02-10T11:20:00Z',
      lastLogin: '2024-02-15T10:15:00Z'
    },
    {
      id: '5',
      name: '山田次郎',
      email: 'yamada@blog.net',
      role: 'PUBLISHER',
      status: 'ACTIVE',
      createdAt: '2024-02-12T09:45:00Z',
      lastLogin: '2024-02-15T07:30:00Z'
    },
    {
      id: '6',
      name: '中村真理',
      email: 'nakamura@media.com',
      role: 'PUBLISHER',
      status: 'SUSPENDED',
      createdAt: '2024-02-08T14:30:00Z',
      lastLogin: '2024-02-10T16:20:00Z'
    },
    {
      id: '7',
      name: '伊藤健太',
      email: 'ito@brand.jp',
      role: 'ADVERTISER',
      status: 'ACTIVE',
      createdAt: '2024-02-05T13:15:00Z',
      lastLogin: '2024-02-14T18:45:00Z'
    }
  ]

  const recentCampaigns: Campaign[] = [
    {
      id: '1',
      name: '健康サプリメント定期購入',
      advertiserName: '田中太郎',
      status: 'ACTIVE',
      conversions: 45,
      revenue: 135000,
      createdAt: '2024-02-10T10:00:00Z'
    },
    {
      id: '2',
      name: 'クレジットカード新規発行',
      advertiserName: 'スマート株式会社',
      status: 'DRAFT',
      conversions: 0,
      revenue: 0,
      createdAt: '2024-02-12T15:30:00Z'
    }
  ]

  const pendingConversions: Conversion[] = [
    {
      id: '1',
      campaignName: '健康サプリメント定期購入',
      publisherName: '佐藤花子',
      amount: 3000,
      status: 'PENDING',
      createdAt: '2024-02-15T12:00:00Z'
    },
    {
      id: '2',
      campaignName: '美容クリーム初回限定',
      publisherName: '山田次郎',
      amount: 2500,
      status: 'PENDING',
      createdAt: '2024-02-15T10:30:00Z'
    }
  ]

  const handleUserClick = (user: User) => {
    setSelectedUser(user)
  }

  const handleCampaignClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
  }

  const handleConversionClick = (conversion: Conversion) => {
    setSelectedConversion(conversion)
  }


  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'SUSPENDED': return 'bg-rose-50 text-rose-700 border-rose-200'
      case 'DRAFT': return 'bg-slate-50 text-slate-700 border-slate-200'
      case 'PAUSED': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
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

  // Calculate stats
  const totalUsers = 156
  const totalCampaigns = 23
  const pendingApprovals = pendingConversions.length
  const monthlyRevenue = 2450000

  if (isLoading) {
    return <PageLoading text="管理者ダッシュボードを読み込んでいます..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-3 py-3">

        {/* Page Header */}
        <div className="bg-white rounded shadow-sm border p-2 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-gray-900">管理者ダッシュボード</h1>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">最終更新</div>
              <div className="text-sm font-medium">
                {currentTime || '読み込み中...'}
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-2 grid-cols-4 mb-2">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow duration-150"
            onClick={() => setSelectedKPI('users')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">総ユーザー数</CardTitle>
              <Users className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-foreground mr-1" />
                前月比 +12
              </p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow duration-150"
            onClick={() => setSelectedKPI('campaigns')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">アクティブ案件</CardTitle>
              <Megaphone className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">{totalCampaigns}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-foreground mr-1" />
                前月比 +3
              </p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow duration-150"
            onClick={() => setSelectedKPI('pending')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">承認待ち</CardTitle>
              <Clock className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">{pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">
                <AlertTriangle className="inline h-3 w-3 text-muted-foreground mr-1" />
                要確認
              </p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow duration-150"
            onClick={() => setSelectedKPI('revenue')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">月間売上</CardTitle>
              <DollarSign className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">¥{monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-foreground mr-1" />
                前月比 +8.5%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-2 lg:grid-cols-2">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-4 py-2 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">新規ユーザー</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => navigate('/admin/users')}
                >
                  すべて見る
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-medium text-gray-700 text-xs py-1">ユーザー</TableHead>
                    <TableHead className="font-medium text-gray-700 text-xs py-1">権限</TableHead>
                    <TableHead className="font-medium text-gray-700 text-xs py-1">ステータス</TableHead>
                    <TableHead className="font-medium text-gray-700 text-xs py-1">登録日</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow 
                      key={user.id}
                      className="cursor-pointer hover:bg-blue-50 transition-colors"
                      onClick={() => handleUserClick(user)}
                    >
                      <TableCell className="py-1">
                        <div>
                          <div className="font-medium text-xs">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-1">
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          {user.role === 'ADMIN' ? '管理者' :
                           user.role === 'ADVERTISER' ? '広告主' : 'アフィリエイター'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-1">
                        <Badge className={`${getStatusBadgeColor(user.status)} border px-2 py-0.5 text-xs`}>
                          {user.status === 'ACTIVE' ? 'アクティブ' :
                           user.status === 'PENDING' ? '承認待ち' : '停止中'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-1">
                        <div className="text-xs">
                          {formatDate(user.createdAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Recent Campaigns */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-4 py-2 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">最新の案件</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => navigate('/admin/campaigns')}
                >
                  すべて見る
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-medium text-gray-700 text-xs py-1">案件名</TableHead>
                    <TableHead className="font-medium text-gray-700 text-xs py-1">ステータス</TableHead>
                    <TableHead className="font-medium text-gray-700 text-xs py-1">成果数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCampaigns.map((campaign) => (
                    <TableRow 
                      key={campaign.id}
                      className="cursor-pointer hover:bg-blue-50 transition-colors"
                      onClick={() => handleCampaignClick(campaign)}
                    >
                      <TableCell className="py-1">
                        <div>
                          <div className="font-medium text-xs">{campaign.name}</div>
                          <div className="text-xs text-gray-500">{campaign.advertiserName}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-1">
                        <Badge className={`${getStatusBadgeColor(campaign.status)} border px-2 py-0.5 text-xs`}>
                          {campaign.status === 'ACTIVE' ? 'アクティブ' :
                           campaign.status === 'PAUSED' ? '一時停止' : '下書き'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-1">
                        <div className="font-semibold text-xs">{campaign.conversions}</div>
                        <div className="text-xs text-gray-500">¥{campaign.revenue.toLocaleString()}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Pending Conversions */}
        <div className="bg-white rounded-lg shadow-sm border mt-2">
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">承認待ちの成果</h3>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs h-7"
                onClick={() => navigate('/admin/conversions')}
              >
                すべて見る
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-medium text-gray-700 text-xs py-1">案件名</TableHead>
                  <TableHead className="font-medium text-gray-700 text-xs py-1">アフィリエイター</TableHead>
                  <TableHead className="font-medium text-gray-700 text-xs py-1">金額</TableHead>
                  <TableHead className="font-medium text-gray-700 text-xs py-1">発生日時</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingConversions.map((conversion) => (
                  <TableRow 
                    key={conversion.id}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => handleConversionClick(conversion)}
                  >
                    <TableCell className="py-1">
                      <div className="font-medium text-xs">{conversion.campaignName}</div>
                    </TableCell>
                    <TableCell className="py-1">
                      <div className="text-xs">{conversion.publisherName}</div>
                    </TableCell>
                    <TableCell className="py-1">
                      <div className="font-semibold text-xs">¥{conversion.amount.toLocaleString()}</div>
                    </TableCell>
                    <TableCell className="py-1">
                      <div className="text-xs">{formatDateTime(conversion.createdAt)}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* User Detail Modal */}
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>ユーザー詳細</DialogTitle>
              <DialogDescription>
                {selectedUser?.name}の詳細情報
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">名前</label>
                    <div className="mt-1 text-gray-900">{selectedUser.name}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">メールアドレス</label>
                    <div className="mt-1 text-gray-900">{selectedUser.email}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">権限</label>
                    <div className="mt-1">
                      <Badge variant="outline">
                        {selectedUser.role === 'ADMIN' ? '管理者' :
                         selectedUser.role === 'ADVERTISER' ? '広告主' : 'アフィリエイター'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">ステータス</label>
                    <div className="mt-1">
                      <Badge className={`${getStatusBadgeColor(selectedUser.status)} border`}>
                        {selectedUser.status === 'ACTIVE' ? 'アクティブ' :
                         selectedUser.status === 'PENDING' ? '承認待ち' : '停止中'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">登録日</label>
                    <div className="mt-1 text-gray-900">{formatDateTime(selectedUser.createdAt)}</div>
                  </div>
                  {selectedUser.lastLogin && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">最終ログイン</label>
                      <div className="mt-1 text-gray-900">{formatDateTime(selectedUser.lastLogin)}</div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setSelectedUser(null)}>
                    閉じる
                  </Button>
                  <Button onClick={() => navigate(`/admin/users/${selectedUser.id}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    詳細管理
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Campaign Detail Modal */}
        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
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
                    <label className="text-sm font-medium text-gray-700">広告主</label>
                    <div className="mt-1 text-gray-900">{selectedCampaign.advertiserName}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">ステータス</label>
                    <div className="mt-1">
                      <Badge className={`${getStatusBadgeColor(selectedCampaign.status)} border`}>
                        {selectedCampaign.status === 'ACTIVE' ? 'アクティブ' :
                         selectedCampaign.status === 'PAUSED' ? '一時停止' : '下書き'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">成果数</label>
                    <div className="mt-1 text-gray-900">{selectedCampaign.conversions}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">売上</label>
                    <div className="mt-1 text-gray-900">¥{selectedCampaign.revenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">作成日</label>
                    <div className="mt-1 text-gray-900">{formatDateTime(selectedCampaign.createdAt)}</div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setSelectedCampaign(null)}>
                    閉じる
                  </Button>
                  <Button onClick={() => navigate(`/admin/campaigns/${selectedCampaign.id}`)}>
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
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>成果詳細</DialogTitle>
              <DialogDescription>
                承認待ちの成果の詳細情報
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
                    <label className="text-sm font-medium text-gray-700">アフィリエイター</label>
                    <div className="mt-1 text-gray-900">{selectedConversion.publisherName}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">金額</label>
                    <div className="mt-1 text-gray-900">¥{selectedConversion.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">ステータス</label>
                    <div className="mt-1">
                      <Badge className={`${getStatusBadgeColor(selectedConversion.status)} border`}>
                        {selectedConversion.status === 'PENDING' ? '承認待ち' :
                         selectedConversion.status === 'APPROVED' ? '承認済み' : '否認済み'}
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
                  <Button onClick={() => navigate(`/admin/conversions/${selectedConversion.id}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    詳細管理
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* KPI Detail Dialogs */}
        {/* Users KPI Dialog */}
        <Dialog open={selectedKPI === 'users'} onOpenChange={() => setSelectedKPI(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>ユーザー統計の詳細</DialogTitle>
              <DialogDescription>
                システム全体のユーザー登録状況と内訳
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">総ユーザー数</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalUsers}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">今月の新規</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">+12</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">アクティブ率</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">87%</div>
                  </CardContent>
                </Card>
              </div>

              {/* User List */}
              <div>
                <h4 className="font-semibold mb-3">ユーザー一覧</h4>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>名前</TableHead>
                        <TableHead>メール</TableHead>
                        <TableHead>権限</TableHead>
                        <TableHead>ステータス</TableHead>
                        <TableHead>登録日</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow 
                          key={user.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                        >
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {user.role === 'ADMIN' ? '管理者' :
                               user.role === 'ADVERTISER' ? '広告主' : 'アフィリエイター'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBadgeColor(user.status)} text-xs border`}>
                              {user.status === 'ACTIVE' ? 'アクティブ' :
                               user.status === 'PENDING' ? '承認待ち' : '停止中'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{formatDate(user.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedKPI(null)}>
                  閉じる
                </Button>
                <Button onClick={() => navigate('/admin/users')}>
                  ユーザー管理へ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Campaigns KPI Dialog */}
        <Dialog open={selectedKPI === 'campaigns'} onOpenChange={() => setSelectedKPI(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>案件統計の詳細</DialogTitle>
              <DialogDescription>
                アクティブな案件の状況と成果
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">総案件数</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">32</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">アクティブ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">23</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">今月の成果数</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,245</div>
                  </CardContent>
                </Card>
              </div>

              {/* Campaign List */}
              <div>
                <h4 className="font-semibold mb-3">アクティブ案件一覧</h4>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>案件名</TableHead>
                        <TableHead>広告主</TableHead>
                        <TableHead>ステータス</TableHead>
                        <TableHead>成果数</TableHead>
                        <TableHead>売上</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentCampaigns.map((campaign) => (
                        <TableRow 
                          key={campaign.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => navigate(`/admin/campaigns/${campaign.id}`)}
                        >
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell className="text-sm text-gray-600">{campaign.advertiserName}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBadgeColor(campaign.status)} text-xs border`}>
                              {campaign.status === 'ACTIVE' ? 'アクティブ' :
                               campaign.status === 'PAUSED' ? '一時停止' : '下書き'}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">{campaign.conversions}</TableCell>
                          <TableCell className="font-semibold">¥{campaign.revenue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedKPI(null)}>
                  閉じる
                </Button>
                <Button onClick={() => navigate('/admin/campaigns')}>
                  案件管理へ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Pending KPI Dialog */}
        <Dialog open={selectedKPI === 'pending'} onOpenChange={() => setSelectedKPI(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>承認待ち成果の詳細</DialogTitle>
              <DialogDescription>
                承認が必要な成果の状況
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">承認待ち件数</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{pendingApprovals}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">合計金額</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">¥{pendingConversions.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">平均待機時間</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2.5日</div>
                  </CardContent>
                </Card>
              </div>

              {/* Pending List */}
              <div>
                <h4 className="font-semibold mb-3">承認待ちリスト</h4>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>案件名</TableHead>
                        <TableHead>アフィリエイター</TableHead>
                        <TableHead>金額</TableHead>
                        <TableHead>発生日時</TableHead>
                        <TableHead>ステータス</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingConversions.map((conversion) => (
                        <TableRow 
                          key={conversion.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => navigate(`/admin/conversions/${conversion.id}`)}
                        >
                          <TableCell className="font-medium">{conversion.campaignName}</TableCell>
                          <TableCell className="text-sm text-gray-600">{conversion.publisherName}</TableCell>
                          <TableCell className="font-semibold">¥{conversion.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-sm">{formatDateTime(conversion.createdAt)}</TableCell>
                          <TableCell>
                            <Badge className="bg-orange-100 text-orange-800 text-xs border">
                              承認待ち
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedKPI(null)}>
                  閉じる
                </Button>
                <Button onClick={() => navigate('/admin/conversions')}>
                  成果管理へ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Revenue KPI Dialog */}
        <Dialog open={selectedKPI === 'revenue'} onOpenChange={() => setSelectedKPI(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>売上統計の詳細</DialogTitle>
              <DialogDescription>
                月間売上の詳細分析
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">今月の売上</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">¥{monthlyRevenue.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">前月比</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">+8.5%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">目標達成率</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">92%</div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Breakdown */}
              <div>
                <h4 className="font-semibold mb-3">カテゴリ別売上</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">健康・美容</span>
                    <div className="text-right">
                      <div className="font-bold">¥1,085,000</div>
                      <div className="text-sm text-gray-500">44.3%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">金融</span>
                    <div className="text-right">
                      <div className="font-bold">¥735,000</div>
                      <div className="text-sm text-gray-500">30.0%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">教育・学習</span>
                    <div className="text-right">
                      <div className="font-bold">¥428,000</div>
                      <div className="text-sm text-gray-500">17.5%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">その他</span>
                    <div className="text-right">
                      <div className="font-bold">¥202,000</div>
                      <div className="text-sm text-gray-500">8.2%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedKPI(null)}>
                  閉じる
                </Button>
                <Button onClick={() => navigate('/admin/reports')}>
                  詳細レポートへ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
