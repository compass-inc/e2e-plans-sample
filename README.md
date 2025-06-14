# E2E Testing with Playwright

このプロジェクトは、生成 AI を利用した E2E の実装方法を提案したものです。

## 提案内容

### 手順

Cursor エディターを利用して、次の手順で E2E テストを実装する。

1. AI に依頼して、テスト手順書を md 形式で作成する。
2. テスト手順書に従ったブラウザテストを AI によって実行させる。
3. ブラウザテストに成功した手順書を元に AI によって E2E テストを実装する。
4. PR を作成し、レビュー、修正などを行う。

### メリット

- ブラウザテストを AI により自動実行できる。
- ブラウザテストの再現性が上がる。
- 実動作を確認しながら手順書を作成できる。
- 手順書を構造化できる。
- 手順書の作成をコード実装と同じフローで行うことができる。
- テスト設計者、実施者によって E2E 実装の PR を作成できる。

### 懸念

- 手順書ベースのブラウザテストがどの程度複雑な手順まで自動実行できるか分からない。

## プロジェクト構成

```
.
├── plans/                          # テスト手順書
│   ├── test_settings.md           # テスト共通設定
│   └── login/                      # ログイン関連のテスト計画
├── tests/                          # テストファイル
│   ├── example.spec.ts            # サンプルテスト
│   └── login/                      # ログイン関連のテスト
└── test-results/                   # テスト結果
```

- エラー発生時のスクリーンショットは `test-results/` ディレクトリに保存されます。

## 前提条件

- Node.js (v18 以上推奨)
- npm または yarn

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Playwright ブラウザのインストール

```bash
npx playwright install
```

## MCP の設定

このプロジェクトでは、ブラウザテストを Playwright MCP によって実行します。

### Cursor 用 MCP 設定

Cursor 用の設定ファイル（`~/.cursor/mcp.json`）に以下の設定を追加してください：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### 設定手順

1. `~/.cursor/mcp.json` ファイルを作成または編集
2. 上記の Playwright MCP 設定を追加
3. Cursor を再起動
4. MCP サーバーが正常に接続されていることを確認

### 使用方法

Cursor で Playwright MCP が設定されると、以下のことが可能になります：

- AI による自動ブラウザテストの実行
- テスト手順書に基づいたブラウザ操作の自動化
- スクリーンショットの自動取得
- テスト結果の自動記録
- Cursor 内でのシームレスなテスト実行

## テスト実行

### 基本的なテスト実行

```bash
# すべてのテストを実行（ヘッドレスモード）
npm test

# ブラウザを表示してテストを実行
npm run test:headed

# Playwright Test UIを使用してテストを実行
npm run test:ui

# テストレポートを表示
npm run report
```

### 個別テスト実行

```bash
# ログインページのテストのみ実行
npx playwright test tests/login/login001_login_page.spec.ts

# ログイン機能のテストのみ実行
npx playwright test tests/login/login002_login.spec.ts
```
