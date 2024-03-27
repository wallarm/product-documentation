# الخطاطيف

يمكنك تعيين Wallarm لإرسال الإشعارات الفورية إلى أي نظام يقبل الخطاطيف الواردة عبر بروتوكول HTTPS.

## تنسيق الإشعار

تُرسل الإشعارات بإما تنسيق JSON Array أو تنسيق JSON محدد بالسطر الجديد (NDJSON) حسب اختيارك أثناء إعداد التكامل. مجموعة كائنات JSON تعتمد على الحدث الذي يتم إرسال الإشعار نيابة عنه. على سبيل المثال:

* الكشف عن الضربة

    === "JSON Array"
        ```json
        [
        {
            "summary": "[Wallarm] كشف ضربة جديدة",
            "details": {
              "client_name": "شركة الاختبار",
              "cloud": "الاتحاد الأوروبي",
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
            "summary": "[Wallarm] كشف ضربة جديدة",
            "details": {
              "client_name": "شركة الاختبار",
              "cloud": "الاتحاد الأوروبي",
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
        {"summary":"[Wallarm] كشف ضربة جديدة","details":{"client_name":"شركة الاختبار","cloud":"الاتحاد الأوروبي","notification_type":"new_hits","hit":{"domain":"example.com","heur_distance":20.714285714285715,"method":"GET","path":"/","payloads":["1' select version();"],"point":["get","id"],"probability":20.714285714285715,"remote_country":null,"remote_port":41253,"remote_addr4":"8.8.8.8","remote_addr6":null,"datacenter":"unknown","tor":"none","request_time":1703519823,"create_time":1703519826,"response_len":345,"response_status":404,"response_time":359,"stamps":[7965],"regex":[],"stamps_hash":271168947,"regex_hash":-2147483648,"type":"sqli","block_status":"monitored","brute_counter":"b:1111:xxxxxxxxxxxxxxxx","final_wallarm_mode":"monitoring","libproton_version":"4.8.0","lom_id":932,"protocol":"rest","proxy_type":null,"request_id":"xxxxxxxxxxxxxxxx","wallarm_mode":null,"id":["hits_production_1111_202312_v_1","xxxxxxxxxxxxxxxx"],"object_type":"hit","anomaly":1.0357142857142858,"parameter":"GET_id_value","applications":["default"]}}
        {"summary":"[Wallarm] كشف ضربة جديدة","details":{"client_name":"شركة الاختبار","cloud":"الاتحاد الأوروبي","notification_type":"new_hits","hit":{"domain":"example.com","heur_distance":2.5,"method":"GET","path":"/etc/passwd","payloads":["/etc/passwd"],"point":["uri"],"probability":2.5,"remote_country":null,"remote_port":41254,"remote_addr4":"8.8.8.8","remote_addr6":null,"datacenter":"unknown","tor":"none","request_time":1703519826,"create_time":1703519829,"response_len":345,"response_status":404,"response_time":339,"stamps":[2907],"regex":[],"stamps_hash":-1063984326,"regex_hash":-2147483648,"type":"ptrav","block_status":"monitored","brute_counter":"b:1111:xxxxxxxxxxxxxxxx","final_wallarm_mode":"monitoring","libproton_version":"4.8.0","lom_id":932,"protocol":"none","proxy_type":null,"request_id":"xxxxxxxxxxxxxxxx","wallarm_mode":null,"id":["hits_production_1111_202312_v_1","xxxxxxxxxxxxxxxx"],"object_type":"hit","anomaly":0.22727272727272727,"parameter":"URI_value","applications":["default"]}}
        ```
* تم اكتشاف الثغرة الأمنية

    === "JSON Array"
        ```json
        [
            {
                summary:"[Wallarm] تم اكتشاف ثغرة جديدة",
                description:"نوع الإشعار: vuln

                            تم اكتشاف ثغرة أمنية جديدة في نظامك.

                            ID: 
                            Title: اختبار
                            Domain: example.com
                            Path: 
                            Method: 
                            Discovered by: 
                            Parameter: 
                            Type: Info
                            Threat: متوسط

                            المزيد من التفاصيل: https://us1.my.wallarm.com/object/555


                            Client: شركة الاختبار
                            Cloud: US
                            ",
                details:{
                    client_name:"شركة الاختبار",
                    cloud:"US",
                    notification_type:"vuln",
                    vuln_link:"https://us1.my.wallarm.com/object/555",
                    vuln:{
                        domain:"example.com",
                        id:null,
                        method:null,
                        parameter:null,
                        path:null,
                        title:"اختبار",
                        discovered_by:null,
                        threat:"متوسط",
                        type:"Info"
                    }
                }
            }
        ]
        ```
    === "New Line Delimited JSON (NDJSON)"
        ```json
        {"summary":"[Wallarm] ثغرة جديدة تم اكتشافها","description":"نوع الإشعار: vuln\nتم اكتشاف ثغرة أمنية جديدة في النظام. \nID: \nTitle: اختبار\nDomain: example.com\nPath: \nMethod: \nDicsovered by: \nParameter \nType: Info\nThreat: Medium\nMore details: https://us1.my.wallarm.com/object/555\nClient: شركة الاختبار\nCloud: US","details":{"client_name":"شركة الاختبار","cloud":"US","notification_type":"vuln","vuln_link":"https://us1.my.wallarm.com/object/555","vuln":{"domain":"example.com","id":null,"method":null,"parameter":null,"path":null,"title":"اختبار","discovered_by":null,"threat":"متوسط","type":"Info"}}}
        ```

