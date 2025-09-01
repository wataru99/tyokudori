'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { PageLoading } from '@/components/ui/loading'
import { useLoading } from '@/contexts/loading-context'
import { useNavigation } from '@/hooks/use-navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, Eye, MousePointerClick, TrendingUp, DollarSign } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Offer {
  id: string
  name: string
  category: string
  advertiserName: string
  commissionType: 'CPA' | 'CPS'
  commissionAmount: number
  approvalRate: number
  conversionRate: number
  status: 'ACTIVE' | 'PAUSED' | 'ENDED'
  tags: string[]
}

export default function PublisherOffersPage() {
  const pathname = usePathname()
  const { toast } = useToast()
  const { setLoading } = useLoading()
  const { navigate } = useNavigation()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true, 'データを読み込んでいます...')
      // Add a short delay for smoother transition
      await new Promise(resolve => setTimeout(resolve, 300))
      setIsLoading(false)
      setLoading(false)
    }
    loadData()
  }, [])

  // Mock data
  const offers: Offer[] = [
    {
      id: '1',
      name: '健康サプリメント定期購入',
      category: '美容・健康',
      advertiserName: 'ヘルスケア株式会社',
      commissionType: 'CPA',
      commissionAmount: 3000,
      approvalRate: 85.5,
      conversionRate: 3.2,
      status: 'ACTIVE',
      tags: ['リスティングOK', 'スマホ最適化', 'ITP対応']
    },
    {
      id: '2',
      name: 'クレジットカード新規発行',
      category: '金融',
      advertiserName: 'ファイナンス株式会社',
      commissionType: 'CPA',
      commissionAmount: 15000,
      approvalRate: 72.0,
      conversionRate: 2.1,
      status: 'ACTIVE',
      tags: ['リスティングNG', '本人申込OK']
    },
    {
      id: '3',
      name: '美容クリーム初回限定',
      category: '美容・健康',
      advertiserName: 'ビューティー株式会社',
      commissionType: 'CPA',
      commissionAmount: 2500,
      approvalRate: 90.0,
      conversionRate: 4.5,
      status: 'ACTIVE',
      tags: ['スマホ最適化', 'ITP対応']
    },
    {
      id: '4',
      name: 'オンライン英会話無料体験',
      category: '教育',
      advertiserName: '教育サービス株式会社',
      commissionType: 'CPA',
      commissionAmount: 3000,
      approvalRate: 88.0,
      conversionRate: 5.2,
      status: 'PAUSED',
      tags: ['リスティングOK']
    }
  ]

  const categories = [
    { value: 'all', label: 'すべてのカテゴリ' },
    { value: '美容・健康', label: '美容・健康' },
    { value: '金融', label: '金融' },
    { value: '教育', label: '教育' },
    { value: 'EC・通販', label: 'EC・通販' },
    { value: 'その他', label: 'その他' }
  ]

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = searchQuery === '' ||
      offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.advertiserName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || offer.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleOfferClick = async (offerId: string) => {
    const path = `/publisher/offers/${offerId}`
    navigate(path)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'PAUSED': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'ENDED': return 'bg-slate-50 text-slate-700 border-slate-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getCommissionText = (type: string, amount: number) => {
    if (type === 'CPS') {
      return `売上の${amount}%`
    }
    return `¥${amount.toLocaleString()}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageLoading text="広告案件を読み込んでいます..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-3 py-3">
        <div className="bg-white rounded shadow-sm border p-2 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-gray-900">広告案件一覧</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="px-2 py-0.5 text-xs">
                <span>{filteredOffers.length} 件の案件</span>
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-2 grid-cols-4 mb-2">
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">掲載可能案件</CardTitle>
              <MousePointerClick className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">{offers.filter(o => o.status === 'ACTIVE').length}</div>
              <p className="text-xs text-muted-foreground">アクティブな案件</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">平均承認率</CardTitle>
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">
                {(offers.reduce((sum, o) => sum + o.approvalRate, 0) / offers.length).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">全案件平均</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">平均CVR</CardTitle>
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">
                {(offers.reduce((sum, o) => sum + o.conversionRate, 0) / offers.length).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">全案件平均</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 p-2">
              <CardTitle className="text-xs font-medium">最高報酬額</CardTitle>
              <DollarSign className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-sm font-bold whitespace-nowrap">
                ¥{Math.max(...offers.map(o => o.commissionAmount)).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">CPA案件</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-2">
          <CardHeader className="p-3">
            <CardTitle className="text-sm">案件を検索</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="grid gap-2 md:grid-cols-3">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                <Input
                  placeholder="案件名や広告主名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-8 text-sm"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="カテゴリを選択" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">案件一覧</CardTitle>
              <Button variant="outline" size="sm" className="h-6 text-xs">
                <Filter className="mr-1 h-3 w-3" />
                詳細フィルター
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-xs">案件名</TableHead>
                    <TableHead className="text-xs">カテゴリ</TableHead>
                    <TableHead className="text-xs">報酬</TableHead>
                    <TableHead className="text-xs">承認率</TableHead>
                    <TableHead className="text-xs">CVR</TableHead>
                    <TableHead className="text-xs">ステータス</TableHead>
                    <TableHead className="text-xs">タグ</TableHead>
                    <TableHead className="text-center text-xs">アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.map((offer) => (
                    <TableRow 
                      key={offer.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => offer.status === 'ACTIVE' && handleOfferClick(offer.id)}
                    >
                      <TableCell className="py-2">
                        <div>
                          <div className="font-medium text-xs">{offer.name}</div>
                          <div className="text-xs text-gray-500">{offer.advertiserName}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge variant="outline" className="text-xs px-2 py-0.5">{offer.category}</Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="font-semibold text-xs">
                          {getCommissionText(offer.commissionType, offer.commissionAmount)}
                        </div>
                        <div className="text-xs text-gray-500">{offer.commissionType}</div>
                      </TableCell>
                      <TableCell className="py-2 text-xs">
                        <div className="font-medium">{offer.approvalRate}%</div>
                      </TableCell>
                      <TableCell className="py-2 text-xs">
                        <div className="font-medium">{offer.conversionRate}%</div>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge className={`${getStatusBadgeColor(offer.status)} text-xs px-2 py-0.5`}>
                          {offer.status === 'ACTIVE' ? 'アクティブ' :
                           offer.status === 'PAUSED' ? '一時停止' : '終了'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex flex-wrap gap-0.5">
                          {offer.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0">
                              {tag}
                            </Badge>
                          ))}
                          {offer.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              +{offer.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-2">
                        <Button
                          size="sm"
                          onClick={() => handleOfferClick(offer.id)}
                          disabled={offer.status !== 'ACTIVE'}
                          className="h-6 text-xs px-2"
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          詳細を見る
                        </Button>
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