export function convertToCSV(data: any[], columns: { key: string; label: string }[]): string {
  if (!data || data.length === 0) {
    return ''
  }

  // ヘッダー行を作成
  const headers = columns.map(col => col.label).join(',')
  
  // データ行を作成
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col.key]
      // 値にカンマ、改行、ダブルクォートが含まれる場合の処理
      if (value === null || value === undefined) {
        return ''
      }
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }).join(',')
  })

  // BOM付きUTF-8で出力（Excelでの文字化け対策）
  return '\uFEFF' + headers + '\n' + rows.join('\n')
}

export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  // モダンブラウザでのダウンロード処理
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// レポート用CSVエクスポート
export function exportReportCSV(
  data: any[],
  reportType: 'daily' | 'offer' | 'publisher' | 'conversion'
) {
  let columns: { key: string; label: string }[] = []
  let filename = ''
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')

  switch (reportType) {
    case 'daily':
      columns = [
        { key: 'date', label: '日付' },
        { key: 'clicks', label: 'クリック数' },
        { key: 'conversions', label: '成果数' },
        { key: 'revenue', label: '売上' },
        { key: 'approvalRate', label: '承認率(%)' },
        { key: 'cvr', label: 'CVR(%)' },
        { key: 'ctr', label: 'CTR(%)' },
      ]
      filename = `daily_report_${dateStr}.csv`
      break
      
    case 'offer':
      columns = [
        { key: 'offerId', label: '案件ID' },
        { key: 'offerName', label: '案件名' },
        { key: 'advertiserName', label: '広告主' },
        { key: 'category', label: 'カテゴリ' },
        { key: 'clicks', label: 'クリック数' },
        { key: 'conversions', label: '成果数' },
        { key: 'revenue', label: '売上' },
        { key: 'approvalRate', label: '承認率(%)' },
        { key: 'cvr', label: 'CVR(%)' },
      ]
      filename = `offer_report_${dateStr}.csv`
      break
      
    case 'publisher':
      columns = [
        { key: 'publisherId', label: '媒体ID' },
        { key: 'publisherName', label: '媒体名' },
        { key: 'siteUrl', label: 'サイトURL' },
        { key: 'clicks', label: 'クリック数' },
        { key: 'conversions', label: '成果数' },
        { key: 'revenue', label: '売上' },
        { key: 'approvalRate', label: '承認率(%)' },
        { key: 'paymentAmount', label: '支払予定額' },
      ]
      filename = `publisher_report_${dateStr}.csv`
      break
      
    case 'conversion':
      columns = [
        { key: 'conversionId', label: '成果ID' },
        { key: 'clickId', label: 'クリックID' },
        { key: 'transactionId', label: '取引ID' },
        { key: 'offerName', label: '案件名' },
        { key: 'publisherName', label: '媒体名' },
        { key: 'amount', label: '金額' },
        { key: 'status', label: 'ステータス' },
        { key: 'createdAt', label: '発生日時' },
        { key: 'approvedAt', label: '承認日時' },
        { key: 'rejectionReason', label: '否認理由' },
      ]
      filename = `conversion_report_${dateStr}.csv`
      break
  }

  const csvContent = convertToCSV(data, columns)
  downloadCSV(filename, csvContent)
}