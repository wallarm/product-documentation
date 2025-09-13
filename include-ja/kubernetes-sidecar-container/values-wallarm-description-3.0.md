```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.0.0-3
     pullPolicy: Always
  # Wallarm APIエンドポイント: 
  # "api.wallarm.com"はEU Cloud用です
  # "us1.api.wallarm.com"はUS Cloud用です
  wallarm_host_api: "api.wallarm.com"
  # Deployロールを持つユーザーのユーザー名です
  deploy_username: "username"
  # Deployロールを持つユーザーのパスワードです
  deploy_password: "password"
  # コンテナが受信リクエストを受け付けるポートで、
  # メインアプリケーションコンテナの定義内の
  # ports.containerPortと同一である必要があります
  app_container_port: 80
  # リクエストフィルタリングモード:
  # "off"はリクエスト処理を無効化します
  # "monitoring"はリクエストを処理しますが、ブロックしません
  # "safe_blocking"はグレーリストに登録されたIPからの悪意のあるリクエストをブロックします
  # "block"はすべてのリクエストを処理し、悪意のあるものをブロックします
  mode: "block"
  # リクエスト分析データ用のメモリ容量(GB)です
  tarantool_memory_gb: 2
```