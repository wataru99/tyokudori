'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Download,
  Filter
} from 'lucide-react'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { DateRange } from 'react-day-picker'
import { addDays } from 'date-fns'

interface Conversion {
  id: string
  campaignName: string
  advertiserName: string
  clickId: string
  amount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  clickDate: string
  conversionDate: string
  approvalDate?: string
  rejectReason?: string
}

export default function PublisherConversionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  // Mock data
  const conversions: Conversion[] = [
    {
      id: '1',
      campaignName: '健康サプリメント定期購入',
      advertiserName: 'ヘルスケア株式会社',
      clickId: 'CLK123456',
      amount: 3000,
      status: 'APPROVED',
      clickDate: '2024-02-14T10:30:00Z',
      conversionDate: '2024-02-15T14:30:00Z',
      approvalDate: '2024-02-16T09:00:00Z'
    },
    {
      id: '2',
      campaignName: 'クレジットカード新規発行',
      advertiserName: 'ファイナンス株式会社',
      clickId: 'CLK123457',
      amount: 15000,
      status: 'PENDING',
      clickDate: '2024-02-14T15:45:00Z',
      conversionDate: '2024-02-15T12:15:00Z'
    },
    {
      id: '3',
      campaignName: '美容クリーム初回限定',
      advertiserName: 'ビューティー株式会社',
      clickId: 'CLK123458',
      amount: 2500,
      status: 'APPROVED',
      clickDate: '2024-02-13T09:20:00Z',
      conversionDate: '2024-02-15T11:45:00Z',
      approvalDate: '2024-02-16T10:30:00Z'
    },
    {
      id: '4',
      campaignName: '健康サプリメント定期購入',
      advertiserName: 'ヘルスケア株式会社',
      clickId: 'CLK123459',
      amount: 3000,
      status: 'PENDING',
      clickDate: '2024-02-15T08:00:00Z',
      conversionDate: '2024-02-15T10:30:00Z'
    },
    {
      id: '5',
      campaignName: 'オンライン英会話無料体験',
      advertiserName: '教育サービス株式会社',
      clickId: 'CLK123460',
      amount: 3000,
      status: 'REJECTED',
      clickDate: '2024-02-10T14:00:00Z',
      conversionDate: '2024-02-12T16:30:00Z',
      approvalDate: '2024-02-14T11:00:00Z',
      rejectReason: '重複申込み'
    },
    {
      id: '6',
      campaignName: '美容クリーム初回限定',
      advertiserName: 'ビューティー株式会社',
      clickId: 'CLK123461',
      amount: 2500,
      status: 'APPROVED',
      clickDate: '2024-02-12T11:30:00Z',
      conversionDate: '2024-02-14T09:15:00Z',
      approvalDate: '2024-02-15T10:00:00Z'
    }
  ]

  const filteredConversions = conversions.filter(conversion => {
    const matchesSearch = searchQuery === '' ||
      conversion.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversion.advertiserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversion.clickId.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || conversion.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="h-3 w-3" />
      case 'PENDING': return <Clock className="h-3 w-3" />
      case 'REJECTED': return <XCircle className="h-3 w-3" />
      default: return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP')
  }

  // Calculate stats
  const approvedConversions = conversions.filter(c => c.status === 'APPROVED')
  const pendingConversions = conversions.filter(c => c.status === 'PENDING')
  const rejectedConversions = conversions.filter(c => c.status === 'REJECTED')
  
  const totalApprovedAmount = approvedConversions.reduce((sum, c) => sum + c.amount, 0)
  const totalPendingAmount = pendingConversions.reduce((sum, c) => sum + c.amount, 0)
  const approvalRate = conversions.length > 0 
    ? ((approvedConversions.length / (approvedConversions.length + rejectedConversions.length)) * 100).toFixed(1)
    : '0'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">成果管理</h1>
              <p className="text-gray-600 mt-1">
                発生した成果の詳細と承認状況を確認できます
              </p>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              CSVエクスポート
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">承認済み報酬</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">¥{totalApprovedAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {approvedConversions.length} 件の成果
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">承認待ち報酬</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">¥{totalPendingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {pendingConversions.length} 件の成果
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">承認率</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{approvalRate}%</div>
              <p className="text-xs text-muted-foreground">
                否認: {rejectedConversions.length} 件
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">今月の確定報酬</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">¥{totalApprovedAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-600 mr-1" />
                前月比 +22.5%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">フィルター</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Input
                placeholder="案件名、広告主名、クリックIDで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="ステータスで絞り込み" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべてのステータス</SelectItem>
                  <SelectItem value="APPROVED">承認済み</SelectItem>
                  <SelectItem value="PENDING">承認待ち</SelectItem>
                  <SelectItem value="REJECTED">否認</SelectItem>
                </SelectContent>
              </Select>
              <DatePickerWithRange date={date} setDate={setDate} />
              <Button variant="outline" onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
                setDate({
                  from: addDays(new Date(), -30),
                  to: new Date(),
                })
              }}>
                <Filter className="mr-2 h-4 w-4" />
                リセット
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conversions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>成果一覧</CardTitle>
              <div className="text-sm text-gray-500">
                {filteredConversions.length} 件の成果
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>案件名</TableHead>
                    <TableHead>クリックID</TableHead>
                    <TableHead>報酬額</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>クリック日時</TableHead>
                    <TableHead>成果発生日時</TableHead>
                    <TableHead>承認/否認日</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConversions.map((conversion) => (
                    <TableRow 
                      key={conversion.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{conversion.campaignName}</div>
                          <div className="text-sm text-gray-500">{conversion.advertiserName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {conversion.clickId}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">¥{conversion.amount.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadgeColor(conversion.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(conversion.status)}
                          {conversion.status === 'APPROVED' ? '承認済み' :
                           conversion.status === 'PENDING' ? '承認待ち' : '否認'}
                        </Badge>
                        {conversion.rejectReason && (
                          <div className="text-xs text-red-600 mt-1">
                            理由: {conversion.rejectReason}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDateTime(conversion.clickDate)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDateTime(conversion.conversionDate)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {conversion.approvalDate ? formatDate(conversion.approvalDate) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}