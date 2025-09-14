apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  selector:
    app: myapp
  ports:
  - port: {{ .Values.service.port }}
    # Wallarm sidecar konteyneri portu;
    # değer, Wallarm sidecar konteynerinin tanımındaki
    # ports.containerPort değerine eşit olmalıdır
    targetPort: 8080