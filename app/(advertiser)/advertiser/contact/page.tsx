'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageLoading } from '@/components/ui/loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Send, Mail, MessageSquare, AlertCircle, Phone } from 'lucide-react'
import { useLoading } from '@/contexts/loading-context'
import { useNavigation } from '@/hooks/use-navigation'

export default function AdvertiserContactPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { setLoading } = useLoading()
  const { navigateWithLoading } = useNavigation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  
  // Initial page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    message: '',
    contactEmail: '',
    contactName: '',
    companyName: '',
    phoneNumber: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "お問い合わせを送信しました",
        description: "担当者より1営業日以内にご連絡いたします。",
      })
      
      // Reset form
      setFormData({
        subject: '',
        category: '',
        message: '',
        contactEmail: '',
        contactName: '',
        companyName: '',
        phoneNumber: ''
      })
      setIsSubmitting(false)
      setLoading(false)
    }, 1500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isPageLoading) {
    return <PageLoading text="お問い合わせページを読み込んでいます..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-3 py-3">
        {/* Page Header */}
        <div className="bg-white rounded shadow-sm border p-2 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-gray-900">お問い合わせ</h1>
            </div>
            <Button 
              variant="outline"
              onClick={() => router.back()}
              size="sm"
              className="h-7"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              <span className="text-xs">戻る</span>
            </Button>
          </div>
        </div>

        {/* Contact Form */}
        <Card className="mb-2">
          <CardHeader className="p-3">
            <CardTitle className="flex items-center text-sm">
              <Mail className="mr-1.5 h-4 w-4" />
              お問い合わせフォーム
            </CardTitle>
            <CardDescription className="text-xs">
              以下のフォームに必要事項をご記入の上、送信してください。
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Company and Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="companyName" className="text-xs">会社名 <span className="text-red-500">*</span></Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="株式会社○○"
                    required
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="contactName" className="text-xs">ご担当者名 <span className="text-red-500">*</span></Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="山田 太郎"
                    required
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="contactEmail" className="text-xs">メールアドレス <span className="text-red-500">*</span></Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="example@company.com"
                    required
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phoneNumber" className="text-xs">電話番号</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="03-1234-5678"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs">お問い合わせ種別 <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  required
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="種別を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">一般的な質問</SelectItem>
                    <SelectItem value="technical">技術的な問題</SelectItem>
                    <SelectItem value="billing">請求・契約について</SelectItem>
                    <SelectItem value="campaign">案件運用について</SelectItem>
                    <SelectItem value="performance">成果・効果について</SelectItem>
                    <SelectItem value="complaint">クレーム・ご意見</SelectItem>
                    <SelectItem value="proposal">新規提案・ご要望</SelectItem>
                    <SelectItem value="other">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-xs">件名 <span className="text-red-500">*</span></Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="お問い合わせの件名を入力してください"
                  required
                  className="h-8 text-sm"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs">お問い合わせ内容 <span className="text-red-500">*</span></Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="お問い合わせ内容を詳しくご記入ください"
                  rows={6}
                  required
                  className="resize-none text-sm"
                />
                <p className="text-xs text-gray-500">
                  {formData.message.length}/2000文字
                </p>
              </div>

              {/* Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                <div className="flex">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="ml-2">
                    <h4 className="text-xs font-medium text-blue-900">ご注意事項</h4>
                    <ul className="mt-1 text-xs text-blue-700 list-disc list-inside space-y-0.5">
                      <li>通常1営業日以内にご返信いたします</li>
                      <li>緊急の場合は担当営業までお電話ください</li>
                      <li>技術的な問題は詳細な情報をご記載ください</li>
                      <li>個人情報は適切に管理いたします</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.back()}
                  size="sm"
                  className="h-7"
                >
                  <span className="text-xs">キャンセル</span>
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting || !formData.category || !formData.subject || !formData.message}
                  size="sm"
                  className="min-w-[100px] h-7"
                >
                  {isSubmitting ? (
                    <span className="flex items-center text-xs">
                      <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></span>
                      送信中...
                    </span>
                  ) : (
                    <span className="flex items-center text-xs">
                      <Send className="mr-1 h-3 w-3" />
                      送信する
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="ml-2">
                  <h3 className="font-semibold text-gray-900 text-sm">お電話でのお問い合わせ</h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    営業担当直通: 03-1234-5678<br />
                    受付時間: 平日 9:00-18:00
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-start">
                <MessageSquare className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="ml-2">
                  <h3 className="font-semibold text-gray-900 text-sm">よくあるご質問</h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    お問い合わせ前にFAQページもご確認ください
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto mt-1 text-xs"
                    onClick={() => navigateWithLoading('/advertiser/faq')}
                  >
                    FAQを見る →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}