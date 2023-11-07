```
...
  - port: {{ .Values.service.port }}
    # Porta do contêiner Wallarm sidecar; 
    # o valor deve ser idêntico a ports.containerPort
    # na definição do contêiner Wallarm sidecar
    targetPort: 80
```