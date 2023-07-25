```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.2.1-1
     pullPolicy: Always
  # Wallarm API エンドポイント
  # EU クラウドの場合は "api.wallarm.com"
  # US クラウドの場合は "us1.api.wallarm.com
  wallarm_host_api: "api.wallarm.com"
  # Deploy 役割のユーザーのユーザー名
  deploy_username: "username"
  # Deploy 役割のユーザーのパスワード
  deploy_password: "password"
  # コンテナが着信リクエストを受け入れるポート
  # この値は ports.containerPort と
  # メインアプリコンテナの定義で同一である必要があります
  app_container_port: 80
  # リクエストのフィルタリングモード
  # リクエスト処理を無効にするには "off"
  # リクエストは処理するがブロックしない場合は "monitoring"
  # グレイリストに登録されたIPからの悪意のあるリクエストをブロックする場合は "safe_blocking"
  # すべてのリクエストを処理し、悪意のあるものをブロックするには "block"
  mode: "block"
  # リクエスト解析データのメモリ容量 (GB)
  # 推奨値はサーバーの合計メモリの75%
  tarantool_memory_gb: 2
```