```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.2.1-1
     pullPolicy: Always
  # Wallarm APIエンドポイント:
  # EU Cloudの場合は"api.wallarm.com"
  # US Cloudの場合は"us1.api.wallarm.com"
  wallarm_host_api: "api.wallarm.com"
  # Deployロールを持つユーザーのユーザー名
  deploy_username: "username"
  # Deployロールを持つユーザーのパスワード
  deploy_password: "password"
  # コンテナが受信するリクエストのポート、
  # 値はメインアプリコンテナのports.containerPortの定義と同一である必要があります
  app_container_port: 80
  # リクエストのフィルタリングモード:
  # "off" リクエスト処理を無効にします
  # "monitoring" リクエストを処理しますがブロックしません
  # "safe_blocking" グレイリストに含まれるIPからの悪意あるリクエストをブロックします
  # "block" 全リクエストを処理し、悪意あるリクエストをブロックします
  mode: "block"
  # リクエスト解析データ用のメモリ容量 (GB単位)
  tarantool_memory_gb: 2
```