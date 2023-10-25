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
    # Wallarm yan arabası konteyner portu; 
    # değer, Wallarm yan arabası konteynerinin tanımındaki ports.containerPort ile aynı olmalıdır 
    targetPort: 8080
```