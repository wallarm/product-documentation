ابتداءً من الإصدار 3.6، يمكنك ضبط كشف الهجوم `overlimit_res` باستخدام القاعدة في واجهة Wallarm.

من قبل، تم استخدام توجيهات NGINX [`wallarm_process_time_limit`][nginx-process-time-limit-docs] و[`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs]. تُعتبر التوجيهات المذكورة قديمة مع إصدار القاعدة الجديدة وسوف تحذف في الإصدارات المستقبلية.

إذا تم تخصيص إعدادات كشف الهجوم `overlimit_res` عبر التوجيهات المذكورة، يُوصى بنقلها إلى القاعدة كما يلي:

1. افتح واجهة Wallarm Console → **القواعد** وتابع إلى إعداد قاعدة [**ضبط كشف الهجوم overlimit_res**][overlimit-res-rule-docs].
1. قم بتكوين القاعدة كما تم عبر التوجيهات NGINX:

    * يجب أن تتطابق شروط القاعدة مع كتلة تكوين NGINX التي تحدد التوجيهات `wallarm_process_time_limit` و`wallarm_process_time_limit_block`.
    * حد زمني للعقدة لمعالجة طلب واحد (بالمللي ثانية): قيمة `wallarm_process_time_limit`.
    * معالجة الطلب: يوصى بخيار **وقف المعالجة**.
    
        !!! تحذير "خطر نفاد ذاكرة النظام"
            الحد الزمني المرتفع و/أو استمرار معالجة الطلب بعد تجاوز الحد يمكن أن يؤدي إلى استنفاد الذاكرة أو معالجة الطلب خارج الوقت.
    
    * تسجيل هجوم overlimit_res: يوصى بخيار **تسجيل وعرض في الأحداث**.

        إذا كانت قيمة `wallarm_process_time_limit_block` أو `process_time_limit_block` هي `off`، اختر خيار **لا تقم بإنشاء حدث هجوم**.
    
    * لا تمتلك القاعدة خيارًا صريحًا مكافئًا لتوجيه `wallarm_process_time_limit_block`. إذا قامت القاعدة بتعيين **تسجيل وعرض في الأحداث**، فإن العقدة إما ستحجب أو تمرر هجوم `overlimit_res` وفقًا ل[وضع تصفية العقدة][waf-mode-instr]:

        * في وضع **المراقبة**، ترسل العقدة الطلب الأصلي إلى عنوان التطبيق. للتطبيق خطر أن يتم استغلاله بواسطة الهجمات المضمنة في أجزاء الطلب المعالجة وغير المعالجة.
        * في وضع **الحجب الآمن**، تحجب العقدة الطلب إذا كان مصدره من عنوان IP [مدرج بالقائمة الرمادية][graylist-docs]. وإلا، ترسل العقدة الطلب الأصلي إلى عنوان التطبيق. للتطبيق خطر أن يتم استغلاله بواسطة الهجمات المضمنة في أجزاء الطلب المعالجة وغير المعالجة.
        * في وضع **الحجب**، تحجب العقدة الطلب.
1. حذف التوجيهات `wallarm_process_time_limit` و`wallarm_process_time_limit_block` من ملف تكوين NGINX.

    إذا تم ضبط كشف الهجوم `overlimit_res` باستخدام كل من التوجيهات والقاعدة، ستعالج العقدة الطلبات كما تحدد القاعدة.

[nginx-process-time-limit-docs]: https://docs.wallarm.com/admin-en/configuration-guides/nginx/directives/wallarm_process_time_limit/
[nginx-process-time-limit-block-docs]: https://docs.wallarm.com/admin-en/configuration-guides/nginx/directives/wallarm_process_time_limit_block/
[overlimit-res-rule-docs]: https://docs.wallarm.com/user-guides/rules/overlimit-res-attack-detection.html
[waf-mode-instr]: https://docs.wallarm.com/admin-en/configuration-guides/manage-detection-mode/
[graylist-docs]: https://docs.wallarm.com/user-guides/ip-lists/graylist.html