'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

const offerSchema = z.object({
  name: z.string().min(1, '案件名は必須です'),
  description: z.string().optional(),
  category: z.string().min(1, 'カテゴリは必須です'),
  landingPageUrl: z.string().url('正しいURL形式で入力してください'),
  previewUrl: z.string().url('正しいURL形式で入力してください').optional().or(z.literal('')),
  commissionType: z.enum(['CPA', 'CPS', 'CPC', 'CPM']),
  commissionAmount: z.number().min(0, '成果単価は0以上で入力してください'),
  commissionPercent: z.number().min(0).max(100).optional(),
  conversionPoint: z.string().min(1, '成果地点は必須です'),
  terms: z.string().optional(),
  prohibitedTerms: z.string().optional(),
  sku: z.string().optional(),
  stockQuantity: z.number().int().min(0).optional(),
  tags: z.array(z.string()).default([]),
})

type OfferFormData = z.infer<typeof offerSchema>

const categories = [
  { value: 'ec', label: 'EC・通販' },
  { value: 'finance', label: '金融' },
  { value: 'beauty', label: '美容・健康' },
  { value: 'education', label: '教育' },
  { value: 'entertainment', label: 'エンタメ' },
  { value: 'travel', label: '旅行' },
  { value: 'other', label: 'その他' },
]

const conversionPoints = [
  { value: 'purchase', label: '商品購入' },
  { value: 'registration', label: '会員登録' },
  { value: 'application', label: '申込み完了' },
  { value: 'inquiry', label: '問い合わせ' },
  { value: 'download', label: 'ダウンロード' },
]

export default function NewOfferPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      tags: [],
      commissionType: 'CPA',
    },
  })

  const tags = watch('tags')

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setValue('tags', [...tags, tagInput])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove))
  }

  const onSubmit = async (data: OfferFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('案件の登録に失敗しました')
      }

      const offer = await response.json()

      toast({
        title: '案件を登録しました',
        description: `案件「${data.name}」を正常に登録しました。`,
      })

      router.push(`/advertiser/offers/${offer.id}`)
    } catch (error) {
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : '案件の登録に失敗しました',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>新規案件登録</CardTitle>
          <CardDescription>
            新しい広告案件を登録します。<span className="text-red-500">*</span>は必須項目です。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 基本情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">基本情報</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    案件名 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="例: 【初回限定】健康サプリメント"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    カテゴリ <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => setValue('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.category.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">説明</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="案件の詳細説明を入力してください"
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="landingPageUrl">
                    LP URL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="landingPageUrl"
                    type="url"
                    {...register('landingPageUrl')}
                    placeholder="https://example.com/lp"
                  />
                  {errors.landingPageUrl && (
                    <p className="text-sm text-red-500">{errors.landingPageUrl.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previewUrl">プレビューURL</Label>
                  <Input
                    id="previewUrl"
                    type="url"
                    {...register('previewUrl')}
                    placeholder="https://example.com/preview"
                  />
                </div>
              </div>
            </div>

            {/* 成果条件 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">成果条件</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="conversionPoint">
                    成果地点 <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => setValue('conversionPoint', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="成果地点を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {conversionPoints.map((point) => (
                        <SelectItem key={point.value} value={point.value}>
                          {point.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.conversionPoint && (
                    <p className="text-sm text-red-500">{errors.conversionPoint.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commissionType">
                    報酬形態 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    defaultValue="CPA"
                    onValueChange={(value) => setValue('commissionType', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CPA">CPA（成果報酬）</SelectItem>
                      <SelectItem value="CPS">CPS（売上連動）</SelectItem>
                      <SelectItem value="CPC">CPC（クリック報酬）</SelectItem>
                      <SelectItem value="CPM">CPM（表示報酬）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="commissionAmount">
                    成果単価（円） <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="commissionAmount"
                    type="number"
                    {...register('commissionAmount', { valueAsNumber: true })}
                    placeholder="1000"
                  />
                  {errors.commissionAmount && (
                    <p className="text-sm text-red-500">{errors.commissionAmount.message}</p>
                  )}
                </div>

                {watch('commissionType') === 'CPS' && (
                  <div className="space-y-2">
                    <Label htmlFor="commissionPercent">成果率（%）</Label>
                    <Input
                      id="commissionPercent"
                      type="number"
                      {...register('commissionPercent', { valueAsNumber: true })}
                      placeholder="10"
                      min={0}
                      max={100}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">承認条件</Label>
                <Textarea
                  id="terms"
                  {...register('terms')}
                  placeholder="承認条件を入力してください"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prohibitedTerms">禁止事項</Label>
                <Textarea
                  id="prohibitedTerms"
                  {...register('prohibitedTerms')}
                  placeholder="禁止事項を入力してください"
                  rows={3}
                />
              </div>
            </div>

            {/* 在庫管理 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">在庫管理</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKUコード</Label>
                  <Input
                    id="sku"
                    {...register('sku')}
                    placeholder="SKU-12345"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">在庫数</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    {...register('stockQuantity', { valueAsNumber: true })}
                    placeholder="100"
                    min={0}
                  />
                  {errors.stockQuantity && (
                    <p className="text-sm text-red-500">{errors.stockQuantity.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* タグ */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">タグ</h3>
              
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="タグを入力"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag} variant="secondary">
                  追加
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                案件を登録
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}