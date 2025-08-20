# Render デプロイメントガイド

このガイドでは、tyokudoriアプリケーションをRenderにデプロイする手順を説明します。

## 前提条件

1. GitHubアカウント
2. Renderアカウント (https://render.com)
3. Firebaseプロジェクト（既存のものを使用）

## デプロイ手順

### 1. GitHubリポジトリの作成

1. GitHubで新しいリポジトリを作成:
   - リポジトリ名: `tyokudori`
   - Public または Private を選択
   - READMEは追加しない（既にあるため）

2. ローカルでGitリポジトリを初期化してプッシュ:

```bash
# OneDriveフォルダの外にプロジェクトをコピー
cd ~
cp -r "/mnt/c/Users/user/OneDrive/デスクトップ/tyokudori" ~/tyokudori
cd ~/tyokudori

# Gitリポジトリを初期化
git init
git add .
git commit -m "Initial commit"

# GitHubリポジトリを追加してプッシュ
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tyokudori.git
git push -u origin main
```

### 2. Renderでのセットアップ

1. [Render](https://render.com) にログイン

2. ダッシュボードで「New +」→「Blueprint」をクリック

3. GitHubリポジトリを接続:
   - 「Connect GitHub」をクリック
   - tyokudoriリポジトリを選択
   - 「Connect」をクリック

4. Renderが`render.yaml`を自動検出し、以下のサービスを作成:
   - Web Service (Next.js + Express)
   - Background Worker
   - PostgreSQL データベース
   - Redis インスタンス

### 3. 環境変数の設定

Renderダッシュボードで各サービスの環境変数を設定:

#### Web Service環境変数:

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# アプリケーションURL（デプロイ後に更新）
NEXT_PUBLIC_API_URL=https://your-app.onrender.com
NEXT_PUBLIC_APP_URL=https://your-app.onrender.com
NEXTAUTH_URL=https://your-app.onrender.com

# その他
EXTERNAL_AF_BASE=https://markecats.co.jp/product/afad/
```

**注意**: 
- `DATABASE_URL`と`REDIS_URL`はRenderが自動的に設定します
- `NEXTAUTH_SECRET`と`JWT_SECRET`はRenderが自動生成します
- `FIREBASE_PRIVATE_KEY`は改行を`\n`に置換して1行で入力

### 4. デプロイの実行

1. 環境変数を設定したら「Save」をクリック
2. 自動的にデプロイが開始されます
3. デプロイログを確認し、エラーがないか確認

### 5. デプロイ後の設定

1. **Prismaマイグレーション**:
   Web ServiceのShellタブから実行:
   ```bash
   npx prisma migrate deploy
   ```

2. **初期データ投入**（必要な場合）:
   ```bash
   npm run seed
   ```

3. **動作確認**:
   - https://your-app.onrender.com にアクセス
   - 各ログインページが正常に表示されることを確認

## トラブルシューティング

### ビルドエラーの場合

1. ログを確認して具体的なエラーメッセージを特定
2. 環境変数が正しく設定されているか確認
3. `package.json`の依存関係が正しいか確認

### データベース接続エラーの場合

1. `DATABASE_URL`が正しく設定されているか確認
2. Prismaマイグレーションが実行されているか確認

### ページが表示されない場合

1. ブラウザの開発者ツールでエラーを確認
2. Renderのログでサーバーエラーを確認
3. 環境変数（特にFirebase関連）が正しく設定されているか確認

## サポート

問題が解決しない場合は、以下を確認してください:

1. [Render Documentation](https://render.com/docs)
2. [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
3. プロジェクトのGitHub Issues

## 注意事項

- 初回デプロイには10-15分程度かかる場合があります
- 無料プランの場合、非アクティブ時にスリープする可能性があります
- WebSocketを使用するため、Web ServiceはStandardプラン以上を推奨します