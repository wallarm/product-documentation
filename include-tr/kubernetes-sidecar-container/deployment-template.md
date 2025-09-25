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
      # Ana uygulama konteynerinizin tanımı
      - name: myapp 
        image: <Image>
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        # Uygulama konteynerinin gelen istekleri kabul ettiği bağlantı noktası
        - containerPort: 8080 
```