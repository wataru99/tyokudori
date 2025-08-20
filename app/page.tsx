import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Briefcase, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">tyokudori</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-6">
            <h2 className="text-5xl font-bold tracking-tight sm:text-6xl">
              tyokudori
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              アフィリエイト運営会社向けのASP（Affiliate Service Provider）管理システムです。
              効率的な案件管理、パートナー管理、成果追跡を実現します。
            </p>
          </div>

          {/* Login Options */}
          <div className="grid gap-8 md:grid-cols-3 mt-16">
            <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-3 text-lg">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">管理者</span>
                </CardTitle>
                <CardDescription>
                  システム全体の管理・運営
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-2 text-left text-muted-foreground">
                  <li>ユーザー管理・権限設定</li>
                  <li>案件承認・管理</li>
                  <li>全体レポート・分析</li>
                  <li>システム設定・監視</li>
                </ul>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href="/admin-login">管理者ログイン</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-3 text-lg">
                  <Briefcase className="h-5 w-5" />
                  <span className="font-semibold">広告主</span>
                </CardTitle>
                <CardDescription>
                  案件の作成・管理
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-2 text-left text-muted-foreground">
                  <li>案件作成・編集・管理</li>
                  <li>アフィリエイター管理</li>
                  <li>成果承認・拒否</li>
                  <li>ROI分析・レポート</li>
                </ul>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href="/advertiser-login">広告主ログイン</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/advertiser-register">新規登録</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-3 text-lg">
                  <Users className="h-5 w-5" />
                  <span className="font-semibold">アフィリエイター</span>
                </CardTitle>
                <CardDescription>
                  アフィリエイト活動
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-2 text-left text-muted-foreground">
                  <li>案件検索・申請</li>
                  <li>アフィリエイトリンク生成</li>
                  <li>リアルタイム成果確認</li>
                  <li>報酬管理・レポート</li>
                </ul>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href="/publisher-login">アフィリエイターログイン</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/publisher-register">新規登録</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mt-24 space-y-8">
            <h3 className="text-3xl font-semibold tracking-tight">システムの特徴</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-secondary rounded-md flex items-center justify-center mx-auto">
                  <Shield className="h-7 w-7 text-foreground" />
                </div>
                <h4 className="font-semibold text-lg">セキュア</h4>
                <p className="text-sm text-muted-foreground">堅牢なセキュリティで大切なデータを保護</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-secondary rounded-md flex items-center justify-center mx-auto">
                  <Users className="h-7 w-7 text-foreground" />
                </div>
                <h4 className="font-semibold text-lg">ユーザフレンドリー</h4>
                <p className="text-sm text-muted-foreground">直感的で使いやすいインターフェース</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-secondary rounded-md flex items-center justify-center mx-auto">
                  <Briefcase className="h-7 w-7 text-foreground" />
                </div>
                <h4 className="font-semibold text-lg">高機能</h4>
                <p className="text-sm text-muted-foreground">豊富な機能で効率的な運営をサポート</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-secondary rounded-md flex items-center justify-center mx-auto">
                  <span className="text-foreground font-bold text-lg">24/7</span>
                </div>
                <h4 className="font-semibold text-lg">24時間稼働</h4>
                <p className="text-sm text-muted-foreground">いつでもアクセス可能な安定したシステム</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 tyokudori. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}