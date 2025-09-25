| API çağrısı: | `GET /v1/test_run/test_run_id` |      |
| ------------- | ------------------------------------------ | ---- |
| Yetkilendirme: | Gerekli | Yetkilendirme token ile sağlanır |
| Token içeren HTTP başlığı: | `X-WallarmAPI-Token` | Token değerini API sunucusuna iletmek için kullanılır |
| Parametreler: | `test_run_id` **(zorunlu)** | Durumu alınacak test çalışmasının tanımlayıcısı |


**İstek örneği:**
```
curl --request GET \
  --url https://us1.api.wallarm.com/v1/test_run/tr_1234 \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345'
```

**Yanıt örneği:**
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