```
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # Wallarm要素：Wallarm ConfigMapを変更した後に実行中のポッドを更新するための注釈
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
        # Wallarm要素：Wallarmサイドカーコンテナの定義
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
            # サービスオブジェクトからのリクエストを受け入れるサイドカーコンテナのポート
            containerPort: 80
          volumeMounts:
          - mountPath: /etc/nginx/sites-enabled
            readOnly: true
            name: wallarm-nginx-conf
        # あなたのメインアプリコンテナの定義
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # アプリケーションコンテナの、着信リクエストを受け入れるポート
          - containerPort: 8080 
      volumes:
      # Wallarm要素：wallarm-nginx-confボリュームの定義
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```