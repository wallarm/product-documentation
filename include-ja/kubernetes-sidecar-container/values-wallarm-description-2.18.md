```
wallarm:
  image:
     repository: wallarm/node
     tag: 2.18.1-5
     pullPolicy: いつも
  # Wallarm APIエンドポイント： 
  # EUクラウドの場合は "api.wallarm.com"
  # USクラウドの場合は "us1.api.wallarm.com"
  wallarm_host_api: "api.wallarm.com"
  # デプロイ役割を持つユーザーのユーザーネーム
  deploy_username: "ユーザーネーム"
  # デプロイ役割を持つユーザーのパスワード
  deploy_password: "パスワード"
  # コンテナが着信リクエストを受け入れるポート、
  # この値は、あなたのメインアプリケーションコンテナの定義にあるports.containerPortと同じでなければなりません
  app_container_port: 80
  # リクエストフィルタリングモード：
  # リクエスト処理を無効にするには "off"
  # リクエストを処理するがブロックしない場合は "monitoring"
  # すべてのリクエストを処理し、悪意のあるものをブロックする場合は "block"
  mode: "block"
  # リクエスト分析データのメモリ量（GB）
  tarantool_memory_gb: 2
  # IPブロッキング機能を有効にするには "true" を設定
  enable_ip_blocking: "false"
```