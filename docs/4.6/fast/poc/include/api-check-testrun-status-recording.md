| API call: | `GET /v1/test_run/test_run_id` |      |
| ------------- | ------------------------------------------ | ---- |
| Authorization: | Required | Authorization is provided by the token |
| HTTP header with the token: | `X-WallarmAPI-Token` | Serves to pass the token’s value to the API server |
| Parameters: | `test_run_id` **(required)** | The identifier of the test run whose state is to be obtained |

<!-- -->
<br><br>
**Example of a request:**
```
curl --request GET \
  --url https://us1.api.wallarm.com/v1/test_run/tr_1234 \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345'
```

**Example of a response:**
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