'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 実際の認証処理をここに実装
      // 仮の処理
      if (email && password) {
        toast({
          title: 'ログイン成功',
          description: '管理者ダッシュボードにリダイレクトします。'
        })
        router.push('/admin')
      } else {
        throw new Error('メールアドレスとパスワードを入力してください')
      }
    } catch (error) {
      toast({
        title: 'ログイン失敗',
        description: error instanceof Error ? error.message : 'ログインに失敗しました。',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[1400px] mx-auto flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* ロゴとブランド名 */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">トップに戻る</span>
          </Link>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">tyokudori</h1>
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200 flex items-center space-x-1 w-fit">
                <Shield className="h-3 w-3" />
                <span className="text-xs">管理者ログイン</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* ログインフォーム */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">管理者ログイン</CardTitle>
            <CardDescription className="text-center">
              システム管理者としてログインしてください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  メールアドレス
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@tyokudori.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  パスワード
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="パスワードを入力"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
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
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>ログイン中...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>管理者としてログイン</span>
                  </div>
                )}
              </Button>
            </form>

            {/* テスト用認証情報 */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-3 font-medium">テスト用アカウント（クリックで入力）:</p>
              <div className="space-y-2">
                <button
                  type="button"
                  className="w-full text-left p-2 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setEmail('admin@tyokudori.com')
                    setPassword('admin123')
                  }}
                >
                  <div className="font-mono">
                    <div><span className="text-gray-500">ID:</span> admin@tyokudori.com</div>
                    <div><span className="text-gray-500">PW:</span> admin123</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                他の権限でのログインをお探しの場合
              </p>
              <div className="mt-2 space-x-4">
                <Link
                  href="/advertiser-login"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  広告主ログイン
                </Link>
                <Link
                  href="/publisher-login"
                  className="text-sm text-green-600 hover:text-green-800 underline"
                >
                  アフィリエイターログイン
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 注意事項 */}
        <Card className="bg-blue-50 border-blue-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">管理者権限について</p>
                <ul className="text-xs space-y-1">
                  <li>• システム全体の管理・設定が可能です</li>
                  <li>• 全ユーザーの情報にアクセスできます</li>
                  <li>• 案件の承認・拒否が行えます</li>
                  <li>• 不正アクセスは法的処罰の対象となります</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}