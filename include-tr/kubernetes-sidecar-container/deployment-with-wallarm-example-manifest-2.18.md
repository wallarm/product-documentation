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
        # Wallarm elementi: Wallarm sidecar container tanımı
        - name: wallarm
          image: wallarm/node:2.18.1-5
          imagePullPolicy: Always
          env:
          # Wallarm API endpoint: 
          # Avrupa Bulut için "api.wallarm.com"
          # Amerika Bulut için "us1.api.wallarm.com"
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # Deploy rolüne sahip kullanıcının kullanıcı adı 
          - name: DEPLOY_USER
            value: "username"
          # Deploy rolüne sahip kullanıcının şifresi
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # IP engelleme işlevinin etkinleştirilip etkinleştirilmeyeceği
          - name: WALLARM_ACL_ENABLE
            value: "true"
          # İstek analitik verileri için GB cinsinden bellek miktarı
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # Wallarm sidecar container'ın Service objesinden talepleri kabul ettiği port 
            containerPort: 80
          volumeMounts:	
          - mountPath: /etc/nginx/sites-enabled	
            readOnly: true	
            name: wallarm-nginx-conf
        # Ana uygulamanızın container tanımı
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # Uygulama containerının gelen istekleri kabul ettiği port
          - containerPort: 8080
      volumes:
      # Wallarm elementi: wallarm-nginx-conf volume tanımı
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```