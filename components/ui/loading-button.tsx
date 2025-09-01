'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Button } from '@/components/ui/button'
import { useLoading } from '@/contexts/loading-context'
import { cn } from '@/lib/utils'

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loadingText?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, loadingText = '処理中...', onClick, disabled, ...props }, ref) => {
    const { setLoading } = useLoading()

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || !onClick) return
      
      // 即座にローディングを表示
      setLoading(true, loadingText)
      
      try {
        await onClick(e)
      } finally {
        // onClickの中で適切にsetLoading(false)を呼ぶ責任はコンポーネント側に
        // ただし、エラーが発生した場合のフォールバックとして500ms後に解除
        setTimeout(() => {
          setLoading(false)
        }, 500)
      }
    }

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </Button>
    )
  }
)

LoadingButton.displayName = 'LoadingButton'