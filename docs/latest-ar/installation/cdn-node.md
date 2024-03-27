[cdn-node-operation-scheme]:        ../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../user-guides/rules/sensitive-data-rule.md
[operation-modes-docs]:             ../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console
[wallarm-cloud-docs]:               ../about-wallarm/overview.md#cloud
[cdn-node-creation-modal]:          ../images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             ../images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    ../images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  ../user-guides/settings/users.md
[update-origin-ip-docs]:            ../user-guides/nodes/cdn-node.md#updating-the-origin-address-of-the-protected-resource
[rules-docs]:                       ../user-guides/rules/rules.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[integration-docs]:                 ../user-guides/settings/integrations/integrations-intro.md
[trigger-docs]:                     ../user-guides/triggers/triggers.md
[application-docs]:                 ../user-guides/settings/applications.md
[nodes-ui-docs]:                    ../user-guides/nodes/cdn-node.md
[events-docs]:                      ../user-guides/events/check-attack.md
[graylist-populating-docs]:         ../user-guides/ip-lists/overview.md#managing-graylist
[graylist-docs]:                    ../user-guides/ip-lists/overview.md
[link-app-conf]:                    ../user-guides/settings/applications.md
[varnish-cache]:                    #why-is-there-a-delay-in-the-update-of-the-content-protected-by-the-cdn-node
[using-varnish-cache]:              ../user-guides/nodes/cdn-node.md#using-varnish-cache

# نشر عقدة وولارم بالتعاون مع Section.io

[Section](https://www.section.io/) هو نظام استضافة أصيل سحابي يتيح نشر عقدة وولارم بسهولة. من خلال توجيه الحركة المرورية من خلاله كوكيل عكسي، يمكنك التخفيف من الحركة المرورية الضارة دون إضافة مكونات خارجية إلى بنية تطبيقك التحتية.

## استخدامات محتملة

من بين جميع [خيارات نشر وولارم المدعومة](supported-deployment-options.md)، هذا الحل هو الحل الموصى به للاستخدامات المذكورة أدناه:

* أنت تبحث عن حل أمني سهل وسريع للنشر لحماية الخدمات الخفيفة.
* لا تملك القدرة على نشر عقد وولارم ضمن بنيتك التحتية للاستضافة.
* تفضل منهجية النشر دون تدخل يدوي، متجنبًا إدارة وصيانة عقد تصفية وولارم.

## القيود

يوجد بعض القيود لهذا الحل:

* لا يُنصح باستخدام عقد CDN لتحليل وتصفية حركة المرور العالية.
* لا يُدعم نشر نوع عقدة CDN تحت [خطة الاشتراك المجانية](../about-wallarm/subscription-plans.md#free-tier-subscription-plan-us-cloud).
* باستخدام عقدة CDN، يمكنك حماية النطاقات من المستوى الثالث (أو أقل، مثل 4th-، 5th- إلخ). على سبيل المثال، يمكنك إنشاء عقدة CDN لـ `ple.example.com`، ولكن ليس لـ `example.com`.
* [خدمة `collectd`](../admin-en/monitoring/intro.md) غير مدعومة.
* غير متاح إعداد [التطبيق مباشرة](../user-guides/settings/applications.md) من خلال الإجراءات القياسية. تواصل مع [فريق دعم وولارم](mailto:support@wallarm.com) للحصول على مساعدة في الإعداد.
* [صفحات الحظر المخصصة ورموز الأخطاء](../admin-en/configuration-guides/configure-block-page-and-code.md) غير قابلة للتهيئة. كافتراضي، تقوم عقدة CDN بإرجاع رمز الاستجابة 403 للطلبات المحظورة.

## المتطلبات

--8<-- "../include/waf/installation/cdn-node/cdn-node-deployment-requirements.md"

## كيفية عمل عقدة CDN

--8<-- "../include/waf/installation/cdn-node/how-cdn-node-works.md"

## نشر عقدة CDN

1. افتح واجهة وولارم → **العقد** → **CDN** → **إنشاء عقدة**.
1. أدخل عنوان النطاق المراد حمايته، على سبيل المثال `ple.example.com`.

    يجب أن يكون العنوان المحدد نطاق من المستوى الثالث (أو أقل) ولا يحتوي على البروتوكول أو الشرطات.
1. تأكد من أن وولارم تعرف بشكل صحيح على العنوان الأصلي المرتبط بالنطاق المحدد. وإلا، يرجى تغيير عنوان الأصل المكتشف تلقائيًا.

    ![نافذة إنشاء عقدة CDN][cdn-node-creation-modal]

    !!! تحذير "تحديث ديناميكي لعنوان الأصل"
        إذا قام مزود الاستضافة لديك بتحديث ديناميكي لعنوان IP الأصلي أو للنطاق المرتبط بالمورد المحمي، يرجى الحفاظ على تحديث عنوان الأصل المحدد في تكوين عقدة CDN. تتيح لك واجهة وولارم تغيير عنوان الأصل [في أي وقت][update-origin-ip-docs].

        وإلا، لن تصل الطلبات إلى المورد المحمي لأن عقدة CDN ستحاول توجيهها إلى عنوان أصل خاطئ.
1. انتظر حتى تنتهي عملية تسجيل عقدة CDN.

    بمجرد انتهاء تسجيل عقدة CDN، سيتم تغيير حالة عقدة CDN إلى **يتطلب CNAME**.
1. أضف سجل CNAME الذي تولده وولارم إلى سجلات DNS للنطاق المحمي.

    إذا كان سجل CNAME مُعدًّا بالفعل للنطاق، يُرجى استبدال قيمته بالقيمة التي أنشأتها وولارم.

    ![نافذة إنشاء عقدة CDN][cname-required-modal]

    حسب مزود DNS الخاص بك، قد يستغرق تغيير سجلات DNS ما يصل إلى 24 ساعة حتى ينتشر ويؤثر على الإنترنت. بمجرد انتشار سجل CNAME الجديد، ستقوم عقدة CDN وولارم بتوجيه جميع الطلبات الواردة إلى المورد المحمي وحظر الطلبات الضارة.
1. إذا لزم الأمر، قم بتحميل شهادة SSL/TLS المخصصة.

    وولارم ستولد شهادة Let's Encrypt لنطاق عقدة CDN كافتراضي.
1. بمجرد انتشار تغييرات سجل DNS، قم بإرسال هجوم اختباري إلى النطاق المحمي:

    ```bash
    curl http://<نطاق_محمي>/etc/passwd
    ```

    * إذا كانت العنوان IP المصدر [مدرجًا في القائمة الرمادية][graylist-docs]، ستقوم العقدة بكل من حظر الهجوم (رمز الاستجابة HTTP هو 403) وتسجيله.
    * إذا لم يكن العنوان IP المصدر [مدرجًا في القائمة الرمادية][graylist-docs]، ستقوم العقدة بتسجيل الهجمات المكتشفة فقط. يمكنك التحقق من تسجيل الهجمات في واجهة وولارم → **الهجمات**:
    
        ![الهجمات في الواجهة][attacks-in-ui]

## الخطوات التالية

تم نشر عقدة وولارم CDN بنجاح!

تعرف على خيارات تكوين وولارم:

--8<-- "../include/waf/installation/cdn-node/cdn-node-configuration-options.md"

## مشكلات عقدة CDN وحلولها

--8<-- "../include/waf/installation/cdn-node/cdn-node-troubleshooting.md"