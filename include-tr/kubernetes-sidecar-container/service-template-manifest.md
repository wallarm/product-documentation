```
apiVersion: v1
kind: Service
metadata:
  name: myapp
  labels:
    run: myapp
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
    name: http
  selector:
    run: myapp
```