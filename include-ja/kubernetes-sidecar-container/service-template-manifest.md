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
を日本語に翻訳します。

```
apiVersion: v1
種類: サービス
メタデータ:
  名前: myapp
  ラベル:
    実行: myapp
仕様:
  タイプ: NodePort
  ポート:
  - ポート: 80
    ターゲットポート: 8080
    プロトコル: TCP
    名前: http
  セレクタ:
    実行: myapp
```