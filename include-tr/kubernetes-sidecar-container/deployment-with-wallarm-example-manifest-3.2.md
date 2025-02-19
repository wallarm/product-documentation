```yaml
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
        # Wallarm unsuru: Wallarm yan konteynerinin tanımı
        - name: wallarm
          image: wallarm/node:3.2.1-1
          imagePullPolicy: Always
          env:
          # Wallarm API uç noktası: 
          # "api.wallarm.com" EU Cloud için
          # "us1.api.wallarm.com" US Cloud için
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # Dağıtım rolüne sahip kullanıcının kullanıcı adı
          - name: DEPLOY_USER
            value: "username"
          # Dağıtım rolüne sahip kullanıcının şifresi
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # İstek analiz verileri için GB cinsinden bellek miktarı
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # Wallarm yan konteyneri, Service nesnesinden gelen istekleri kabul ettiği port
            containerPort: 80
          volumeMounts:	
          - mountPath: /etc/nginx/sites-enabled	
            readOnly: true	
            name: wallarm-nginx-conf
        # Ana uygulama konteynerinizin tanımı
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # Uygulama konteynerinin gelen istekleri kabul ettiği port
          - containerPort: 8080
      volumes:
      # Wallarm unsuru: wallarm-nginx-conf hacminin tanımı
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```