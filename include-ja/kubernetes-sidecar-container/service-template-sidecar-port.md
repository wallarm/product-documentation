```
...
  - port: {{ .Values.service.port }}
    # Wallarmサイドカーコンテナのポート;
    # この値は、Wallarmサイドカーコンテナの定義の
    # ports.containerPortと同じでなければなりません
    targetPort: 80
```