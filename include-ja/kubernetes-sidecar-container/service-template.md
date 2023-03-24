```
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  selector:
    app: myapp
  ports:
  - port: {{ .Values.service.port }}
    # Wallarmサイドカーコンテナポート;
    # この値は、Wallarmサイドカーコンテナの定義のports.containerPortと同一である必要があります
    targetPort: 8080
```