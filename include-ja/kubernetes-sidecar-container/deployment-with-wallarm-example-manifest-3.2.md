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
        # Wallarmのエレメント：Wallarmサイドカーコンテナの定義
        - name: wallarm
          image: wallarm/node:3.2.1-1
          imagePullPolicy: Always
          env:
          # Wallarm APIエンドポイント：
          # "api.wallarm.com"はEUクラウドの場合
          # "us1.api.wallarm.com"はUSクラウドの場合
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
          # リクエスト分析データのためのメモリ量（GB）
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
        # メインアプリコンテナの定義
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # アプリケーションコンテナがインバウンドリクエストを受け入れるポート
          - containerPort: 8080
      volumes:
      # Wallarmのエレメント：wallarm-nginx-confボリュームの定義
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```