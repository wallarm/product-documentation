```
apiVersion: apps/v1
kind: Implantação
metadata:
  annotations:
    # Elemento Wallarm: anotação para atualizar pods em execução após mudar o Wallarm ConfigMap
    checksum / config: '{{ include (print $.Template.BasePath "/wallarm-sidecar-configmap.yaml") . | sha256sum }}'
  name: meuapp
spec:
  selector:
    matchLabels:
      app: meuapp
  template:
    metadata:
      labels:
        app: meuapp
    spec:
      containers:
        # Elemento Wallarm: definição do container lateral Wallarm
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
            # Porta na qual o container lateral Wallarm aceita solicitações
            # do objeto de serviço
            containerPort: 80
          volumeMounts:
          - mountPath: /etc/nginx/sites-enabled
            readOnly: true
            name: wallarm-nginx-conf
        # Definição do container do seu aplicativo principal
        - name: meuapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # Porta na qual o contêiner do aplicativo aceita solicitações de entrada
          - containerPort: 8080
      volumes:
      # Elemento Wallarm: definição do volume wallarm-nginx-conf
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```