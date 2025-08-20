'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
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
  const router = useRouter()
  const pathname = usePathname()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [selectedConversion, setSelectedConversion] = useState<Conversion | null>(null)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null)

  useEffect(() => {
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

  const handleNavigate = (path: string) => {
    if (pathname === path) return
    router.push(path)
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">

        {/* Page Header */}
        <div className="bg-card rounded-md shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">管理者ダッシュボード</h1>
              <p className="text-muted-foreground mt-2">
                システム全体の管理と監視を行います
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">最終更新</div>
              <div className="text-lg font-medium">
                {currentTime || '読み込み中...'}
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => setSelectedKPI('users')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総ユーザー数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold whitespace-nowrap">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-foreground mr-1" />
                前月比 +12
              </p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => setSelectedKPI('campaigns')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">アクティブ案件</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold whitespace-nowrap">{totalCampaigns}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-foreground mr-1" />
                前月比 +3
              </p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => setSelectedKPI('pending')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">承認待ち</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold whitespace-nowrap">{pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">
                <AlertTriangle className="inline h-3 w-3 text-muted-foreground mr-1" />
                要確認
              </p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => setSelectedKPI('revenue')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">月間売上</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold whitespace-nowrap">¥{monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-foreground mr-1" />
                前月比 +8.5%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Users */}
          <div className="bg-card rounded-md shadow-sm">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">新規ユーザー</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNavigate('/admin/users')}
                >
                  すべて見る
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead className="font-medium">ユーザー</TableHead>
                    <TableHead className="font-medium">権限</TableHead>
                    <TableHead className="font-medium">ステータス</TableHead>
                    <TableHead className="font-medium">登録日</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow 
                      key={user.id}
                      className="cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => handleUserClick(user)}
                    >
                      <TableCell className="py-4">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline">
                          {user.role === 'ADMIN' ? '管理者' :
                           user.role === 'ADVERTISER' ? '広告主' : 'アフィリエイター'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={`${getStatusBadgeColor(user.status)} border px-3 py-1`}>
                          {user.status === 'ACTIVE' ? 'アクティブ' :
                           user.status === 'PENDING' ? '承認待ち' : '停止中'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm">
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
          <div className="bg-card rounded-md shadow-sm">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">最新の案件</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNavigate('/admin/campaigns')}
                >
                  すべて見る
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead className="font-medium">案件名</TableHead>
                    <TableHead className="font-medium">ステータス</TableHead>
                    <TableHead className="font-medium">成果数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCampaigns.map((campaign) => (
                    <TableRow 
                      key={campaign.id}
                      className="cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => handleCampaignClick(campaign)}
                    >
                      <TableCell className="py-4">
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">{campaign.advertiserName}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={`${getStatusBadgeColor(campaign.status)} border px-3 py-1`}>
                          {campaign.status === 'ACTIVE' ? 'アクティブ' :
                           campaign.status === 'PAUSED' ? '一時停止' : '下書き'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-semibold">{campaign.conversions}</div>
                        <div className="text-sm text-muted-foreground">¥{campaign.revenue.toLocaleString()}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Pending Conversions */}
        <div className="bg-card rounded-md shadow-sm mt-6">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">承認待ちの成果</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleNavigate('/admin/conversions')}
              >
                すべて見る
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow>
                  <TableHead className="font-medium">案件名</TableHead>
                  <TableHead className="font-medium">アフィリエイター</TableHead>
                  <TableHead className="font-medium">金額</TableHead>
                  <TableHead className="font-medium">発生日時</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingConversions.map((conversion) => (
                  <TableRow 
                    key={conversion.id}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => handleConversionClick(conversion)}
                  >
                    <TableCell className="py-4">
                      <div className="font-medium">{conversion.campaignName}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div>{conversion.publisherName}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-semibold">¥{conversion.amount.toLocaleString()}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm">{formatDateTime(conversion.createdAt)}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* User Detail Modal */}
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl">
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
                  <Button onClick={() => handleNavigate(`/admin/users/${selectedUser.id}`)}>
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
                  <Button onClick={() => handleNavigate(`/admin/campaigns/${selectedCampaign.id}`)}>
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
                  <Button onClick={() => handleNavigate(`/admin/conversions/${selectedConversion.id}`)}>
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
                          onClick={() => handleNavigate(`/admin/users/${user.id}`)}
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
                <Button onClick={() => handleNavigate('/admin/users')}>
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
                          onClick={() => handleNavigate(`/admin/campaigns/${campaign.id}`)}
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
                <Button onClick={() => handleNavigate('/admin/campaigns')}>
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
                          onClick={() => handleNavigate(`/admin/conversions/${conversion.id}`)}
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
                <Button onClick={() => handleNavigate('/admin/conversions')}>
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
                <Button onClick={() => handleNavigate('/admin/reports')}>
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