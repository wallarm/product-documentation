```
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # Wallarm öğesi: Wallarm ConfigMap değiştikten sonra çalışan podların güncellenmesi için işaret
    checksum/config: '{{ include (print $.Template.BasePath "/wallarm-sidecar-configmap.yaml") . | sha256sum }}'
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
        # Wallarm öğesi: Wallarm sidecar konteynırın tanımlanması
        - name: wallarm
          image: {{ .Values.wallarm.image.repository }}:{{ .Values.wallarm.image.tag }}
          imagePullPolicy: {{ .Values.wallarm.image.pullPolicy | quote }}
          env:
          - name: WALLARM_API_HOST
            value: {{ .Values.wallarm.wallarm_host_api | quote }}
          - name: DEPLOY_USER
            value: {{ .Values.wallarm.deploy_username | quote }}
          - name: DEPLOY_PASSWORD
            value: {{ .Values.wallarm.deploy_password | quote }}
          - name: DEPLOY_FORCE
            value: "true"
          - name: WALLARM_ACL_ENABLE
            value: "true"
          - name: TARANTOOL_MEMORY_GB
            value: {{ .Values.wallarm.tarantool_memory_gb | quote }}
          ports:
          - name: http
            # Wallarm sidecar konteynırının Servis nesnesinden talepleri kabul ettiği port
            containerPort: 80
          volumeMounts:
          - mountPath: /etc/nginx/sites-enabled
            readOnly: true
            name: wallarm-nginx-conf
        # Ana uygulama konteynırınızın tanımı
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # Uygulama konteynırının gelen talepleri kabul ettiği port
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