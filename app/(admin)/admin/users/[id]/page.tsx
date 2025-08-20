'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Edit, Mail, Phone, Building, Calendar, Shield, Activity, FileText, MessageCircle } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'

interface User {
  id: string
  email: string
  role: 'ADMIN' | 'PUBLISHER' | 'ADVERTISER'
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED'
  firstName: string | null
  lastName: string | null
  companyName: string | null
  phoneNumber: string | null
  postalCode: string | null
  prefecture: string | null
  city: string | null
  address: string | null
  building: string | null
  createdAt: string
  updatedAt: string
  emailVerifiedAt: string | null
  lastLoginAt: string | null
  publishers: Array<{
    id: string
    name: string
    status: string
  }>
  advertisers: Array<{
    id: string
    name: string
    status: string
  }>
  adminActions: Array<{
    id: string
    action: string
    targetType: string
    targetId: string
    reason: string | null
    createdAt: string
  }>
  tickets: Array<{
    id: string
    title: string
    status: string
    priority: string
    createdAt: string
  }>
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = params.id as string

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`http://localhost:4000/api/users/${userId}`)
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else if (response.status === 404) {
          setError('ユーザーが見つかりません')
        } else {
          setError('ユーザー情報の取得に失敗しました')
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        setError('ネットワークエラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800'
      case 'ADVERTISER': return 'bg-blue-100 text-blue-800'
      case 'PUBLISHER': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'SUSPENDED': return 'bg-red-100 text-red-800'
      case 'DELETED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '未設定'
    return new Date(dateString).toLocaleString('ja-JP')
  }

  const formatDateOnly = (dateString: string | null) => {
    if (!dateString) return '未設定'
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">読み込み中...</div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-destructive text-lg">{error || 'ユーザーが見つかりません'}</div>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button onClick={() => router.back()} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
          <div>
            <h1 className="text-3xl font-bold">ユーザー詳細</h1>
            <p className="text-muted-foreground mt-1">
              {user.firstName && user.lastName 
                ? `${user.lastName} ${user.firstName}`
                : user.companyName || user.email
              }
            </p>
          </div>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          編集
        </Button>
      </div>

      {/* 基本情報カード */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">アカウント状態</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className={getStatusBadgeColor(user.status)}>
                {user.status === 'ACTIVE' ? 'アクティブ' :
                 user.status === 'PENDING' ? '承認待ち' :
                 user.status === 'SUSPENDED' ? '停止中' : '削除済み'}
              </Badge>
              <Badge className={getRoleBadgeColor(user.role)}>
                {user.role === 'ADMIN' ? '管理者' : 
                 user.role === 'ADVERTISER' ? '広告主' : '媒体運営者'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">登録情報</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">登録日</div>
              <div className="text-sm">{formatDateOnly(user.createdAt)}</div>
              <div className="text-xs text-muted-foreground">最終ログイン</div>
              <div className="text-sm">{formatDate(user.lastLoginAt)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">関連情報</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">媒体数</div>
              <div className="text-sm">{user.publishers?.length || 0}件</div>
              <div className="text-xs text-muted-foreground">広告主数</div>
              <div className="text-sm">{user.advertisers?.length || 0}件</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* タブコンテンツ */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">プロフィール</TabsTrigger>
          <TabsTrigger value="entities">関連エンティティ</TabsTrigger>
          <TabsTrigger value="activity">管理者アクション</TabsTrigger>
          <TabsTrigger value="tickets">チケット</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  連絡先情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">メールアドレス</label>
                  <div className="mt-1">{user.email}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    認証済み: {user.emailVerifiedAt ? formatDate(user.emailVerifiedAt) : '未認証'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">電話番号</label>
                  <div className="mt-1">{user.phoneNumber || '未設定'}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  個人・会社情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">氏名</label>
                  <div className="mt-1">
                    {user.firstName && user.lastName 
                      ? `${user.lastName} ${user.firstName}`
                      : '未設定'
                    }
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">会社名</label>
                  <div className="mt-1">{user.companyName || '未設定'}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>住所情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">郵便番号</label>
                  <div className="mt-1">{user.postalCode || '未設定'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">都道府県</label>
                  <div className="mt-1">{user.prefecture || '未設定'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">市区町村</label>
                  <div className="mt-1">{user.city || '未設定'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">番地</label>
                  <div className="mt-1">{user.address || '未設定'}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">建物名・部屋番号</label>
                  <div className="mt-1">{user.building || '未設定'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entities" className="space-y-4">
          {user.role === 'PUBLISHER' && (
            <Card>
              <CardHeader>
                <CardTitle>媒体一覧</CardTitle>
                <CardDescription>このユーザーが運営している媒体</CardDescription>
              </CardHeader>
              <CardContent>
                {user.publishers && user.publishers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>媒体名</TableHead>
                        <TableHead>ステータス</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.publishers.map((publisher) => (
                        <TableRow key={publisher.id}>
                          <TableCell>{publisher.name}</TableCell>
                          <TableCell>
                            <Badge>{publisher.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">詳細</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    媒体が登録されていません
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {user.role === 'ADVERTISER' && (
            <Card>
              <CardHeader>
                <CardTitle>広告主アカウント一覧</CardTitle>
                <CardDescription>このユーザーの広告主アカウント</CardDescription>
              </CardHeader>
              <CardContent>
                {user.advertisers && user.advertisers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>アカウント名</TableHead>
                        <TableHead>ステータス</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.advertisers.map((advertiser) => (
                        <TableRow key={advertiser.id}>
                          <TableCell>{advertiser.name}</TableCell>
                          <TableCell>
                            <Badge>{advertiser.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">詳細</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    広告主アカウントが登録されていません
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                管理者アクション履歴
              </CardTitle>
              <CardDescription>このユーザーに対して実行された管理者アクション</CardDescription>
            </CardHeader>
            <CardContent>
              {user.adminActions && user.adminActions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>アクション</TableHead>
                      <TableHead>対象</TableHead>
                      <TableHead>理由</TableHead>
                      <TableHead>実行日時</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.adminActions.map((action) => (
                      <TableRow key={action.id}>
                        <TableCell>{action.action}</TableCell>
                        <TableCell>{action.targetType}</TableCell>
                        <TableCell>{action.reason || '-'}</TableCell>
                        <TableCell>{formatDate(action.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  管理者アクション履歴がありません
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                サポートチケット
              </CardTitle>
              <CardDescription>このユーザーが作成したサポートチケット</CardDescription>
            </CardHeader>
            <CardContent>
              {user.tickets && user.tickets.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>タイトル</TableHead>
                      <TableHead>ステータス</TableHead>
                      <TableHead>優先度</TableHead>
                      <TableHead>作成日</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>
                          <Badge>{ticket.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{ticket.priority}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">詳細</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  サポートチケットがありません
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}