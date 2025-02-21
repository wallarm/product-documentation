```yaml
wallarm:
  image:
     repository: wallarm/node
     tag: 3.6.2-1
     pullPolicy: Always
  # Wallarm APIエンドポイント：
  # EU Cloud用は "api.wallarm.com"
  # US Cloud用は "us1.api.wallarm.com"
  wallarm_host_api: "api.wallarm.com"
  # Deployロールを持つユーザーのユーザー名
  deploy_username: "username"
  # Deployロールを持つユーザーのパスワード
  deploy_password: "password"
  # コンテナが着信リクエストを受け入れるポート、
  # 値はmain app containerのports.containerPortと同一である必要があります
  # main app containerの定義
  app_container_port: 80
  # リクエストフィルトレーションモード：
  # リクエスト処理を無効にするには "off"
  # リクエストを処理するがブロックしないには "monitoring"
  # グレイリストのIPからの悪意あるリクエストをブロックするには "safe_blocking"
  # すべてのリクエストを処理し、悪意あるリクエストをブロックするには "block"
  mode: "block"
  # リクエスト解析データ用のメモリ容量（GB）
  tarantool_memory_gb: 2
```