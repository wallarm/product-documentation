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
          image: wallarm/node:3.0.0-3
          imagePullPolicy: Always
          env:
          # Wallarm APIエンドポイント:
          # EUクラウド向け「api.wallarm.com」
          # USクラウド向け「us1.api.wallarm.com」
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # Deploy役割を持つ利用者のユーザー名
          - name: DEPLOY_USER
            value: "username"
          # Deploy役割を持つユーザのパスワード
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # リクエスト分析データ用のメモリの量（GB単位）
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
        # あなたのメインアプリのコンテナの定義
        - name: myapp
          image: <画像>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # アプリケーションコンテナがインカミングリクエストを受け入れるポート
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