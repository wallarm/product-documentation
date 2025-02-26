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
        # Wallarm要素：Wallarmサイドカーコンテナの定義です
        - name: wallarm
          image: wallarm/node:3.2.1-1
          imagePullPolicy: Always
          env:
          # Wallarm APIエンドポイントです：
          # EU Cloudの場合は"api.wallarm.com"
          # US Cloudの場合は"us1.api.wallarm.com"
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # Deployロールを持つユーザーのユーザー名です
          - name: DEPLOY_USER
            value: "username"
          # Deployロールを持つユーザーのパスワードです
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # リクエスト解析データ用のメモリ容量（GB単位）です
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # ServiceオブジェクトからのリクエストをWallarmサイドカーコンテナが受け付けるポートです
            containerPort: 80
          volumeMounts:	
          - mountPath: /etc/nginx/sites-enabled	
            readOnly: true	
            name: wallarm-nginx-conf
        # メインアプリコンテナの定義です
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # アプリケーションコンテナが着信リクエストを受け付けるポートです
          - containerPort: 8080
      volumes:
      # Wallarm要素：wallarm-nginx-confボリュームの定義です
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```