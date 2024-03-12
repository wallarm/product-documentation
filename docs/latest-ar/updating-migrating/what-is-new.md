# إيه الجديد في نود Wallarm إصدار 4.10

تم إصدار نسخة جديدة من نود Wallarm! ده الإصدار بيقدم خاصية متقدمة لكشف محاولات استخدام بيانات الاعتماد المسروقة، اللي بتزود حماية أكبر لواجهات برمجة التطبيقات APIs بتاعتك.

!!! info "الأشياء المختارة المحسنة في الإصدار 4.10"
    فقط بعض الأشياء، منها مثبت الكل في واحد، صورة Docker القائمة على NGINX وصور السحاب (AMI، صورة GCP) تم إصدارها كجزء من الإصدار 4.10، مع دعم للقدرات المقدمة حديثًا.

## كشف محاولات استخدام بيانات الاعتماد <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

بدءًا من الإصدار 4.10، Wallarm بيقدم كشف فوري وإشعارات لمحاولات استخدام بيانات الاعتماد المسروقة. استخدام بيانات الاعتماد المسروقة، وهو الإدخال الآلي لأزواج اسم المستخدم/البريد الإلكتروني وكلمة المرور الضعيفة أو المسروقة في نماذج تسجيل الدخول للمواقع للوصول غير الشرعي إلى حسابات المستخدمين، بقى تحت المراقبة الشديدة الآن. الخاصية دي مكنتك من تحديد الحسابات التي تم اختراق بيانات الاعتماد بتاعتها واتخاذ إجراءات لتأمينها، مثل إبلاغ مالكي الحساب وتعليق الوصول إلى الحساب مؤقتًا.

[تعلم كيف تقوم بتكوين كشف استخدام بيانات الاعتماد](../about-wallarm/credential-stuffing.md)

![الهجمات - استخدام بيانات الاعتماد](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-attacks.png)


## صورة Docker المبنية على NGINX أصبحت مُحسنة وأكثر أمانًا

[صورة Docker لنود Wallarm المبني على NGINX](../admin-en/installation-docker-en.md) تم تحديثها لتوفير أمان وتحسين أكبر. التحديثات الأساسية تشمل:

* صورة Docker دلوقتي مبنية على Alpine Linux بدلاً من Debian، لتوفير أداة أكثر أمانًا وخفيفة الوزن. لاحظ أن موديولات NGINX `auth-pam` و `subs-filter`، اللي كانت مشمولة قبل كده، مش بقت موجودة مع صورة Docker.
* تم التحديث لآخر نسخة مستقرة من NGINX، 1.24.0، بدلًا من النسخة السابقة 1.14.x. مع إن أغلب الثغرات الأمنية في 1.14.x تم إصلاحها بواسطة فريق Debian (كانت صورة سابقة مبنية على Debian 10.x)، الترقية لـ 1.24.0 حلت الثغرات الأمنية المتبقية لتحسين الأمان.

      ترقية NGINX، بالإضافة إلى التحول لـ Alpine Linux، حلت ثغرة إعادة تعيين سريع HTTP/2 (CVE-2023-44487)، بسبب تطبيق تصحيح خاص بـ Alpine  في NGINX 1.24.0.

