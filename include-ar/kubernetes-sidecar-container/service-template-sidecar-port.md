```
  - port: {{ .Values.service.port }}
    # منفذ حاوية جانبية لـ Wallarm؛
    # يجب أن تكون القيمة مطابقة لـ ports.containerPort
    # في تعريف حاوية جانبية لـ Wallarm
    targetPort: 80
```