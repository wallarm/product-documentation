```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.2.1-1
     pullPolicy: Always
  # Wallarm APIエンドポイント： 
  # "api.wallarm.com"はEU Cloud向けです。
  # "us1.api.wallarm.com"はUS Cloud向けです。
  wallarm_host_api: "api.wallarm.com"
  # Deployロールを持つユーザーのユーザー名です。
  deploy_username: "username"
  # Deployロールを持つユーザーのパスワードです。
  deploy_password: "password"
  # コンテナが受信リクエストを受け付けるポートです。
  # 値はメインアプリコンテナの定義内にある
  # ports.containerPortと同一にする必要があります。
  app_container_port: 80
  # リクエストフィルタリングモード：
  # "off"はリクエスト処理を無効にします。
  # "monitoring"はリクエストは処理しますがブロックしません。
  # "safe_blocking"はグレーリスト化されたIPアドレスからの悪意あるリクエストをブロックします。
  # "block"はすべてのリクエストを処理し、悪意あるものをブロックします。
  mode: "block"
  # リクエスト分析データ用のメモリ量（GB）です。
  tarantool_memory_gb: 2
```