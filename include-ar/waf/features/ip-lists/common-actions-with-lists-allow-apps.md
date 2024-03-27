[access-wallarm-api-docs]: ../../api/overview.md#your-own-client
[application-docs]:        ../settings/applications.md

## استدعاءات API للحصول على كائنات قائمة الـ IP وتعبئتها وحذفها

للحصول على كائنات قائمة الـ IP وتعبئتها وحذفها، يمكنك [استدعاء API وولارم مباشرة](../../api/overview.md) بالإضافة إلى استخدام واجهة المستخدم لوحة التحكم وولارم. فيما يلي بعض الأمثلة على استدعاءات API المقابلة.

### معاملات طلب API

يتم تمرير المعاملات في طلبات API لقراءة وتغيير قوائم الـ IP:

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### إضافة إلى القائمة مداخل من ملف `.csv`

لإضافة الـ IPs أو الشبكات الفرعية من ملف `.csv` إلى القائمة، استخدم السكريبت bash الآتي:

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### إضافة إلى القائمة IP أو شبكة فرعية واحدة

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### إضافة عدة دول إلى القائمة

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### إضافة عدة خدمات بروكسي إلى القائمة

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### حذف كائن من قائمة الـ IP

يتم حذف الكائنات من قوائم الـ IP بواسطة معرفاتهم.

للحصول على معرف كائن، قم بطلب محتويات قائمة الـ IP وانسخ `objects.id` للكائن المطلوب من الاستجابة:

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

بعد الحصول على معرف الكائن، أرسل الطلب التالي لحذفه من القائمة:

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

يمكنك حذف عدة كائنات دفعة واحدة بتمرير معرفاتهم كمصفوفة في طلب الحذف.