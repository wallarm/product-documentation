تتيح اختبارات التكامل التحقق من صحة التكوين، وتوافر سحابة Wallarm، وتنسيق الإخطارات. لاختبار التكامل، يمكنك استخدام زر **اختبار التكامل** عند إنشاء التكامل أو تعديله.

يتم اختبار التكامل على النحو التالي:

* يتم إرسال إخطارات الاختبار بالبادئة `[Test message]` إلى النظام المختار.
* تغطي إخطارات الاختبار الأحداث التالية (كل في سجل منفصل):

    * مستخدم جديد في حساب الشركة
    * اكتشاف عنوان IP جديد في نطاق الشركة
    * إنشاء مشغل جديد في حساب الشركة
    * اكتشاف ثغرة أمنية جديدة
* تشتمل إخطارات الاختبار على بيانات اختبار.