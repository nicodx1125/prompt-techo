# PromptBase (プロンプトベース)

開発者向けのシンプルでモダンなプロンプト管理アプリケーションです。Next.js と Supabase を使用して構築されています。

## 特徴

*   **簡単なプロンプト登録:** タイトル、本文、タグを入力してすぐに保存。
*   **リアルタイム検索:** キーワードでプロンプトを瞬時にフィルタリング。
*   **ワンクリックコピー:** コードブロックスタイルの表示と、ワンクリックでのコピー機能。
*   **レスポンシブデザイン:** PCでもスマホでも快適に利用可能。
*   **ダークモード:** 目に優しいダークテーマを採用。

## 技術スタック

*   **Framework:** Next.js (App Router)
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Backend:** Supabase

## セットアップ手順

> [!NOTE]
> 現在はMVPとして **LocalStorage** を使用してデータをブラウザに保存しています。Supabaseの設定は不要ですぐに動作確認が可能です。

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd prompt-base
npm install
```

### 2. 環境変数の設定 (Supabase利用時のみ)

> 現在はスキップ可能です。将来的にSupabaseを有効化する場合に設定してください。

プロジェクトルートに `.env.local` ファイルを作成し、以下の変数を設定してください。これらは Supabase プロジェクトの設定画面から取得できます。

```bash
NEXT_PUBLIC_SUPABASE_URL=你的_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_SUPABASE_ANON_KEY
```

### 3. Supabase データベースの準備 (Supabase利用時のみ)

> 現在はスキップ可能です。

Supabase の SQL エディタで以下の SQL を実行して、テーブルを作成してください。

```sql
create table prompts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  tags text[] default array[]::text[],
  created_at timestamptz default now()
);

-- RLS (Row Level Security) の設定
alter table prompts enable row level security;

-- 誰でもデータの読み取りを許可
create policy "Allow public read access" on prompts for select using (true);

-- 誰でもデータの追加を許可
create policy "Allow public insert access" on prompts for insert with check (true);
```

### 4. ローカル開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

## Vercel へのデプロイ

1.  GitHub にコードをプッシュします。
2.  Vercel で新しいプロジェクトを作成し、リポジトリをインポートします。
3.  **Environment Variables** の設定で、`.env.local` と同様に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を追加します。
4.  Deploy をクリックして完了です。
