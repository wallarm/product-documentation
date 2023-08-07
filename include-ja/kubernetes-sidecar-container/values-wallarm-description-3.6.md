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
  # コンテナが着信リクエストを受け入れるポート の番号。
  # 値はポート.containerPortを使用するように設定する操作
  # あなたのメインアプリコンテナの定義において
  app_container_port: 80
  # リクエストフィルタリングモード:
  # 処理を無効にするために"off"
  # 処理を行うがリクエストをブロックしないために"monitoring"
  # グレイリストのIPからの悪意のあるリクエストをブロックするために"safe_blocking"
  # すべてのリクエストを処理し、悪意のあるものをブロックするために"block"
  mode: "block"
  # リクエスト分析データのためのメモリの量(GB)
  tarantool_memory_gb: 2
```