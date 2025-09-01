'use client'

import { useState, useEffect } from 'react'
import { PageLoading } from '@/components/ui/loading'
import { useLoading } from '@/contexts/loading-context'
import { useNavigation } from '@/hooks/use-navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, UserPlus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

interface User {
  id: string
  email: string
  role: 'ADMIN' | 'PUBLISHER' | 'ADVERTISER'
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED'
  firstName: string
  lastName: string
  companyName: string | null
  createdAt: string
  updatedAt: string
}

export default function AdminUsersPage() {
  const { setLoading } = useLoading()
  const { navigate } = useNavigation()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading delay
    const loadData = async () => {
      setLoading(true, 'データを読み込んでいます...')
      // Add a short delay for smoother transition
      await new Promise(resolve => setTimeout(resolve, 300))
      setIsLoading(false)
      setLoading(false)
      fetchUsers()
    }
    loadData()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    // モックデータを使用
    setUsers([
      {
        id: '1',
        email: 'tanaka@example.com',
        role: 'ADVERTISER',
        status: 'PENDING',
        firstName: '太郎',
        lastName: '田中',
        companyName: '株式会社ABC',
        createdAt: '2024-02-15T09:30:00Z',
        updatedAt: '2024-02-15T09:30:00Z'
      },
      {
        id: '2',
        email: 'sato@example.com',
        role: 'PUBLISHER',
        status: 'ACTIVE',
        firstName: '花子',
        lastName: '佐藤',
        companyName: null,
        createdAt: '2024-02-14T14:15:00Z',
        updatedAt: '2024-02-14T14:15:00Z'
      },
      {
        id: '3',
        email: 'suzuki@example.com',
        role: 'PUBLISHER',
        status: 'PENDING',
        firstName: '一郎',
        lastName: '鈴木',
        companyName: null,
        createdAt: '2024-02-13T16:45:00Z',
        updatedAt: '2024-02-13T16:45:00Z'
      },
      {
        id: '4',
        email: 'yamada@company.com',
        role: 'ADVERTISER',
        status: 'ACTIVE',
        firstName: '美咲',
        lastName: '山田',
        companyName: 'XYZ株式会社',
        createdAt: '2024-02-10T10:00:00Z',
        updatedAt: '2024-02-12T15:30:00Z'
      }
    ])
    setLoading(false)
  }

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`
    const matchesSearch = searchQuery === '' || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.companyName && user.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }


  if (isLoading) {
    return <PageLoading text="ユーザー管理を読み込んでいます..." />
  }

  return (
    <div className="py-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
              <p className="text-gray-600 mt-1">
                システムに登録されているユーザーの管理を行います
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <UserPlus className="mr-2 h-4 w-4" />
              新規ユーザー追加
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">フィルター</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="名前やメールで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="権限で絞り込み" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての権限</SelectItem>
                  <SelectItem value="ADMIN">管理者</SelectItem>
                  <SelectItem value="ADVERTISER">広告主</SelectItem>
                  <SelectItem value="PUBLISHER">アフィリエイター</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="ステータスで絞り込み" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべてのステータス</SelectItem>
                  <SelectItem value="ACTIVE">アクティブ</SelectItem>
                  <SelectItem value="PENDING">承認待ち</SelectItem>
                  <SelectItem value="SUSPENDED">停止中</SelectItem>
                  <SelectItem value="DELETED">削除済み</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                フィルターをリセット
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>ユーザー一覧</CardTitle>
              <div className="text-sm text-gray-500">
                {filteredUsers.length} 件のユーザー
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">ユーザーを読み込み中...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">エラー: {error}</p>
                <Button onClick={fetchUsers} variant="outline" className="mt-4">
                  再試行
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ユーザー</TableHead>
                      <TableHead>権限</TableHead>
                      <TableHead>ステータス</TableHead>
                      <TableHead>登録日</TableHead>
                      <TableHead>最終更新</TableHead>
                      <TableHead className="text-right">アクション</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                    <TableRow 
                      key={user.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.companyName && (
                            <div className="text-xs text-gray-400">{user.companyName}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role === 'ADMIN' ? '管理者' : 
                           user.role === 'ADVERTISER' ? '広告主' : 'アフィリエイター'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(user.status)}>
                          {user.status === 'ACTIVE' ? 'アクティブ' :
                           user.status === 'PENDING' ? '承認待ち' :
                           user.status === 'SUSPENDED' ? '停止中' : '削除済み'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>{formatDate(user.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              詳細を見る
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              編集
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              削除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}