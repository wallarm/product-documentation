[anchor-report-mode]:              #running-fast-node-in-report-mode

[doc-ci-mode-testing-report]:      ../poc/ci-mode-testing.md#getting-the-report-about-the-test
[doc-ci-mode-testing]:             ../poc/ci-mode-testing.md
[doc-get-token]:                   create-node.md
[deploy-docker-with-fast-node]:    ../qsg/deployment.md#4-deploy-the-fast-node-docker-container

# الحصول على التقرير بنتائج الاختبار

يتيح لك عقدة FAST الحصول على نتائج الاختبار بصيغتي TXT وJSON:

* يحتوي ملف TXT على نتائج اختبار موجزة — إحصائيات الأساس وقائمة الثغرات الأمنية المكتشفة.
* يحتوي ملف JSON على نتائج اختبار مفصلة — تفاصيل عن اختبار الأمان والطلبات الأساسية، بالإضافة إلى قائمة الثغرات الأمنية المكتشفة. تتوافق محتويات ملف JSON مع البيانات المتوفرة في حسابك على Wallarm > **تشغيلات الاختبار**.

للحصول على التقرير، اختر طريقة توليد التقرير واتبع الإرشادات أدناه:

* [تشغيل عقدة FAST في وضع التقرير][anchor-report-mode]
* [تشغيل عقدة FAST في وضع الاختبار مع خيار تحميل التقرير][doc-ci-mode-testing-report]

## تشغيل عقدة FAST في وضع التقرير

لتشغيل عقدة FAST في وضع التقرير، قم بأداء الخطوات التالية عند [نشر حاوية Docker][deploy-docker-with-fast-node]:

<ol start="1"><li>تعيين متغيرات البيئة:</li></ol>

| المتغير               	| الوصف 	| مطلوب   	|
|----------------------	| -----	| ---------	|
| `WALLARM_API_TOKEN`    	| [رمز][doc-get-token] من سحابة Wallarm. | نعم |
| `WALLARM_API_HOST`     	| عنوان خادم API الخاص بـ Wallarm. <br>القيم المسموح بها: <br>`us1.api.wallarm.com` للخادم في سحابة Wallarm الأمريكية و <br>`api.wallarm.com` للخادم في سحابة Wallarm الأوروبية.| نعم |
| `CI_MODE`              	| وضع تشغيل عقدة FAST.<br>يجب أن يكون `report`. | نعم |
| `TEST_RUN_ID`        	| معرف تشغيل الاختبار المطلوب للحصول على التقرير.<br>يُعرض المعرف في حسابك على Wallarm > **تشغيلات الاختبار** وفي سجلات تشغيل عقدة FAST في وضع الاختبار.<br>بشكل افتراضي، يُستخدم معرف آخر تشغيل اختبار. | لا |

<ol start="2"><li>مرر مسار المجلد للتقارير عبر خيار <code>-v {DIRECTORY_FOR_REPORTS}:/opt/reports/</code>.</li></ol>

**مثال على الأمر لتشغيل حاوية Docker عقدة FAST في وضع التقرير:**

```
docker run  --rm -e WALLARM_API_HOST=us1.api.wallarm.com -e WALLARM_API_TOKEN=qwe53UTb2 -e CI_MODE=report -e TEST_RUN_ID=9012 -v documents/reports:/opt/reports/ wallarm/fast
```

## الحصول على التقرير

إذا تم تنفيذ الأمر بنجاح، ستحصل على بيانات موجزة عن تشغيل الاختبار في الطرفية:

--8<-- "../include/fast/console-include/operations/node-in-ci-mode-report.md"

عندما يتم إنهاء توليد التقرير، ستجد الملفات التالية مع التقارير في مجلد `DIRECTORY_FOR_REPORTS`:

* `<TEST RUN NAME>.<UNIX TIME>.txt`
* `<TEST RUN NAME>.<UNIX TIME>.json`