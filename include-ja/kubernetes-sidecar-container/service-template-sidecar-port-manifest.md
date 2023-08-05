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

を

```
...
  ポート:
  - ポート: 80
    ターゲットポート: 80
    プロトコル: TCP
    名前: http
  セレクター:
    ラン: myapp
```

に変換します。