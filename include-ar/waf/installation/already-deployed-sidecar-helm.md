!!! info "إذا نشرت عدة عقد Wallarm"
    يجب أن تكون جميع العقد Wallarm المنشورة في بيئتك من **نفس النسخ**. يجب أيضًا أن تكون وحدات التحليلات اللاحقة المثبتة على الخوادم المنفصلة من **نفس النسخ**.

    قبل تثبيت العقدة الإضافية، الرجاء التأكد من أن نسختها تتطابق مع نسخة الوحدات المنشورة مسبقًا. إذا كانت نسخة الوحدة المنشورة [قديمة أو ستصبح قديمة قريبًا (`4.0` أو أقل)][versioning-policy]، قم بترقية جميع الوحدات إلى النسخة الأخيرة.

    يُحدد إصدار صورة عقدة تصفية Wallarm المنشورة في ملف تكوين مخطط Helm → `wallarm.image.tag`.