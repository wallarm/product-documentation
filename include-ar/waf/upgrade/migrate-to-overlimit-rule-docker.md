ابتداءً من الإصدار 3.6، يمكنك تعديل إعدادات كشف الهجمات `overlimit_res` باستخدام القاعدة في لوحة تحكم Wallarm.

سابقًا، كانت الخيارات التالية مستخدمة:

* الأوامر [`wallarm_process_time_limit`][nginx-process-time-limit-docs] و[`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] لـ NGINX
* المعاملات [`process_time_limit`][envoy-process-time-limit-docs] و[`process_time_limit_block`][envoy-process-time-limit-block-docs] لـ Envoy

تُعد الأوامر والمعاملات المذكورة قديمةً مع إصدار القاعدة الجديدة وستُحذف في الإصدارات المستقبلية.

إذا تم تخصيص إعدادات كشف هجمات `overlimit_res` عبر المعاملات المذكورة، يُنصح بنقلها إلى القاعدة كما يلي:

1. افتح لوحة تحكم Wallarm → **القواعد** وتابع إلى إعداد قاعدة [**تعديل كشف هجمات overlimit_res**][overlimit-res-rule-docs].
1. قم بتكوين القاعدة كما في ملفات الإعداد المركبة:

    * يجب أن تطابق شرط القاعدة كتلة الإعداد في NGINX أو Envoy مع الأوامر `wallarm_process_time_limit` و`wallarm_process_time_limit_block` أو المعاملات `process_time_limit` و`process_time_limit_block` المحددة.
    * الحد الزمني للعقدة لمعالجة طلب واحد (بالمللي ثانية): قيمة `wallarm_process_time_limit` أو `process_time_limit`.
    * معالجة الطلب: يُنصح بخيار **إيقاف المعالجة**.
    
        !!! تحذير "خطر نفاد ذاكرة النظام"
            قد يؤدي الحد الزمني العالي و/أو استمرار معالجة الطلب بعد تجاوز الحد إلى استنفاد الذاكرة أو معالجة الطلب خارج الوقت.
    
    * تسجيل هجمة overlimit_res: يُنصح بخيار **تسجيل وعرض في الأحداث**.

        إذا كانت قيمة `wallarm_process_time_limit_block` أو `process_time_limit_block` هي `off`، اختر خيار **عدم إنشاء حدث هجمة**.
    
    * القاعدة ليس لها خيار مُساوٍ صريح للأمر `wallarm_process_time_limit_block` (`process_time_limit_block` في Envoy). إذا تم ضبط القاعدة على **تسجيل وعرض في الأحداث**، فإن العقدة ستمنع أو تسمح بمرور هجمة `overlimit_res` بناءً على [وضع ترشيح العقدة][waf-mode-instr]:

        * في وضع **المراقبة**، العقدة توجه الطلب الأصلي إلى عنوان التطبيق. التطبيق معرض للخطر ليتم استغلاله بواسطة الهجمات المتضمنة في أجزاء الطلب المعالجة وغير المعالجة.
        * في وضع **الحظر الآمن**، العقدة تمنع الطلب إذا كان مصدره من عنوان IP مدرج في [القائمة الرمادية][graylist-docs]. خلاف ذلك، العقدة توجه الطلب الأصلي إلى عنوان التطبيق. التطبيق معرض للخطر ليتم استغلاله بواسطة الهجمات المتضمنة في أجزاء الطلب المعالجة وغير المعالجة.
        * في وضع **الحظر**، العقدة تمنع الطلب.
1. احذف الأوامر `wallarm_process_time_limit`, `wallarm_process_time_limit_block` لـ NGINX والمعاملات `process_time_limit`, `process_time_limit_block` لـ Envoy من ملف الإعداد المركب.

    إذا تم تعديل كشف هجمات `overlimit_res` باستخدام كلٍ من المعاملات والقاعدة، فإن العقدة ستعالج الطلبات كما تحدد القاعدة.

[nginx-process-time-limit-docs]: https://docs.wallarm.com/nginx/directives/wallarm_process_time_limit/
[nginx-process-time-limit-block-docs]: https://docs.wallarm.com/nginx/directives/wallarm_process_time_limit_block/
[envoy-process-time-limit-docs]: https://docs.wallarm.com/envoy/parameters/process_time_limit/
[envoy-process-time-limit-block-docs]: https://docs.wallarm.com/envoy/parameters/process_time_limit_block/
[overlimit-res-rule-docs]: https://docs.wallarm.com/rules/overlimit_res-attack-detection/
[waf-mode-instr]: https://docs.wallarm.com/node-modes/
[graylist-docs]: https://docs.wallarm.com/list-management/graylist/