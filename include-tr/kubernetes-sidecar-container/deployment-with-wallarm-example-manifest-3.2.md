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
        # Wallarm öğesi: Wallarm yan uygulama konteynerinin tanımlanması
        - name: wallarm
          image: wallarm/node:3.2.1-1
          imagePullPolicy: Always
          env:
          # Wallarm API endpoint: 
          # AB Bulut için "api.wallarm.com"
          # ABD Bulut için "us1.api.wallarm.com" 
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # Deploy rolü olan kullanıcının kullanıcı adı
          - name: DEPLOY_USER
            value: "username"
          # Deploy rolü olan kullanıcının şifresi
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # İstek analitiği verileri için GB cinsinden bellek miktarı
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # Service nesnesinden gelen istekleri kabul etmek için Wallarm yan uygulama konteynerının portu 
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
      # Wallarm öğesi: wallarm-nginx-conf hacminin tanımlanması
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```