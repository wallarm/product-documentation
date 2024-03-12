بناءً على الهجمات المكتشفة في البداية، يقوم وحدة **التحقق من التهديدات الفعّالة** بإنشاء الكثير من طلبات الاختبار الجديدة بحمولات مختلفة تهاجم نفس النقطة النهائية. يتيح هذا الآلية لـ Wallarm الكشف عن الثغرات الأمنية التي يمكن أن يتم استغلالها أثناء الهجمات. تؤكد عملية التحقق من التهديدات الفعّالة إما أن التطبيق ليس عرضة لناقلات الهجوم المحددة أو تجد مشاكل أمنية حقيقية بأمان التطبيق.

[قائمة بالثغرات الأمنية التي يمكن اكتشافها بواسطة الوحدة](../attacks-vulns-list.md)

عملية **التحقق من التهديدات الفعّالة** تستخدم المنطق التالي لفحص التطبيق المحمي لاحتمالية وجود ثغرات أمنية في الويب والـ API:

1. بالنسبة لكل مجموعة طلبات ضارة (كل هجوم) تم اكتشافها بواسطة عقدة تصفية Wallarm وتم تحميلها إلى سحابة Wallarm المتصلة، يقوم النظام بتحليل أي نقطة نهائية محددة (URL، معلمة سلسلة الطلب، سمة JSON، حقل XML، إلخ) تم مهاجمتها وأي نوع معين من الثغرات الأمنية (SQLi، RCE، XSS، إلخ) كان المهاجم يحاول استغلالها. على سبيل المثال، لنلقي نظرة على الطلب الضار التالي بطريقة GET:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=UNION SELECT username, password
    ```

    من الطلب سيتعلم النظام التفاصيل التالية:
    
    * URL المهاجم هو `https://example.com/login`
    * نوع الهجوم المستخدم هو SQLi (وفقًا لحمولة `UNION SELECT username, password`)
    * معلمة سلسلة الاستعلام المهاجمة هي `user`
    * معلومة إضافية مقدمة في الطلب هي معلمة سلسلة الطلب `token=IyEvYmluL3NoCg` (من المحتمل أن يتم استخدامها من قبل التطبيق لمصادقة المستخدم)
2. باستخدام المعلومات المجمعة ستقوم وحدة **التحقق من التهديدات الفعّالة** بإنشاء قائمة بحوالي 100-150 طلب اختبار إلى النقطة النهائية المستهدفة أصلاً ولكن بأنواع مختلفة من الحمولات الضارة لنفس نوع الهجوم (مثل SQLi). على سبيل المثال:

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

    !!! info "الحمولات الضارة لا تضر مواردك"
        حمولات الطلبات التي تم توليدها لا تتضمن بناء جملة ضارة حقيقية، وإنما هي مُعدة فقط لتقليد مبدأ الهجوم. نتيجةً لذلك، لا تضر بمواردك.
3. سترسل وحدة **التحقق من التهديدات الفعّالة** طلبات الاختبار المُولّدة إلى التطبيق متجاوزة حماية Wallarm (باستخدام [ميزة القائمة البيضاء][allowlist-scanner-addresses]) وتحقق من أن التطبيق في النقطة النهائية المحددة ليس عرضة لنوع الهجوم المحدد. إذا اشتبهت الوحدة بأن التطبيق لديه ثغرة أمنية فعلية، فإنها ستقوم بإنشاء حدث بنوع [واقعة](../user-guides/events/check-attack.md#incidents).

    !!! info "قيمة رأس HTTPS `User-Agent` في الطلبات"
        سيكون لرأس HTTP `User-Agent` في طلبات وحدة **التحقق من التهديدات الفعّالة** القيمة `Wallarm Threat-Verification (v1.x)`.
4. يتم الإبلاغ عن الوقائع الأمنية المكتشفة في واجهة Wallarm Console ويمكن إرسالها إلى فريق الأمان الخاص بك عبر [التكاملات](../user-guides/settings/integrations/integrations-intro.md) و[المشغلات](../user-guides/triggers/triggers.md) الطرف ثالث المتاحة.