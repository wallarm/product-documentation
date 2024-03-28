[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-certificate-request.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-certificate-window.png
[img-store-location]:       ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-store-location.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-wizard-resume.png
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-import-success.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-https-ok.png

# تثبيت شهادة SSL ذاتية التوقيع لعقدة FAST لمتصفح Microsoft Edge

لتثبيت الشهادة لمتصفح Microsoft Edge، اتبع الخطوات التالية:

1. تأكد من ضبط متصفحك لاستخدام عقدة FAST كوكيل لبروتوكولي HTTP وHTTPS.

2. اطلب ملف `cert.der` من أي نطاق عبر HTTP باستخدام المتصفح.

   على سبيل المثال، يمكنك استخدام أحد الروابط التالية:
   
   * <http://wallarm.get/cert.der>
   * <http://example.com/cert.der>

   سيمنحك المتصفح خيار فتح ملف الشهادة أو حفظه. اختر زر **Open**.

   ![طلب شهادة عقدة FAST ذاتية التوقيع][img-cert-request]

3. ستفتح نافذة تحتوي على معلومات حول الشهادة. لاحظ أن اسم الشهادة وتاريخ انتهاء الصلاحية سيختلفان عن المعروض في الصورة. اختر زر **Install Certificate**.

   ![نافذة "الشهادة"][img-cert-window]

4. اختر خيار التثبيت المناسب للشهادة في النافذة التي تفتح. يمكنك تثبيت الشهادة إما للمستخدم الحالي أو لكل المستخدمين. اختر الخيار المناسب واختر زر **Next**.

   ![اختيار موقع مخزن الشهادات][img-store-location]

5. سيُطلب منك اختيار مخزن شهادات. اختر خيار "وضع كل الشهادات في المخزن التالي" واضبط "سلطات التصديق الجذرية الموثوقة" كمخزن. اختر زر **Next**.
   ![اختيار مخزن الشهادات][img-store]

   تأكد من اختيار المخزن المناسب للشهادة وابدأ عملية الاستيراد بالضغط على زر **Finish**.
   
   ![استئناف معالج استيراد الشهادة][img-wizard-resume]

6. ستظهر لك رسالة تحذيرية حول عدم القدرة على التحقق من بصمة الشهادة التي يتم استيرادها. اختر زر **Yes** لإكمال عملية الاستيراد.

   ![تحذير التحقق من صحة البصمة][img-fingerprint-warning]

   بنجاح الاستيراد، ستظهر رسالة معلوماتية "تم الاستيراد بنجاح".

   ![نجاح استيراد الشهادة][img-import-ok]

7. تحقق من صحة تثبيت الشهادة. للقيام بذلك، اذهب إلى أي موقع عبر HTTPS. ينبغي تحويلك إلى إصدار HTTPS من الموقع دون أي رسائل تحذيرية حول شهادات غير موثوقة.

   على سبيل المثال، يمكنك التصفح إلى الإصدار HTTPS من موقع Google Gruyere:
   <https://google-gruyere.appspot.com>

   ![HTTPS يعمل][img-https-ok]