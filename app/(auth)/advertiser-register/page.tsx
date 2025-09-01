'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Briefcase, Eye, EyeOff, ArrowLeft, Building2, User, Mail, Phone } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import PageLoading from '@/components/ui/loading'

export default function AdvertiserRegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [formData, setFormData] = useState({
    companyName: '',
    representativeName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'エラー',
        description: 'パスワードが一致しません。',
        variant: 'destructive'
      })
      return
    }

    if (!agreeToTerms) {
      toast({
        title: 'エラー',
        description: '利用規約に同意してください。',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)

    try {
      // 実際の登録処理をここに実装
      // 仮の処理
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: '登録申請を受け付けました',
        description: '審査完了後、メールでご連絡いたします。'
      })
      
      router.push('/advertiser-login')
    } catch (error) {
      toast({
        title: '登録失敗',
        description: error instanceof Error ? error.message : '登録に失敗しました。',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isPageLoading) {
    return <PageLoading text="登録ページを読み込んでいます..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* ロゴとブランド名 */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">トップに戻る</span>
          </Link>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">tyokudori</h1>
              <Badge className="bg-blue-100 text-blue-800 flex items-center space-x-1 w-fit">
                <Briefcase className="h-3 w-3" />
                <span className="text-xs">広告主登録</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* 登録フォーム */}
        <Card className="border-blue-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">広告主アカウント登録</CardTitle>
            <CardDescription className="text-center">
              必要事項を入力して、広告主として登録申請を行ってください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="companyName" className="text-sm font-medium flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span>会社名 <span className="text-red-500">*</span></span>
                </label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="株式会社サンプル"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="representativeName" className="text-sm font-medium flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>担当者名 <span className="text-red-500">*</span></span>
                </label>
                <Input
                  id="representativeName"
                  name="representativeName"
                  type="text"
                  placeholder="山田太郎"
                  value={formData.representativeName}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>メールアドレス <span className="text-red-500">*</span></span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>電話番号</span>
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="03-1234-5678"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  パスワード <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="8文字以上で入力"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={8}
                    className="border-gray-300 focus:border-blue-500 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  パスワード（確認） <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="パスワードを再入力"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    minLength={8}
                    className="border-gray-300 focus:border-blue-500 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <Link href="/terms" className="text-blue-600 hover:underline">利用規約</Link>と
                  <Link href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>
                  に同意します
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>登録処理中...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span>広告主として登録申請</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                すでにアカウントをお持ちの場合
              </p>
              <Link
                href="/advertiser-login"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                ログインはこちら
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 広告主登録のメリット */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <span>広告主登録のメリット</span>
            </h3>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>• 効果的なアフィリエイト広告の配信</li>
              <li>• 成果報酬型で無駄のない広告運用</li>
              <li>• リアルタイムな成果レポート</li>
              <li>• 優良アフィリエイターとのマッチング</li>
              <li>• 専任サポートによる運用支援</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}