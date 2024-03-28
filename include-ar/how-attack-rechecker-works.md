استنادًا إلى الهجمات المكتشفة مبدئيًا، يُنشئ وحدة **التحقق من التهديدات النشطة** العديد من طلبات الاختبار الجديدة بأحمال عمل مختلفة تهاجم نفس النقطة النهائية. يسمح هذا الآلية لـWallarm بكشف الثغرات الأمنية التي يمكن استغلالها خلال الهجمات. سيؤكد عملية التحقق من التهديدات النشطة إما أن التطبيق غير معرض لثغرات هجوم معينة أو يجد مشكلات أمنية فعلية في أمان التطبيق.

[قائمة الثغرات التي يمكن اكتشافها بواسطة الوحدة](../attacks-vulns-list.md)

تستخدم عملية **التحقق من التهديدات النشطة** المنطق التالي لفحص التطبيق المحمي لثغرات الأمان المحتملة في الويب وAPI:

1. لكل مجموعة من طلبات ضارة (كل هجوم) تم اكتشافه بواسطة عقدة تصفية Wallarm وتحميلها إلى Wallarm Cloud المتصل، يحلل النظام أي نقطة نهائية محددة (عنوان URL، معلمة سلسلة الطلب، سمة JSON، حقل XML، إلخ) تمت مهاجمتها وأي نوع من الثغرات الأمنية (SQLi، RCE، XSS، إلخ) كان المهاجم يحاول استغلاله. على سبيل المثال، دعونا نلقي نظرة على الطلب الضار التالي من نوع GET:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=UNION SELECT username, password
    ```

    سيتعلم النظام من الطلب التفاصيل التالية:
    
    * عنوان URL المهاجم هو `https://example.com/login`
    * نوع الهجوم المستخدم هو SQLi (طبقًا لـ`UNION SELECT username, password` الحمولة)
    * معلمة سلسلة الاستعلام المهاجمة هي `user`
    * قطعة إضافية من المعلومات المقدمة في الطلب هي معلمة سلسلة الطلب `token=IyEvYmluL3NoCg` (ربما تُستخدم من قبل التطبيق لمصادقة المستخدم)
2. باستخدام المعلومات المجمعة، ستقوم وحدة **التحقق من التهديدات النشطة** بإنشاء قائمة من حوالي 100-150 طلب اختبار إلى النقطة النهائية المستهدفة أصلاً ولكن بأنواع مختلفة من الأحمال الضارة لنفس نوع الهجوم (مثل SQLi). على سبيل المثال:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=1')+WAITFOR+DELAY+'0 indexpt'+AND+('wlrm'='wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1+AND+SLEEP(10)--+wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1);SELECT+PG_SLEEP(10)--
    https://example.com/login?token=IyEvYmluL3NoCg&user=1'+OR+SLEEP(10)+AND+'wlrm'='wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1+AND+1=(SELECT+1+FROM+PG_SLEEP(10))
    https://example.com/login?token=IyEvYmluL3NoCg&user=%23'%23\x22%0a-sleep(10)%23
    https://example.com/login?token=IyEvYmluL3NoCg&user=1';+WAITFOR+DELAY+'0code:10'--
    https://example.com/login?token=IyEvYmluL3NoCg&user=1%27%29+OR+SLEEP%280%29+AND+%28%27wlrm%27%3D%27wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=SLEEP(10)/*'XOR(SLEEP(10))OR'|\x22XOR(SLEEP(10))OR\x22*/
    ```

    !!! info "الأحمال الضارة لا تضر مواردك"
        الأحمال الضارة للطلبات المولدة لا تشمل بناء جملة ضارة حقيقية، إنما هي تهدف فقط إلى تقليد مبدأ الهجوم. نتيجةً لذلك، لا تضر بمواردك.
3. سترسل وحدة **التحقق من التهديدات النشطة** الطلبات الاختبارية المولدة إلى التطبيق متجاوزة حماية Wallarm (باستخدام [ميزة القائمة البيضاء][allowlist-scanner-addresses]) وتتحقق من أن التطبيق في النقطة النهائية المحددة ليس عرضة لنوع الهجوم المحدد. إذا اشتبهت الوحدة في أن التطبيق لديه ثغرة أمنية فعلية، ستقوم بإنشاء حدث بنوع [حادث](../user-guides/events/check-attack.md#incidents).

    !!! info "قيمة رأس التوجيه `User-Agent` في الطلبات"
        سيكون لرأس HTTP `User-Agent` في طلبات وحدة **التحقق من التهديدات النشطة** القيمة `Wallarm Threat-Verification (v1.x)`.
4. يتم الإبلاغ عن الحوادث الأمنية المكتشفة في وحدة التحكم Wallarm ويمكن إرسالها إلى فريق الأمان الخاص بك عبر [التكاملات](../user-guides/settings/integrations/integrations-intro.md) المتاحة لطرف ثالث و[المحفزات](../user-guides/triggers/triggers.md).