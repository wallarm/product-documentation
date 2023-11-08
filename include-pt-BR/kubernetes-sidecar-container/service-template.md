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
    # Porta do contêiner auxiliar Wallarm;
    # o valor deve ser idêntico ao ports.containerPort
    # na definição do contêiner auxiliar Wallarm
    targetPort: 8080
```