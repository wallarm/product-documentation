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
      # お使いのメインアプリケーションコンテナの定義です
      - name: myapp 
        image: <Image>
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        # アプリケーションコンテナが外部からのリクエストを受け付けるポートです
        - containerPort: 8080 
```