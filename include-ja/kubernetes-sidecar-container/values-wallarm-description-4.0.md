```yaml
wallarm:
  image:
     repository: wallarm/node
     tag: 4.0.2-1
     pullPolicy: Always
  # Wallarm APIエンドポイント:
  # EU Cloudの場合は "api.wallarm.com"
  # US Cloudの場合は "us1.api.wallarm.com"
  wallarm_host_api: "api.wallarm.com"
  # Wallarmノードトークン
  wallarm_api_token: "token"
  # コンテナが着信リクエストを受け付けるポート、
  # この値はメインアプリコンテナの ports.containerPort の定義と同一である必要があります
  app_container_port: 80
  # リクエストフィルタリングモード:
  # "off" はリクエスト処理を無効にします
  # "monitoring" はリクエストを処理しますがブロックしません
  # "safe_blocking" はグレイリストされたIPから発信された悪意のあるリクエストをブロックします
  # "block" は全てのリクエストを処理し、悪意のあるリクエストをブロックします
  mode: "block"
  # リクエスト解析データ用のメモリ容量（GB単位）
  tarantool_memory_gb: 2
```