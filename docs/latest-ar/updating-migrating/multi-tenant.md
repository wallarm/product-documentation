[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png

# ترقية عقدة متعددة التأجير

تصف هذه التعليمات الخطوات لترقية العقدة متعددة التأجير 4.x إلى الإصدار 4.10.

لترقية العقدة متعددة التأجير التي انتهت صلاحيتها (3.6 أو أقل)، يرجى استخدام [تعليمات مختلفة](older-versions/multi-tenant.md).

## المتطلبات

* تنفيذ الأوامر التالية من قبل المستخدم ذي دور **المدير العام** المضاف تحت [حساب المستأجر التقني](../installation/multi-tenant/configure-accounts.md#tenant-account-structure)
* الوصول إلى `https://us1.api.wallarm.com` عند العمل مع Wallarm Cloud الأمريكية أو إلى `https://api.wallarm.com` عند العمل مع Wallarm Cloud الأوروبية. يرجى التأكد من أن الوصول ليس محجوبًا بواسطة جدار حماية

## اتبع إجراء الترقية القياسي

الإجراءات القياسية هي لـ:

* [ترقية وحدات Wallarm NGINX](nginx-modules.md)
* [ترقية وحدة ما بعد التحليل](separate-postanalytics.md)
* [ترقية صورة Wallarm Docker المبنية على NGINX أو Envoy](docker-container.md)
* [ترقية وحدة التحكم NGINX Ingress مع الوحدات المدمجة من Wallarm](ingress-controller.md)
* [ترقية صورة العقدة السحابية](cloud-image.md)

!!! تحذير "إنشاء العقدة متعددة التأجير"
    أثناء إنشاء العقدة Wallarm، يرجى اختيار خيار **العقدة متعددة التأجير**:

    ![إنشاء العقدة متعددة التأجير](../images/user-guides/nodes/create-multi-tenant-node.png)