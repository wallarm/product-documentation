# الصيانة

يوفر هذا القسم إرشادات شاملة حول صيانة ومراقبة وترقية نشر Wallarm الخاص بك لضمان الأداء والأمان الأمثل.

## ما هو مضمون

* **العقد والبنية التحتية**
    * [نظرة عامة على العقد](../user-guides/nodes/nodes.md) - إدارة ومراقبة عقد Wallarm الخاصة بك
    * [تخصيص الموارد](../admin-en/configuration-guides/allocate-resources-for-node.md) - تكوين موارد وحدة المعالجة المركزية والذاكرة
    * [مزامنة السحابة](../admin-en/configure-cloud-node-synchronization-en.md) - تكوين مزامنة العقدة مع Wallarm Cloud
    * [تكوين الوكيل](../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md) - إعداد الوكيل للوصول إلى Wallarm API
    * [تكوين صفحة الحظر](../admin-en/configuration-guides/configure-block-page-and-code.md) - تخصيص صفحات الحظر ورموز الاستجابة
    * [معالجة الرؤوس غير الصالحة](../admin-en/configuration-guides/handling-invalid-headers.md) - تكوين السلوك لرؤوس HTTP غير الصالحة
    * [بصمة JA3](../admin-en/enabling-ja3.md) - تمكين بصمة TLS لتعزيز الأمان
    * [موفر Terraform](../admin-en/managing/terraform-provider.md) - إدارة البنية التحتية لـ Wallarm كرمز

* **المراقبة والمقاييس**
    * [خدمة الإحصائيات](../admin-en/configure-statistics-service.md) - تكوين جمع الإحصائيات
    * [سجل العُقدة](../admin-en/configure-logging.md) - تكوين مستويات السجل والإخراج
    * [تكوين الفشل الاحتياطي](../admin-en/configure-backup-en.md) - إعداد آليات الفشل الاحتياطي
    * [فحص الصحة](../admin-en/uat-checklist-en.md) - التحقق من صحة العقدة ووظائفها

* **الترقيات والترحيل**
    * [سياسة الإصدارات](../updating-migrating/versioning-policy.md) - فهم إصدارات Wallarm ودورة حياة الدعم
    * [التوصيات العامة](../updating-migrating/general-recommendations.md) - أفضل الممارسات للترقيات
    * [ما الجديد](../updating-migrating/what-is-new.md) - التغييرات الرئيسية ودليل الترحيل للإصدارات الجديدة
    * **سجلات التغيير**
        * [سجل تغيير عقدة NGINX](../updating-migrating/node-artifact-versions.md) - ملاحظات الإصدار للعقد المستندة إلى NGINX
        * [سجل تغيير العقدة الأصلية](../updating-migrating/native-node/node-artifact-versions.md) - ملاحظات الإصدار للعقد الأصلية
        * [حزمة رمز الموصل](../installation/connectors/code-bundle-inventory.md) - ملاحظات إصدار الموصل
    * **ترقيات عقدة NGINX**
        * [حزم DEB/RPM](../updating-migrating/nginx-modules.md)
        * [وحدة Postanalytics](../updating-migrating/separate-postanalytics.md)
        * [مثبت الكل في واحد](../updating-migrating/all-in-one.md)
        * [صورة Docker](../updating-migrating/docker-container.md)
        * [وحدة تحكم Ingress](../updating-migrating/ingress-controller.md)
        * [إيقاف وحدة تحكم Ingress](../updating-migrating/nginx-ingress-retirement.md)
        * [وكيل Sidecar](../updating-migrating/sidecar-proxy.md)
        * [صورة السحابة](../updating-migrating/cloud-image.md)
        * [العقدة متعددة المستأجرين](../updating-migrating/multi-tenant.md)
    * **ترقيات العقدة الأصلية**
        * [مثبت الكل في واحد](../updating-migrating/native-node/all-in-one.md)
        * [مخطط Helm](../updating-migrating/native-node/helm-chart.md)
        * [صورة Docker](../updating-migrating/native-node/docker-image.md)

* **العمليات**
    * [تعلم حجم الطلبات](../admin-en/operation/learn-incoming-request-number.md) - تحديد حجم طلبات API للفوترة وتخطيط السعة
    * [عناوين IP للماسح الضوئي](../admin-en/scanner-addresses.md) - عناوين IP لماسح Wallarm لقائمة السماح

* **استكشاف الأخطاء وإصلاحها**
    * [نظرة عامة](../troubleshooting/overview.md) - إرشادات عامة لاستكشاف الأخطاء وإصلاحها
    * [الكشف والحظر](../troubleshooting/detection-and-blocking.md) - استكشاف مشاكل كشف الهجمات وإصلاحها
    * [أدوات الكشف](../troubleshooting/detection-tools-tuning.md) - ضبط آليات الكشف بدقة
    * [الأداء](../troubleshooting/performance.md) - معالجة مشاكل الأداء
    * [IP العميل الحقيقي](../admin-en/using-proxy-or-balancer-en.md) - تكوين اكتشاف IP العميل الصحيح
    * [مشاكل المستخدم النهائي](../faq/common-errors-after-installation.md) - الأخطاء الشائعة بعد التثبيت
    * [وحدة تحكم Wallarm Ingress](../faq/ingress-installation.md) - المشاكل الخاصة بـ Ingress
    * [Wallarm Cloud معطل](../faq/wallarm-cloud-down.md) - التعامل مع عدم توفر السحابة
    * [تنبيهات لوحة معلومات OWASP](../faq/node-issues-on-owasp-dashboards.md) - حل تنبيهات لوحة المعلومات
    * [سجل أخطاء NGINX](../troubleshooting/wallarm-issues-in-nginx-error-log.md) - تفسير رسائل أخطاء NGINX
    * [DNS الديناميكي في NGINX](../admin-en/configure-dynamic-dns-resolution-nginx.md) - تكوين حل DNS الديناميكي
