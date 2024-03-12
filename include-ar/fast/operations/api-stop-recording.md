| استدعاء API: | `POST /v1/test_run/test_run_id/action/stop` |      |
| ------------- | ------------------------------------------ | ---- |
| التفويض: | مطلوب | بالتوكن |
| HTTP header مع التوكن: | `X-WallarmAPI-Token` | يُستخدم لتمرير قيمة التوكن إلى خادم API |
| المعاملات: | `test_run_id` **(مطلوب)** | مُعرّف جلسة الاختبار التي سيُوقف تسجيل الطلبات الأساسية لها |

**مثال على طلب:**
```
curl --request GET \
  --url https://us1.api.wallarm.com/v1/test_run/tr_1234/action/stop \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345'
```

**مثال على رد:**
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