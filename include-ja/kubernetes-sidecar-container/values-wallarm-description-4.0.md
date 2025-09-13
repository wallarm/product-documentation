```
wallarm:
  image:
     repository: wallarm/node
     tag: 4.0.2-1
     pullPolicy: Always
  # WallarmのAPIエンドポイントは以下のとおりです: 
  # EU Cloudの場合は"api.wallarm.com"です。
  # US Cloudの場合は"us1.api.wallarm.com"です。
  wallarm_host_api: "api.wallarm.com"
  # Wallarmノードのトークンです。
  wallarm_api_token: "token"
  # コンテナが受信リクエストを受け付けるポートです。
  # 値は、メインアプリコンテナの定義にある
  # ports.containerPortと同一にする必要があります。
  app_container_port: 80
  # リクエストのフィルタリングモードです:
  # リクエスト処理を無効にする場合は"off"を指定します。
  # リクエストは処理しますがブロックしない場合は"monitoring"を指定します。
  # グレーリストに登録されたIPからの悪意のあるリクエストのみをブロックする場合は"safe_blocking"を指定します。
  # すべてのリクエストを処理し、悪意のあるものをブロックする場合は"block"を指定します。
  mode: "block"
  # リクエスト分析データ用のメモリ容量(GB)です。
  tarantool_memory_gb: 2
```