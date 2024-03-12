```
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # عنصر Wallarm: علامة لتحديث الحاويات الجارية بعد تغيير خريطة تكوين Wallarm
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
        # عنصر Wallarm: تعريف حاوية جانبية Wallarm
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
            # المنفذ الذي تقبل عليه حاوية Wallarm الجانبية الطلبات
            # من كائن الخدمة
            containerPort: 80
          volumeMounts:
          - mountPath: /etc/nginx/sites-enabled
            readOnly: true
            name: wallarm-nginx-conf
        # تعريف حاوية التطبيق الرئيسية الخاصة بك
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # المنفذ الذي تقبل عليه حاوية التطبيق الواردة الطلبات
          - containerPort: 8080 
      volumes:
      # عنصر Wallarm: تعريف حجم إعدادات nginx الخاصة بـ Wallarm
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```