'use client'

import { useState } from 'react'
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
  
  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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

  return (
    <div className="py-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">システム設定</h1>
              <p className="text-gray-600 mt-1">
                アプリケーションの設定を管理します
              </p>
            </div>
            <Button 
              onClick={handleSaveSettings}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? '保存中...' : '設定を保存'}
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="general">
              <Settings className="mr-2 h-4 w-4" />
              一般設定
            </TabsTrigger>
            <TabsTrigger value="commission">
              <CreditCard className="mr-2 h-4 w-4" />
              報酬設定
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="mr-2 h-4 w-4" />
              メール設定
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              通知設定
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              セキュリティ
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>一般設定</CardTitle>
                <CardDescription>
                  サイトの基本的な設定を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="site-name">サイト名</Label>
                  <Input
                    id="site-name"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="site-description">サイト説明</Label>
                  <Textarea
                    id="site-description"
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    rows={3}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact-email">お問い合わせメールアドレス</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div className="flex items-center justify-between py-4 border-t">
                  <div>
                    <Label htmlFor="maintenance-mode">メンテナンスモード</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      有効にすると、管理者以外のアクセスを制限します
                    </p>
                  </div>
                  <Switch
                    id="maintenance-mode"
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commission Settings */}
          <TabsContent value="commission">
            <Card>
              <CardHeader>
                <CardTitle>報酬設定</CardTitle>
                <CardDescription>
                  デフォルトの報酬率や支払い条件を設定します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="default-commission">デフォルト報酬率 (%)</Label>
                  <Input
                    id="default-commission"
                    type="number"
                    value={defaultCommission}
                    onChange={(e) => setDefaultCommission(e.target.value)}
                    min="0"
                    max="100"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="minimum-payout">最低支払い金額 (円)</Label>
                  <Input
                    id="minimum-payout"
                    type="number"
                    value={minimumPayout}
                    onChange={(e) => setMinimumPayout(e.target.value)}
                    min="0"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="payout-cycle">支払いサイクル</Label>
                  <select
                    id="payout-cycle"
                    value={payoutCycle}
                    onChange={(e) => setPayoutCycle(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border rounded-md"
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
              <CardHeader>
                <CardTitle>メール設定</CardTitle>
                <CardDescription>
                  システムメールの送信設定を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="smtp-host">SMTPホスト</Label>
                  <Input
                    id="smtp-host"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="smtp-port">SMTPポート</Label>
                  <Input
                    id="smtp-port"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="smtp-user">SMTPユーザー名</Label>
                  <Input
                    id="smtp-user"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="smtp-password">SMTPパスワード</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>通知設定</CardTitle>
                <CardDescription>
                  管理者通知の設定を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-4">
                  <div>
                    <Label htmlFor="email-notifications">メール通知</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      重要な通知をメールで受け取る
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between py-4 border-t">
                  <div>
                    <Label htmlFor="new-user-notifications">新規ユーザー通知</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      新規ユーザー登録時に通知を受け取る
                    </p>
                  </div>
                  <Switch
                    id="new-user-notifications"
                    checked={newUserNotifications}
                    onCheckedChange={setNewUserNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between py-4 border-t">
                  <div>
                    <Label htmlFor="conversion-notifications">コンバージョン通知</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      新規コンバージョン発生時に通知を受け取る
                    </p>
                  </div>
                  <Switch
                    id="conversion-notifications"
                    checked={conversionNotifications}
                    onCheckedChange={setConversionNotifications}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>セキュリティ設定</CardTitle>
                <CardDescription>
                  システムのセキュリティ設定を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    セキュリティ設定の変更は慎重に行ってください。
                    不適切な設定はシステムの脆弱性につながる可能性があります。
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <Label>二要素認証を必須にする</Label>
                      <p className="text-sm text-gray-500 mt-1">
                        全ユーザーに二要素認証の設定を要求します
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-t">
                    <div>
                      <Label>IPアドレス制限</Label>
                      <p className="text-sm text-gray-500 mt-1">
                        管理画面へのアクセスをIPアドレスで制限します
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-t">
                    <div>
                      <Label>ログイン試行回数制限</Label>
                      <p className="text-sm text-gray-500 mt-1">
                        連続したログイン失敗でアカウントをロックします
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  )
}