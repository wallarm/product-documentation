```
...
  - port: {{ .Values.service.port }}
    # Wallarm sidecar container port; 
    # değer, ports.containerPort ile aynı olmalıdır
    # Wallarm sidecar container tanımında
    targetPort: 80
```