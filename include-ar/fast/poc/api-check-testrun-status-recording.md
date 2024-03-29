| استدعاء API: | `GET /v1/test_run/test_run_id` |      |
| ------------- | ------------------------------------------ | ---- |
| الإذن: | مطلوب | يتم توفير الإذن بواسطة التوكن |
| الرأس HTTP مع التوكن: | `X-WallarmAPI-Token` | يخدم لنقل قيمة التوكن إلى خادم API |
| المعاملات: | `test_run_id` **(مطلوب)** | مُعرف التشغيل التجريبي الذي سيتم الحصول على حالته |

**مثال على طلب:**
```
curl --request GET \
  --url https://us1.api.wallarm.com/v1/test_run/tr_1234 \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345'
```

**مثال على استجابة:**
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