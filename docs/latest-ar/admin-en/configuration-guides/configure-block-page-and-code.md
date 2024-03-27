# تكوين صفحة الحظر ورمز الخطأ (NGINX)

تصف هذه التعليمات الطريقة لتخصيص صفحة الحظر ورمز الخطأ المرجع في الرد على الطلبات المحظورة للأسباب التالية:

* يحتوي الطلب على حمولات ضارة من الأنواع التالية: [هجمات التحقق من الإدخال](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)، [هجمات vpatch](../../user-guides/rules/vpatch-rule.md)، أو [الهجمات المكتشفة بناءً على التعبيرات العادية](../../user-guides/rules/regex-rule.md).
* يحتوي الطلب على حمولات ضارة من القائمة المذكورة أعلاه وهي تأتي من [عنوان IP رمادي](../../user-guides/ip-lists/overview.md) والعقدة تقوم بترشيح الطلبات في طور الحظر الآمن [mode](../configure-wallarm-mode.md).
* الطلب نشأ من [عنوان IP في القائمة السوداء](../../user-guides/ip-lists/overview.md).

## قيود التكوين

تتم دعم تكوين صفحة الحظر ورمز الخطأ في تنشيطات عقدة Wallarm المستندة إلى NGINX ولكن لا يتم دعمها في تنشيطات عقدة Wallarm المستندة إلى Envoy و CDN. تُرجع العقد Envoy و CDN دائمًا الرمز `403` في الرد على الطلب المحظور.

## طرق التكوين

بشكل افتراضي، يتم إرجاع رمز الاستجابة 403 وصفحة حظر NGINX الافتراضية للعميل. يمكنك تغيير الإعدادات الافتراضية باستخدام التوجيهات الخاصة بـNGINX التالية:

* `wallarm_block_page`
* `wallarm_block_page_add_dynamic_path`

### توجيه NGINX `wallarm_block_page`

يمكنك تكوين صفحة الحظر ورمز الخطأ عن طريق تمرير العوامل التالية في توجيه `wallarm_block_page` الخاص بـNGINX:

* المسار إلى ملف HTM أو HTML لصفحة الحظر. يمكنك تحديد المسار إلى صفحة حظر مخصصة أو [صفحة الحظر النموذجية](#customizing-sample-blocking-page) المقدمة من Wallarm.
* نص الرسالة التي سيتم إرجاعها في الرد على الطلب المحظور.
* URL لإعادة توجيه العميل.
* `response_code`: رمز الاستجابة.
* `type`: نوع الطلب المحظور الذي يجب أن يتم إرجاع التكوين المحدد في الاستجابة له. يقبل العامل قيمة واحدة أو عدة قيم (مفصولة بفواصل) من القائمة:

    * `attack` (افتراضيًا): للطلبات المحظورة بواسطة العقدة الترشيح عند ترشيح الطلبات في [وضع](../configure-wallarm-mode.md) الحظر أو الحظر الآمن.
    * `acl_ip`: للطلبات التي تنشأ من عناوين IP التي تمت إضافتها إلى [القائمة السوداء](../../user-guides/ip-lists/overview.md) ككائن واحد أو شبكة فرعية.
    * `acl_source`: للطلبات التي تنشأ من عناوين IP التي تم تسجيلها في بلدان [مدرجة في القائمة السوداء](../../user-guides/ip-lists/overview.md)، أو مناطق أو مراكز بيانات.

يقبل توجيه `wallarm_block_page` العوامل المدرجة في الأشكال التالية:

* المسار إلى ملف HTM أو HTML، ورمز الخطأ (اختياري)، ونوع الطلب المحظور (اختياري)

    ```bash
    wallarm_block_page &/<PATH_TO_FILE/HTML_HTM_FILE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```
    
    توفر Wallarm صفحة حظر نموذجية يمكنك استخدام هذه الصفحة كنقطة بداية لـ[التخصيص](#customizing-sample-blocking-page) الخاص بك. تقع الصفحة في المسار التالي:
    
    === "جميع البرامج المثبتة في صورة واحدة، صورة AMI أو GCP، صورة Docker المستندة إلى NGINX"
        ```
        &/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html
        ```
    === "خيارات التنشيط الأخرى"
        ```
        &/usr/share/nginx/html/wallarm_blocked.html
        ```

    يمكنك استخدام [متغيرات NGINX](https://nginx.org/en/docs/varindex.html) على صفحة الحظر. لهذا، أضف اسم المتغير بتنسيق `${variable_name}` إلى كود صفحة الحظر، على سبيل المثال `${remote_addr}` لعرض عنوان IP الذي تم منه إصدار الطلب المحظور.

    !!! warning "معلومات مهمة لمستخدمي Debian و CentOS"
        إذا استخدمت إصدارًا من NGINX أقل من 1.11 تم تثبيته من مستودعات [CentOS/Debian](../../installation/nginx/dynamic-module-from-distr.md)، يجب أن تزيل متغير `request_id` من كود الصفحة لعرض صفحة الحظر الديناميكية بشكل صحيح:
        ```
        UUID ${request_id}
        ```

        وهذا ينطبق على كلاً من `wallarm_blocked.html` وعلى الصفحة المختصة بالحظر المخصص.

    [مثال على التكوين →](#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code)
* URL لإعادة توجيه العميل ونوع الطلب المحظور (اختياري)

    ``` bash
    wallarm_block_page /<REDIRECT_URL> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [مثال على التكوين →](#url-for-the-client-redirection)
* موقع NGINX المسمي `location` ونوع الطلب المحظور (اختياري)

    ``` bash
    wallarm_block_page @<NAMED_LOCATION> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [مثال على التكوين →](#named-nginx-location)
* اسم المتغير الذي يحدد المسار إلى ملف HTM أو HTML، ورمز الخطأ (اختياري)، ونوع الطلب المحظور (اختياري)

    ``` bash
    wallarm_block_page &<VARIABLE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```

    !!! warning "تهيئة صفحة الحظر باستخدام متغيرات NGINX في الكود"
        إذا كنت تستخدم هذه الطريقة لتعيين صفحة الحظر التي تحتوي على [متغيرات NGINX](https://nginx.org/en/docs/varindex.html) في كودها، يرجى تهيئة هذه الصفحة عبر التوجيه [`wallarm_block_page_add_dynamic_path`](#nginx-directive-wallarm_block_page_add_dynamic_path).
