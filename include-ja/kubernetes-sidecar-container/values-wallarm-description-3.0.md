```yaml
wallarm:
  image:
     repository: wallarm/node
     tag: 3.0.0-3
     pullPolicy: Always
  # Wallarm APIエンドポイント:
  # "api.wallarm.com"はEU Cloud用です
  # "us1.api.wallarm.com"はUS Cloud用です
  wallarm_host_api: "api.wallarm.com"
  # Deployロールを持つユーザーのユーザー名
  deploy_username: "username"
  # Deployロールを持つユーザーのパスワード
  deploy_password: "password"
  # コンテナが要求を受け付けるポートです,
  # この値はmain app containerのports.containerPortの定義と同一でなければなりません
  app_container_port: 80
  # 要求フィルトレーションモード:
  # "off"は要求処理を無効にします
  # "monitoring"は要求を処理しますがブロックしません
  # "safe_blocking"はgraylisted IPから発生した悪意ある要求をブロックします
  # "block"はすべての要求を処理し、悪意ある要求をブロックします
  mode: "block"
  # 要求分析データ用のメモリ容量(GB)
  tarantool_memory_gb: 2
```