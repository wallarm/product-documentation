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
        # Wallarm要素：Wallarmサイドカーコンテナの定義
        - name: wallarm
          image: wallarm/node:2.18.1-5
          imagePullPolicy: Always
          env:
          # Wallarm APIエンドポイント：
          # EUクラウド用 "api.wallarm.com"
          # USクラウド用 "us1.api.wallarm.com"
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # Deploy役割を持つユーザーのユーザー名
          - name: DEPLOY_USER
            value: "username"
          # Deploy役割を持つユーザーのパスワード
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # IPブロッキング機能を有効にするかどうか
          - name: WALLARM_ACL_ENABLE
            value: "true"
          # リクエスト分析データのメモリ量（GB）
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # Wallarmサイドカーコンテナがサービスオブジェクトからのリクエストを受け入れるポート
            containerPort: 80
          volumeMounts:
          - mountPath: /etc/nginx/sites-enabled
            readOnly: true
            name: wallarm-nginx-conf
        # あなたのメインアプリケーションコンテナの定義
        - name: myapp
          image: <イメージ>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # アプリケーションコンテナが着信リクエストを受け入れるポート
          - containerPort: 8080
      volumes:
      # Wallarm要素：wallarm-nginx-confボリュームの定義
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```