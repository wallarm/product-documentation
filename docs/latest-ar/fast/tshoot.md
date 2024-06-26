#   استكشاف الأخطاء وإصلاحها

##  المشاكل الشائعة وكيفية حلها

**ماذا تفعل إذا...**

* **...عرض عقدة FAST إحدى الرسائل التالية في إخراج وحدة التحكم؟**

--8<-- "../include/fast/console-include/tshoot/request-timeout.md"
    
    أو

--8<-- "../include/fast/console-include/tshoot/access-denied.md"
    
    **الحل:** تأكد من أن

    * عقدة FAST ومضيف Docker المقابل لها لديهما وصولٌ إلى الإنترنت (وبشكل خاص، يجب أن تكون سيرفرات `api.wallarm.com` و `us1.api.wallarm.com` الخاصة بـ Wallarm قابلة للوصول عن طريق `TCP/443`)، و
    * أنت تستخدم قيمة [الرمز][link-token] الصحيحة وتتواصل مع سيرفر Wallarm API المناسب. لاحظ أن FAST تستخدم *رموزًا* مختلفة للاتصال بسيرفرات API حسب ما إذا كانت تقع في السحابات الأوروبية أو الأمريكية.
    
* **...مصدر الطلب لا يثق في شهادة SSL ذاتية التوقيع لعقدة FAST؟**

    **الحل:** قم بإعداد شهادة SSL موثوقة باتباع أي طريقة مذكورة في [هذه التعليمات][doc-ssl].
    
* **...عقدة FAST تعمل ولكن لا يتم تسجيل طلبات الأساس؟**

    **الحل:** تحقق مما يلي:

    * مصدر الطلب مُعدّ لاستخدام عقدة FAST كخادم وكيل ويتم تزويده بالمنفذ الصحيح واسم النطاق أو عنوان IP للعقدة للاتصال بها.
    * مصدر الطلب يستخدم عقدة FAST كخادم وكيل لكل بروتوكول يستخدمه المصدر (موقف شائع هو أن عقدة FAST تُستخدم كخادم وكيل HTTP، بينما مصدر الطلب يحاول إرسال طلبات HTTPS).
    * متغير البيئة [`ALLOWED_HOST`][doc-allowed-host] مُعد بشكل صحيح.
    
* **...لا تعمل اختبارات FAST أو الامتدادات المخصصة على عقدة FAST؟**

    **الحل:** تحقق من أن عقدة FAST تسجل طلبات الأساس وأن هذه الطلبات تتوافق مع سياسة الاختبار المستخدمة من قبل العقدة.

##  التواصل مع فريق الدعم

إذا لم تتمكن من العثور على مشكلتك في القائمة أعلاه، أو وجدت الحل غير مفيد، فاتصل بفريق دعم Wallarm.

يمكنك [كتابة رسالة بريد إلكتروني](mailto:support@wallarm.com) أو ملء النموذج على بوابة Wallarm. لإرسال تعليق من خلال البوابة، قم بما يلي:

* انقر على علامة الاستفهام في الزاوية العلوية اليمنى من البوابة.
* في الشريط الجانبي المفتوح، حدد إدخال "دعم Wallarm".
* اكتب وأرسل رسالة بريد إلكتروني.

##  جمع البيانات التشخيصية

قد يطلب منك عضو في فريق دعم Wallarm جمع قطعة من البيانات التشخيصية المتعلقة بعقدة FAST.

اضبط بعض متغيرات البيئة، ثم نفذ الأوامر التالية لجمع البيانات (استبدل `<اسم حاوية عقدة FAST>` بالاسم الحقيقي لحاوية عقدة FAST التي تريد جمع البيانات التشخيصية منها):

```
FAST_IMAGE_VERSION=`docker image inspect wallarm/fast | grep version | tail -n1 | awk '{print $2}' | sed 's/"//g'`
TIMESTAMP=`/bin/date +%d.%m.%y_%H-%M-%S`

docker exec -e IMAGE_VERSION=$FAST_IMAGE_VERSION <اسم حاوية عقدة FAST> /usr/local/bin/collect_info_fast.sh

docker cp <اسم حاوية عقدة FAST>:/opt/diag/fast_supout.tar.gz fast_supout-$TIMESTAMP.tar.gz
```

بعد تنفيذ هذه الأوامر بنجاح، سيتم وضع البيانات التشخيصية في الأرشيف `fast_supout-$TIMESTAMP.tar.gz` على المضيف Docker. سيمثل `$TIMESTAMP` في اسم الأرشيف وقت الجمع.