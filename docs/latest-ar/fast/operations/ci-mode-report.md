[anchor-report-mode]:              #running-fast-node-in-report-mode

[doc-ci-mode-testing-report]:      ../poc/ci-mode-testing.md#getting-the-report-about-the-test
[doc-ci-mode-testing]:             ../poc/ci-mode-testing.md
[doc-get-token]:                   create-node.md
[deploy-docker-with-fast-node]:    ../qsg/deployment.md#4-deploy-the-fast-node-docker-container

# الحصول على التقرير بنتائج الاختبار

يتيح لك عقدة FAST الحصول على نتائج الاختبار بصيغ TXT و JSON:

* يحتوي ملف TXT على نتائج الاختبار الموجزة — إحصائيات الأساس وقائمة الثغرات الأمنية المكتشفة.
* يحتوي ملف JSON على نتائج الاختبار التفصيلية — تفاصيل عن اختبار الأمان والطلبات الأساسية، بالإضافة إلى قائمة الثغرات الأمنية المكتشفة. محتوي ملف JSON يتوافق مع البيانات المتوفرة في حسابك على Wallarm > **تشغيل الاختبارات**.

للحصول على التقرير، اختر طريقة إنشاء التقرير واتبع الإرشادات أدناه:

* [تشغيل عقدة FAST في وضع التقرير][anchor-report-mode]
* [تشغيل عقدة FAST في وضع الاختبار مع خيار تنزيل تقرير][doc-ci-mode-testing-report]

## تشغيل عقدة FAST في وضع التقرير

لاجراء تشغيل عقدة FAST في وضع التقرير، نفذ الخطوات التالية عند [نشر حاوية Docker][deploy-docker-with-fast-node]:

<ol start="1"><li>ضبط متغيرات البيئة:</li></ol>

| متغير                 	| الوصف 	| مطلوب 	|
|-------------------------	| ---------	| --------	|
| `WALLARM_API_TOKEN`      	| [رمز][doc-get-token] من سحابة Wallarm. | نعم |
| `WALLARM_API_HOST`       	| عنوان خادم API Wallarm. <br>القيم المسموح بها: <br>`us1.api.wallarm.com` للخادم في سحابة Wallarm الأمريكية و <br>`api.wallarm.com` للخادم في سحابة Wallarm الأوروبية.| نعم |
| `CI_MODE`                	| وضع تشغيل عقدة FAST.<br>يجب أن يكون `report`. | نعم |
| `TEST_RUN_ID`            	| معرف تشغيل الاختبار اللازم للحصول على التقرير.<br>يظهر المعرف في حسابك على Wallarm > **تشغيل الاختبارات** وفي سجلات تشغيل عقدة FAST في وضع الاختبار.<br>افتراضيًا، يستخدم معرف آخر تشغيل اختبار. | لا |

<ol start="2"><li>مرر مسار المجلد للتقارير عبر خيار <code>-v {DIRECTORY_FOR_REPORTS}:/opt/reports/</code>.</li></ol>

**مثال الأمر لتشغيل حاوية Docker لعقدة FAST في وضع التقرير:**

```
docker run  --rm -e WALLARM_API_HOST=us1.api.wallarm.com -e WALLARM_API_TOKEN=qwe53UTb2 -e CI_MODE=report -e TEST_RUN_ID=9012 -v documents/reports:/opt/reports/ wallarm/fast
```

## الحصول على التقرير

إذا تم تنفيذ الأمر بنجاح، ستحصل على بيانات موجزة عن تشغيل الاختبار في الطرفية:

--8<-- "../include/fast/console-include/operations/node-in-ci-mode-report.md"

عند الانتهاء من إنشاء التقرير، ستجد الملفات التالية بالتقارير في مجلد `DIRECTORY_FOR_REPORTS`:

* `<TEST RUN NAME>.<UNIX TIME>.txt`
* `<TEST RUN NAME>.<UNIX TIME>.json`