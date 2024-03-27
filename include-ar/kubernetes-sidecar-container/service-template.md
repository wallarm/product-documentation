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
    # بورت الحاوية الجانبية لوولارم؛
    # يجب أن تكون القيمة مطابقة ل ports.containerPort
    # في تعريف حاوية وولارم الجانبية
    targetPort: 8080
```