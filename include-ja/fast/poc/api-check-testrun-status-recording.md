| API呼び出し: | `GET /v1/test_run/test_run_id` |      |
| ------------- | ------------------------------------------ | ---- |
| 認証: | 必須 | 認証はトークンによって提供されます |
| トークンを含むHTTPヘッダー: | `X-WallarmAPI-Token` | トークンの値をAPIサーバーに渡すために使用されます |
| パラメーター: | `test_run_id` **（必須）** | 状態を取得するテスト実行の識別子 |

**リクエスト例:**
```
curl --request GET \
  --url https://us1.api.wallarm.com/v1/test_run/tr_1234 \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345'
```

**レスポンス例:**
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