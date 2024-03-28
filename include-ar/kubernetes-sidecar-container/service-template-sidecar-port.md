```
...
  - port: {{ .Values.service.port }}
    # منفذ حاوية الخادم الوكيل لـWallarm؛
    # يجب أن تكون القيمة مطابقة لـports.containerPort
    # في تعريف حاوية الخادم الوكيل لـWallarm
    targetPort: 80
```