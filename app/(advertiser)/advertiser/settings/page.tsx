'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageLoading } from '@/components/ui/loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  Bell, 
  Shield, 
  CreditCard,
  Key,
  AlertCircle,
  Save,
  Lock
} from 'lucide-react'
import { useLoading } from '@/contexts/loading-context'
import { useNavigation } from '@/hooks/use-navigation'

interface ProfileData {
  companyName: string
  representativeName: string
  email: string
  phone: string
  website: string
  address: string
  zipCode: string
}

interface NotificationSettings {
  emailNotifications: boolean
  newConversions: boolean
  dailyReport: boolean
  weeklyReport: boolean
  monthlyReport: boolean
  campaignAlerts: boolean
  systemUpdates: boolean
}

interface PaymentInfo {
  bankName: string
  branchName: string
  accountType: 'normal' | 'current'
  accountNumber: string
  accountHolder: string
}

export default function AdvertiserSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { setLoading } = useLoading()
  const { navigateWithLoading } = useNavigation()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)

  // Form states
  const [profileData, setProfileData] = useState<ProfileData>({
    companyName: '株式会社サンプル',
    representativeName: '山田 太郎',
    email: 'advertiser@example.com',
    phone: '03-1234-5678',
    website: 'https://example.com',
    address: '東京都千代田区大手町1-1-1',
    zipCode: '100-0004'
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    newConversions: true,
    dailyReport: false,
    weeklyReport: true,
    monthlyReport: true,
    campaignAlerts: true,
    systemUpdates: true
  })

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    bankName: 'みずほ銀行',
    branchName: '東京営業部',
    accountType: 'normal',
    accountNumber: '1234567',
    accountHolder: 'カ）サンプル'
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Initial page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: '保存しました',
        description: 'プロフィール情報を更新しました。'
      })
      setIsSaving(false)
      setLoading(false)
    }, 1000)
  }

  const handleNotificationUpdate = async () => {
    setIsSaving(true)
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: '保存しました',
        description: '通知設定を更新しました。'
      })
      setIsSaving(false)
      setLoading(false)
    }, 1000)
  }

  const handlePaymentUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: '保存しました',
        description: '振込先情報を更新しました。'
      })
      setIsSaving(false)
      setLoading(false)
    }, 1000)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'エラー',
        description: '新しいパスワードが一致しません。',
        variant: 'destructive'
      })
      return
    }

    setIsSaving(true)
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: '更新しました',
        description: 'パスワードを変更しました。'
      })
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setIsSaving(false)
      setLoading(false)
    }, 1000)
  }

  if (isPageLoading) {
    return <PageLoading text="設定を読み込んでいます..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-3 py-3">

        {/* Page Header */}
        <div className="bg-white rounded shadow-sm border p-2 mb-2">
          <h1 className="text-sm font-bold text-gray-900">アカウント設定</h1>
        </div>

        {/* Settings Tabs */}
        <Card>
          <CardContent className="p-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-8 w-full">
                <TabsTrigger value="profile" className="text-xs flex-1">
                  <User className="mr-1 h-3 w-3" />
                  プロフィール
                </TabsTrigger>
                <TabsTrigger value="notifications" className="text-xs flex-1">
                  <Bell className="mr-1 h-3 w-3" />
                  通知設定
                </TabsTrigger>
                <TabsTrigger value="payment" className="text-xs flex-1">
                  <CreditCard className="mr-1 h-3 w-3" />
                  振込先
                </TabsTrigger>
                <TabsTrigger value="security" className="text-xs flex-1">
                  <Shield className="mr-1 h-3 w-3" />
                  セキュリティ
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-3">
                <form onSubmit={handleProfileUpdate} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="companyName" className="text-xs">会社名</Label>
                      <Input
                        id="companyName"
                        value={profileData.companyName}
                        onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                        className="h-8 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="representativeName" className="text-xs">代表者名</Label>
                      <Input
                        id="representativeName"
                        value={profileData.representativeName}
                        onChange={(e) => setProfileData({ ...profileData, representativeName: e.target.value })}
                        className="h-8 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-xs">メールアドレス</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="h-8 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-xs">電話番号</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="h-8 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="website" className="text-xs">ウェブサイト</Label>
                      <Input
                        id="website"
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="zipCode" className="text-xs">郵便番号</Label>
                      <Input
                        id="zipCode"
                        value={profileData.zipCode}
                        onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                        className="h-8 text-sm"
                        placeholder="100-0004"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <Label htmlFor="address" className="text-xs">住所</Label>
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" disabled={isSaving} className="h-7">
                      {isSaving ? (
                        <span className="flex items-center text-xs">
                          <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></span>
                          保存中...
                        </span>
                      ) : (
                        <span className="flex items-center text-xs">
                          <Save className="mr-1 h-3 w-3" />
                          保存する
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="mt-3 space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">メール通知</div>
                      <div className="text-xs text-gray-500">メールで通知を受け取る</div>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                      }
                    />
                  </div>
                  
                  <div className="ml-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs">新規成果通知</div>
                      <Switch
                        checked={notificationSettings.newConversions}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({ ...notificationSettings, newConversions: checked })
                        }
                        disabled={!notificationSettings.emailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs">日次レポート</div>
                      <Switch
                        checked={notificationSettings.dailyReport}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({ ...notificationSettings, dailyReport: checked })
                        }
                        disabled={!notificationSettings.emailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs">週次レポート</div>
                      <Switch
                        checked={notificationSettings.weeklyReport}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({ ...notificationSettings, weeklyReport: checked })
                        }
                        disabled={!notificationSettings.emailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs">月次レポート</div>
                      <Switch
                        checked={notificationSettings.monthlyReport}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({ ...notificationSettings, monthlyReport: checked })
                        }
                        disabled={!notificationSettings.emailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs">案件アラート</div>
                      <Switch
                        checked={notificationSettings.campaignAlerts}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({ ...notificationSettings, campaignAlerts: checked })
                        }
                        disabled={!notificationSettings.emailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs">システム更新情報</div>
                      <Switch
                        checked={notificationSettings.systemUpdates}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({ ...notificationSettings, systemUpdates: checked })
                        }
                        disabled={!notificationSettings.emailNotifications}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleNotificationUpdate} size="sm" disabled={isSaving} className="h-7">
                    {isSaving ? (
                      <span className="flex items-center text-xs">
                        <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></span>
                        保存中...
                      </span>
                    ) : (
                      <span className="flex items-center text-xs">
                        <Save className="mr-1 h-3 w-3" />
                        保存する
                      </span>
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Payment Tab */}
              <TabsContent value="payment" className="mt-3">
                <form onSubmit={handlePaymentUpdate} className="space-y-3">
                  <div className="bg-amber-50 border border-amber-200 rounded p-2">
                    <div className="flex">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="ml-2">
                        <h4 className="text-xs font-medium text-amber-900">重要</h4>
                        <p className="mt-0.5 text-xs text-amber-700">
                          振込先情報の変更後、確認のためお支払いが一時停止される場合があります。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="bankName" className="text-xs">銀行名</Label>
                      <Input
                        id="bankName"
                        value={paymentInfo.bankName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, bankName: e.target.value })}
                        className="h-8 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="branchName" className="text-xs">支店名</Label>
                      <Input
                        id="branchName"
                        value={paymentInfo.branchName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, branchName: e.target.value })}
                        className="h-8 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="accountType" className="text-xs">口座種別</Label>
                      <Select
                        value={paymentInfo.accountType}
                        onValueChange={(value: 'normal' | 'current') => 
                          setPaymentInfo({ ...paymentInfo, accountType: value })
                        }
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">普通</SelectItem>
                          <SelectItem value="current">当座</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="accountNumber" className="text-xs">口座番号</Label>
                      <Input
                        id="accountNumber"
                        value={paymentInfo.accountNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, accountNumber: e.target.value })}
                        className="h-8 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <Label htmlFor="accountHolder" className="text-xs">口座名義（カナ）</Label>
                      <Input
                        id="accountHolder"
                        value={paymentInfo.accountHolder}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, accountHolder: e.target.value })}
                        className="h-8 text-sm"
                        placeholder="カ）サンプル"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" size="sm" disabled={isSaving} className="h-7">
                      {isSaving ? (
                        <span className="flex items-center text-xs">
                          <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></span>
                          保存中...
                        </span>
                      ) : (
                        <span className="flex items-center text-xs">
                          <Save className="mr-1 h-3 w-3" />
                          保存する
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="mt-3">
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm flex items-center">
                        <Key className="mr-1.5 h-4 w-4" />
                        パスワード変更
                      </CardTitle>
                      <CardDescription className="text-xs">
                        定期的なパスワード変更を推奨します
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3">
                      <form onSubmit={handlePasswordChange} className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="currentPassword" className="text-xs">現在のパスワード</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="h-8 text-sm"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="newPassword" className="text-xs">新しいパスワード</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="h-8 text-sm"
                            required
                          />
                          <p className="text-xs text-gray-500">8文字以上、英数字を含む</p>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="confirmPassword" className="text-xs">新しいパスワード（確認）</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="h-8 text-sm"
                            required
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" size="sm" disabled={isSaving} className="h-7">
                            {isSaving ? (
                              <span className="flex items-center text-xs">
                                <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></span>
                                更新中...
                              </span>
                            ) : (
                              <span className="flex items-center text-xs">
                                <Lock className="mr-1 h-3 w-3" />
                                パスワード変更
                              </span>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm flex items-center">
                        <Shield className="mr-1.5 h-4 w-4" />
                        二段階認証
                      </CardTitle>
                      <CardDescription className="text-xs">
                        アカウントのセキュリティを強化します
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="text-sm">二段階認証</div>
                          <div className="text-xs text-gray-500">未設定</div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7">
                          <span className="text-xs">設定する</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}