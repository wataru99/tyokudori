'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function PublisherLoginPage() {
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
          description: 'アフィリエイターダッシュボードにリダイレクトします。'
        })
        router.push('/publisher')
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
                <span className="text-xs">アフィリエイターログイン</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* ログインフォーム */}
        <Card className="border-green-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">アフィリエイターログイン</CardTitle>
            <CardDescription className="text-center">
              アフィリエイターとしてログインして案件を見つけてください
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
                  placeholder="publisher@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-green-200 focus:border-green-500"
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
                    className="border-green-200 focus:border-green-500 pr-10"
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
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>ログイン中...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>アフィリエイターとしてログイン</span>
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
                    setEmail('publisher@tyokudori.com')
                    setPassword('publisher123')
                  }}
                >
                  <div className="font-mono">
                    <div><span className="text-gray-500">ID:</span> publisher@tyokudori.com</div>
                    <div><span className="text-gray-500">PW:</span> publisher123</div>
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
                  href="/admin-login"
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  管理者ログイン
                </Link>
                <Link
                  href="/advertiser-login"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  広告主ログイン
                </Link>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                まだアカウントをお持ちでない場合
              </p>
              <Link
                href="/publisher-register"
                className="text-sm text-green-600 hover:text-green-800 underline"
              >
                アフィリエイターとして新規登録
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 案内 */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-1">アフィリエイターでできること</p>
                <ul className="text-xs space-y-1">
                  <li>• 豊富な案件から選択・申請</li>
                  <li>• アフィリエイトリンクの生成</li>
                  <li>• リアルタイムの成果確認</li>
                  <li>• 報酬の詳細レポート</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}