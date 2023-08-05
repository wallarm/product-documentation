| APIコール: | `GET /v1/test_run/test_run_id` |      |
| ------------- | ------------------------------------------ | ---- |
| 認証: | 必須 | トークンによって認証が提供されます |
| トークン付きのHTTPヘッダー: | `X-WallarmAPI-Token` | トークンの値をAPIサーバーに渡すために使用されます |
| パラメーター: | `test_run_id` **(必須)** | 状態を取得するテストランの識別子 |


**リクエストの例:**
```
curl --request GET \
  --url https://us1.api.wallarm.com/v1/test_run/tr_1234 \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345'
```

**レスポンスの例:**
```
{
  "status": 200,
  "body": {
    "id": tr_1234,
    "name": "demo-testrun",
    ...
    "ready_for_recording": true,
    ...
  }
}
```