```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  selector:
    app: myapp
  ports:
  - port: {{ .Values.service.port }}
    # Wallarm sidecarコンテナのポートです;
    # この値はports.containerPortと同一である必要があります
    # Wallarm sidecarコンテナの定義内です
    targetPort: 8080
```