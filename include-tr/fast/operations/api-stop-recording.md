| API call: | `POST /v1/test_run/test_run_id/action/stop` |      |
| ------------- | ------------------------------------------ | ---- |
| Authorization: | Gerekli | Token ile birlikte |
| HTTP header with the token: | `X-WallarmAPI-Token` | Token değerini API sunucusuna iletmek için kullanılır |
| Parameters: | `test_run_id` **(gerekli)** | Standart isteklerin kaydının durdurulacağı test çalıştırmasının tanımlayıcısı |

**Bir istek örneği:**
```
curl --request GET \
  --url https://us1.api.wallarm.com/v1/test_run/tr_1234/action/stop \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345'
```

**Bir yanıt örneği:**
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