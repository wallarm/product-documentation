| استدعاء الواجهة البرمجية: | `GET /v1/test_run/test_run_id` |      |
| ------------- | ------------------------------------------ | ---- |
| التصريح: | مطلوب | يتم توفير التصريح عن طريق الرمز |
| العنوان البرمجي مع الرمز: | `X-WallarmAPI-Token` | يُستخدم لنقل قيمة الرمز إلى خادم الواجهة البرمجية |
| المُعاملات: | `test_run_id` **(مطلوب)** | مُعرف الاختبار الذي يُراد الحصول على حالته |

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