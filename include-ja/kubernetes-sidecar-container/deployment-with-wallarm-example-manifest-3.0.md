```yaml
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
        # Wallarm要素: Wallarmサイドカーコンテナの定義
        - name: wallarm
          image: wallarm/node:3.0.0-3
          imagePullPolicy: Always
          env:
          # Wallarm APIエンドポイント:
          # "api.wallarm.com"はEU Cloud用です
          # "us1.api.wallarm.com"はUS Cloud用です
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # Deployロールを持つユーザーのユーザー名
          - name: DEPLOY_USER
            value: "username"
          # Deployロールを持つユーザーのパスワード
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # リクエストの解析データに使用するメモリ容量（GB単位）
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # WallarmサイドカーコンテナがServiceオブジェクトからのリクエストを受け付けるポート
            containerPort: 80
          volumeMounts:	
          - mountPath: /etc/nginx/sites-enabled	
            readOnly: true	
            name: wallarm-nginx-conf
        # メインアプリコンテナの定義
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # アプリケーションコンテナが着信リクエストを受け付けるポート
          - containerPort: 8080
      volumes:
      # Wallarm要素: wallarm-nginx-confボリュームの定義
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```