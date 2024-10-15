# الويب هوك 

يمكنك تعيين Wallarm لإرسال الإشعارات الفورية لأي نظام يقبل الويب هوك الواردة عبر بروتوكول HTTPS.

## تنسيق الإشعار 

تُرسل الإشعارات بإما تنسيق JSON Array أو تنسيق New Line Delimited JSON (NDJSON) حسب اختيارك أثناء إعداد التكامل. يعتمد مجموعة من الأجسام JSON على الحدث الذي أرسلت له الإشعار. مثلاً:

* اكتشاف الهجوم

    === "JSON Array"
        ```json
        [
        {
            "summary": "[Wallarm] New hit detected",
            "details": {
              "client_name": "Test Company",
              "cloud": "EU",
              "notification_type": "new_hits",
              "hit": {
                "domain": "example.com",
                "heur_distance": 20.714285714285715,
                "method": "GET",
                "path": "/",
                "payloads": [
                  "1' select version();"
                ],
                "point": [
                  "get",
                  "id"
                ],
                "probability": 20.714285714285715,
                "remote_country": null,
                "remote_port": 41253,
                "remote_addr4": "8.8.8.8",
                "remote_addr6": null,
                "datacenter": "unknown",
                "tor": "none",
                "request_time": 1703519823,
                "create_time": 1703519826,
                "response_len": 345,
                "response_status": 404,
                "response_time": 359,
                "stamps": [
                  7965
                ],
                "regex": [],
                "stamps_hash": 271168947,
                "regex_hash": -2147483648,
                "type": "sqli",
                "block_status": "monitored",
                "brute_counter": "b:1111:xxxxxxxxxxxxxxxx",
                "final_wallarm_mode": "monitoring",
                "libproton_version": "4.8.0",
                "lom_id": 932,
                "protocol": "rest",
                "proxy_type": null,
                "request_id": "xxxxxxxxxxxxxxxx",
                "wallarm_mode": null,
                "id": [
                  "hits_production_1111_202312_v_1",
                  "xxxxxxxxxxxxxxxx"
                ],
                "object_type": "hit",
                "anomaly": 1.0357142857142858,
                "parameter": "GET_id_value",
                "applications": [
                  "default"
                ]
              }
           }
        },
        {
            "summary": "[Wallarm] New hit detected",
            "details": {
              "client_name": "Test Company",
              "cloud": "EU",
              "notification_type": "new_hits",
              "hit": {
                "domain": "example.com",
                "heur_distance": 2.5,
                "method": "GET",
                "path": "/etc/passwd",
                "payloads": [
                  "/etc/passwd"
                ],
                "point": [
                  "uri"
                ],
                "probability": 2.5,
                "remote_country": null,
                "remote_port": 41254,
                "remote_addr4": "8.8.8.8",
                "remote_addr6": null,
                "datacenter": "unknown",
                "tor": "none",
                "request_time": 1703519826,
                "create_time": 1703519829,
                "response_len": 345,
                "response_status": 404,
                "response_time": 339,
                "stamps": [
                  2907
                ],
                "regex": [],
                "stamps_hash": -1063984326,
                "regex_hash": -2147483648,
                "type": "ptrav",
                "block_status": "monitored",
                "brute_counter": "b:1111:xxxxxxxxxxxxxxxx",
                "final_wallarm_mode": "monitoring",
                "libproton_version": "4.8.0",
                "lom_id": 932,
                "protocol": "none",
                "proxy_type": null,
                "request_id": "xxxxxxxxxxxxxxxx",
                "wallarm_mode": null,
                "id": [
                  "hits_production_1111_202312_v_1",
                  "xxxxxxxxxxxxxxxx"
                ],
                "object_type": "hit",
                "anomaly": 0.22727272727272727,
                "parameter": "URI_value",
                "applications": [
                  "default"
                ]
              }
           }
        }
        ]
        ```
    === "New Line Delimited JSON (NDJSON)"
        ```json
        {"summary":"[Wallarm] New hit detected","details":{"client_name":"Test Company","cloud":"EU","notification_type":"new_hits","hit":{"domain":"example.com","heur_distance":20.714285714285715,"method":"GET","path":"/","payloads":["1' select version();"],"point":["get","id"],"probability":20.714285714285715,"remote_country":null,"remote_port":41253,"remote_addr4":"8.8.8.8","remote_addr6":null,"datacenter":"unknown","tor":"none","request_time":1703519823,"create_time":1703519826,"response_len":345,"response_status":404,"response_time":359,"stamps":[7965],"regex":[],"stamps_hash":271168947,"regex_hash":-2147483648,"type":"sqli","block_status":"monitored","brute_counter":"b:1111:xxxxxxxxxxxxxxxx","final_wallarm_mode":"monitoring","libproton_version":"4.8.0","lom_id":932,"protocol":"rest","proxy_type":null,"request_id":"xxxxxxxxxxxxxxxx","wallarm_mode":null,"id":["hits_production_1111_202312_v_1","xxxxxxxxxxxxxxxx"],"object_type":"hit","anomaly":1.0357142857142858,"parameter":"GET_id_value","applications":["default"]}}
        {"summary":"[Wallarm] New hit detected","details":{"client_name":"Test Company","cloud":"EU","notification_type":"new_hits","hit":{"domain":"example.com","heur_distance":2.5,"method":"GET","path":"/etc/passwd","payloads":["/etc/passwd"],"point":["uri"],"probability":2.5,"remote_country":null,"remote_port":41254,"remote_addr4":"8.8.8.8","remote_addr6":null,"datacenter":"unknown","tor":"none","request_time":1703519826,"create_time":1703519829,"response_len":345,"response_status":404,"response_time":339,"stamps":[2907],"regex":[],"stamps_hash":-1063984326,"regex_hash":-2147483648,"type":"ptrav","block_status":"monitored","brute_counter":"b:1111:xxxxxxxxxxxxxxxx","final_wallarm_mode":"monitoring","libproton_version":"4.8.0","lom_id":932,"protocol":"none","proxy_type":null,"request_id":"xxxxxxxxxxxxxxxx","wallarm_mode":null,"id":["hits_production_1111_202312_v_1","xxxxxxxxxxxxxxxx"],"object_type":"hit","anomaly":0.22727272727272727,"parameter":"URI_value","applications":["default"]}}
        ```
