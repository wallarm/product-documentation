```
...
  - port: {{ .Values.service.port }}
    # Wallarm sidecar konteynır portu; 
    # değer, ports.containerPort ile aynı olmalıdır
    # Wallarm sidecar konteynırının tanımında
    targetPort: 80
```