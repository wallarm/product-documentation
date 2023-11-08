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
        # Elemento Wallarm: definição do contêiner Wallarm sidecar
        - name: wallarm
          image: wallarm/node:3.0.0-3
          imagePullPolicy: Always
          env:
          # Ponto final da API Wallarm: 
          # "api.wallarm.com" para a nuvem da UE
          # "us1.api.wallarm.com" para a nuvem dos EUA
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # Nome de usuário do usuário com a função Deploy
          - name: DEPLOY_USER
            value: "username"
          # Senha do usuário com a função Deploy
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # Quantidade de memória em GB para dados de análise de solicitação          
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # Porta na qual o contêiner Wallarm sidecar aceita solicitações 
            # do objeto Service
            containerPort: 80
          volumeMounts:	
          - mountPath: /etc/nginx/sites-enabled	
            readOnly: true	
            name: wallarm-nginx-conf
        # Definição do seu contêiner de aplicativo principal
        - name: myapp
          image: <Imagem>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # Porta na qual o contêiner de aplicativos aceita solicitações de entrada
          - containerPort: 8080
      volumes:
      # Elemento Wallarm: definição do volume wallarm-nginx-conf
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```