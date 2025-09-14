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
        # Wallarm öğesi: Wallarm sidecar kapsayıcısının tanımı
        - name: wallarm
          image: wallarm/node:3.6.2-1
          imagePullPolicy: Always
          env:
          # Wallarm API uç noktası: 
          # "api.wallarm.com" EU Cloud için
          # "us1.api.wallarm.com" US Cloud için
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # Deploy rolüne sahip kullanıcının kullanıcı adı
          - name: DEPLOY_USER
            value: "username"
          # Deploy rolüne sahip kullanıcının parolası
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # İstek analitiği verisi için GB cinsinden bellek miktarı
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # Wallarm sidecar kapsayıcısının istekleri kabul ettiği bağlantı noktası 
            # Service nesnesinden
            containerPort: 80
          volumeMounts:	
          - mountPath: /etc/nginx/sites-enabled	
            readOnly: true	
            name: wallarm-nginx-conf
        # Ana uygulama kapsayıcınızın tanımı
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # Uygulama kapsayıcısının gelen istekleri kabul ettiği bağlantı noktası
          - containerPort: 8080
      volumes:
      # Wallarm öğesi: wallarm-nginx-conf hacminin tanımı
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default