'use client'

import { useState, useEffect } from 'react'
import { PageLoading } from '@/components/ui/loading'
import { useLoading } from '@/contexts/loading-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Bell, Shield, CreditCard, Globe, Mail, Save } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const { setLoading } = useLoading()
  const [isLoading, setIsLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  
  // General settings
  const [siteName, setSiteName] = useState('チョクドリ')
  const [siteDescription, setSiteDescription] = useState('信頼できるアフィリエイトプラットフォーム')
  const [contactEmail, setContactEmail] = useState('support@tyokudori.com')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  
  // Commission settings
  const [defaultCommission, setDefaultCommission] = useState('10')
  const [minimumPayout, setMinimumPayout] = useState('5000')
  const [payoutCycle, setPayoutCycle] = useState('monthly')
  
  // Email settings
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com')
  const [smtpPort, setSmtpPort] = useState('587')
  const [smtpUser, setSmtpUser] = useState('')
  const [smtpPassword, setSmtpPassword] = useState('')
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [newUserNotifications, setNewUserNotifications] = useState(true)
  const [conversionNotifications, setConversionNotifications] = useState(true)

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
  }, [])
  
  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 50))
      
      toast({
        title: "設定を保存しました",
        description: "変更が正常に保存されました。",
      })
    } catch (error) {
      toast({
        title: "エラー",
        description: "設定の保存に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return <PageLoading text="システム設定を読み込んでいます..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-3 py-3">
        {/* Page Header */}
        <div className="bg-white rounded shadow-sm border p-2 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-gray-900">システム設定</h1>
            </div>
            <Button 
              onClick={handleSaveSettings}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs"
            >
              <Save className="mr-1 h-3 w-3" />
              {loading ? '保存中...' : '設定を保存'}
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-3">
          <TabsList className="bg-white border h-8">
            <TabsTrigger value="general" className="text-xs px-2 py-1">
              <Settings className="mr-1 h-3 w-3" />
              一般設定
            </TabsTrigger>
            <TabsTrigger value="commission" className="text-xs px-2 py-1">
              <CreditCard className="mr-1 h-3 w-3" />
              報酬設定
            </TabsTrigger>
            <TabsTrigger value="email" className="text-xs px-2 py-1">
              <Mail className="mr-1 h-3 w-3" />
              メール設定
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs px-2 py-1">
              <Bell className="mr-1 h-3 w-3" />
              通知設定
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs px-2 py-1">
              <Shield className="mr-1 h-3 w-3" />
              セキュリティ
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm">一般設定</CardTitle>
                <CardDescription className="text-xs">
                  サイトの基本的な設定を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div>
                  <Label htmlFor="site-name" className="text-sm">サイト名</Label>
                  <Input
                    id="site-name"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
                
                <div>
                  <Label htmlFor="site-description" className="text-sm">サイト説明</Label>
                  <Textarea
                    id="site-description"
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    rows={2}
                    className="mt-1 text-xs"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact-email" className="text-sm">お問い合わせメールアドレス</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
                
                <div className="flex items-center justify-between py-2 border-t">
                  <div>
                    <Label htmlFor="maintenance-mode" className="text-sm">メンテナンスモード</Label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      有効にすると、管理者以外のアクセスを制限します
                    </p>
                  </div>
                  <Switch
                    id="maintenance-mode"
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                    className="h-4 w-8"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commission Settings */}
          <TabsContent value="commission">
            <Card>
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm">報酬設定</CardTitle>
                <CardDescription className="text-xs">
                  デフォルトの報酬率や支払い条件を設定します
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div>
                  <Label htmlFor="default-commission" className="text-sm">デフォルト報酬率 (%)</Label>
                  <Input
                    id="default-commission"
                    type="number"
                    value={defaultCommission}
                    onChange={(e) => setDefaultCommission(e.target.value)}
                    min="0"
                    max="100"
                    className="mt-1 h-8 text-xs"
                  />
                </div>
                
                <div>
                  <Label htmlFor="minimum-payout" className="text-sm">最低支払い金額 (円)</Label>
                  <Input
                    id="minimum-payout"
                    type="number"
                    value={minimumPayout}
                    onChange={(e) => setMinimumPayout(e.target.value)}
                    min="0"
                    className="mt-1 h-8 text-xs"
                  />
                </div>
                
                <div>
                  <Label htmlFor="payout-cycle" className="text-sm">支払いサイクル</Label>
                  <select
                    id="payout-cycle"
                    value={payoutCycle}
                    onChange={(e) => setPayoutCycle(e.target.value)}
                    className="mt-1 w-full px-2 py-1.5 h-8 text-xs border rounded-md"
                  >
                    <option value="weekly">週次</option>
                    <option value="biweekly">隔週</option>
                    <option value="monthly">月次</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email">
            <Card>
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm">メール設定</CardTitle>
                <CardDescription className="text-xs">
                  システムメールの送信設定を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div>
                  <Label htmlFor="smtp-host" className="text-sm">SMTPホスト</Label>
                  <Input
                    id="smtp-host"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
                
                <div>
                  <Label htmlFor="smtp-port" className="text-sm">SMTPポート</Label>
                  <Input
                    id="smtp-port"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
                
                <div>
                  <Label htmlFor="smtp-user" className="text-sm">SMTPユーザー名</Label>
                  <Input
                    id="smtp-user"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
                
                <div>
                  <Label htmlFor="smtp-password" className="text-sm">SMTPパスワード</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm">通知設定</CardTitle>
                <CardDescription className="text-xs">
                  管理者通知の設定を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="email-notifications" className="text-sm">メール通知</Label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      重要な通知をメールで受け取る
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    className="h-4 w-8"
                  />
                </div>
                
                <div className="flex items-center justify-between py-2 border-t">
                  <div>
                    <Label htmlFor="new-user-notifications" className="text-sm">新規ユーザー通知</Label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      新規ユーザー登録時に通知を受け取る
                    </p>
                  </div>
                  <Switch
                    id="new-user-notifications"
                    checked={newUserNotifications}
                    onCheckedChange={setNewUserNotifications}
                    className="h-4 w-8"
                  />
                </div>
                
                <div className="flex items-center justify-between py-2 border-t">
                  <div>
                    <Label htmlFor="conversion-notifications" className="text-sm">コンバージョン通知</Label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      新規コンバージョン発生時に通知を受け取る
                    </p>
                  </div>
                  <Switch
                    id="conversion-notifications"
                    checked={conversionNotifications}
                    onCheckedChange={setConversionNotifications}
                    className="h-4 w-8"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm">セキュリティ設定</CardTitle>
                <CardDescription className="text-xs">
                  システムのセキュリティ設定を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    セキュリティ設定の変更は慎重に行ってください。
                    不適切な設定はシステムの脆弱性につながる可能性があります。
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label className="text-sm">二要素認証を必須にする</Label>
                      <p className="text-xs text-gray-500 mt-0.5">
                        全ユーザーに二要素認証の設定を要求します
                      </p>
                    </div>
                    <Switch className="h-4 w-8" />
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t">
                    <div>
                      <Label className="text-sm">IPアドレス制限</Label>
                      <p className="text-xs text-gray-500 mt-0.5">
                        管理画面へのアクセスをIPアドレスで制限します
                      </p>
                    </div>
                    <Switch className="h-4 w-8" />
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t">
                    <div>
                      <Label className="text-sm">ログイン試行回数制限</Label>
                      <p className="text-xs text-gray-500 mt-0.5">
                        連続したログイン失敗でアカウントをロックします
                      </p>
                    </div>
                    <Switch className="h-4 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}