```
wallarm:
  image:
     repository: wallarm/node
     tag: 4.0.2-1
     pullPolicy: 常時引き出す
  # Wallarm APIエンドポイント: 
  # EUクラウドの場合は "api.wallarm.com"
  # USクラウドの場合は "us1.api.wallarm.com"
  wallarm_host_api: "api.wallarm.com"
  # Wallarm ノードトークン
  wallarm_api_token: "token"
  # コンテナが入力リクエストを受け付けるポート、
  # その値はports.containerPortとmain appコンテナの定義が同じでなければならない。
  app_container_port: 80
  # リクエストフィルタリングモード:
  # 処理を無効にするには "off"
  # リクエストを処理するがブロックしない場合は "monitoring"
  # グレイリストIP由来の悪意あるリクエストをブロックするには、"safe_blocking"
  # すべてのリクエストを処理し、悪意あるものをブロックするには、"block"
  mode: "block"
  # リクエスト分析データのメモリ量(GB)
  tarantool_memory_gb: 2
```
