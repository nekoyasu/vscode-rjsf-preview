# RJSF Schema Preview

JSON Schema をインタラクティブな React フォームとしてプレビューできる VS Code 拡張機能です。[react-jsonschema-form (RJSF)](https://github.com/rjsf-team/react-jsonschema-form) を使用しています。

## 機能

- JSON Schema をリアルタイムでフォームとしてプレビュー（編集と同時に更新）
- 複数の UI テーマに対応：Default / Fluent UI（ライト / ダーク）
- 送信したフォームデータを JSON で表示

<!-- TODO: スクリーンショットを追加 -->
<!-- ![screenshot](images/screenshot.png) -->

## インストール

この拡張機能は Marketplace には公開していません。ローカルで `.vsix` をビルドしてインストールすれば、デバッグ実行（F5）なしで利用できます。

```bash
npm install
npm run install:local   # .vsix をパッケージして VS Code にインストール
```

その後、ウィンドウを再読み込みします（`Ctrl+Shift+P` → **開発者: ウィンドウの再読み込み**）。

補足:

- `npm run package` は `rjsf-preview.vsix` の生成のみでインストールはしません。
- `npm run install:local` は `--force` 付きのため、同一バージョンでも上書きされます。コードを変更したら実行し、ウィンドウを再読み込みしてください。
- Remote-WSL の場合、`code --install-extension` は **WSL 側**にインストールされます。Windows ローカルのフォルダを開いたウィンドウでは有効になりません。そちらにも入れる場合は「拡張機能」ビュー右上の **…** → **VSIX からのインストール** で同じ `rjsf-preview.vsix` を指定してください。
- アンインストール: `code --uninstall-extension local.rjsf-preview`

## 使い方

1. JSON Schema ファイルを開く（ファイル名が `schema*.json` または `*schema.json` にマッチするもの）
2. エディタのタイトルバーにあるプレビューアイコンをクリック、またはコマンドパレット（`Cmd+Shift+P`）から **"Open RJSF Form Preview"** を実行
3. サイドパネルにフォームプレビューが表示され、リアルタイムで更新される

## 必要環境

追加のセットアップは不要です。

## 設定

| 設定項目 | 型 | 既定値 | 説明 |
| --- | --- | --- | --- |
| `rjsf-preview.defaultTheme` | `"default"` \| `"fluent-light"` \| `"fluent-dark"` | `"default"` | フォームプレビューの既定 UI テーマ。`default` は RJSF 標準テーマ、それ以外は Fluent UI（ライト / ダーク）。 |

テーマはプレビューパネル上でも切り替えられます。この設定はプレビューを開いたときに選択されるテーマを決めるものです。

## 既知の問題

<!-- TODO: 既知の問題を記載 -->

## リリースノート

### 0.1.0

初回リリース。

## ライセンス

MIT
