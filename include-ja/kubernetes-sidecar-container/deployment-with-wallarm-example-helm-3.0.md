```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # Wallarmエレメント: Wallarm ConfigMap変更後に実行中のPodを更新するための注釈
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
        # Wallarmエレメント: Wallarm sidecarコンテナの定義
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
            # Wallarm sidecarコンテナがServiceオブジェクトからリクエストを受け付けるポート
            containerPort: 80
          volumeMounts:
          - mountPath: /etc/nginx/sites-enabled
            readOnly: true
            name: wallarm-nginx-conf
        # メインアプリコンテナの定義
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # アプリケーションコンテナが受け付ける着信リクエストのポート
          - containerPort: 8080 
      volumes:
      # Wallarmエレメント: wallarm-nginx-confボリュームの定義
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```