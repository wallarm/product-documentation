للحصول على أحداث Wallarm منظمة ضمن لوحة تحكم جاهزة للاستخدام في Splunk 9.0 أو أحدث، يمكنك تثبيت [تطبيق Wallarm لـ Splunk](https://splunkbase.splunk.com/app/6610).

يوفر لك هذا التطبيق لوحة تحكم مُعدة مسبقًا تُملأ تلقائيًا بالأحداث المُستلمة من Wallarm. بالإضافة إلى ذلك، يُتيح لك التطبيق الانتقال إلى السجلات التفصيلية لكل حدث وتصدير البيانات من لوحة التحكم.

![لوحة تحكم Splunk][splunk-dashboard-by-wallarm-img]

لتثبيت تطبيق Wallarm لـ Splunk:

1. في واجهة Splunk ➝ **التطبيقات** ابحث عن تطبيق `Wallarm API Security`.
1. انقر **تثبيت** وأدخل بيانات اعتماد Splunkbase.

إذا تم تسجيل بعض أحداث Wallarm بالفعل في Splunk، سيتم عرضها على لوحة التحكم، بالإضافة إلى الأحداث اللاحقة التي سيكتشفها Wallarm.

بالإضافة إلى ذلك، يمكنك تخصيص لوحة التحكم الجاهزة للاستخدام بالكامل، مثل عرضها أو [سلاسل البحث](https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Search) المستخدمة لاستخراج البيانات من جميع سجلات Splunk.