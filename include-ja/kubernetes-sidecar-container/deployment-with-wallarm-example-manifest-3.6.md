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
        # Wallarm要素: Wallarmサイドカーコンテナの定義です
        - name: wallarm
          image: wallarm/node:3.6.2-1
          imagePullPolicy: Always
          env:
          # Wallarm APIエンドポイントです:
          # "api.wallarm.com"はEU Cloud用です
          # "us1.api.wallarm.com"はUS Cloud用です
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # Deployロールのユーザー名です
          - name: DEPLOY_USER
            value: "username"
          # Deployロールのユーザーパスワードです
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # リクエスト解析データ用のメモリ(GB)の量です
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # WallarmサイドカーコンテナがServiceオブジェクトからのリクエストを受け付けるポートです
            containerPort: 80
          volumeMounts:	
          - mountPath: /etc/nginx/sites-enabled	
            readOnly: true	
            name: wallarm-nginx-conf
        # メインアプリのコンテナ定義です
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # アプリケーションコンテナがリクエストを受け付けるポートです
          - containerPort: 8080
      volumes:
      # Wallarm要素: wallarm-nginx-confボリュームの定義です
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```