## إعداد التكامل

1. افتح Wallarm UI → **التكاملات**.
1. انقر على كتلة **الخطاطيف** أو انقر على زر **أضف التكامل** واختر **الخطاطيف**.
1. أدخل اسم التكامل.
1. أدخل عنوان URL للخطاف الهدف.
1. إذا لزم الأمر، قم بتكوين الإعدادات المتقدمة:

    --8<-- "../include/integrations/webhook-advanced-settings.md"

    ![مثال على الإعدادات المتقدمة](../../../images/user-guides/settings/integrations/additional-webhook-settings.png)
1. اختر أنواع الأحداث لتنشيط الإشعارات.

    ![تكامل الخطاطيف](../../../images/user-guides/settings/integrations/add-webhook-integration.png)

    التفاصيل على الأحداث المتاحة:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. انقر فوق **اختبار التكامل** للتحقق من صحة التكوين، وتوفر Wallarm Cloud، وتنسيق الإشعار. يتم دائمًا إرسال الإشعارات الاختبار بتنسيق JSON Array، حتى لو تم اختيار تنسيق JSON محدد بالسطر الجديد (NDJSON).
1. انقر فوق **أضف التكامل**.

## إعداد تنبيهات إضافية

--8<-- "../include/integrations/integrations-trigger-setup.md"

### المثال: الإشعار إلى عنوان URL للخطاف إذا تمت إضافة عنوان IP إلى قائمة الحظر

إذا تمت إضافة عنوان IP إلى قائمة الحظر، سيتم إرسال الخطاف حول هذا الحدث إلى عنوان URL للخطاف.

![مثال على مشغل لعنوان IP في قائمة الحظر](../../../images/user-guides/triggers/trigger-example4.png)

**لاختبار المشغل:**

1. افتح وحدة تحكم Wallarm → **قوائم ال IP** → **قائمة الحظر** وأضف عنوان IP إلى قائمة الحظر. على سبيل المثال:

    ![إضافة IP إلى قائمة الحظر](../../../images/user-guides/triggers/test-ip-blocking.png)
2. تحقق من أن الخطاف التالي تم إرساله إلى عنوان URL للخطاف:

    ```
    [
        {
            "summary": "[Wallarm] المشغل: تم حظر عنوان IP جديد",
            "description": "نوع الإشعار: ip_blocked\n\nتم حظر عنوان IP 1.1.1.1 حتى 2021-06-10 02:27:15 +0300 للسبب ينتج الكثير من الهجمات. يمكنك مراجعة عناوين IP المحظورة في قسم \"قائمة الحظر\" في وحدة تحكم Wallarm.\nتم تنشيط هذا الإشعار بواسطة المشغل \"الإشعار عن ال IP المحظور\". ال IP محظور للتطبيق التطبيق #8.\n\nClient: شركة الاختبار\nCloud: الاتحاد الأوروبي\n",
            "details": {
            "client_name": "شركة الاختبار",
            "cloud": "الاتحاد الأوروبي",
            "notification_type": "ip_blocked",
            "trigger_name": "الإشعار عن ال IP المحظور",
            "application": "التطبيق #8",
            "reason": "ينتج الكثير من الهجمات",
            "expire_at": "2021-06-10 02:27:15 +0300",
            "ip": "1.1.1.1"
            }
        }
    ]
    ```

    * `إشعار عن IP محظور` هو اسم المشغل
    * `شركة الاختبار` هو اسم حساب شركتك في وحدة تحكم Wallarm
    * `الاتحاد الأوروبي` هو Wallarm Cloud حيث تم تسجيل حساب الشركة الخاص بك

## تعطيل وحذف التكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعلمات التكامل غير الصحيحة

--8<-- "../include/integrations/integration-not-working.md"
