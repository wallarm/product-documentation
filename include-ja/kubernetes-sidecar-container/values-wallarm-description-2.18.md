```
wallarm:
  image:
     repository: wallarm/node
     tag: 2.18.1-5
     pullPolicy: Always
  # WallarmのAPIエンドポイント: 
  # EU Cloudの場合は"api.wallarm.com"です
  # US Cloudの場合は"us1.api.wallarm.com"です
  wallarm_host_api: "api.wallarm.com"
  # Deployロールを持つユーザーのユーザー名です
  deploy_username: "username"
  # Deployロールを持つユーザーのパスワードです
  deploy_password: "password"
  # コンテナが受信リクエストを受け付けるポートです。
  # 値はports.containerPortと同一にする必要があります。
  # メインアプリケーションコンテナの定義内です。
  app_container_port: 80
  # リクエストフィルタリングモード:
  # リクエスト処理を無効にするには"off"を使用します
  # リクエストを処理するがブロックしない場合は"monitoring"を使用します
  # すべてのリクエストを処理し、悪意のあるものをブロックするには"block"を使用します
  mode: "block"
  # リクエスト分析データ用のメモリ量(GB)です
  tarantool_memory_gb: 2
  # IP Blocking機能を有効にするには"true"に設定します
  enable_ip_blocking: "false"
```