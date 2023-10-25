```
apiVersion: v1
tür: Servis
metadata:
  ad: myapp
  etiketler:
    çalıştır: myapp
spec:
  tür: NodePort
  bağlantı noktaları:
  - port: 80
    hedefPort: 8080
    protokol: TCP
    ad: http
  seçici:
    çalıştır: myapp
```