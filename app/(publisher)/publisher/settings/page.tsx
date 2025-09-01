'use client'

import { useState, useEffect } from 'react'
import { PageLoading } from '@/components/ui/loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { 
  User, 
  Bell, 
  CreditCard, 
  Shield, 
  Save,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe
} from 'lucide-react'
import { useLoading } from '@/contexts/loading-context'
import { useNavigation } from '@/hooks/use-navigation'

export default function PublisherSettingsPage() {
  const { toast } = useToast()
  const { setLoading } = useLoading()
  const { navigateWithLoading } = useNavigation()
  const [isSaving, setIsSaving] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const handleSave = () => {
    setIsSaving(true)
    setLoading(true)
    setTimeout(() => {
      toast({
        title: "設定を保存しました",
        description: "変更内容が正常に保存されました。",
      })
      setIsSaving(false)
      setLoading(false)
    }, 1500)
  }

  if (isPageLoading) {
    return <PageLoading text="設定を読み込んでいます..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">設定</h1>
          <p className="text-gray-600 mt-1">
            アカウント情報や通知設定を管理します
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="profile">プロフィール</TabsTrigger>
            <TabsTrigger value="payment">支払い情報</TabsTrigger>
            <TabsTrigger value="notifications">通知設定</TabsTrigger>
            <TabsTrigger value="security">セキュリティ</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  プロフィール設定
                </CardTitle>
                <CardDescription>
                  基本的なアカウント情報を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">氏名</Label>
                    <Input id="name" defaultValue="アフィリエイトパートナー" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input id="email" type="email" defaultValue="publisher@tyokudori.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">電話番号</Label>
                    <Input id="phone" type="tel" placeholder="090-1234-5678" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">ウェブサイト</Label>
                    <Input id="website" type="url" placeholder="https://example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">自己紹介</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="あなたのサイトやアフィリエイト活動について教えてください"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">主な活動カテゴリー</Label>
                  <Select defaultValue="blog">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog">ブログ</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="website">ウェブサイト</SelectItem>
                      <SelectItem value="other">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving} size="sm" className="h-7">
                      {isSaving ? (
                        <span className="flex items-center text-xs">
                          <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></span>
                          保存中...
                        </span>
                      ) : (
                        <span className="flex items-center text-xs">
                          <Save className="mr-1 h-3 w-3" />
                          変更を保存
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  支払い情報
                </CardTitle>
                <CardDescription>
                  報酬の振込先情報を設定します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank">銀行名</Label>
                    <Input id="bank" placeholder="○○銀行" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">支店名</Label>
                    <Input id="branch" placeholder="○○支店" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountType">口座種別</Label>
                    <Select defaultValue="normal">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">普通</SelectItem>
                        <SelectItem value="current">当座</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">口座番号</Label>
                    <Input id="accountNumber" placeholder="1234567" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="accountName">口座名義（カナ）</Label>
                    <Input id="accountName" placeholder="ヤマダ タロウ" />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    報酬は月末締め、翌月末払いとなります。
                    最低支払金額は5,000円です。
                  </p>
                </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving} size="sm" className="h-7">
                      {isSaving ? (
                        <span className="flex items-center text-xs">
                          <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></span>
                          保存中...
                        </span>
                      ) : (
                        <span className="flex items-center text-xs">
                          <Save className="mr-1 h-3 w-3" />
                          変更を保存
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  通知設定
                </CardTitle>
                <CardDescription>
                  メール通知の設定を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>成果発生通知</Label>
                      <p className="text-sm text-gray-500">
                        成果が発生した時にメール通知を受け取る
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>成果承認通知</Label>
                      <p className="text-sm text-gray-500">
                        成果が承認された時にメール通知を受け取る
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>新規案件通知</Label>
                      <p className="text-sm text-gray-500">
                        新しい案件が追加された時に通知を受け取る
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>月次レポート</Label>
                      <p className="text-sm text-gray-500">
                        月次の成果レポートをメールで受け取る
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>お知らせメール</Label>
                      <p className="text-sm text-gray-500">
                        システムからのお知らせを受け取る
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving} size="sm" className="h-7">
                      {isSaving ? (
                        <span className="flex items-center text-xs">
                          <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></span>
                          保存中...
                        </span>
                      ) : (
                        <span className="flex items-center text-xs">
                          <Save className="mr-1 h-3 w-3" />
                          変更を保存
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  セキュリティ設定
                </CardTitle>
                <CardDescription>
                  アカウントのセキュリティを管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">現在のパスワード</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">新しいパスワード</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">新しいパスワード（確認）</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">ログイン履歴</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>2024-02-15 10:30:00</span>
                      <span className="text-gray-500">Chrome - 東京</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2024-02-14 15:45:00</span>
                      <span className="text-gray-500">Safari - 大阪</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2024-02-13 09:15:00</span>
                      <span className="text-gray-500">Chrome - 東京</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? '保存中...' : 'パスワードを変更'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}