من بين جميع [خيارات نشر Wallarm المدعومة][supported-deployments]، تُعد صورة Docker المبنية على Envoy هي الخيار الموصى به لنشر Wallarm في هذه **الحالات الاستخدامية**:

* إذا كانت منظمتك تستخدم بنية تحتية قائمة على Docker، فإن صورة Wallarm Docker هي الاختيار الأمثل. تندمج بسهولة في إعداداتك الحالية، سواء كنت تستخدم هندسة المايكروسرفيسات تعمل على AWS ECS، Alibaba ECS، أو خدمات مماثلة أخرى. هذا الحل ينطبق أيضًا على أولئك الذين يستخدمون الآلات الافتراضية الباحثين عن إدارة أكثر تنظيماً عبر حاويات Docker.
* إذا كنت بحاجة إلى التحكم المفصل بكل حاوية، فإن صورة Docker تتميز. توفر مستوى أعلى من عزل الموارد مما هو ممكن عادةً مع النشرات المبنية على الآلات الافتراضية التقليدية.