```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.6.2-1
     pullPolicy: Always
  # Wallarm APIエンドポイント: 
  # EU Cloudの場合は"api.wallarm.com"です
  # US Cloudの場合は"us1.api.wallarm.com"です
  wallarm_host_api: "api.wallarm.com"
  # Deployロールを持つユーザーのユーザー名です
  deploy_username: "username"
  # Deployロールを持つユーザーのパスワードです
  deploy_password: "password"
  # コンテナが外部からのリクエストを受け付けるポートです
  # 値はメインアプリケーションコンテナの定義内にある
  # ports.containerPortと同一である必要があります
  app_container_port: 80
  # リクエストフィルタリングモード:
  # リクエスト処理を無効にするには"off"を使用します
  # リクエストは処理しますがブロックしない場合は"monitoring"を使用します
  # グレーリストに登録されたIPアドレスからの悪意のあるリクエストをブロックするには"safe_blocking"を使用します
  # すべてのリクエストを処理し、悪意のあるものをブロックするには"block"を使用します
  mode: "block"
  # リクエスト分析データ用のメモリ量(GB)です
  tarantool_memory_gb: 2
```