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
          image: wallarm/node:3.2.1-1
          imagePullPolicy: Always
          env:
          # Wallarm API エンドポイント:
          # "api.wallarm.com" (EU クラウド用)
          # "us1.api.wallarm.com" (US クラウド用)
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # Deploy ロールを持つユーザのユーザ名
          - name: DEPLOY_USER
            value: "username"
          # Deploy ロールを持つユーザのパスワード
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # 要求分析データのメモリ量（GB）、
          # 推奨値はサーバーの合計メモリの 75％
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # Wallarm サイドカーコンテナが Service オブジェクトからのリクエストを受け入れるポート
            containerPort: 80
          volumeMounts:    
          - mountPath: /etc/nginx/sites-enabled    
            readOnly: true    
            name: wallarm-nginx-conf
        # メインアプリコンテナの定義
        - name: myapp
          image: <イメージ>
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