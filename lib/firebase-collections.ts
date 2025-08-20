// Firebase Firestore コレクション定義

export const COLLECTIONS = {
  // ユーザー関連
  USERS: 'users',
  USER_PROFILES: 'userProfiles',
  
  // 案件関連
  OFFERS: 'offers',
  OFFER_CREATIVES: 'offerCreatives',
  OFFER_APPLICATIONS: 'offerApplications',
  
  // 成果関連
  CLICKS: 'clicks',
  CONVERSIONS: 'conversions',
  
  // 支払い関連
  PAYOUTS: 'payouts',
  INVOICES: 'invoices',
  
  // その他
  INVITATIONS: 'invitations',
  TICKETS: 'tickets',
  AUDIT_LOGS: 'auditLogs',
  SITES: 'sites',
} as const

// データモデル型定義
export interface User {
  id?: string
  email: string
  role: 'admin' | 'publisher' | 'advertiser'
  status: 'pending' | 'active' | 'suspended' | 'deleted'
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

export interface UserProfile {
  userId: string
  firstName?: string
  lastName?: string
  firstNameKana?: string
  lastNameKana?: string
  companyName?: string
  phoneNumber?: string
  faxNumber?: string
  dateOfBirth?: Date
  
  // 住所
  postalCode?: string
  prefecture?: string
  city?: string
  address?: string
  building?: string
  
  // ビジネス情報
  invoiceNumber?: string
  
  // 銀行口座（Publisher用）
  bankName?: string
  branchName?: string
  accountType?: string
  accountNumber?: string
  accountHolder?: string
}

export interface Offer {
  id?: string
  advertiserId: string
  
  // 基本情報
  name: string
  description?: string
  category: string
  tags: string[]
  
  // URL
  landingPageUrl: string
  previewUrl?: string
  
  // 報酬
  commissionType: 'CPA' | 'CPS' | 'CPC' | 'CPM'
  commissionAmount: number
  commissionPercent?: number
  
  // 条件
  terms?: string
  prohibitedTerms?: string
  
  // トラッキング
  conversionPoint: string
  cookieWindow: number // days
  approvalWindow: number // days
  
  // 在庫
  sku?: string
  stockQuantity?: number
  
  // ステータス
  status: 'draft' | 'active' | 'paused' | 'expired'
  isPrivate: boolean
  requireApproval: boolean
  
  // 統計（非正規化）
  clickCount: number
  conversionCount: number
  approvalRate: number
  
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
}

export interface Creative {
  id?: string
  offerId: string
  type: 'banner' | 'text' | 'video'
  name: string
  imageUrl?: string
  width?: number
  height?: number
  content?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface OfferApplication {
  id?: string
  offerId: string
  publisherId: string
  status: 'pending' | 'approved' | 'rejected'
  message?: string
  rejectionReason?: string
  approvedAt?: Date
  rejectedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Click {
  id?: string
  clickId: string
  offerId: string
  publisherId: string
  
  // トラッキングデータ
  subId?: string
  subId2?: string
  subId3?: string
  subId4?: string
  subId5?: string
  
  // リクエストデータ
  ip: string
  userAgent: string
  referer?: string
  device?: string
  os?: string
  browser?: string
  country?: string
  
  createdAt: Date
}

export interface Conversion {
  id?: string
  clickId: string
  offerId: string
  publisherId: string
  advertiserId: string
  
  // 取引データ
  transactionId: string
  amount: number
  quantity: number
  currency: string
  
  // 報酬
  publisherRevenue: number
  
  // ステータス
  status: 'pending' | 'approved' | 'rejected'
  
  // 承認情報
  approvedBy?: string
  approvedAt?: Date
  rejectedBy?: string
  rejectedAt?: Date
  rejectionReason?: string
  
  // 支払い
  payoutId?: string
  
  createdAt: Date
  updatedAt: Date
}

export interface Payout {
  id?: string
  publisherId: string
  
  // 金額
  amount: number
  currency: string
  fee: number
  netAmount: number
  
  // ステータス
  status: 'pending' | 'processing' | 'completed' | 'failed'
  
  // 支払い詳細
  paymentMethod?: string
  transactionId?: string
  
  // 成果ID配列
  conversionIds: string[]
  
  processedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Site {
  id?: string
  publisherId: string
  name: string
  url: string
  category?: string
  description?: string
  monthlyPV?: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Ticket {
  id?: string
  userId: string
  subject: string
  category: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo?: string
  
  // メッセージはサブコレクションとして保存
  
  resolvedAt?: Date
  closedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface TicketMessage {
  id?: string
  ticketId: string
  userId: string
  content: string
  isInternal: boolean
  createdAt: Date
}

export interface Invitation {
  id?: string
  code: string
  role: 'admin' | 'publisher' | 'advertiser'
  invitedBy: string
  maxUses: number
  usedCount: number
  expiresAt: Date
  createdAt: Date
}

export interface AuditLog {
  id?: string
  userId: string
  action: string
  entityType: string
  entityId: string
  metadata?: any
  ip?: string
  userAgent?: string
  createdAt: Date
}