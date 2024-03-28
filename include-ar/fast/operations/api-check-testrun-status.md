| استدعاء API: | `GET /v1/test_run/test_run_id` |      |
| ------------- | ------------------------------------------ | ---- |
| الإذن: | مطلوب | بالرمز |
| الرأس HTTP بالرمز: | `X-WallarmAPI-Token` | يُستخدم لنقل قيمة الرمز إلى خادم API |
| المُعاملات: | `test_run_id` **(مطلوب)** | مُعرِّف جولة الاختبار التي يُراد الحصول على حالتها |


**مثال على طلب:**
```
curl --request GET \
  --url https://us1.api.wallarm.com/v1/test_run/tr_1234 \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345'
```

**مثال على الاستجابة:**
```
{
  "status": 200,
  "body": {
    "id": tr_1234,
    "name": "demo-testrun",
    "vulns": [
      {
        "id": vuln_0001,
        "threat": 80,
        "code": "S0001",
        "type": "sqli"
      }
    ],
    "clientid": demo_0000,
    "state": "failed",
    "simple_state": "failed",
    "allowed_actions": [],
    "baseline_check_all_terminated_count": 1,
    "baseline_check_fail_count": 1,
    "baseline_check_tech_fail_count": 0,
    "baseline_check_passed_count": 0,
    "baseline_check_running_count": 0,
    "baseline_check_interrupted_count": 0,
    "sended_requests_count": 70,
    ...
    "start_time": 1555572038,
    "end_time": 1555572309,
    ...
    "domains": [
      "app.example.local"
    ],
    "baseline_count": 1,
    ...    
    "baseline_check_waiting_count": 0,
    "planing_requests_count": 70
  }
}
```