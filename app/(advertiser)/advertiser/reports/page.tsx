'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PageLoading } from '@/components/ui/loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { 
  Calendar as CalendarIcon,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  DollarSign,
  Target,
  MousePointer
} from 'lucide-react'
import { useLoading } from '@/contexts/loading-context'
import { useNavigation } from '@/hooks/use-navigation'

interface ReportData {
  date: string
  clicks: number
  conversions: number
  revenue: number
  cvr: number
  cpa: number
}

interface PublisherPerformance {
  publisherId: string
  publisherName: string
  clicks: number
  conversions: number
  revenue: number
  cvr: number
}

interface CampaignPerformance {
  campaignId: string
  campaignName: string
  clicks: number
  conversions: number
  revenue: number
  cvr: number
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED'
}

export default function AdvertiserReportsPage() {
  const router = useRouter()
  const { setLoading } = useLoading()
  const { navigate } = useNavigation()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  })
  const [selectedPeriod, setSelectedPeriod] = useState('last30days')
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data
  const dailyData: ReportData[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return {
      date: format(date, 'yyyy-MM-dd'),
      clicks: Math.floor(Math.random() * 500) + 100,
      conversions: Math.floor(Math.random() * 20) + 5,
      revenue: Math.floor(Math.random() * 50000) + 10000,
      cvr: Math.random() * 5 + 1,
      cpa: Math.floor(Math.random() * 3000) + 1000
    }
  })

  const publisherData: PublisherPerformance[] = [
    {
      publisherId: 'pub_001',
      publisherName: 'メディアA',
      clicks: 3245,
      conversions: 89,
      revenue: 267000,
      cvr: 2.74
    },
    {
      publisherId: 'pub_002',
      publisherName: 'メディアB',
      clicks: 2156,
      conversions: 56,
      revenue: 168000,
      cvr: 2.60
    },
    {
      publisherId: 'pub_003',
      publisherName: 'メディアC',
      clicks: 1876,
      conversions: 45,
      revenue: 135000,
      cvr: 2.40
    }
  ]

  const campaignData: CampaignPerformance[] = [
    {
      campaignId: 'camp_001',
      campaignName: '健康サプリメント定期購入',
      clicks: 5432,
      conversions: 127,
      revenue: 381000,
      cvr: 2.34,
      status: 'ACTIVE'
    },
    {
      campaignId: 'camp_002',
      campaignName: 'クレジットカード新規発行',
      clicks: 3210,
      conversions: 89,
      revenue: 712000,
      cvr: 2.77,
      status: 'ACTIVE'
    },
    {
      campaignId: 'camp_003',
      campaignName: '美容クリーム初回限定',
      clicks: 1234,
      conversions: 23,
      revenue: 69000,
      cvr: 1.86,
      status: 'PAUSED'
    }
  ]

  // Initial page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const handleExport = (format: 'csv' | 'excel') => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Simulate download
      console.log(`Exporting report in ${format} format`)
    }, 1500)
  }

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    const today = new Date()
    let from = new Date()

    switch (period) {
      case 'today':
        from = today
        break
      case 'yesterday':
        from = new Date(today.setDate(today.getDate() - 1))
        break
      case 'last7days':
        from = new Date(today.setDate(today.getDate() - 7))
        break
      case 'last30days':
        from = new Date(today.setDate(today.getDate() - 30))
        break
      case 'thisMonth':
        from = new Date(today.getFullYear(), today.getMonth(), 1)
        break
      case 'lastMonth':
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        break
    }

    setDateRange({ from, to: new Date() })
  }

  // Calculate totals
  const totals = dailyData.reduce(
    (acc, day) => ({
      clicks: acc.clicks + day.clicks,
      conversions: acc.conversions + day.conversions,
      revenue: acc.revenue + day.revenue
    }),
    { clicks: 0, conversions: 0, revenue: 0 }
  )

  const avgCVR = totals.clicks > 0 ? (totals.conversions / totals.clicks * 100).toFixed(2) : '0.00'
  const avgCPA = totals.conversions > 0 ? Math.floor(totals.revenue / totals.conversions) : 0

  if (isPageLoading) {
    return <PageLoading text="レポートを読み込んでいます..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-3 py-3">

        {/* Page Header */}
        <div className="bg-white rounded shadow-sm border p-2 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-gray-900">レポート</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport('csv')}
                className="h-7"
              >
                <Download className="mr-1 h-3 w-3" />
                <span className="text-xs">CSV</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport('excel')}
                className="h-7"
              >
                <FileText className="mr-1 h-3 w-3" />
                <span className="text-xs">Excel</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded shadow-sm border p-3 mb-2">
          <div className="flex items-center space-x-2">
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">今日</SelectItem>
                <SelectItem value="yesterday">昨日</SelectItem>
                <SelectItem value="last7days">過去7日間</SelectItem>
                <SelectItem value="last30days">過去30日間</SelectItem>
                <SelectItem value="thisMonth">今月</SelectItem>
                <SelectItem value="lastMonth">先月</SelectItem>
                <SelectItem value="custom">カスタム</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <CalendarIcon className="h-3 w-3" />
              <span>
                {format(dateRange.from, 'yyyy/MM/dd', { locale: ja })} - {format(dateRange.to, 'yyyy/MM/dd', { locale: ja })}
              </span>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-2 grid-cols-4 mb-2">
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">総クリック数</CardTitle>
              <MousePointer className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">{totals.clicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-foreground mr-1" />
                前期比 +12.5%
              </p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">総成果数</CardTitle>
              <Target className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">{totals.conversions}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-foreground mr-1" />
                前期比 +8.3%
              </p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">総売上</CardTitle>
              <DollarSign className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">¥{totals.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-foreground mr-1" />
                前期比 +15.2%
              </p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">平均CVR</CardTitle>
              <BarChart3 className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">{avgCVR}%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline h-3 w-3 text-foreground mr-1" />
                前期比 -0.3%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Report Tabs */}
        <Card>
          <CardContent className="p-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-8">
                <TabsTrigger value="overview" className="text-xs">概要</TabsTrigger>
                <TabsTrigger value="daily" className="text-xs">日別</TabsTrigger>
                <TabsTrigger value="campaign" className="text-xs">案件別</TabsTrigger>
                <TabsTrigger value="publisher" className="text-xs">媒体別</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-3">
                <div className="space-y-3">
                  <div className="text-sm font-semibold">パフォーマンスサマリー</div>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-xs text-gray-600">平均CPA</div>
                      <div className="text-lg font-bold">¥{avgCPA.toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-xs text-gray-600">最高CVR案件</div>
                      <div className="text-sm font-semibold">{campaignData[1].campaignName}</div>
                      <div className="text-xs text-gray-500">{campaignData[1].cvr}%</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-xs text-gray-600">最高売上媒体</div>
                      <div className="text-sm font-semibold">{publisherData[0].publisherName}</div>
                      <div className="text-xs text-gray-500">¥{publisherData[0].revenue.toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-xs text-gray-600">アクティブ案件数</div>
                      <div className="text-lg font-bold">{campaignData.filter(c => c.status === 'ACTIVE').length}</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="daily" className="mt-3">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="text-xs py-2">日付</TableHead>
                        <TableHead className="text-xs py-2 text-right">クリック数</TableHead>
                        <TableHead className="text-xs py-2 text-right">成果数</TableHead>
                        <TableHead className="text-xs py-2 text-right">売上</TableHead>
                        <TableHead className="text-xs py-2 text-right">CVR</TableHead>
                        <TableHead className="text-xs py-2 text-right">CPA</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailyData.slice(-7).reverse().map((day) => (
                        <TableRow key={day.date}>
                          <TableCell className="py-2 text-xs">
                            {format(new Date(day.date), 'MM/dd (E)', { locale: ja })}
                          </TableCell>
                          <TableCell className="py-2 text-xs text-right">{day.clicks.toLocaleString()}</TableCell>
                          <TableCell className="py-2 text-xs text-right">{day.conversions}</TableCell>
                          <TableCell className="py-2 text-xs text-right">¥{day.revenue.toLocaleString()}</TableCell>
                          <TableCell className="py-2 text-xs text-right">{day.cvr.toFixed(2)}%</TableCell>
                          <TableCell className="py-2 text-xs text-right">¥{day.cpa.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="campaign" className="mt-3">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="text-xs py-2">案件名</TableHead>
                        <TableHead className="text-xs py-2">ステータス</TableHead>
                        <TableHead className="text-xs py-2 text-right">クリック数</TableHead>
                        <TableHead className="text-xs py-2 text-right">成果数</TableHead>
                        <TableHead className="text-xs py-2 text-right">売上</TableHead>
                        <TableHead className="text-xs py-2 text-right">CVR</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaignData.map((campaign) => (
                        <TableRow key={campaign.campaignId}>
                          <TableCell className="py-2 text-xs">{campaign.campaignName}</TableCell>
                          <TableCell className="py-2">
                            <Badge className={cn(
                              "text-xs px-2 py-0.5",
                              campaign.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                              campaign.status === 'PAUSED' ? "bg-amber-50 text-amber-700 border-amber-200" :
                              "bg-rose-50 text-rose-700 border-rose-200"
                            )}>
                              {campaign.status === 'ACTIVE' ? 'アクティブ' :
                               campaign.status === 'PAUSED' ? '一時停止' : '期限切れ'}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2 text-xs text-right">{campaign.clicks.toLocaleString()}</TableCell>
                          <TableCell className="py-2 text-xs text-right">{campaign.conversions}</TableCell>
                          <TableCell className="py-2 text-xs text-right">¥{campaign.revenue.toLocaleString()}</TableCell>
                          <TableCell className="py-2 text-xs text-right">{campaign.cvr}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="publisher" className="mt-3">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="text-xs py-2">媒体名</TableHead>
                        <TableHead className="text-xs py-2 text-right">クリック数</TableHead>
                        <TableHead className="text-xs py-2 text-right">成果数</TableHead>
                        <TableHead className="text-xs py-2 text-right">売上</TableHead>
                        <TableHead className="text-xs py-2 text-right">CVR</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {publisherData.map((publisher) => (
                        <TableRow key={publisher.publisherId}>
                          <TableCell className="py-2 text-xs">{publisher.publisherName}</TableCell>
                          <TableCell className="py-2 text-xs text-right">{publisher.clicks.toLocaleString()}</TableCell>
                          <TableCell className="py-2 text-xs text-right">{publisher.conversions}</TableCell>
                          <TableCell className="py-2 text-xs text-right">¥{publisher.revenue.toLocaleString()}</TableCell>
                          <TableCell className="py-2 text-xs text-right">{publisher.cvr}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}