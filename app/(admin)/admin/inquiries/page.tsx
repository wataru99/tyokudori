'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { 
  Mail, 
  Search, 
  Filter,
  Eye,
  Reply,
  Archive,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  User,
  Building
} from 'lucide-react'

interface Inquiry {
  id: string
  senderType: 'publisher' | 'advertiser'
  senderName: string
  senderEmail: string
  companyName?: string
  category: string
  subject: string
  message: string
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
  repliedAt?: string
  assignee?: string
}

export default function AdminInquiriesPage() {
  const { toast } = useToast()
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock data
  const inquiries: Inquiry[] = [
    {
      id: '1',
      senderType: 'publisher',
      senderName: '山田 太郎',
      senderEmail: 'yamada@example.com',
      category: 'payment',
      subject: '報酬の支払いタイミングについて',
      message: '先月の報酬がまだ振り込まれていないようですが、いつ頃の予定でしょうか？',
      status: 'NEW',
      priority: 'HIGH',
      createdAt: '2024-02-15T10:30:00Z'
    },
    {
      id: '2',
      senderType: 'advertiser',
      senderName: '鈴木 花子',
      senderEmail: 'suzuki@company.com',
      companyName: '株式会社ABC',
      category: 'campaign',
      subject: 'キャンペーンの成果が伸び悩んでいます',
      message: '先週から開始したキャンペーンの成果が想定を下回っています。改善策をご提案いただけますか？',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      createdAt: '2024-02-15T09:15:00Z',
      assignee: '営業担当A'
    },
    {
      id: '3',
      senderType: 'publisher',
      senderName: '佐藤 次郎',
      senderEmail: 'sato@blog.com',
      category: 'technical',
      subject: 'リンクが正しく動作しません',
      message: 'アフィリエイトリンクをクリックしても404エラーが表示されます。確認をお願いします。',
      status: 'RESOLVED',
      priority: 'HIGH',
      createdAt: '2024-02-14T14:00:00Z',
      repliedAt: '2024-02-14T16:30:00Z'
    },
    {
      id: '4',
      senderType: 'advertiser',
      senderName: '高橋 美咲',
      senderEmail: 'takahashi@brand.com',
      companyName: 'ブランドXYZ',
      category: 'proposal',
      subject: '新しいクリエイティブの提案',
      message: '春のキャンペーンに向けて新しいバナークリエイティブを準備しました。レビューをお願いします。',
      status: 'NEW',
      priority: 'LOW',
      createdAt: '2024-02-15T11:45:00Z'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          新規
        </Badge>
      case 'IN_PROGRESS':
        return <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          対応中
        </Badge>
      case 'RESOLVED':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          解決済み
        </Badge>
      case 'ARCHIVED':
        return <Badge variant="secondary">アーカイブ</Badge>
      default:
        return null
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      general: '一般',
      technical: '技術',
      payment: '支払い',
      billing: '請求',
      campaign: '案件',
      performance: '成果',
      complaint: 'クレーム',
      proposal: '提案',
      other: 'その他'
    }
    return labels[category] || category
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <Badge variant="destructive">高</Badge>
      case 'MEDIUM':
        return <Badge variant="warning">中</Badge>
      case 'LOW':
        return <Badge variant="secondary">低</Badge>
      default:
        return null
    }
  }

  const handleReply = () => {
    if (!selectedInquiry || !replyMessage) return

    toast({
      title: "返信を送信しました",
      description: `${selectedInquiry.senderName}様へ返信を送信しました。`,
    })

    setReplyMessage('')
    setIsReplyOpen(false)
  }

  const handleStatusChange = (inquiryId: string, newStatus: string) => {
    toast({
      title: "ステータスを更新しました",
      description: `問い合わせ #${inquiryId} のステータスを更新しました。`,
    })
  }

  const filteredInquiries = inquiries.filter(inquiry => {
    if (filterCategory !== 'all' && inquiry.category !== filterCategory) return false
    if (filterStatus !== 'all' && inquiry.status !== filterStatus) return false
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        inquiry.subject.toLowerCase().includes(searchLower) ||
        inquiry.senderName.toLowerCase().includes(searchLower) ||
        inquiry.senderEmail.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const newInquiries = filteredInquiries.filter(i => i.status === 'NEW')
  const inProgressInquiries = filteredInquiries.filter(i => i.status === 'IN_PROGRESS')
  const resolvedInquiries = filteredInquiries.filter(i => i.status === 'RESOLVED' || i.status === 'ARCHIVED')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">お問い合わせ管理</h1>
              <p className="text-gray-600 mt-1">
                ユーザーからのお問い合わせを管理・対応します
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                新規: {newInquiries.length}
              </Badge>
              <Badge variant="warning" className="text-lg px-4 py-2">
                対応中: {inProgressInquiries.length}
              </Badge>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="件名、送信者名、メールアドレスで検索"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="カテゴリー" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="general">一般</SelectItem>
                  <SelectItem value="technical">技術</SelectItem>
                  <SelectItem value="payment">支払い</SelectItem>
                  <SelectItem value="campaign">案件</SelectItem>
                  <SelectItem value="complaint">クレーム</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="NEW">新規</SelectItem>
                  <SelectItem value="IN_PROGRESS">対応中</SelectItem>
                  <SelectItem value="RESOLVED">解決済み</SelectItem>
                  <SelectItem value="ARCHIVED">アーカイブ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inquiries Table */}
        <Card>
          <CardHeader>
            <CardTitle>お問い合わせ一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">すべて ({filteredInquiries.length})</TabsTrigger>
                <TabsTrigger value="new">新規 ({newInquiries.length})</TabsTrigger>
                <TabsTrigger value="in_progress">対応中 ({inProgressInquiries.length})</TabsTrigger>
                <TabsTrigger value="resolved">完了 ({resolvedInquiries.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <InquiryTable 
                  inquiries={filteredInquiries}
                  onView={(inquiry) => {
                    setSelectedInquiry(inquiry)
                    setIsDetailOpen(true)
                  }}
                  onStatusChange={handleStatusChange}
                />
              </TabsContent>

              <TabsContent value="new">
                <InquiryTable 
                  inquiries={newInquiries}
                  onView={(inquiry) => {
                    setSelectedInquiry(inquiry)
                    setIsDetailOpen(true)
                  }}
                  onStatusChange={handleStatusChange}
                />
              </TabsContent>

              <TabsContent value="in_progress">
                <InquiryTable 
                  inquiries={inProgressInquiries}
                  onView={(inquiry) => {
                    setSelectedInquiry(inquiry)
                    setIsDetailOpen(true)
                  }}
                  onStatusChange={handleStatusChange}
                />
              </TabsContent>

              <TabsContent value="resolved">
                <InquiryTable 
                  inquiries={resolvedInquiries}
                  onView={(inquiry) => {
                    setSelectedInquiry(inquiry)
                    setIsDetailOpen(true)
                  }}
                  onStatusChange={handleStatusChange}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Inquiry Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-3xl">
            {selectedInquiry && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl flex items-center justify-between">
                    <span>{selectedInquiry.subject}</span>
                    <div className="flex gap-2">
                      {getStatusBadge(selectedInquiry.status)}
                      {getPriorityBadge(selectedInquiry.priority)}
                    </div>
                  </DialogTitle>
                  <DialogDescription>
                    問い合わせ ID: #{selectedInquiry.id}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  {/* Sender Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      {selectedInquiry.senderType === 'publisher' ? (
                        <User className="h-4 w-4 mr-2" />
                      ) : (
                        <Building className="h-4 w-4 mr-2" />
                      )}
                      送信者情報
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">名前:</span> {selectedInquiry.senderName}
                      </div>
                      <div>
                        <span className="text-gray-600">メール:</span> {selectedInquiry.senderEmail}
                      </div>
                      {selectedInquiry.companyName && (
                        <div>
                          <span className="text-gray-600">会社名:</span> {selectedInquiry.companyName}
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">種別:</span> {selectedInquiry.senderType === 'publisher' ? 'アフィリエイター' : '広告主'}
                      </div>
                      <div>
                        <span className="text-gray-600">カテゴリー:</span> {getCategoryLabel(selectedInquiry.category)}
                      </div>
                      <div>
                        <span className="text-gray-600">受信日時:</span> {new Date(selectedInquiry.createdAt).toLocaleString('ja-JP')}
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <h4 className="font-medium mb-2">メッセージ</h4>
                    <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
                      {selectedInquiry.message}
                    </div>
                  </div>

                  {/* Assignee */}
                  {selectedInquiry.assignee && (
                    <div>
                      <h4 className="font-medium mb-2">担当者</h4>
                      <p className="text-sm">{selectedInquiry.assignee}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={() => {
                        setIsDetailOpen(false)
                        setIsReplyOpen(true)
                      }}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      返信する
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleStatusChange(selectedInquiry.id, 'IN_PROGRESS')}
                      disabled={selectedInquiry.status !== 'NEW'}
                    >
                      対応開始
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleStatusChange(selectedInquiry.id, 'RESOLVED')}
                      disabled={selectedInquiry.status === 'RESOLVED' || selectedInquiry.status === 'ARCHIVED'}
                    >
                      解決済みにする
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleStatusChange(selectedInquiry.id, 'ARCHIVED')}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      アーカイブ
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Reply Dialog */}
        <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>返信を作成</DialogTitle>
              <DialogDescription>
                {selectedInquiry && `${selectedInquiry.senderName}様への返信`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label>宛先</Label>
                <p className="text-sm text-gray-600">
                  {selectedInquiry?.senderEmail}
                </p>
              </div>

              <div>
                <Label>件名</Label>
                <p className="text-sm text-gray-600">
                  Re: {selectedInquiry?.subject}
                </p>
              </div>

              <div>
                <Label htmlFor="reply">返信内容</Label>
                <Textarea
                  id="reply"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={10}
                  placeholder="返信内容を入力してください..."
                  className="mt-2"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReplyOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleReply} disabled={!replyMessage}>
                <Send className="h-4 w-4 mr-2" />
                送信
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Inquiry Table Component
function InquiryTable({ 
  inquiries, 
  onView, 
  onStatusChange 
}: { 
  inquiries: Inquiry[], 
  onView: (inquiry: Inquiry) => void,
  onStatusChange: (id: string, status: string) => void
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ステータス</TableHead>
            <TableHead>優先度</TableHead>
            <TableHead>送信者</TableHead>
            <TableHead>件名</TableHead>
            <TableHead>カテゴリー</TableHead>
            <TableHead>受信日時</TableHead>
            <TableHead>アクション</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.map((inquiry) => (
            <TableRow key={inquiry.id}>
              <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
              <TableCell>{getPriorityBadge(inquiry.priority)}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{inquiry.senderName}</p>
                  <p className="text-sm text-gray-500">
                    {inquiry.senderType === 'publisher' ? 'アフィリエイター' : '広告主'}
                  </p>
                </div>
              </TableCell>
              <TableCell className="max-w-[300px]">
                <p className="truncate">{inquiry.subject}</p>
              </TableCell>
              <TableCell>{getCategoryLabel(inquiry.category)}</TableCell>
              <TableCell className="text-sm">
                {new Date(inquiry.createdAt).toLocaleString('ja-JP')}
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onView(inquiry)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  詳細
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'NEW':
      return <Badge variant="destructive" className="flex items-center gap-1 w-fit">
        <AlertCircle className="h-3 w-3" />
        新規
      </Badge>
    case 'IN_PROGRESS':
      return <Badge variant="warning" className="flex items-center gap-1 w-fit">
        <Clock className="h-3 w-3" />
        対応中
      </Badge>
    case 'RESOLVED':
      return <Badge variant="success" className="flex items-center gap-1 w-fit">
        <CheckCircle className="h-3 w-3" />
        解決済み
      </Badge>
    case 'ARCHIVED':
      return <Badge variant="secondary" className="w-fit">アーカイブ</Badge>
    default:
      return null
  }
}

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    general: '一般',
    technical: '技術',
    payment: '支払い',
    billing: '請求',
    campaign: '案件',
    performance: '成果',
    complaint: 'クレーム',
    proposal: '提案',
    other: 'その他'
  }
  return labels[category] || category
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'HIGH':
      return <Badge variant="destructive" className="w-fit">高</Badge>
    case 'MEDIUM':
      return <Badge variant="warning" className="w-fit">中</Badge>
    case 'LOW':
      return <Badge variant="secondary" className="w-fit">低</Badge>
    default:
      return null
  }
}