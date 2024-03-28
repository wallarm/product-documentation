المتغير البيئي | الوصف | مطلوب
--- | ---- | ----
`WALLARM_API_TOKEN` | رمز العقدة أو API لـ Wallarm. | نعم
`WALLARM_API_HOST` | خادم API الخاص بـ Wallarm:<ul><li>`us1.api.wallarm.com` للسحابة الأمريكية</li><li>`api.wallarm.com` للسحابة الأوروبية</li></ul>القيمة الافتراضية: `api.wallarm.com`. | لا
`WALLARM_LABELS` | <p>متاح ابتداءً من العقدة 4.6. يعمل فقط إذا تم تعيين `WALLARM_API_TOKEN` إلى [رمز API][api-token] بدور `Deploy`. يقوم بتعيين تسمية `group` لتجميع نماذج العقد، على سبيل المثال:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...سيقوم بوضع نموذج العقدة في مجموعة النماذج `<GROUP>` (الموجودة أو، إذا لم تكن موجودة، سيتم إنشاؤها).</p> | نعم (لرموز API)