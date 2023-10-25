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
        # Wallarm element: Wallarm yan konteynır tanımlaması
        - name: wallarm
          image: wallarm/node:3.0.0-3
          imagePullPolicy: Always
          enviroment:
          # Wallarm API uç noktası: 
          # "api.wallarm.com" Avrupa Bulutu için
          # "us1.api.wallarm.com" ABD Bulutu için
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # Deploy rolüne sahip kullanıcının adı
          - name: DEPLOY_USER
            value: "username"
          # Deploy rolüne sahip kullanıcının şifresi
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # İsteklerin analitik verileri için GB cinsinden bellek miktarı          
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # Wallarm yan konteynırın Servis nesnesinden istekleri kabul ettiği port 
            containerPort: 80
          volumeMounts:	
          - mountPath: /etc/nginx/sites-enabled	
            readOnly: true	
            name: wallarm-nginx-conf
        # Ana uygulama konteynırının tanımlaması
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # Uygulama konteynırının gelen istekleri kabul ettiği port
          - containerPort: 8080
      volumes:
      # Wallarm element: wallarm-nginx-conf hacminin tanımlaması
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```