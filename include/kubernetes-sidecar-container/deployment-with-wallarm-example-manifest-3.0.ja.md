```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        # Wallarm 要素: Wallarm サイドカーコンテナの定義
        - name: wallarm
          image: wallarm/node:3.0.0-3
          imagePullPolicy: Always
          env:
          # Wallarm API エンドポイント: 
          # EU クラウドの場合 "api.wallarm.com"
          # US クラウドの場合 "us1.api.wallarm.com"
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # デプロイロールを持つユーザーのユーザー名
          - name: DEPLOY_USER
            value: "username"
          # デプロイロールを持つユーザーのパスワード
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # リクエスト分析データのメモリ量（GB）、
          # 推奨値はサーバーメモリの75％
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # サービスオブジェクトからのリクエストを受け入れる
            # Wallarm サイドカーコンテナのポート
            containerPort: 80
          volumeMounts:	
          - mountPath: /etc/nginx/sites-enabled	
            readOnly: true	
            name: wallarm-nginx-conf
        # メインアプリケーションコンテナの定義
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # アプリケーションコンテナが受信リクエストを受け入れるポート
          - containerPort: 8080
      volumes:
      # Wallarm 要素: wallarm-nginx-conf ボリュームの定義
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```