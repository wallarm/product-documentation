```
...
  - port: {{ .Values.service.port }}
    # Wallarm サイドカー コンテナ のポート;
    # この値は ports.containerPort の定義と
    # Wallarm サイドカー コンテナと同一でなければならない
    targetPort: 80
```