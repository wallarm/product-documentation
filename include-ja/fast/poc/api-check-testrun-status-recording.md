| API呼び出し: | `GET /v1/test_run/test_run_id` |      |
| ------------- | ------------------------------------------ | ---- |
| 認可: | 必須です | 認可はトークンで行われます |
| トークンを渡すHTTPヘッダー: | `X-WallarmAPI-Token` | APIサーバーにトークンの値を渡すためのものです |
| パラメータ: | `test_run_id` **(必須)** | 状態を取得する対象のテスト実行の識別子です |


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