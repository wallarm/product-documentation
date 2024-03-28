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
      # تعريف حاوية التطبيق الرئيسية الخاصة بك
      - name: myapp 
        image: <Image>
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        # البورت الذي تقبل فيه حاوية التطبيق الطلبات الواردة
        - containerPort: 8080 
```