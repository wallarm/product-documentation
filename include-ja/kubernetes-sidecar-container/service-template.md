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
    # Wallarmサイドカーコンテナのポートです。 
    # 値はWallarmサイドカーコンテナの定義にある
    # ports.containerPortと同一である必要があります。
    targetPort: 8080
```