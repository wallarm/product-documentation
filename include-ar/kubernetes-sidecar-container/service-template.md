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
    # منفذ حاوية الجانبية لـ Wallarm؛ 
    # يجب أن تكون القيمة مطابقة لـ ports.containerPort
    # في تعريف حاوية الجانبية لـ Wallarm
    targetPort: 8080
```