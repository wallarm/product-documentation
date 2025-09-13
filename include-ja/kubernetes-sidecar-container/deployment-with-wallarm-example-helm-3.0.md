```
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # Wallarm要素: Wallarm ConfigMapの変更後に実行中のPodを更新するためのアノテーションです
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
        # Wallarm要素: Wallarmサイドカーコンテナの定義です
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
            # Wallarmサイドカーコンテナがリクエストを受け付けるポートです
            # リクエストはServiceオブジェクトから送信されます
            containerPort: 80
          volumeMounts:
          - mountPath: /etc/nginx/sites-enabled
            readOnly: true
            name: wallarm-nginx-conf
        # メインアプリケーションコンテナの定義です
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # アプリケーションコンテナが受信リクエストを受け付けるポートです
          - containerPort: 8080 
      volumes:
      # Wallarm要素: wallarm-nginx-confボリュームの定義です
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```