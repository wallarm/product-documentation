# الترحيل من قوائم السماح والحظر في عقدة Wallarm الإصدار 2.18 وما دون إلى الإصدار 4.8

ابتداءً من عقدة Wallarm الإصدار 3.x، تم تغيير طريقة تكوين قوائم السماح والحظر لعناوين IP. يوجه هذا المستند كيفية الترحيل من قوائم السماح والحظر المكونة في عقدة Wallarm الإصدار 2.18 أو ما دون إلى أحدث عقدة Wallarm.

## ما الذي تغير؟

تم تغيير تكوين قوائم السماح والحظر لعناوين IP كما يلي:

* تم إهمال توجيهات NGINX [`wallarm_acl_*`](/2.18/admin-en/configure-parameters-en/#wallarm_acl)، ومعاملات Envoy [`acl`](/2.18/admin-en/configuration-guides/envoy/fine-tuning/#ip-denylisting-settings)، ومتغيرات البيئة `WALLARM_ACL_*`. الآن، يتم تكوين قوائم IP كما يلي:

    * خطوات إضافية لتمكين وظيفة قائمة السماح أو الحظر ليست مطلوبة. تقوم عقدة Wallarm بتنزيل قوائم عناوين IP من سحابة Wallarm بشكل افتراضي وتطبق البيانات المنزلة عند معالجة الطلبات الواردة.
    * يتم تكوين صفحة الحظر وكود الخطأ المُرجع في الاستجابة إلى الطلب المحظور باستخدام التوجيه [`wallarm_block_page`](../admin-en/configure-parameters-en.md#wallarm_block_page) بدلاً من `wallarm_acl_block_page`.
* يتم إدارة عناوين IP المدرجة في قوائم السماح والحظر عبر واجهة استخدام Wallarm.
* عناوين IP الخاصة ب[ماسح ضعف Wallarm](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) مدرجة في قائمة السماح افتراضيًا. لم تعد مطلوبة إضافة عناوين IP للماسح الضوئي إلى قائمة السماح يدويًا.

## إجراء ترحيل تكوين قائمة السماح والحظر

1. أبلغ [دعم Wallarm الفني](mailto:support@wallarm.com) بأنك تقوم بتحديث وحدات ترشيح العقدة إلى الإصدار الأخير واطلب تمكين منطق قوائم IP الجديد لحساب Wallarm الخاص بك.

    عند تمكين منطق قوائم IP الجديد، يرجى فتح واجهة استخدام Wallarm والتأكد من توفر قسم [**قوائم IP**](../user-guides/ip-lists/overview.md).
2. إذا كنت تقوم بتحديث عقدة Wallarm متعددة المستأجرين، يرجى حذف السكربتات المستخدمة لمزامنة قائمة حظر عناوين IP والعقدة متعددة المستأجرين الإصدار 2.18 أو ما دون. ابتداءً من الإصدار 3.2، لم تعد مطلوبة التكامل اليدوي لـ[قوائم IP](../user-guides/ip-lists/overview.md).
3. قم بتحديث وحدات ترشيح العقدة إلى الإصدار 4.8 باتباع [التعليمات المناسبة](general-recommendations.md#update-process).
4. أزل قائمة السماح لعناوين IP الخاصة بماسح الضعف من ملفات تكوين العقدة الفلترة. ابتداءً من العقدة الفلترة الإصدار 3.x، عناوين IP للماسح الضوئي مدرجة في قائمة السماح افتراضيًا. في إصدارت Wallarm السابقة، يمكن تكوين قائمة السماح بالطرق التالية:

    * تعطيل وضع الترشيح لعناوين IP الماسح الضوئي (على سبيل المثال: [تكوين NGINX](/2.18/admin-en/scanner-ips-allowlisting/)، [حاوية جانبية K8s](/2.18/admin-en/installation-guides/kubernetes/wallarm-sidecar-container-helm/#step-1-creating-wallarm-configmap)، [متحكم K8s Ingress](/2.18/admin-en/configuration-guides/wallarm-ingress-controller/best-practices/allowlist-wallarm-ip-addresses/)).
    * التوجيه NGINX [`allow`](https://nginx.org/en/docs/http/ngx_http_access_module.html#allow).
5. إذا تم استخدام الطرق المذكورة لإدراج عناوين IP الأخرى التي لا ينبغي حظرها من قبل العقدة الفلترة، يرجى نقلها إلى [قائمة السماح في واجهة استخدام Wallarm](../user-guides/ip-lists/overview.md).
6. إذا كنت تستخدم التوجيه `wallarm_acl_block_page` لتكوين صفحة الحظر وكود الخطأ المرجع عندما ينشأ الطلب من عنوان IP الموجود في قائمة الحظر، يرجى استبدال اسم التوجيه بـ `wallarm_block_page` وتحديث قيمته باتباع [التعليمات](../admin-en/configuration-guides/configure-block-page-and-code.md).
7. أزل متغيرات البيئة NGINX وEnvoy `WALLARM_ACL_*` من أوامر `docker run`.
8. (اختياري) أزل التوجيهات NGINX [`wallarm_acl_*`](/2.18/admin-en/configure-parameters-en/#wallarm_acl) ومعاملات Envoy [`acl`](/2.18/admin-en/configuration-guides/envoy/fine-tuning/#ip-denylisting-settings) من ملفات تكوين العقدة الفلترة.