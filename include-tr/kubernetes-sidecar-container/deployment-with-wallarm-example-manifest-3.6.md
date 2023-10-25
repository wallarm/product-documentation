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
        # Wallarm öğesi: Wallarm sidecar kapının tanımı
        - name: wallarm
          image: wallarm/node:3.6.2-1
          imagePullPolicy: Always
          env:
          # Wallarm API endpoint: 
          # Avrupa Bulutu için "api.wallarm.com"
          # ABD Bulutu için "us1.api.wallarm.com"
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # Yayın rolüne sahip kullanıcının adı
          - name: DEPLOY_USER
            value: "username"
          # Yayın rolüne sahip kullanıcının şifresi
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # İstek analitiği verileri için GB cinsinden bellek miktarı
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # Wallarm sidecar konteynerin Hizmet nesnesinden gelen istekleri kabul ettiği port 
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
          # Uygulama kapının gelen istekleri kabul ettiği port
          - containerPort: 8080
      volumes:
      # Wallarm öğesi: wallarm-nginx-conf hacminin tanımı
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```
