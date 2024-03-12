[img-verification-statuses]:    ../../images/user-guides/events/attack-verification-statuses.png
[img-verify-attack]:            ../../images/user-guides/events/verify-attack.png
[img-verified-icon]:            ../../images/user-guides/events/verified.png#mini
[img-error-icon]:               ../../images/user-guides/events/error.png#mini
[img-forced-icon]:              ../../images/user-guides/events/forced.png#mini
[img-sheduled-icon]:            ../../images/user-guides/events/sheduled.png#mini
[img-cloud-icon]:               ../../images/user-guides/events/cloud.png#mini
[img-skip-icon]:                ../../images/user-guides/events/skipped.png#mini

[al-brute-force-attack]:      ../../attacks-vulns-list.md#bruteforce-attack
[al-forced-browsing]:         ../../attacks-vulns-list.md#forced-browsing
[al-bola]:                    ../../attacks-vulns-list.md#broken-object-level-authorization-bola

# تحقق من الهجمات

 والارم بيتحقق تلقائيًا من الهجمات عشان يشوف الثغرات الفعالة.

ممكن تشوف حالة التحقق من الهجمة وتجبر التحقق مرة تانية من تبويب **الهجمات**. الهجمة المختارة هتكون أساس لإنشاء مجموعة اختبار الهجمة.

![الهجمات بحالات التحقق المختلفة][img-verification-statuses]

## شوف حالة التحقق من الهجمة

1. اضغط على تبويب **الهجمات**.
2. شوف الحالة في عمود **التحقق الفعال**.

## أسطورة حالة التحقق من الهجمة

* ![متحقق][img-verified-icon] *متحقق*: الهجمة تم التحقق منها.
* ![خطأ][img-error-icon] *خطأ*: محاولة للتحقق من نوع هجمة مش بيدعم التحقق. [الأسباب الممكنة](#attack-types-that-do-not-support-verification)
* ![تجاوزت][img-skip-icon] *تجاوزت*: محاولة للتحقق من نوع هجمة تم تجاهلها. [الأسباب الممكنة](#attack-types-that-do-not-support-verification)
* ![مفروض][img-forced-icon] *مفروض*: الهجمة ليها أولوية مرتفعة في قوائم التحقق.
* ![مجدول][img-sheduled-icon] *مجدول*: الهجمة موجودة في قائمة الانتظار للتحقق.
* ![ما قدرتش اتصل بالسيرفر][img-cloud-icon] *ما قدرتش اتصل بالسيرفر*: مش قادر أصل للسيرفر دلوقتي.

## إجبار التحقق من الهجمة

1. اختار هجمة.
2. اضغط على علامة الحالة في عمود **التحقق الفعال**.
3. اضغط *إجبار التحقق*.

والارم هيرفع أولوية التحقق من الهجمة في القائمة.

![تحقق من الهجمات][img-verify-attack]

## أنواع الهجمات اللي مش بتدعم التحقق

الهجمات من الأنواع التالية مش بتدعم التحقق:

* [هجمات القوة الغاشمة][al-brute-force-attack]
* [تصفح بالإكراه][al-forced-browsing]
* [BOLA][al-bola]
* هجمات بحد أقصى لمعالجة الطلبات
* هجمات الثغرات الأمنية المقفلة
* هجمات مش فيها بيانات كافية للتحقق
* [هجمات مكونة من مجموعات واردة من IPs مصدرية](../../admin-en/configuration-guides/protecting-with-thresholds.md)

هيفشل إعادة تحقق الهجمة في الحالات التالية:

* هجمات أرسلت عبر البروتوكول gRPC أو Protobuff
* هجمات أرسلت عبر HTTP نسخة غير 1.x
* هجمات أرسلت بطريقة مختلفة عن: GET, POST, PUT, HEAD, PATCH, OPTIONS, DELETE, LOCK, UNLOCK, MOVE, TRACE
* مش قادر أصل لعنوان الطلب الأصلي
* إشارات الهجمة موجودة في رأس `HOST`
* [عنصر الطلب](../rules/request-processing.md) اللي فيه إشارات الهجمة مختلف عن أي من التالي: `uri` , `header`, `query`, `post`, `path`, `action_name`, `action_ext`