* الدعم للمعالجات بمعمارية ARM64، اللي بيتم تحديدها تلقائيًا أثناء عملية التثبيت.
* داخل حاوية Docker، كل العمليات بقت بتستخدم المستخدم غير الجذر `wallarm`، ودي تغيير من إعداد المستخدم `root` السابق. ده بيأثر على عملية NGINX كمان.
* نقطة النهاية [`/wallarm-status`](../admin-en/configure-statistics-service.md) تم تحديثها لتصدير المقاييس بصيغة Prometheus بدلًا من JSON. ده بينطبق بشكل خاص عند الوصول لنقطة النهاية من خارج حاوية Docker. اعلم أنه يجب ضبط متغير البيئة [`WALLARM_STATUS_ALLOW`](../admin-en/installation-docker-en.md#wallarm-status-allow-env-var) بشكل مناسب لهذه الوظيفة.
* صورة Docker دلوقتي تم بنائها باستخدام [مثبت الكل في واحد](../installation/nginx/all-in-one.md)، اللي غير في تركيب داخلي للمجلدات:

      * مجلد ملف السجل: `/var/log/wallarm` → `/opt/wallarm/var/log/wallarm`.
      * مجلد بملفات تحتوي على بيانات اعتماد لنود Wallarm للاتصال بالسحابة: `/etc/wallarm` → `/opt/wallarm/etc/wallarm`.
      * مسار مجلد `/usr/share` → `/opt/wallarm/usr/share`.
      
          ده قدم مسار جديد لـ [صفحة الحظر النموذجية](../admin-en/configuration-guides/configure-block-page-and-code.md)، الموجودة في `/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`، وللسكريبت التشخيصي، الموجود في `/opt/wallarm/usr/share/wallarm-common/collect-info.sh`.

المنتجات الجديدة المصدرة مدعومة أيضًا بالصورة الجديدة لـ Docker القائمة على NGINX.

## صور السحابة مُحسنة

[صورة آلة أمازون (AMI)](../installation/cloud-platforms/aws/ami.md) و[صورة آلة جوجل السحابية](../installation/cloud-platforms/gcp/machine-image.md) تم تحسينها. التحديثات الأساسية تشمل:

* صور السحابة دلوقتي بتستخدم Debian 12.x (bookworm)، أحدث إصدار مستقر، بدلًا من Debian 10.x (buster) المتقادم، لتحسين الأمان.
* تم التحديث لنسخة NGINX الأحدث، 1.22.0، بدلًا من النسخة السابقة 1.14.x.
* الدعم للمعالجات بمعمارية ARM64، اللي بيتم تحديدها تلقائيًا أثناء عملية التثبيت.
* صور السحابة بقت مبنية باستخدام [مثبت الكل في واحد](../installation/nginx/all-in-one.md)، اللي غير في تركيب داخلي للمجلدات:

      * سكريبت تسجيل النود: `/usr/share/wallarm-common/register-node` → `/opt/wallarm/usr/share/wallarm-common/cloud-init.py`.
      * مجلد ملف السجل: `/var/log/wallarm` → `/opt/wallarm/var/log/wallarm`.
      * مجلد بملفات تحتوي على بيانات اعتماد لنود Wallarm للاتصال بالسحابة: `/etc/wallarm` → `/opt/wallarm/etc/wallarm`.
      * مسار مجلد `/usr/share` → `/opt/wallarm/usr/share`.
      
          ده قدم مسار جديد لـ [صفحة الحظر النموذجية](../admin-en/configuration-guides/configure-block-page-and-code.md)، الموجودة في `/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`، وللسكريبت التشخيصي، الموجود في `/opt/wallarm/usr/share/wallarm-common/collect-info.sh`.
      
      * تم إزالة ملف `/etc/nginx/conf.d/wallarm.conf` اللي كان يحتوي على إعدادات نود Wallarm العامة.

المنتجات الجديدة المصدرة مدعومة أيضًا بصور السحابة بهذا الشكل الجديد.

## معالجة الثغرات الأمنية

إصدار 4.10.1 بيتناول عدة ثغرات أمنية بخطورة عالية وحرجة في أدوات تنصيب Wallarm، ما بيزود وضع البرنامج الأمني من خلال استبدال مكونات كانت معرضة للخطر من قبل.

من بين الثغرات الأمنية اللي تم معالجتها تلك اللي تم تحديدها بـ [CVE-2020-36327](https://nvd.nist.gov/vuln/detail/CVE-2020-36327)، [CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920)، وعدة ثغرات أخرى. قائمة كاملة بالثغرات الأمنية المعالجة، مع CVEs المحددة لكل أداة تنصيب نود، ممكن تتلاقى في [جرد إصدارات أداة نود](node-artifact-versions.md).

## عند الترقية من النود 3.6 وأقل

لو بترقي من الإصدار 3.6 أو أقل، تعرف على كل التغيرات من [القائمة المنفصلة](older-versions/what-is-new.md).

## أي نودات Wallarm موصى بترقيتها؟

* نودات Wallarm العميل والمتعددة المستأجرين من الإصدار 4.6 و 4.8 للبقاء محدّثين مع إصدارات Wallarm وتجنّب [استبعاد وحدة مثبتة](versioning-policy.md#version-support).
* نودات Wallarm العميل والمتعددة المستأجرين من الإصدارات [غير المدعومة](versioning-policy.md#version-list) (4.4 وأقل). التغيرات المتاحة في نود Wallarm 4.10 بتسهل تكوين النود وتحسن في ترشيح حركة المرور. لاحظ ده أن بعض إعدادات نود 4.10 **غير متوافقة** مع نودات الإصدارات الأقدم.

## عملية الترقية

1. راجع [توصيات لترقية الوحدة](general-recommendations.md).
2. قم بترقية الوحدات المثبتة وفقًا لتعليمات خيار تنصيب نود Wallarm بتاعك:

      * [مثبت الكل في واحد](all-in-one.md)
      * [حاوية Docker بالوحدات لـ NGINX](docker-container.md)
      * [وحدة تحكم توجيه NGINX مع وحدات Wallarm المدمجة](ingress-controller.md)
      * [صورة السحابة للنود](cloud-image.md)
      * [نود متعدد المستأجرين](multi-tenant.md)

----------

[تحديثات أخرى في منتجات ومكونات Wallarm →](https://changelog.wallarm.com/)