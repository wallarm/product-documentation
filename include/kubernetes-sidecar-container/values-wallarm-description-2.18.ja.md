```
wallarm:
  image:
     repository: wallarm/node
     tag: 2.18.1-5
     pullPolicy: 常に
  # Wallarm APIエンドポイント:
  # EUクラウドの場合は "api.wallarm.com"
  # USクラウドの場合は "us1.api.wallarm.com"
  wallarm_host_api: "api.wallarm.com"
  # デプロイ役割を持つユーザーのユーザー名
  deploy_username: "username"
  # デプロイ役割を持つユーザーのパスワード
  deploy_password: "password"
  # コンテナが受信リクエストを受け入れるポート。 
  # この値は、メインアプリコンテナの定義のports.containerPortと一致する必要があります
  app_container_port: 80
  # リクエストのフィルタリングモード:
  # 処理を無効にするには "off"
  # リクエストを処理するがブロックしない場合は "monitoring"
  # 全てのリクエストを処理し、不正なリクエストをブロックする場合は "block"
  mode: "block"
  # リクエスト解析データのメモリ量（GB）
  tarantool_memory_gb: 2
  # IPブロック機能を有効にするには "true" に設定します
  enable_ip_blocking: "false"
```