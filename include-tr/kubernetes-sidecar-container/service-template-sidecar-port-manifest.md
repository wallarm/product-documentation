```
...
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
    name: http
  selector:
    run: myapp
```