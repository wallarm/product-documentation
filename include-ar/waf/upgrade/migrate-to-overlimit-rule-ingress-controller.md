ابتداءً من الإصدار 3.6، يمكن تعديل دقيق لكشف هجمات `overlimit_res` باستخدام القاعدة في لوحة تحكم Wallarm.

في وقت سابق، كانت تُستخدم التوجيهات [`wallarm_process_time_limit`][nginx-process-time-limit-docs] و[`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] الخاصة بـ NGINX. تُعتبر هذه التوجيهات قديمة مع إصدار القاعدة الجديد وسيتم حذفها في الإصدارات المستقبلية.

إذا تم تخصيص إعدادات كشف هجمات `overlimit_res` عن طريق التوجيهات المذكورة، يُنصح بنقلها إلى القاعدة كما يلي:

1. افتح لوحة تحكم Wallarm → **القواعد** وتابع إلى إعداد قاعدة [**تعديل دقيق لكشف هجمات overlimit_res**][overlimit-res-rule-docs].
1. قم بتكوين القاعدة كما تم عبر التوجيهات NGINX:

    * يجب أن تطابق شرط القاعدة كتلة تكوين NGINX مع التوجيهات `wallarm_process_time_limit` و`wallarm_process_time_limit_block` المحددة.
    * الحد الزمني للعقدة لمعالجة طلب واحد (بالميلي ثانية): قيمة `wallarm_process_time_limit`.
    * معالجة الطلب: يُوصى باختيار خيار **إيقاف المعالجة**.
    
        !!! تحذير "خطر نفاد ذاكرة النظام"
            يمكن أن يؤدي الحد الزمني العالي و/أو استمرار معالجة الطلب بعد تجاوز الحد إلى استنفاد الذاكرة أو معالجة الطلب خارج الوقت المحدد.
    
    * تسجيل هجوم overlimit_res: يُوصى بخيار **تسجيل وعرض في الأحداث**.

        إذا كانت قيمة `wallarm_process_time_limit_block` أو `process_time_limit_block` هي `off`، اختر خيار **عدم إنشاء حدث هجوم**.
    
    * لا تمتلك القاعدة خيارًا صريحًا مكافئًا لتوجيه `wallarm_process_time_limit_block`. إذا ضبطت القاعدة على **تسجيل وعرض في الأحداث**، ستقوم العقدة إما بحظر هجوم `overlimit_res` أو تمريره بناءً على [وضع تصفية العقدة][waf-mode-instr]:

        * في وضع **المراقبة**، تقوم العقدة بتوجيه الطلب الأصلي إلى عنوان التطبيق. للتطبيق خطر التعرض للاستغلال من قبل الهجمات المتضمنة في أجزاء الطلب المعالجة وغير المعالجة.
        * في وضع **الحظر الآمن**، تقوم العقدة بحظر الطلب إذا كان مصدره من عنوان IP في [القائمة الرمادية][graylist-docs]. وإلا، تقوم العقدة بتوجيه الطلب الأصلي إلى عنوان التطبيق. للتطبيق خطر التعرض للاستغلال من قبل الهجمات المتضمنة في أجزاء الطلب المعالجة وغير المعالجة.
        * في وضع **الحظر**، تقوم العقدة بحظر الطلب.
1. احذف التوجيهات `wallarm_process_time_limit` و`wallarm_process_time_limit_block` من ملف تكوين `values.yaml`.

    إذا تم تعديل دقيق لكشف هجوم `overlimit_res` باستخدام كل من التوجيهات والقاعدة، ستعالج العقدة الطلبات كما تضبط القاعدة.

[nginx-process-time-limit-docs]: https://docs.wallarm.com/admin-en/configuration-guides/nginx/directives/wallarm_process_time_limit/
[nginx-process-time-limit-block-docs]: https://docs.wallarm.com/admin-en/configuration-guides/nginx/directives/wallarm_process_time_limit_block/
[overlimit-res-rule-docs]: https://docs.wallarm.com/user-guides/rules/overlimit-res-rule-setup/
[waf-mode-instr]: https://docs.wallarm.com/admin-en/configuration-guides/configure-block-page/
[graylist-docs]: https://docs.wallarm.com/user-guides/ip-lists/graylist/