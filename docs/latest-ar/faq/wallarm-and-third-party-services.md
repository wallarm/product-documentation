# تفاعل منصة Wallarm مع الخدمات الخارجية

إذا واجهت بعض المشكلات أثناء تفاعل منصة Wallarm مع الخدمات الخارجية، تحقق من دليل استكشاف الأخطاء وإصلاحها هذا لمعالجتها. إذا لم تجد تفاصيل ذات صلة هنا، يرجى الاتصال بـ[الدعم الفني لـ Wallarm](mailto:support@wallarm.com).

## ما هي الخدمات الخارجية التي تتفاعل معها منصة Wallarm؟

تتفاعل منصة Wallarm مع الخدمات الخارجية التالية:

* خادم التغذية الراجعة Tarantool (`https://feedback.tarantool.io`) لرفع بيانات نموذج Tarantool القياسي إليه.

    يستخدم الخزين الفوري Tarantool بواسطة وحدة ما بعد التحليلات في Wallarm المنتشرة على جهازك من حزمة `wallarm-tarantool`. يتم نشر خزن Tarantool كنموذجين، مخصص (`wallarm-tarantool`) وقياسي (`tarantool`). يتم نشر نموذج قياسي إلى جانب النموذج المخصص بشكل افتراضي ولا يتم استخدامه بواسطة مكونات Wallarm.
    
    Wallarm تستخدم نموذج Tarantool المخصص فقط الذي لا يرسل أي بيانات إلى `https://feedback.tarantool.io`. ومع ذلك، يمكن للنموذج الافتراضي أن يرسل البيانات إلى خادم التغذية الراجعة Tarantool مرة واحدة في الساعة ([المزيد من التفاصيل](https://www.tarantool.io/en/doc/latest/reference/configuration/#feedback)).

## هل يمكنني تعطيل إرسال بيانات نموذج Tarantool القياسي إلى `https://feedback.tarantool.io`؟

نعم، يمكنك تعطيل إرسال بيانات نموذج Tarantool القياسي إلى `https://feedback.tarantool.io` كما يلي:

* إذا كنت لا تستخدم نموذج Tarantool القياسي، يمكنك تعطيله:

    ```bash
    systemctl stop tarantool
    ```
* إذا كان نموذج Tarantool القياسي يعالج مشكلاتك، يمكنك تعطيل إرسال البيانات إلى `https://feedback.tarantool.io` باستخدام البارامتر [`feedback_enabled`](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-logging-feedback-enabled).