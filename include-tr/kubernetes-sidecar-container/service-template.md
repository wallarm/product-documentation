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
    # Wallarm sidecar container port; 
    # değer, Wallarm sidecar container tanımındaki ports.containerPort ile aynı olmalıdır
    targetPort: 8080
```