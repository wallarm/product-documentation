# تفاعل منصة وولارم والخدمات الخارجية

إذا واجهت بعض المشكلات أثناء التفاعل بين منصة وولارم والخدمات الخارجية، تحقق من هذا الدليل لإصلاح الأعطال لمعالجتها. إذا لم تجد التفاصيل ذات الصلة هنا، يُرجى التواصل مع [دعم وولارم الفني](mailto:support@wallarm.com).

## مع أي خدمات خارجية تتفاعل منصة وولارم؟

تتفاعل منصة وولارم مع الخدمات الخارجية التالية:

* تخزين GCP لتحميل قائمة فعلية بعناوين IP المسجلة في دول ومناطق ومراكز بيانات [المسموح بها، الممنوعة، أو الموجودة في القائمة الرمادية](../user-guides/ip-lists/overview.md).

    قبل تثبيت وولارم، نوصي بالتأكد من أن جهازك لديه الوصول إلى [عناوين IP لتخزين GCP](https://www.gstatic.com/ipranges/goog.json).
* خادم تغذية الرجعية لـ Tarantool (`https://feedback.tarantool.io`) لرفع بيانات نموذج Tarantool القياسي إليه.

    يستخدم التخزين في الذاكرة Tarantool بواسطة وحدة تحليلات الما بعد في وولارم المنصوبة على جهازك من الحزمة `wallarm-tarantool`. يتم نشر التخزين Tarantool كنموذجين، مخصص (`wallarm-tarantool`) وقياسي (`tarantool`). يتم نشر نموذج قياسي جنبًا إلى جنب مع النموذج المخصص افتراضيًا ولا يستخدم بواسطة مكونات وولارم.
    
    تستخدم وولارم نموذج Tarantool المخصص فقط الذي لا يرسل أي بيانات إلى `https://feedback.tarantool.io`. ومع ذلك، يمكن لنموذج افتراضي إرسال البيانات إلى خادم تغذية الرجعية لـ Tarantool مرة واحدة في الساعة ([المزيد من التفاصيل](https://www.tarantool.io/en/doc/latest/reference/configuration/#feedback)).

## هل يمكنني تعطيل إرسال بيانات نموذج Tarantool القياسي إلى `https://feedback.tarantool.io`؟

نعم، يمكنك تعطيل إرسال بيانات نموذج Tarantool القياسي إلى `https://feedback.tarantool.io` كما يلي:

* إذا كنت لا تستخدم نموذج Tarantool القياسي، يمكنك تعطيله:

    ```bash
    systemctl stop tarantool
    ```
* إذا كان نموذج Tarantool القياسي يعالج مشكلاتك، يمكنك تعطيل إرسال البيانات إلى `https://feedback.tarantool.io` باستخدام العامل [`feedback_enabled`](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-logging-feedback-enabled).