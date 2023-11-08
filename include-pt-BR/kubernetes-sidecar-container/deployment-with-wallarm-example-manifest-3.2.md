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
        # Elemento Wallarm: definição do container lateral Wallarm
        - name: wallarm
          image: wallarm/node:3.2.1-1
          imagePullPolicy: Always
          env:
          # Endpoint da API Wallarm: 
          # "api.wallarm.com" para o Cloud da UE
          # "us1.api.wallarm.com" para o Cloud dos EUA
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # Usuário com o papel de Deploy
          - name: DEPLOY_USER
            value: "nome_de_usuario"
          # Senha do usuário com o papel de Deploy
          - name: DEPLOY_PASSWORD
            value: "senha"
          - name: DEPLOY_FORCE
            value: "true"
          # Quantidade de memória em GB para dados de análise de solicitações
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # Porta na qual o container lateral Wallarm aceita solicitações 
            # do objeto de Serviço
            containerPort: 80
          volumeMounts:	
          - mountPath: /etc/nginx/sites-enabled	
            readOnly: true	
            name: wallarm-nginx-conf
        # Definição do container do seu aplicativo principal
        - name: myapp
          image: <Imagem>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # Porta na qual o container da aplicação aceita solicitações de entrada
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