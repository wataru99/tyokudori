import { NextRequest, NextResponse } from 'next/server'

// Mock user data that matches the expected structure
const mockUsers = [
  {
    id: '1',
    email: 'admin@tyokudori.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    firstName: '管理者',
    lastName: '太郎',
    companyName: 'チョクドリ株式会社',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-15T12:00:00Z'
  },
  {
    id: '2',
    email: 'advertiser@tyokudori.com',
    role: 'ADVERTISER',
    status: 'ACTIVE',
    firstName: '広告主',
    lastName: '花子',
    companyName: '株式会社マーケティング',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-02-01T10:30:00Z'
  },
  {
    id: '3',
    email: 'publisher@tyokudori.com',
    role: 'PUBLISHER',
    status: 'ACTIVE',
    firstName: 'アフィリエイター',
    lastName: '次郎',
    companyName: '個人事業主',
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-02-10T16:00:00Z'
  },
  {
    id: '4',
    email: 'tanaka@example.com',
    role: 'ADVERTISER',
    status: 'PENDING',
    firstName: '田中',
    lastName: '太郎',
    companyName: '田中商事株式会社',
    createdAt: '2024-02-14T10:00:00Z',
    updatedAt: '2024-02-14T10:00:00Z'
  },
  {
    id: '5',
    email: 'sato@example.com',
    role: 'PUBLISHER',
    status: 'SUSPENDED',
    firstName: '佐藤',
    lastName: '花子',
    companyName: null,
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-02-05T09:00:00Z'
  },
  {
    id: '6',
    email: 'yamada@example.com',
    role: 'PUBLISHER',
    status: 'ACTIVE',
    firstName: '山田',
    lastName: '次郎',
    companyName: 'ヤマダアフィリエイト',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-02-20T14:30:00Z'
  },
  {
    id: '7',
    email: 'suzuki@example.com',
    role: 'ADVERTISER',
    status: 'ACTIVE',
    firstName: '鈴木',
    lastName: '一郎',
    companyName: '鈴木エンタープライズ',
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-02-18T09:15:00Z'
  },
  {
    id: '8',
    email: 'watanabe@example.com',
    role: 'PUBLISHER',
    status: 'DELETED',
    firstName: '渡辺',
    lastName: '三郎',
    companyName: null,
    createdAt: '2023-12-20T16:00:00Z',
    updatedAt: '2024-01-30T11:00:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    // Get pagination parameters from query string
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Apply pagination
    const total = mockUsers.length
    const users = mockUsers.slice(skip, skip + limit)

    // Return response in the expected format
    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}