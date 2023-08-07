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
          image: wallarm/node:3.6.2-1
          imagePullPolicy: Always
          env:
          # Wallarm API エンドポイント: 
          # "api.wallarm.com" は EU クラウドの場合
          # "us1.api.wallarm.com" は US クラウドの場合
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # Deploy ロールを持つユーザーのユーザー名
          - name: DEPLOY_USER
            value: "username"
          # Deploy ロールを持つユーザーのパスワード
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # リクエスト分析データのメモリ容量(GB)
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # Wallarm サイドカーコンテナが Service オブジェクトからのリクエストを受け付けるポート
            containerPort: 80
          volumeMounts:  
          - mountPath: /etc/nginx/sites-enabled  
            readOnly: true  
            name: wallarm-nginx-conf
        # メインのアプリケーションコンテナの定義
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # アプリケーションコンテナが受け付ける入力リクエストのポート
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