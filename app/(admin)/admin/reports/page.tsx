'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Target, BarChart3, LineChart, PieChart } from 'lucide-react'
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
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null)

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
        <Card 
          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          onClick={() => setSelectedKPI('revenue')}
        >
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
        <Card
          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          onClick={() => setSelectedKPI('conversions')}
        >
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
        <Card
          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          onClick={() => setSelectedKPI('cvr')}
        >
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
        <Card
          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          onClick={() => setSelectedKPI('approval')}
        >
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
        <Card
          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          onClick={() => setSelectedKPI('avgPrice')}
        >
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
        <Card
          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          onClick={() => setSelectedKPI('roas')}
        >
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
              <div className="space-y-4">
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">売上推移グラフ</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>日付</TableHead>
                        <TableHead className="text-right">クリック数</TableHead>
                        <TableHead className="text-right">成果数</TableHead>
                        <TableHead className="text-right">CVR</TableHead>
                        <TableHead className="text-right">売上</TableHead>
                        <TableHead className="text-right">承認率</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailyData.map((day, index) => (
                        <TableRow key={index}>
                          <TableCell>{day.date}</TableCell>
                          <TableCell className="text-right">{day.clicks.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{day.conversions}</TableCell>
                          <TableCell className="text-right">{((day.conversions / day.clicks) * 100).toFixed(2)}%</TableCell>
                          <TableCell className="text-right font-semibold">¥{day.revenue.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{day.approvalRate}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
              <div className="space-y-4">
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">案件別売上グラフ</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>案件名</TableHead>
                        <TableHead className="text-right">売上</TableHead>
                        <TableHead className="text-right">成果数</TableHead>
                        <TableHead className="text-right">CTR</TableHead>
                        <TableHead className="text-right">CVR</TableHead>
                        <TableHead className="text-right">平均単価</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {offerPerformance.map((offer, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{offer.name}</TableCell>
                          <TableCell className="text-right font-semibold">¥{offer.revenue.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{offer.conversions}</TableCell>
                          <TableCell className="text-right">{offer.ctr}%</TableCell>
                          <TableCell className="text-right">{offer.cvr}%</TableCell>
                          <TableCell className="text-right">¥{Math.round(offer.revenue / offer.conversions).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">カテゴリ別構成比</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">カテゴリ別売上</h4>
                    {categoryData.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{category.value}%</p>
                          <p className="text-sm text-gray-500">¥{Math.round(totalRevenue * category.value / 100).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* KPI Detail Dialogs */}
      <Dialog open={selectedKPI === 'revenue'} onOpenChange={() => setSelectedKPI(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>売上詳細分析</DialogTitle>
            <DialogDescription>期間内の売上推移と内訳</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">¥{totalRevenue.toLocaleString()}</div>
                  <p className="text-sm text-gray-500">総売上</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">+12.5%</div>
                  <p className="text-sm text-gray-500">前期比成長率</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">¥{Math.round(totalRevenue / 7).toLocaleString()}</div>
                  <p className="text-sm text-gray-500">日平均売上</p>
                </CardContent>
              </Card>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日付</TableHead>
                    <TableHead className="text-right">売上</TableHead>
                    <TableHead className="text-right">前日比</TableHead>
                    <TableHead className="text-right">構成比</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyData.map((day, index) => (
                    <TableRow key={index}>
                      <TableCell>{day.date}</TableCell>
                      <TableCell className="text-right font-semibold">¥{day.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {index > 0 ? (
                          <span className={day.revenue > dailyData[index - 1].revenue ? 'text-green-600' : 'text-red-600'}>
                            {((day.revenue / dailyData[index - 1].revenue - 1) * 100).toFixed(1)}%
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-right">{((day.revenue / totalRevenue) * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedKPI === 'conversions'} onOpenChange={() => setSelectedKPI(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>成果件数詳細分析</DialogTitle>
            <DialogDescription>期間内の成果発生状況</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{totalConversions}</div>
                  <p className="text-sm text-gray-500">総成果数</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{Math.round(totalConversions / 7)}</div>
                  <p className="text-sm text-gray-500">日平均成果数</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">¥{avgOrderValue.toLocaleString()}</div>
                  <p className="text-sm text-gray-500">成果単価</p>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">時間帯別成果発生</h4>
              <div className="grid grid-cols-6 gap-2">
                {[
                  { hour: '0-4時', count: 12 },
                  { hour: '4-8時', count: 23 },
                  { hour: '8-12時', count: 89 },
                  { hour: '12-16時', count: 112 },
                  { hour: '16-20時', count: 98 },
                  { hour: '20-24時', count: 56 }
                ].map((slot, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{slot.hour}</p>
                    <p className="text-lg font-bold">{slot.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedKPI === 'cvr'} onOpenChange={() => setSelectedKPI(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>CVR詳細分析</DialogTitle>
            <DialogDescription>コンバージョン率の推移と要因分析</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{cvr}%</div>
                  <p className="text-sm text-gray-500">平均CVR</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
                  <p className="text-sm text-gray-500">総クリック数</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{totalConversions}</div>
                  <p className="text-sm text-gray-500">総成果数</p>
                </CardContent>
              </Card>
            </div>
            <div>
              <h4 className="font-semibold mb-3">デバイス別CVR</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>PC</span>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold">4.2%</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>スマートフォン</span>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold">3.1%</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '31%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>タブレット</span>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold">3.8%</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '38%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedKPI === 'approval'} onOpenChange={() => setSelectedKPI(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>承認率詳細分析</DialogTitle>
            <DialogDescription>案件別・媒体別の承認率状況</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{avgApprovalRate}%</div>
                  <p className="text-sm text-gray-500">平均承認率</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{Math.round(totalConversions * avgApprovalRate / 100)}</div>
                  <p className="text-sm text-gray-500">承認済み件数</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{totalConversions - Math.round(totalConversions * avgApprovalRate / 100)}</div>
                  <p className="text-sm text-gray-500">否認件数</p>
                </CardContent>
              </Card>
            </div>
            <div>
              <h4 className="font-semibold mb-3">否認理由内訳</h4>
              <div className="space-y-2">
                {[
                  { reason: '重複申込', count: 15, percentage: 35 },
                  { reason: '情報不備', count: 10, percentage: 23 },
                  { reason: 'キャンセル', count: 8, percentage: 19 },
                  { reason: '不正申込', count: 5, percentage: 12 },
                  { reason: 'その他', count: 5, percentage: 11 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>{item.reason}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{item.count}件</span>
                      <span className="font-bold">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedKPI === 'avgPrice'} onOpenChange={() => setSelectedKPI(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>平均単価詳細分析</DialogTitle>
            <DialogDescription>案件別の単価分布と推移</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">¥{avgOrderValue.toLocaleString()}</div>
                  <p className="text-sm text-gray-500">全体平均単価</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">¥15,000</div>
                  <p className="text-sm text-gray-500">最高単価</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">¥1,500</div>
                  <p className="text-sm text-gray-500">最低単価</p>
                </CardContent>
              </Card>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>案件名</TableHead>
                    <TableHead className="text-right">平均単価</TableHead>
                    <TableHead className="text-right">最高単価</TableHead>
                    <TableHead className="text-right">最低単価</TableHead>
                    <TableHead className="text-right">件数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offerPerformance.map((offer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{offer.name}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ¥{Math.round(offer.revenue / offer.conversions).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ¥{Math.round(offer.revenue / offer.conversions * 1.5).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ¥{Math.round(offer.revenue / offer.conversions * 0.7).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">{offer.conversions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedKPI === 'roas'} onOpenChange={() => setSelectedKPI(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>ROAS詳細分析</DialogTitle>
            <DialogDescription>広告費用対効果の詳細</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">320%</div>
                  <p className="text-sm text-gray-500">平均ROAS</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">¥{Math.round(totalRevenue / 3.2).toLocaleString()}</div>
                  <p className="text-sm text-gray-500">広告費用</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">¥{totalRevenue.toLocaleString()}</div>
                  <p className="text-sm text-gray-500">広告収益</p>
                </CardContent>
              </Card>
            </div>
            <div>
              <h4 className="font-semibold mb-3">媒体別ROAS</h4>
              <div className="space-y-2">
                {publisherPerformance.map((publisher, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{publisher.name}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        費用: ¥{Math.round(publisher.revenue / 3.2).toLocaleString()}
                      </span>
                      <span className="font-bold text-green-600">
                        {Math.round(320 + (index % 3 - 1) * 50)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}