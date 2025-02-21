| API呼び出し: | `POST /v1/test_run/test_run_id/action/stop` |      |
| ------------- | ------------------------------------------ | ---- |
| 認証: | 必須 | トークンを用いて |
| トークンを含むHTTPヘッダー: | `X-WallarmAPI-Token` | APIサーバへトークンの値を渡すために使用します |
| パラメータ: | `test_run_id` **(必須)** | ベースラインリクエストの記録を停止するテスト実行の識別子です |

**リクエスト例:**
```
curl --request GET \
  --url https://us1.api.wallarm.com/v1/test_run/tr_1234/action/stop \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345'
```

**レスポンス例:**
```
{
  "status": 200,
  "body": {
    "id": tr_1234,
    ...
    "recording": false,
    ...
  }
}
```