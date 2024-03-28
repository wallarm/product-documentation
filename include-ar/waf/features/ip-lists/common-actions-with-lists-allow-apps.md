[access-wallarm-api-docs]: ../../api/overview.md#your-own-client
[application-docs]:        ../settings/applications.md

## استدعاءات API للحصول على كائنات قائمة عناوين IP وتعبئتها وحذفها

للحصول على كائنات قائمة عناوين IP وتعبئتها وحذفها، يمكنك [الاستدعاء المباشر لواجهة برمجة تطبيقات Wallarm](../../api/overview.md) بالإضافة إلى استخدام واجهة Wallarm Console. فيما يلي بعض الأمثلة على استدعاءات API المقابلة.

### معاملات طلب API

المعاملات التي يمكن تمريرها في طلبات API لقراءة وتغيير قوائم عناوين IP:

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### إضافة إلى القائمة العناصر من ملف `.csv`

لإضافة العناوين أو الشبكات الفرعية من ملف `.csv` إلى القائمة، استخدم السكريبت bash التالي:

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### إضافة عنوان IP أو شبكة فرعية واحدة إلى القائمة

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### إضافة عدة دول إلى القائمة

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### إضافة عدة خدمات بروكسي إلى القائمة

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### حذف كائن من قائمة عناوين IP

يتم حذف الكائنات من قوائم عناوين IP وفقاً لمعرفاتها.

للحصول على معرف كائن، اطلب محتويات قائمة عناوين IP وانسخ `objects.id` للكائن المطلوب من الإستجابة:

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

بمجرد الحصول على معرف الكائن، قم بإرسال الطلب التالي لحذفه من القائمة:

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

يمكنك حذف عدة كائنات دفعة واحدة بتمرير معرفاتها كمصفوفة في طلب الحذف.