'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface Offer {
  id: string
  name: string
  category: string
  advertiserName: string
  commissionType: string
  commissionAmount: number
  terms?: string
  prohibitedTerms?: string
}

interface ApplicationFormProps {
  offer: Offer | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { offerId: string; message: string }) => Promise<void>
}

export function ApplicationForm({ offer, isOpen, onClose, onSubmit }: ApplicationFormProps) {
  const { toast } = useToast()
  const [message, setMessage] = useState('')
  const [hasReadTerms, setHasReadTerms] = useState(false)
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!offer) return

    if (!hasReadTerms || !hasAgreedToTerms) {
      toast({
        title: '確認が必要です',
        description: '利用規約と注意事項をお読みいただき、同意のチェックをお願いします。',
        variant: 'destructive'
      })
      return
    }

    if (message.trim().length < 20) {
      toast({
        title: '申請理由が不足しています',
        description: '申請理由は20文字以上で入力してください。',
        variant: 'destructive'
      })
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({
        offerId: offer.id,
        message: message.trim()
      })
      
      // リセット
      setMessage('')
      setHasReadTerms(false)
      setHasAgreedToTerms(false)
      onClose()
      
      toast({
        title: '申請を送信しました',
        description: '広告主による審査完了までお待ちください。結果はメールでお知らせします。'
      })
    } catch (error) {
      toast({
        title: '送信エラー',
        description: '申請の送信に失敗しました。しばらく時間をおいて再度お試しください。',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (isSubmitting) return
    setMessage('')
    setHasReadTerms(false)
    setHasAgreedToTerms(false)
    onClose()
  }

  if (!offer) return null

  const getCommissionText = () => {
    if (offer.commissionType === 'CPS') {
      return `売上の${offer.commissionAmount}%`
    }
    return `¥${offer.commissionAmount.toLocaleString()}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">案件申請</DialogTitle>
          <DialogDescription>
            以下の案件への参加申請を行います。利用規約と注意事項をよくお読みの上、申請してください。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 案件情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{offer.name}</CardTitle>
              <CardDescription>{offer.advertiserName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <span className="text-sm text-muted-foreground">カテゴリ</span>
                  <Badge variant="outline" className="ml-2">{offer.category}</Badge>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">報酬形態</span>
                  <div className="font-medium">{offer.commissionType}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">報酬額</span>
                  <div className="font-medium text-green-600">{getCommissionText()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 利用規約・注意事項 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
                重要事項・利用規約
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">広告掲載に関する注意事項</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• 虚偽の情報や誇大広告は厳禁です</li>
                  <li>• 商標権・著作権を侵害する掲載はできません</li>
                  <li>• 他社商品との比較表現は事前承認が必要です</li>
                  <li>• 薬機法に抵触する表現は使用できません</li>
                  <li>• 承認されていない媒体での掲載は禁止です</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">報酬・支払いについて</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 成果の承認は広告主による審査後に確定します</li>
                  <li>• 不正なトラフィックによる成果は無効となります</li>
                  <li>• 支払いは月末締め翌々月末払いです</li>
                  <li>• 最低支払額は¥1,000からとなります</li>
                  <li>• 振込手数料はパートナー様負担となります</li>
                </ul>
              </div>

              {offer.prohibitedTerms && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">禁止事項</h4>
                  <p className="text-sm text-red-700">{offer.prohibitedTerms}</p>
                </div>
              )}

              {offer.terms && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">特別条件</h4>
                  <p className="text-sm text-gray-700">{offer.terms}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 申請理由入力 */}
          <Card>
            <CardHeader>
              <CardTitle>申請理由</CardTitle>
              <CardDescription>
                この案件に申請する理由や運営媒体の特徴、想定される訴求方法などをご記入ください（20文字以上）
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="例：健康・美容分野に特化したブログを運営しており、30代女性のフォロワーが多く、本商品のターゲット層と合致するため申請いたします。過去の類似商品での実績もあり、適切な訴求が可能です。"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <div className="mt-2 text-sm text-muted-foreground">
                {message.length}/500文字 (最低20文字以上)
              </div>
            </CardContent>
          </Card>

          {/* 同意チェック */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="read-terms"
                    checked={hasReadTerms}
                    onCheckedChange={(checked) => setHasReadTerms(checked)}
                  />
                  <label htmlFor="read-terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    上記の利用規約、注意事項、禁止事項をすべて読み、理解しました
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agree-terms"
                    checked={hasAgreedToTerms}
                    onCheckedChange={(checked) => setHasAgreedToTerms(checked)}
                  />
                  <label htmlFor="agree-terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    すべての条件に同意し、規約を遵守してアフィリエイト活動を行います
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 送信ボタン */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              キャンセル
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!hasReadTerms || !hasAgreedToTerms || message.trim().length < 20 || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>送信中...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>申請を送信</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}