```
...
  - port: {{ .Values.service.port }}
    # Wallarmサイドカーコンテナのポートです。 
    # 値は、Wallarmサイドカーコンテナの定義内にある
    # ports.containerPortと同一である必要があります。
    targetPort: 80
```