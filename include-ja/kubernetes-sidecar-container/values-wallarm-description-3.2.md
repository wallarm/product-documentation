```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.2.1-1
     pullPolicy: 常に
  # Wallarm APIエンドポイント: 
  # EUクラウドの場合は "api.wallarm.com"
  # USクラウドの場合は "us1.api.wallarm.com"
  wallarm_host_api: "api.wallarm.com"
  # デプロイ役割を持つユーザーのユーザー名
  deploy_username: "username"
  # デプロイ役割を持つユーザーのパスワード
  deploy_password: "password"
  # コンテナが受信リクエストを受け入れるポート、
  # 値はports.containerPortと
  # あなたのメインのアプリケーションコンテナの定義と同じでなければならない
  app_container_port: 80
  # リクエストフィルタリングモード:
  # 処理を無効にするには "off"
  # リクエストは処理されますが、ブロックはされません "monitoring"
  # グレーリストに指定されたIPからの悪意のあるリクエストをブロック "safe_blocking"
  # すべてのリクエストを処理し、悪意のあるものをブロックします "block"
  mode: "block"
  # リクエスト分析データのためのメモリの量（GB単位）
  tarantool_memory_gb: 2
```