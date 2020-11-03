```
...
  - port: {{ .Values.service.port }}
    # Wallarm sidecar container port; 
    # the value must be identical to ports.containerPort
    # in definition of Wallarm sidecar container
    targetPort: 80
```