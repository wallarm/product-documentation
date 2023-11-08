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
      # Definição do contêiner principal do seu aplicativo
      - name: myapp 
        image: <Imagem>
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        # Porta na qual o contêiner do aplicativo aceita solicitações de entrada
        - containerPort: 8080 
```