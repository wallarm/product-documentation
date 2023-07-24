```
apiVersion: apps/v1
kind: Deployment
metadata:
  名前: myapp
spec:
  選択器:
    matchLabels:
      アプリ: myapp
  テンプレート:
    metadata:
      ラベル:
        アプリ: myapp
    spec:
      コンテナ:
        # Wallarm要素: Wallarmサイドカーコンテナの定義
        - 名前: wallarm
          画像: wallarm/node:3.6.2-1
          imagePullPolicy: いつでも
          env:
          # Wallarm APIエンドポイント: 
          # "api.wallarm.com"はEUクラウド向け
          # "us1.api.wallarm.com"はUSクラウド向け
          - 名前: WALLARM_API_HOST
            値: "api.wallarm.com"
          # デプロイ役割を持つユーザーのユーザー名
          - 名前: DEPLOY_USER
            値: "username"
          # デプロイ役割を持つユーザーのパスワード
          - 名前: DEPLOY_PASSWORD
            値: "password"
          - 名前: DEPLOY_FORCE
            値: "true"
          # リクエスト分析データのメモリ量（GB）
          - 名前: TARANTOOL_MEMORY_GB
            値: "2"
          ポート:
          - 名前: http
            # ポートは、WallarmサイドカーコンテナがServiceオブジェクトからのリクエストを受け付けるポート
            containerPort: 80
          volumeMounts：	
          - mountPath: /etc/nginx/sites-enabled	
            読み取り専用: true	
            名前: wallarm-nginx-conf
        # メインアプリのコンテナの定義
        - 名前: myapp
          画像: <画像>
          リソース:
            制限:
              メモリ: "128Mi"
              cpu: "500m"
          ポート:
          # ポートは、アプリケーションコンテナが着信要求を受け付けるポート
          - containerPort: 8080
      ボリューム:
      # Wallarm要素: wallarm-nginx-confボリュームの定義
      - 名前: wallarm-nginx-conf
        configMap:
          名前: wallarm-sidecar-nginx-conf
          アイテム:
            - キー: default
              パス: default
```