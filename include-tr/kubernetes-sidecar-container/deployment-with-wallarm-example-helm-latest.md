```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # Wallarm öğesi: Wallarm ConfigMap değiştirildikten sonra çalışan pod’ları güncellemek için açıklama
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
        # Wallarm öğesi: Wallarm sidecar konteynerinin tanımı
        - name: wallarm
          image: {{ .Values.wallarm.image.repository }}:{{ .Values.wallarm.image.tag }}
          imagePullPolicy: {{ .Values.wallarm.image.pullPolicy | quote }}
          env:
          - name: WALLARM_API_HOST
            value: {{ .Values.wallarm.wallarm_host_api | quote }}
          - name: WALLARM_API_TOKEN
            value: {{ .Values.wallarm.wallarm_api_token | quote }}
          - name: DEPLOY_FORCE
            value: "true"
          - name: TARANTOOL_MEMORY_GB
            value: {{ .Values.wallarm.tarantool_memory_gb | quote }}
          ports:
          - name: http
            # Wallarm sidecar konteynerinin Service nesnesinden gelen istekleri kabul ettiği port
            # Service nesnesinden
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
      # Wallarm öğesi: wallarm-nginx-conf hacminin tanımı
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```