* كشف أمني 

    === "JSON Array"
        ```json
        [
            {
                summary:"[Wallarm] New vulnerability detected",
                description:"Notification type: vuln

                            New vulnerability was detected in your system.

                            ID: 
                            Title: Test
                            Domain: example.com
                            Path: 
                            Method: 
                            Discovered by: 
                            Parameter: 
                            Type: Info
                            Threat: Medium

                            More details: https://us1.my.wallarm.com/object/555


                            Client: TestCompany
                            Cloud: US
                            ",
                details:{
                    client_name:"TestCompany",
                    cloud:"US",
                    notification_type:"vuln",
                    vuln_link:"https://us1.my.wallarm.com/object/555",
                    vuln:{
                        domain:"example.com",
                        id:null,
                        method:null,
                        parameter:null,
                        path:null,
                        title:"Test",
                        discovered_by:null,
                        threat:"Medium",
                        type:"Info"
                    }
                }
            }
        ]
        ```
    === "New Line Delimited JSON (NDJSON)"
        ```json
        {"summary":"[Wallarm] New vulnerability detected","description":"Notification type: vuln\nNew vulnerability was detected in your system.\nID: \nTitle: Test\nDomain: example.com\nPath: \nMethod: \nDiscovered by: \nParameter: \nType: Info\nThreat: Medium\nMore details: https://us1.my.wallarm.com/object/555\nClient: TestCompany\nCloud: US","details":{"client_name":"TestCompany","cloud":"US","notification_type":"vuln","vuln_link":"https://us1.my.wallarm.com/object/555","vuln":{"domain":"example.com","id":null,"method":null,"parameter":null,"path":null,"title":"Test","discovered_by":null,"threat":"Medium","type":"Info"}}}
        ```

## إعداد التكامل 

1. افتح Wallarm UI → **التكاملات**.
1. انقر على الويب هوك أو انقر فوق الزر **إضافة تكامل** واختر **الويب هوك**.
1. أدخل اسم التكامل.
1. أدخل URL الويب هوك الهدف.
1. إذا كان مطلوبًا، قم بتكوين الإعدادات المتقدمة:

    --8<-- "../include/integrations/webhook-advanced-settings.md"

    ![مثال على الإعدادات المتقدمة](../../../images/user-guides/settings/integrations/additional-webhook-settings.png)
1. اختر أنواع الأحداث لتحفيز الإشعارات.

    ![تكامل الويب هوك](../../../images/user-guides/settings/integrations/add-webhook-integration.png)

    تفاصيل حول الأحداث المتاحة:

    --8<-- "../include/integrations/advanced-events-for-integrations-ar.md"

1. انقر على **اختبار التكامل** للتحقق من صحة الإعدادات، وتوفر سحابة Wallarm، وتنسيق الإشعارات. يتم دائمًا إرسال الإشعارات الاختبارية بتنسيق JSON Array، حتى إذا تم اختيار New Line Delimited JSON (NDJSON).
1. انقر **إضافة التكامل**.

## إعداد التنبيهات الإضافية

--8<-- "../include/integrations/integrations-trigger-setup-ar.md"

### مثال: الإشعار إلى URL الويب هوك إذا تمت إضافة عنوان IP إلى القائمة السوداء

إذا تمت إضافة عنوان IP إلى القائمة السوداء، سيتم إرسال الويب هوك حول هذا الحدث إلى URL الويب هوك.

![مثال على المحفز لـIP القائمة السوداء](../../../images/user-guides/triggers/trigger-example4.png)

**لاختبار المحفز:**

1. افتح وحدة تحكم Wallarm → **قوائم IP** → **القائمة السوداء** وأضف عنوان IP إلى القائمة السوداء. على سبيل المثال:

    ![إضافة IP إلى القائمة السوداء](../../../images/user-guides/triggers/test-ip-blocking.png)
2. تحقق من أن ال̉ويب هوك التالي تم إرساله إلى URL الويب هوك:

    ```
    [
        {
            "summary": "[Wallarm] Trigger: New IP address was denylisted",
            "description": "Notification type: ip_blocked\n\nIP address 1.1.1.1 was denylisted until 2021-06-10 02:27:15 +0300 for the reason Produces many attacks. You can review blocked IP addresses in the \"Denylist\" section of Wallarm Console.\nThis notification was triggered by the \"Notification about denylisted IP\" trigger. The IP is blocked for the application Application #8.\n\nClient: TestCompany\nCloud: EU\n",
            "details": {
            "client_name": "TestCompany",
            "cloud": "EU",
            "notification_type": "ip_blocked",
            "trigger_name": "Notification about denylisted IP",
            "application": "Application #8",
            "reason": "Produces many attacks",
            "expire_at": "2021-06-10 02:27:15 +0300",
            "ip": "1.1.1.1"
            }
        }
    ]
    ```

    * `Notification about denylisted IP` هو اسم المحفز
    * `TestCompany` هو اسم حساب شركتك في وحدة تحكم Wallarm
    * `EU` هو Wallarm Cloud حيث تم تسجيل حساب شركتك

## تعطيل وحذف التكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعلمات التكامل غير الصحيحة

--8<-- "../include/integrations/integration-not-working.md"
