'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Users, Eye, EyeOff, ArrowLeft, Globe, User, Mail, FileText } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function PublisherRegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    siteUrl: '',
    siteDescription: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      
      router.push('/publisher-login')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
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
              <Badge className="bg-green-100 text-green-800 flex items-center space-x-1 w-fit">
                <Users className="h-3 w-3" />
                <span className="text-xs">アフィリエイター登録</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* 登録フォーム */}
        <Card className="border-green-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">アフィリエイター登録</CardTitle>
            <CardDescription className="text-center">
              必要事項を入力して、アフィリエイターとして登録申請を行ってください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>お名前（ハンドルネーム可） <span className="text-red-500">*</span></span>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="田中太郎"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-green-500"
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
                  placeholder="affiliate@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="siteUrl" className="text-sm font-medium flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span>運営サイトURL <span className="text-red-500">*</span></span>
                </label>
                <Input
                  id="siteUrl"
                  name="siteUrl"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.siteUrl}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="siteDescription" className="text-sm font-medium flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>サイト概要 <span className="text-red-500">*</span></span>
                </label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  placeholder="サイトのジャンルや内容、月間PVなどを記載してください"
                  value={formData.siteDescription}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="border-gray-300 focus:border-green-500"
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
                    className="border-gray-300 focus:border-green-500 pr-10"
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
                    className="border-gray-300 focus:border-green-500 pr-10"
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
                  <Link href="/terms" className="text-green-600 hover:underline">利用規約</Link>と
                  <Link href="/privacy" className="text-green-600 hover:underline">プライバシーポリシー</Link>
                  に同意します
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>登録処理中...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>アフィリエイターとして登録申請</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                すでにアカウントをお持ちの場合
              </p>
              <Link
                href="/publisher-login"
                className="text-sm text-green-600 hover:text-green-800 underline"
              >
                ログインはこちら
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* アフィリエイター登録のメリット */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span>アフィリエイター登録のメリット</span>
            </h3>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>• 高単価案件への参加が可能</li>
              <li>• リアルタイムな成果確認</li>
              <li>• 豊富な広告素材の提供</li>
              <li>• 安定した報酬支払い</li>
              <li>• 専任担当者によるサポート</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}