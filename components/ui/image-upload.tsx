'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface ImageUploadProps {
  value?: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedFormats?: string[]
  folder?: string
}

export function ImageUpload({
  value = [],
  onChange,
  maxFiles = 5,
  maxSize = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/gif'],
  folder = 'images',
}: ImageUploadProps) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (value.length + acceptedFiles.length > maxFiles) {
        toast({
          title: 'エラー',
          description: `最大${maxFiles}枚まで画像をアップロードできます。`,
          variant: 'destructive',
        })
        return
      }

      setUploading(true)
      const newUrls: string[] = []

      for (const file of acceptedFiles) {
        try {
          // ファイル名の生成
          const timestamp = Date.now()
          const randomString = Math.random().toString(36).substring(2, 15)
          const extension = file.name.split('.').pop()
          const fileName = `${folder}/${timestamp}_${randomString}.${extension}`

          // Firebase Storageにアップロード
          const storageRef = ref(storage, fileName)
          const uploadTask = uploadBytesResumable(storageRef, file)

          // アップロード進捗の監視
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              setUploadProgress((prev) => ({ ...prev, [file.name]: progress }))
            },
            (error) => {
              console.error('Upload error:', error)
              toast({
                title: 'アップロードエラー',
                description: `${file.name}のアップロードに失敗しました。`,
                variant: 'destructive',
              })
            },
            async () => {
              // アップロード完了後、URLを取得
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              newUrls.push(downloadURL)
              
              // 全ファイルのアップロード完了後
              if (newUrls.length === acceptedFiles.length) {
                onChange([...value, ...newUrls])
                setUploading(false)
                setUploadProgress({})
                toast({
                  title: 'アップロード完了',
                  description: `${newUrls.length}枚の画像をアップロードしました。`,
                })
              }
            }
          )
        } catch (error) {
          console.error('Upload error:', error)
          toast({
            title: 'エラー',
            description: 'アップロード中にエラーが発生しました。',
            variant: 'destructive',
          })
        }
      }
    },
    [value, onChange, maxFiles, folder, toast]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, format) => {
      acc[format] = []
      return acc
    }, {} as Record<string, string[]>),
    maxSize: maxSize * 1024 * 1024,
    disabled: uploading || value.length >= maxFiles,
  })

  const removeImage = (index: number) => {
    const newUrls = [...value]
    newUrls.splice(index, 1)
    onChange(newUrls)
  }

  return (
    <div className="space-y-4">
      {/* アップロードエリア */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
          ${uploading || value.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
        {isDragActive ? (
          <p className="text-sm">ここにドロップしてください...</p>
        ) : (
          <>
            <p className="text-sm">
              クリックまたはドラッグ＆ドロップで画像をアップロード
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} 形式、
              最大{maxSize}MBまで
            </p>
          </>
        )}
      </div>

      {/* アップロード進捗 */}
      {Object.entries(uploadProgress).map(([fileName, progress]) => (
        <div key={fileName} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{fileName}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      ))}

      {/* アップロード済み画像 */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* 残り枚数表示 */}
      <p className="text-xs text-muted-foreground text-center">
        {value.length} / {maxFiles} 枚アップロード済み
      </p>
    </div>
  )
}