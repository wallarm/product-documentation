[cdn-node-operation-scheme]:        ../../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../rules/sensitive-data-rule.md
[operation-modes-docs]:             ../../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console
[wallarm-cloud-docs]:               ../../about-wallarm/overview.md#cloud
[cdn-node-creation-modal]:          ../../images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             ../../images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    ../../images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  ../settings/users.md
[update-origin-ip-docs]:            #updating-the-origin-address-of-the-protected-resource
[rules-docs]:                       ../rules/rules.md
[ip-lists-docs]:                    ../ip-lists/overview.md
[integration-docs]:                 ../settings/integrations/integrations-intro.md
[trigger-docs]:                     ../triggers/triggers.md
[application-docs]:                 ../settings/applications.md
[events-docs]:                      ../events/check-attack.md
[graylist-populating-docs]:         ../ip-lists/overview.md#managing-graylist
[link-app-conf]:                    ../settings/applications.md
[using-varnish-cache]:              #using-varnish-cache

# عقد تصفية CDN

قسم **العُقد** في واجهة مستخدم لوحة تحكم Wallarm يُتيح لك إدارة عقد [**Wallarm node**](nodes.md) وأنواع عقد **CDN**. هذا المقال يخص عقد CDN.

!!! info "عقد CDN تحت الخطة المجانية"
    نشر نوع عقد CDN غير مدعوم تحت [الخطة المجانية](../../about-wallarm/subscription-plans.md#free-tier-subscription-plan-us-cloud).

--8<-- "../include/waf/installation/cdn-node/how-cdn-node-works.md"

## إنشاء عقدة

لإنشاء عقدة CDN، الرجاء اتباع [التعليمات](../../installation/cdn-node.md).

## عرض تفاصيل العقدة

تُعرض تفاصيل العقدة المُثبتة في جدول وبطاقة كل عقدة. لفتح البطاقة، انقر على سجل الجدول المناسب.

الخصائص والمقاييس التالية للعقدة متاحة:

* اسم العقدة الذي تم إنشاؤه بناءً على اسم النطاق المحمي
* عنوان IP للعقدة
* العنوان الأصلي المرتبط بالنطاق المحمي
* المعرّف الفريد للعقدة (UUID)
* حالة العقدة
* شهادة SSL/TLS: Let's Encrypt التي أنشأها Wallarm أو التخصيصية
* وقت آخر تزامن لعقدة التصفية وسحابة Wallarm
* تاريخ إنشاء عقدة التصفية
* عدد الطلبات التي تمت معالجتها بواسطة العقدة في الشهر الحالي
* إصدارات من custom_ruleset و proton.db المستخدمة
* إصدارات حزم Wallarm المثبتة
* مؤشر تحديثات المكونات المتاحة

![بطاقة عقدة CDN](../../images/user-guides/nodes/view-cdn-node-comp-vers.png)

## تحديث عنوان الأصل للمورد المحمي

إذا كان مزود الاستضافة الخاص بك يقوم بتحديث عنوان IP الأصلي أو النطاق المرتبط بالمورد المحمي ديناميكيًا، الرجاء الحفاظ على تحديث العنوان الأصلي المُحدد في تكوين عقدة CDN. خلاف ذلك، لن تصل الطلبات إلى المورد المحمي لأن عقدة CDN ستحاول توجيهها إلى عنوان أصلي غير صحيح.

لتحديث عنوان الأصل، استخدم خيار **تعديل عنوان الأصل**.

## تحميل شهادة SSL/TLS المحددة

Wallarm تصدر تلقائيًا [شهادة Let's Encrypt](https://letsencrypt.org/) التي تتيح HTTPS على نطاق عقدة CDN. يتم إنشاء الشهادات وتجديدها تلقائيًا حسب الحاجة.

إذا كان لديك بالفعل شهادة للنطاق المحمي وتفضل استخدامها عن شهادة Let's Encrypt، يمكنك تحميل شهادتك الخاصة باستخدام خيار **تحديث شهادة SSL/TLS**.

## استخدام Varnish Cache

استخدام عقدة CDN مع مسرّع HTTP [Varnish Cache](https://varnish-cache.org/intro/index.html#intro) يسرّع من توصيل المحتوى للمستخدمين (مثل إستجابات الخادم الخاص بك). ومع ذلك، إذا قمت بتغيير المحتوى الخاص بك، قد يتم تحديث النسخة المخزنة في CDN بتأخير، والتي قد تسبب [مشاكل](#why-is-there-a-delay-in-the-update-of-the-content-protected-by-the-cdn-node) وتكون سببًا لتعطيل Varnish Cache.

لتجنب مشاكل سرعة تحديث المحتوى، يتم تعطيل Varnish Cache افتراضيًا. يمكنك تمكين/تعطيل Varnish Cache يدويًا. للقيام بذلك، انتقل إلى **العُقد** → قائمة عقدة CDN → **تمكين Varnish Cache** أو **تعطيل Varnish Cache**.

## حذف عقدة

عند حذف عقدة التصفية، سيتم إيقاف التصفية للطلبات المرسلة إلى نطاقك. لا يمكن التراجع عن عملية حذف عقدة التصفية. سيتم حذف عقدة Wallarm نهائيًا من قائمة العُقد.

1. احذف سجل CNAME الخاص بـ Wallarm من سجلات DNS للنطاق المحمي.

    !!! warning "سيتم إيقاف تخفيف الطلبات الخبيثة"
        بمجرد إزالة سجل CNAME وبدء سريان التأثير على الإنترنت، عقدة CDN الخاصة بـ Wallarm ستتوقف عن توجيه الطلبات، وسيذهب الحركة المشروعة والخبيثة مباشرةً إلى المورد المحمي.

        ينتج عن ذلك خطر استغلال ضعف الخادم المحمي عندما يدخل السجل المحذوف حيز التنفيذ ولم يدخل سجل CNAME الذي تم إنشاؤه لإصدار العقدة الجديد حيز التنفيذ بعد.
1. انتظر حتى تنتشر التغييرات. يُعرض الحالة الفعلية لسجل CNAME في لوحة التحكم Wallarm → **العُقد** → **CDN** → **حذف عقدة**.
1. احذف عقدة CDN من قائمة العُقد.

![حذف العقدة](../../images/user-guides/nodes/delete-cdn-node.png)

## استكشاف أخطاء عقدة CDN وإصلاحها

--8<-- "../include/waf/installation/cdn-node/cdn-node-troubleshooting.md"