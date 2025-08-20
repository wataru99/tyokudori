'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Target } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
// import { DatePickerWithRange } from '@/components/ui/date-range-picker'
// Recharts imports temporarily commented out due to vendor.js error
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts'

// サンプルデータ
const dailyData = [
  { date: '2024-01-01', clicks: 1200, conversions: 45, revenue: 135000, approvalRate: 82 },
  { date: '2024-01-02', clicks: 1350, conversions: 52, revenue: 156000, approvalRate: 85 },
  { date: '2024-01-03', clicks: 1100, conversions: 38, revenue: 114000, approvalRate: 79 },
  { date: '2024-01-04', clicks: 1450, conversions: 61, revenue: 183000, approvalRate: 88 },
  { date: '2024-01-05', clicks: 1300, conversions: 49, revenue: 147000, approvalRate: 84 },
  { date: '2024-01-06', clicks: 980, conversions: 35, revenue: 105000, approvalRate: 78 },
  { date: '2024-01-07', clicks: 1250, conversions: 48, revenue: 144000, approvalRate: 83 },
]

const offerPerformance = [
  { name: '健康サプリメント定期購入', revenue: 450000, conversions: 150, ctr: 2.3, cvr: 4.5 },
  { name: 'クレジットカード新規発行', revenue: 640000, conversions: 80, ctr: 1.8, cvr: 2.1 },
  { name: '美容クリーム初回限定', revenue: 280000, conversions: 93, ctr: 3.1, cvr: 5.2 },
  { name: '英会話スクール無料体験', revenue: 180000, conversions: 60, ctr: 2.5, cvr: 3.8 },
]

const publisherPerformance = [
  { name: 'メディアA', revenue: 380000, conversions: 127, approvalRate: 86 },
  { name: 'メディアB', revenue: 290000, conversions: 97, approvalRate: 82 },
  { name: 'メディアC', revenue: 220000, conversions: 73, approvalRate: 79 },
  { name: 'メディアD', revenue: 180000, conversions: 60, approvalRate: 88 },
  { name: 'メディアE', revenue: 160000, conversions: 53, approvalRate: 84 },
]

const categoryData = [
  { name: '美容・健康', value: 35, color: '#8884d8' },
  { name: '金融', value: 25, color: '#82ca9d' },
  { name: 'EC・通販', value: 20, color: '#ffc658' },
  { name: '教育', value: 12, color: '#ff7c7c' },
  { name: 'その他', value: 8, color: '#8dd1e1' },
]

export default function AdminReportsPage() {
  const { toast } = useToast()
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 0, 7),
  })
  const [groupBy, setGroupBy] = useState('day')
  const [selectedOffer, setSelectedOffer] = useState('all')
  const [selectedPublisher, setSelectedPublisher] = useState('all')

  const handleExportCSV = () => {
    toast({
      title: 'CSVエクスポート開始',
      description: 'レポートのダウンロードを開始しました。',
    })
  }

  // 統計計算
  const totalRevenue = dailyData.reduce((sum, day) => sum + day.revenue, 0)
  const totalConversions = dailyData.reduce((sum, day) => sum + day.conversions, 0)
  const totalClicks = dailyData.reduce((sum, day) => sum + day.clicks, 0)
  const avgApprovalRate = Math.round(
    dailyData.reduce((sum, day) => sum + day.approvalRate, 0) / dailyData.length
  )
  const cvr = ((totalConversions / totalClicks) * 100).toFixed(2)
  const avgOrderValue = Math.round(totalRevenue / totalConversions)

  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">レポート・分析</h1>
          <p className="text-gray-600 mt-1">
            アフィリエイトの成果データを分析し、ビジネスインサイトを得ることができます
          </p>
        </div>
      </div>

      {/* フィルタセクション */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>レポート設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-2 block">期間</label>
              <Select defaultValue="7days">
                <SelectTrigger>
                  <SelectValue placeholder="期間を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">今日</SelectItem>
                  <SelectItem value="7days">過去7日間</SelectItem>
                  <SelectItem value="30days">過去30日間</SelectItem>
                  <SelectItem value="thisMonth">今月</SelectItem>
                  <SelectItem value="lastMonth">先月</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">集計単位</label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">日別</SelectItem>
                  <SelectItem value="week">週別</SelectItem>
                  <SelectItem value="month">月別</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">案件</label>
              <Select value={selectedOffer} onValueChange={setSelectedOffer}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="1">健康サプリメント定期購入</SelectItem>
                  <SelectItem value="2">クレジットカード新規発行</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">媒体</label>
              <Select value={selectedPublisher} onValueChange={setSelectedPublisher}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="1">メディアA</SelectItem>
                  <SelectItem value="2">メディアB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleExportCSV} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              CSVエクスポート
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIカード */}
      <div className="grid gap-4 md:grid-cols-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総売上</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">¥{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-600 mr-1" />
              前期比 +12.5%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">成果件数</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{totalConversions}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-600 mr-1" />
              前期比 +8.3%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CVR</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{cvr}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 text-red-600 mr-1" />
              前期比 -0.3%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">承認率</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{avgApprovalRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-600 mr-1" />
              前期比 +2.1%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均単価</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">¥{avgOrderValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-600 mr-1" />
              前期比 +5.7%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">320%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-600 mr-1" />
              前期比 +15.2%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* グラフセクション */}
      <Tabs defaultValue="trend" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trend">トレンド分析</TabsTrigger>
          <TabsTrigger value="offer">案件別分析</TabsTrigger>
          <TabsTrigger value="publisher">媒体別分析</TabsTrigger>
          <TabsTrigger value="category">カテゴリ分析</TabsTrigger>
        </TabsList>

        <TabsContent value="trend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>売上・成果推移</CardTitle>
              <CardDescription>
                日別の売上高と成果件数の推移を表示しています
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">グラフ表示機能は準備中です</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>案件別パフォーマンス</CardTitle>
              <CardDescription>
                各案件の売上高と成果指標を比較できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">グラフ表示機能は準備中です</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publisher" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>媒体別パフォーマンス</CardTitle>
              <CardDescription>
                各媒体の売上貢献度と承認率を確認できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {publisherPerformance.map((publisher, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{publisher.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        成果: {publisher.conversions}件 | 承認率: {publisher.approvalRate}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">¥{publisher.revenue.toLocaleString()}</p>
                      <div className="w-32 bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${(publisher.revenue / 380000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>カテゴリ別売上構成</CardTitle>
              <CardDescription>
                カテゴリごとの売上構成比を円グラフで表示します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">グラフ表示機能は準備中です</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}