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
    # Wallarmのサイドカーコンテナポート
    # この値はWallarmのサイドカーコンテナの定義内のports.containerPortと同一でなければなりません
    targetPort: 8080
```