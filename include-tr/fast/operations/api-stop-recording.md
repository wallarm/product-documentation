| API çağrısı: | `POST /v1/test_run/test_run_id/action/stop` |      |
| ------------- | ------------------------------------------ | ---- |
| Yetkilendirme: | Gerekli | Token ile |
| Token içeren HTTP başlığı: | `X-WallarmAPI-Token` | Token değerini API sunucusuna iletmek için kullanılır |
| Parametreler: | `test_run_id` **(gerekli)** | Temel isteklerin kaydını durdurmak istediğiniz test çalışmasının tanımlayıcısı |

**İstek örneği:**
```
curl --request GET \
  --url https://us1.api.wallarm.com/v1/test_run/tr_1234/action/stop \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345'
```

**Yanıt örneği:**
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