```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.6.2-1
     pullPolicy: 常に
  # Wallarm APIエンドポイント: 
  # EUクラウドの場合は "api.wallarm.com"
  # USクラウドの場合は "us1.api.wallarm.com"
  wallarm_host_api: "api.wallarm.com"
  # デプロイロールを持つユーザーのユーザー名
  deploy_username: "username"
  # デプロイロールを持つユーザーのパスワード
  deploy_password: "password"
  # コンテナが受信リクエストを受け入れるポート。
  # 値はあなたのメインアプリコンテナの定義内の ports.containerPort と 
  # 同一でなければなりません。
  app_container_port: 80
  # リクエストのフィルタリングモード:
  # リクエスト処理を無効にするためには "off"
  # リクエストを処理するがブロックしないためには "monitoring"
  # グレイリスト化されたIPから発生した悪意のあるリクエストをブロックするためには "safe_blocking"
  # 全てのリクエストを処理し、悪意のあるものをブロックするためには "block"
  mode: "block"
  # リクエスト分析データのためのメモリ量（GB）
  tarantool_memory_gb: 2
```