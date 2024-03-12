[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png

# تحديث العقدة المتعددة الإيجارات

هذه التعليمات توضح الخطوات لتحديث العقدة المتعددة الإيجارات من الإصدار 4.x إلى 4.10.

لتحديث العقدة المتعددة الإيجارات التي انتهى دورها (3.6 أو أقل)، برجاء استخدام [تعليمات مختلفة](older-versions/multi-tenant.md).

## المتطلبات

* تنفيذ الأوامر التالية من قبل المستخدم الذي تم إضافته بدور **المدير العام** تحت [حساب الإيجار التقني](../installation/multi-tenant/configure-accounts.md#tenant-account-structure)
* الوصول إلى `https://us1.api.wallarm.com` إذا كنت تعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` إذا كنت تعمل مع سحابة Wallarm الأوروبية. يرجى التأكد من أن الوصول غير محظور بواسطة جدار الحماية

## اتبع إجراء الترقية القياسي

الإجراءات القياسية هي لـ:

* [تحديث وحدات NGINX الخاصة بـ Wallarm](nginx-modules.md)
* [تحديث وحدة التحليلات بعد الاستخدام](separate-postanalytics.md)
* [تحديث صورة واجهة الحاويات من Wallarm التي تستند إلى NGINX- أو Envoy](docker-container.md)
* [تحديث وحدة التحكم في الوصول NGINX مع وحدات Wallarm المدمجة](ingress-controller.md)
* [تحديث صورة العقدة السحابية](cloud-image.md)

!!! warning "إنشاء العقدة المتعددة الإيجارات"
    أثناء إنشاء العقدة Wallarm، يُرجى اختيار خيار **العقدة المتعددة الإيجارات**:

    ![إنشاء العقدة المتعددة الإيجارات](../images/user-guides/nodes/create-multi-tenant-node.png)