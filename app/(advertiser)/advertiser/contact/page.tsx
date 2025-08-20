'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Send, Mail, MessageSquare, AlertCircle, Phone } from 'lucide-react'

export default function AdvertiserContactPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
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
    }, 1500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">お問い合わせ</h1>
              <p className="text-gray-600 mt-1">
                運営チームへのご質問・ご要望をお送りください
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              戻る
            </Button>
          </div>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              お問い合わせフォーム
            </CardTitle>
            <CardDescription>
              以下のフォームに必要事項をご記入の上、送信してください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company and Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">会社名 <span className="text-red-500">*</span></Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="株式会社○○"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">ご担当者名 <span className="text-red-500">*</span></Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="山田 太郎"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">メールアドレス <span className="text-red-500">*</span></Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="example@company.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">電話番号</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="03-1234-5678"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">お問い合わせ種別 <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  required
                >
                  <SelectTrigger>
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
                <Label htmlFor="subject">件名 <span className="text-red-500">*</span></Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="お問い合わせの件名を入力してください"
                  required
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">お問い合わせ内容 <span className="text-red-500">*</span></Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="お問い合わせ内容を詳しくご記入ください"
                  rows={8}
                  required
                  className="resize-none"
                />
                <p className="text-sm text-gray-500">
                  {formData.message.length}/2000文字
                </p>
              </div>

              {/* Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-900">ご注意事項</h4>
                    <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                      <li>通常1営業日以内にご返信いたします</li>
                      <li>緊急の場合は担当営業までお電話ください</li>
                      <li>技術的な問題は詳細な情報をご記載ください</li>
                      <li>個人情報は適切に管理いたします</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.back()}
                >
                  キャンセル
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting || !formData.category || !formData.subject || !formData.message}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      送信中...
                    </span>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      送信する
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <Phone className="h-8 w-8 text-primary mt-1" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">お電話でのお問い合わせ</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    営業担当直通: 03-1234-5678<br />
                    受付時間: 平日 9:00-18:00
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <MessageSquare className="h-8 w-8 text-primary mt-1" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">よくあるご質問</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    お問い合わせ前にFAQページもご確認ください
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto mt-2"
                    onClick={() => router.push('/advertiser/faq')}
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