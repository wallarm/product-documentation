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
        # Elemento Wallarm: definição do contêiner sidecar Wallarm
        - name: wallarm
          image: wallarm/node:2.18.1-5
          imagePullPolicy: Always
          env:
          # Endpoint da API Wallarm: 
          # "api.wallarm.com" para o Cloud EU
          # "us1.api.wallarm.com" para o Cloud US
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
          # Se deve habilitar a funcionalidade de bloqueio de IP
          - name: WALLARM_ACL_ENABLE
            value: "true"
          # Quantidade de memória em GB para dados de análise de solicitações 
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # Porta na qual o contêiner sidecar Wallarm aceita solicitações 
            # do objeto do serviço
            containerPort: 80
          volumeMounts:	
          - mountPath: /etc/nginx/sites-enabled	
            readOnly: true	
            name: wallarm-nginx-conf
        # Definição do contêiner do aplicativo principal
        - name: myapp
          image: <Imagem>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # Porta na qual o contêiner do aplicativo aceita solicitações de entrada
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
