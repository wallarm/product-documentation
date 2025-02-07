```
wallarm:
  image:
     repository: wallarm/node
     tag: 2.18.1-5
     pullPolicy: Always
  # Wallarm APIエンドポイント:
  # "api.wallarm.com" はEU Cloud用です
  # "us1.api.wallarm.com" はUS Cloud用です
  wallarm_host_api: "api.wallarm.com"
  # デプロイロールを持つユーザーのユーザー名
  deploy_username: "username"
  # デプロイロールを持つユーザーのパスワード
  deploy_password: "password"
  # コンテナが着信リクエストを受け付けるポートを指定します,
  # この値はports.containerPortと同一である必要があります
  # メインアプリコンテナの定義内で
  app_container_port: 80
  # リクエストフィルタリングモード:
  # "off" に設定するとリクエスト処理が無効になります
  # "monitoring" に設定するとリクエスト処理は行うがリクエストをブロックしません
  # "block" に設定すると、すべてのリクエストを処理して悪意のあるものをブロックします
  mode: "block"
  # リクエスト分析データのためのメモリ容量（GB単位）
  tarantool_memory_gb: 2
  # "true" に設定するとIPブロック機能が有効になります
  enable_ip_blocking: "false"
```