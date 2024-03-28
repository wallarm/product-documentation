[link-node-installation]:       install-certificate-on-fast-node.md
[link-safari-ssl]:              browsers-ssl/safari-ssl.md
[link-chrome-ssl]:              browsers-ssl/chrome-ssl.md
[link-edge-ssl]:                browsers-ssl/edge-ssl.md
[link-ie11-ssl]:                browsers-ssl/ie11-ssl.md
[link-firefox-ssl]:             browsers-ssl/firefox-ssl.md

[img-insecure-connection]:      ../../images/fast/qsg/common/deployment/11-qsg-fast-inst-untrusted-cert.png

# مقدمة

عند التعامل مع تطبيق ويب من خلال متصفح باستخدام HTTPS، قد ترى هذه الرسالة أو رسالة مشابهة عن شهادة غير موثوق بها:

![رسالة شهادة غير موثوق بها في Mozilla Firefox][img-insecure-connection]

يقاطع عقدة FAST طلبات HTTPS من العميل ويبادر بالاتصال بالخادم البعيد بنفسه. يجب أن يثق المتصفح بشهادة عقدة FAST، وإلا سيعامل المتصفح هذا الوضع كهجوم من نوع man-in-the-middle.

إذا لم تمتلك عقدة FAST شهادة موثوق بها من قِبل المتصفح الذي تستخدمه، فإن محاولة إرسال طلبات HTTPS إلى الخادم من ذلك المتصفح ستؤدي إلى تحذير بالاتصال غير المؤمن.

للعمل بنجاح مع تطبيقات الويب عبر HTTPS، يمكنك استخدام إحدى الحلول التالية:
* إذا كانت لديك شهادة SSL خاصة بك يثق بها المتصفح بالفعل، يمكنك [إضافتها إلى عقدة FAST][link-node-installation].
* إذا لم تكن لديك شهادة SSL خاصة بك، يمكنك إضافة شهادة الجذر الموقعة ذاتيًا لعقدة FAST إلى متصفحك. للقيام بذلك، اتبع التعليمات الخاصة بمتصفحك:
    * [Apple Safari][link-safari-ssl]
    * [Google Chrome][link-chrome-ssl]
    * [Microsoft Edge][link-edge-ssl]
    * [Microsoft Internet Explorer 11][link-ie11-ssl]
    * [Mozilla Firefox][link-firefox-ssl]