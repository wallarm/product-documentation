ابتداءً من الإصدار 3.6، يمكنك ضبط اكتشاف هجمات `overlimit_res` باستخدام القاعدة في وحدة التحكم Wallarm.

في السابق، تم استخدام الخيارات التالية:

* توجيهات NGINX [`wallarm_process_time_limit`][nginx-process-time-limit-docs] و [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs]
* معايير Envoy [`process_time_limit`][envoy-process-time-limit-docs] و [`process_time_limit_block`][envoy-process-time-limit-block-docs]

تعتبر التوجيهات والمعايير المذكورة قديمة مع إصدار القاعدة الجديدة وسيتم حذفها في الإصدارات المستقبلية.

إذا تم تخصيص إعدادات اكتشاف هجمات `overlimit_res` عبر المعايير المذكورة، يُنصح بنقلها إلى القاعدة على النحو التالي:

1. افتح وحدة التحكم Wallarm → **القواعد** وتابع إلى إعداد قاعدة [**ضبط اكتشاف هجمات overlimit_res**][overlimit-res-rule-docs].
1. قم بتكوين القاعدة كما في ملفات التكوين المثبتة:

    * يجب أن تتطابق شرط القاعدة مع كتلة تكوين NGINX أو Envoy التي تحدد توجيهات `wallarm_process_time_limit` و `wallarm_process_time_limit_block` أو معايير `process_time_limit` و `process_time_limit_block`.
    * الحد الزمني للعقدة لمعالجة طلب واحد (ملي ثانية): قيمة `wallarm_process_time_limit` أو `process_time_limit`.
    * معالجة الطلب: يُنصح بخيار **إيقاف المعالجة**.
    
        !!! تحذير "خطر نفاد ذاكرة النظام"
            يمكن أن يؤدي الحد الزمني العالي و/أو استمرار معالجة الطلب بعد تجاوز الحد إلى استنزاف الذاكرة أو معالجة الطلب خارج الوقت.
    
    * تسجيل هجمة overlimit_res: يُنصح بخيار **التسجيل والعرض في الأحداث**.

        إذا كانت قيمة `wallarm_process_time_limit_block` أو `process_time_limit_block` هي `off`، اختر خيار **عدم إنشاء حدث هجمة**.
    
    * القاعدة لا تمتلك خيارًا مطابقًا صريحًا لتوجيهة `wallarm_process_time_limit_block` (`process_time_limit_block` في Envoy). إذا وضعت القاعدة **التسجيل والعرض في الأحداث**، فإن العقدة إما ستحظر أو تمرر هجمة `overlimit_res` اعتمادًا على [وضع ترشيح العقدة][waf-mode-instr]:

        * في وضع **المراقبة**، تقوم العقدة بتوجيه الطلب الأصلي إلى عنوان التطبيق. للتطبيق خطر التعرض للاستغلال من قِبل الهجمات المدرجة في أجزاء الطلب المعالجة وغير المعالجة.
        * في وضع **الحظر الآمن**، تحظر العقدة الطلب إذا كان مصدره من عنوان IP في [القائمة الرمادية][graylist-docs]. وإلا، تقوم العقدة بتوجيه الطلب الأصلي إلى عنوان التطبيق. للتطبيق خطر التعرض للاستغلال من قِبل الهجمات المدرجة في أجزاء الطلب المعالجة وغير المعالجة.
        * في وضع **الحظر**، تحظر العقدة الطلب.
1. احذف توجيهات NGINX `wallarm_process_time_limit`, `wallarm_process_time_limit_block` ومعايير Envoy `process_time_limit`, `process_time_limit_block` من ملف التكوين المثبت.

    إذا تم ضبط اكتشاف هجمات `overlimit_res` باستخدام كلًا من المعايير والقاعدة، فإن العقدة ستعالج الطلبات كما تحدد القاعدة.