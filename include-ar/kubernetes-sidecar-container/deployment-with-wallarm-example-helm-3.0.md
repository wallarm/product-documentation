```
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # عنصر من Wallarm: تعليق لتحديث الحاويات الجارية بعد تغيير خريطة تهيئة Wallarm
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
        # عنصر من Wallarm: تعريف حاوية الوكيل الجانبية لـ Wallarm
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
          - name: TARANTOOL_MEMORY_GB
            value: {{ .Values.wallarm.tarantool_memory_gb | quote }}
          ports:
          - name: http
            # المنفذ الذي تقبل فيه حاوية الوكيل الجانبية لـ Wallarm الطلبات من كائن الخدمة
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
          # المنفذ الذي تقبل فيه حاوية التطبيق الطلبات الواردة
          - containerPort: 8080 
      volumes:
      # عنصر من Wallarm: تعريف وحدة التخزين wallarm-nginx-conf
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```