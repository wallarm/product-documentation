```
...
  - port: {{ .Values.service.port }}
    # Wallarmサイドカーコンテナのポート;
    # この値はports.containerPortと同一でなければなりません
    # Wallarmサイドカーコンテナの定義内
    targetPort: 80
```