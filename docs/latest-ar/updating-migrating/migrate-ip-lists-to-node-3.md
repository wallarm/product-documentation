# الانتقال بقوائم السماح والحجب من عقدة Wallarm الإصدار 2.18 وما دون إلى الإصدار 4.8

بدءًا من عقدة Wallarm الإصدار 3.x، تم تغيير طريقة تكوين قوائم عناوين IP السماح والحجب. يوجه هذا الوثيقة كيفية الانتقال بقوائم السماح والحجب المكونة في عقدة Wallarm الإصدار 2.18 أو ما دون إلى أحدث إصدار من عقدة Wallarm.

## ما الذي تغير؟

تم تغيير تكوين قائمتي السماح والحجب لعناوين IP كالتالي:

* تم إيقاف استخدام توجيهات NGINX [`wallarm_acl_*`](/2.18/admin-en/configure-parameters-en/#wallarm_acl)، ومعاملات Envoy [`acl`](/2.18/admin-en/configuration-guides/envoy/fine-tuning/#ip-denylisting-settings)، ومتغيرات بيئة `WALLARM_ACL_*`. الآن، يتم تكوين قوائم IP كما يلي:

    * لا تتطلب خطوات إضافية لتمكين وظائف قوائم السماح أو الحجب. تقوم عقدة Wallarm بتنزيل قوائم عناوين IP من سحابة Wallarm بشكل افتراضي وتطبيق البيانات المنزلة عند معالجة الطلبات الواردة.
    * يتم تكوين صفحة الحجب وكود الخطأ المُرجع في الاستجابة للطلب المحجوب باستخدام توجيه [`wallarm_block_page`](../admin-en/configure-parameters-en.md#wallarm_block_page) بدلاً من `wallarm_acl_block_page`.
* يتم إدارة عناوين IP المدرجة في قائمتي السماح والحجب عبر واجهة Wallarm Console.
* يتم إدراج عناوين IP لـ [Wallarm Vulnerability Scanner](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) في قائمة السماح بشكل افتراضي. لم يعد تدريج عناوين IP الخاصة بالماسح ضوئي يدويًا مطلوبًا.

## إجراء تهيئة الانتقال لقوائم السماح والحجب

1. أبلغ [الدعم الفني لـ Wallarm](mailto:support@wallarm.com) بأنك تقوم بتحديث وحدات تصفية العقد إلى أحدث إصدار واطلب تمكين المنطق الجديد لقوائم IP لحسابك في Wallarm.

    عند تمكين منطق قوائم IP الجديد، يرجى فتح واجهة Wallarm Console والتأكد من توفر قسم [**قوائم IP**](../user-guides/ip-lists/overview.md).
2. إذا كنت تقوم بتحديث عقدة Wallarm متعددة المستأجرين، يرجى حذف السكربتات المستخدمة لمزامنة قائمة الحجب لعناوين IP وعقدة متعددة المستأجرين الإصدار 2.18 أو ما دون. بدءًا من الإصدار 3.2، لم يعد مطلوبًا دمج [قوائم IP](../user-guides/ip-lists/overview.md) يدويًا.
3. قم بتحديث وحدات تصفية العقد إلى الإصدار 4.8 وفقًا لـ[التعليمات المناسبة](general-recommendations.md#update-process).
4. احذف قائمة سماح عناوين IP لـ Wallarm Scanner من ملفات تكوين عقدة التصفية. بدءًا من عقدة التصفية الإصدار 3.x، يتم إدراج عناوين IP للماسحات الضوئية في قائمة السماح بشكل افتراضي. في إصدارات عقدة Wallarm السابقة، يمكن تكوين قائمة السماح بالطرق التالية:

    * وضع تصفية معطل لعناوين IP للماسح الضوئي (على سبيل المثال: [تكوين NGINX](/2.18/admin-en/scanner-ips-allowlisting/)، [حاوية جانبية بـ K8s](/2.18/admin-en/installation-guides/kubernetes/wallarm-sidecar-container-helm/#step-1-creating-wallarm-configmap)، [K8s Ingress controller](/2.18/admin-en/configuration-guides/wallarm-ingress-controller/best-practices/allowlist-wallarm-ip-addresses/)).
    * توجيه NGINX [`allow`](https://nginx.org/en/docs/http/ngx_http_access_module.html#allow).
5. إذا تم استخدام الطرق المذكورة لإدراج عناوين IP أخرى في قائمة السماح التي لا ينبغي حظرها بواسطة عقدة التصفية، يرجى نقلها إلى [قائمة السماح في واجهة Wallarm Console](../user-guides/ip-lists/overview.md).
6. إذا كنت قد استخدمت توجيه `wallarm_acl_block_page` لتكوين صفحة الحظر ورمز الخطأ المُرجع عندما تأتي الطلب من عنوان IP المدرج في قائمة الحجب، يرجى استبدال اسم التوجيه بـ `wallarm_block_page` وتحديث قيمته وفقًا لـ[التعليمات](../admin-en/configuration-guides/configure-block-page-and-code.md).
7. قم بإزالة متغيرات بيئة NGINX وEnvoy `WALLARM_ACL_*` من أوامر `docker run`.
8. (اختياري) قم بإزالة توجيهات NGINX [`wallarm_acl_*`](/2.18/admin-en/configure-parameters-en/#wallarm_acl) ومعاملات Envoy [`acl`](/2.18/admin-en/configuration-guides/envoy/fine-tuning/#ip-denylisting-settings) من ملفات تكوين عقدة التصفية.