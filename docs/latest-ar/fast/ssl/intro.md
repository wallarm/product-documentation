[link-node-installation]:       install-certificate-on-fast-node.md
[link-safari-ssl]:              browsers-ssl/safari-ssl.md
[link-chrome-ssl]:              browsers-ssl/chrome-ssl.md
[link-edge-ssl]:                browsers-ssl/edge-ssl.md
[link-ie11-ssl]:                browsers-ssl/ie11-ssl.md
[link-firefox-ssl]:             browsers-ssl/firefox-ssl.md

[img-insecure-connection]:      ../../images/fast/qsg/common/deployment/11-qsg-fast-inst-untrusted-cert.png

# المقدمة

عند العمل مع تطبيق ويب من خلال متصفح باستخدام HTTPS، قد ترى هذه الرسالة أو رسالة مماثلة عن شهادة غير موثوقة:

![رسالة شهادة غير موثوقة من موزيلا فايرفوكس][img-insecure-connection]

يقاطع عقد FAST طلبات HTTPS من العميل ويبدأ الاتصال بالخادم البعيد نفسه. يجب أن يثق متصفحك بشهادة عقد FAST، وإلا سيعامل المتصفح هذا الوضع كهجوم منتصف الرجل.

إذا لم يكن لدى عقد FAST شهادة موثوق بها من قبل المتصفح الذي تستخدمه، فإن محاولة إرسال طلبات HTTPS إلى الخادم من ذلك المتصفح ستؤدي إلى تحذير اتصال غير آمن.

للعمل بنجاح مع تطبيقات الويب عبر HTTPS يمكنك استخدام إحدى الحلول التالية:
* إذا كان لديك شهادة SSL خاصة بك والتي يثق بها متصفحك بالفعل، يمكنك [إضافتها إلى عقد FAST][link-node-installation].
* إذا لم يكن لديك شهادة SSL خاصة بك، يمكنك إضافة الشهادة الجذرية الموقعة ذاتيًا لعقد FAST إلى متصفحك. للقيام بذلك، اتبع الإرشادات الخاصة بمتصفحك:
    * [أبل سفاري][link-safari-ssl]
    * [جوجل كروم][link-chrome-ssl]
    * [مايكروسوفت إيدج][link-edge-ssl]
    * [مايكروسوفت إنترنت إكسبلورر 11][link-ie11-ssl]
    * [موزيلا فايرفوكس][link-firefox-ssl]