| APIコール: | `POST /v1/test_run/test_run_id/action/stop` |      |
| ------------- | ------------------------------------------ | ---- |
| 認証: | 必須 | トークン付き |
| トークンを含むHTTPヘッダー: | `X-WallarmAPI-Token` | トークンの値をAPIサーバーに渡すために使用します |
| パラメーター: | `test_run_id` **(必須)** | ベースラインリクエストの記録を停止するテストランの識別子 |

**リクエストの例:**
```
curl --request GET \
  --url https://us1.api.wallarm.com/v1/test_run/tr_1234/action/stop \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345'
```

**レスポンスの例:**
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