| استدعاء API: | `POST /v1/test_run/test_run_id/action/stop` |      |
| ------------- | ------------------------------------------ | ---- |
| الإذن: | مطلوب | بالرمز |
| رأس HTTP مع الرمز: | `X-WallarmAPI-Token` | يستخدم لنقل قيمة الرمز إلى خادم API |
| المعاملات: | `test_run_id` **(مطلوب)** | معرف تشغيل الاختبار لإيقاف تسجيل الطلبات الأساسية له |

**مثال على طلب:**
```
curl --request GET \
  --url https://us1.api.wallarm.com/v1/test_run/tr_1234/action/stop \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345'
```

**مثال على استجابة:**
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