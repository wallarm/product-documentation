[img-cert-request]:     ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-request.png
[img-cert-download]:    ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-download.png
[img-https-ok]:         ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-https-ok.png


#   تثبيت شهادة SSL الذاتية التوقيع لعقدة FAST لمتصفح Mozilla Firefox

لتثبيت الشهادة لمتصفح Mozilla Firefox، قم بما يلي:

1.  تأكد من ضبط متصفحك لاستخدام عقدة FAST كوكيل لبروتوكولات HTTP و HTTPS.

2.  اطلب ملف `cert.der` من أي نطاق عبر HTTP باستخدام المتصفح.

    على سبيل المثال، يمكنك استخدام أحد الروابط التالية:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    سوف يقوم المتصفح بتحميل ملف الشهادة. حسب الإعدادات، سيتم وضع الملف إما في دليل التحميل الافتراضي أو في الدليل الذي تختاره.
    
    ![طلب شهادة عقدة FAST الذاتية التوقيع][img-cert-request]

3.  ستفتح نافذة حوارية. سيُطلب منك تثبيت الشهادة. لاحظ أن اسم الشهادة وتاريخ انتهاء صلاحيتها سيختلفان عن المعروض في الصورة.    
    
    اختر خيار "الوثوق بـ CA هذا لتحديد المواقع الإلكترونية" واختر زر **موافق**.

    ![تحميل الشهادة][img-cert-download]

4.  تحقق من تثبيت الشهادة بشكل صحيح. للقيام بذلك، اذهب إلى أي موقع عبر HTTPS. يجب أن يتم توجيهك إلى نسخة HTTPS من الموقع دون أي رسائل تحذيرية حول الشهادات غير الموثوق بها.

    على سبيل المثال، يمكنك التصفح إلى نسخة HTTPS من موقع Google Gruyere:
    <https://google-gruyere.appspot.com>

    ![HTTPS يعمل][img-https-ok]