```
wallarm:
  image:
     repository: wallarm/node
     tag: 4.0.2-1
     pullPolicy: 常に
  # Wallarm APIエンドポイント: 
  # "api.wallarm.com" はEUクラウド用
  # "us1.api.wallarm.com" はUSクラウド用
  wallarm_host_api: "api.wallarm.com"
  # Wallarmノードトークン
  wallarm_api_token: "トークン"
  # コンテナが受信リクエストを受け入れるポート、
  # この値はports.containerPortと同一である必要があります
  # これがあなたのメインアプリケーションコンテナの定義です
  app_container_port: 80
  # リクエストのフィルタリングモード：
  # "off" はリクエストの処理を無効にします
  # "monitoring" はリクエストを処理しますがブロックしません
  # "safe_blocking" はグレイリスト化されたIPからの悪意あるリクエストをブロックします
  # "block" は全てのリクエストを処理し、悪意あるものをブロックします
  mode: "block"
  # リクエスト分析データのためのメモリ量（GB）
  tarantool_memory_gb: 2
```