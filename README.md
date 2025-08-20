# tyokudori - アフィリエイト管理システム

アフィリエイト運営会社向けのASP（Affiliate Service Provider）管理システムです。

## 機能

- 3つのユーザーロール: Admin（運営）、Publisher（アフィリエイター）、Advertiser（広告主）
- リアルタイム成果通知（WebSocket）
- 100%モバイル対応
- 外部サービス連携対応
- お問い合わせ管理システム
- 洗練されたUI/UXデザイン

## 技術スタック

- **フロントエンド**: Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui
- **バックエンド**: Node.js, Express, Prisma ORM, PostgreSQL, Socket.IO
- **インフラ**: Render対応

## セットアップ

1. 依存関係のインストール
```bash
npm install
```

2. 環境変数の設定
```bash
cp .env.example .env
# .envファイルを編集して必要な値を設定
```

3. データベースのセットアップ
```bash
npm run migrate:dev
npm run seed  # 初期データ投入（オプション）
```

4. 開発サーバーの起動
```bash
npm run dev
```

ブラウザが自動的に開き、http://localhost:3000 でアプリケーションにアクセスできます。

## デプロイ（Render）

1. Renderでアカウントを作成
2. このリポジトリをGitHubにプッシュ
3. Renderダッシュボードで「New Blueprint Instance」を選択
4. GitHubリポジトリを接続
5. render.yamlが自動的に検出され、必要なサービスが作成されます
6. 環境変数を設定:
   - Firebaseの認証情報
   - NEXTAUTH_SECRET（生成する）
   - JWT_SECRET（生成する）
   - その他の必要な環境変数（.env.exampleを参照）

### 注意事項

- PostgreSQLとRedisは自動的にプロビジョニングされます
- 初回デプロイ後、Prismaマイグレーションを実行する必要があります
- WebSocketサポートのためにWeb ServiceのプランはStandard以上を推奨

## 開発コマンド

- `npm run dev` - 開発サーバー起動（ブラウザ自動オープン）
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバー起動
- `npm run lint` - ESLintチェック
- `npm run typecheck` - TypeScriptタイプチェック
- `npm run migrate:dev` - データベースマイグレーション（開発）
- `npm run migrate` - データベースマイグレーション（本番）