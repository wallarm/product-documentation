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
      # メインアプリコンテナの定義
      - name: myapp 
        image: <Image>
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        # アプリケーションコンテナが受信リクエストを受け入れるポート
        - containerPort: 8080 
```