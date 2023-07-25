```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.0.0-3
     pullPolicy: Always
  # Wallarm API エンドポイント:
  # EUクラウドの場合："api.wallarm.com"
  # 米国クラウドの場合："us1.api.wallarm.com"
  wallarm_host_api: "api.wallarm.com"
  # Deployロールを持つユーザーのユーザー名
  deploy_username: "username"
  # Deployロールを持つユーザーのパスワード
  deploy_password: "password"
  # コンテナが着信リクエストを受け入れるポート
  # 値はプリンシパルアプリコンテナの概念におけるports.containerPortと同じである必要があります
  app_container_port: 80
  # リクエストフィルタリングモード:
  # リクエスト処理を無効にするには"off"
  # リクエストを処理するがブロックしない："monitoring"
  # グレイリスト化されたIPからの悪意のあるリクエストをブロック："safe_blocking"
  # すべてのリクエストを処理し、悪意のあるものをブロック："block"
  mode: "block"
  # リクエスト分析データのメモリ量(GB)、
  # 推奨値はサーバーの総メモリの75％
  tarantool_memory_gb: 2
```