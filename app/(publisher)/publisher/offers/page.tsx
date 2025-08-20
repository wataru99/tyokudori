'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, Eye, MousePointerClick, TrendingUp, DollarSign } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

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
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

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

  const handleOfferClick = (offerId: string) => {
    const path = `/publisher/offers/${offerId}`
    if (pathname === path) return
    router.push(path)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800'
      case 'ENDED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCommissionText = (type: string, amount: number) => {
    if (type === 'CPS') {
      return `売上の${amount}%`
    }
    return `¥${amount.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">広告案件一覧</h1>
              <p className="text-gray-600 mt-1">
                提携可能な広告案件を検索し、申請することができます
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="px-3 py-1">
                <span className="text-sm">{filteredOffers.length} 件の案件</span>
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">掲載可能案件</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{offers.filter(o => o.status === 'ACTIVE').length}</div>
              <p className="text-xs text-muted-foreground">アクティブな案件</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">平均承認率</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {(offers.reduce((sum, o) => sum + o.approvalRate, 0) / offers.length).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">全案件平均</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">平均CVR</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {(offers.reduce((sum, o) => sum + o.conversionRate, 0) / offers.length).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">全案件平均</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">最高報酬額</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                ¥{Math.max(...offers.map(o => o.commissionAmount)).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">CPA案件</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">案件を検索</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="案件名や広告主名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
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
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>案件一覧</CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                詳細フィルター
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>案件名</TableHead>
                    <TableHead>カテゴリ</TableHead>
                    <TableHead>報酬</TableHead>
                    <TableHead>承認率</TableHead>
                    <TableHead>CVR</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>タグ</TableHead>
                    <TableHead className="text-center">アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.map((offer) => (
                    <TableRow 
                      key={offer.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => offer.status === 'ACTIVE' && handleOfferClick(offer.id)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{offer.name}</div>
                          <div className="text-sm text-gray-500">{offer.advertiserName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{offer.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">
                          {getCommissionText(offer.commissionType, offer.commissionAmount)}
                        </div>
                        <div className="text-xs text-gray-500">{offer.commissionType}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{offer.approvalRate}%</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{offer.conversionRate}%</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(offer.status)}>
                          {offer.status === 'ACTIVE' ? 'アクティブ' :
                           offer.status === 'PAUSED' ? '一時停止' : '終了'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {offer.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {offer.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{offer.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          onClick={() => handleOfferClick(offer.id)}
                          disabled={offer.status !== 'ACTIVE'}
                        >
                          <Eye className="mr-2 h-4 w-4" />
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