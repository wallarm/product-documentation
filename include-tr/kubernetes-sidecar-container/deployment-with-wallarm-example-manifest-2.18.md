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
        # Wallarm öğesi: Wallarm sidecar konteynerinin tanımı
        - name: wallarm
          image: wallarm/node:2.18.1-5
          imagePullPolicy: Always
          env:
          # Wallarm API uç noktası: 
          # EU Cloud için "api.wallarm.com"
          # US Cloud için "us1.api.wallarm.com"
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
          # IP engelleme işlevinin etkinleştirilip etkinleştirilmeyeceği
          - name: WALLARM_ACL_ENABLE
            value: "true"
          # İstek analiz verileri için GB cinsinden bellek miktarı 
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # Wallarm sidecar konteynerinin Service nesnesinden gelen istekleri 
            # kabul ettiği bağlantı noktası
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
          # Uygulama konteynerinin gelen istekleri kabul ettiği bağlantı noktası
          - containerPort: 8080
      volumes:
      # Wallarm öğesi: wallarm-nginx-conf biriminin tanımı
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default