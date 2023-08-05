```
wallarm:
  image:
     リポジトリ: wallarm/node
     タグ: 3.0.0-3
     プルポリシー: 常に
  # WallarmのAPIエンドポイント: 
  # EUクラウドの場合は "api.wallarm.com"
  # USクラウドの場合は "us1.api.wallarm.com"
  wallarm_host_api: "api.wallarm.com"
  # Deploy役割を持つユーザーのユーザー名
  deploy_username: "username"
  # Deploy役割を持つユーザーのパスワード
  deploy_password: "パスワード"
  # コンテナが受信リクエストを受け付けるポート
  # 値はポート.containerPort
  # あなたのメインアプリコンテナの設定と同じでなければなりません
  app_container_port: 80
  # リクエストフィルトレーションモード：
  # "off"でリクエスト処理を無効化
  # "モニタリング"でリクエストを処理するがブロックしない
  # "safe_blocking"で、グレイリストに登録されたIPからの悪意のあるリクエストをブロック
  # "block"で全てのリクエストを処理し、悪意のあるものはブロック
  モード: "block"
  # リクエスト分析データ用のメモリ容量（GB）
  tarantool_memory_gb: 2
```
