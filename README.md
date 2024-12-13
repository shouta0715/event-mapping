# Webプロジェクションマッピング同期システム

## セットアップ

- pnpm のインストールが必要です。インストール方法は以下のリンクを参照してください。
  - https://pnpm.io/installation

```bash
git clone https://github.com/shouta0715/event-mapping
cd event-mapping
```

1. 依存関係のインストール

```bash
pnpm install
```

2. データベースのセットアップ

- データベースの初期化

```bash
pnpm db:generate
```

- データベースのマイグレーションファイルを生成します。

```bash
pnpm db:apply
```

- seed データの投入

```bash
cd apps/api
pnpm db:seed
```

3. 管理画面の設定

- 管理画面の環境変数の設定

```bash
cd apps/admin
cp .env.example .env.local
```

- パッケージのビルド
  ルートから実行してください。

```bash
pnpm build:packages
```

- 管理画面の起動

ルートから実行してください。

```bash
pnpm dev:propeller
```

- 管理画面にアクセス

```bash
http://localhost:3000
```

4. イベントの設定

- `http://localhost:3000`にアクセスしてください。
- サンプル -> プロペラを選択してください。
- コンテンツIDをコピーしてください。
- `apps/events/propeller`の`.env.local`のファイルを作成してください。
  - ```bash
    cd apps/events/propeller
    cp .env.example .env.local
    ```
- コンテンツIDを`apps/events/propeller`の`.env.local`の`VITE_SOURCE_ID`に設定してください。
- なにも表示されない場合は、再度`pnpm dev:propeller`を実行してください。

その他のイベントも同様に行ってください。
イベントの起動方法は`pnpm dev:{event-name}`で行ってください。

ターミナル上のCLIは上下矢印で起動中のパッケージを選択、Enterで確定、その後いつもと同じ1つ分のターミナルになります。