```
...
  - port: {{ .Values.service.port }}
    # Wallarm sidecar konteyner portu; 
    # değer ports.containerPort ile aynı olmalıdır
    # Wallarm sidecar konteynerinin tanımında
    targetPort: 80
```