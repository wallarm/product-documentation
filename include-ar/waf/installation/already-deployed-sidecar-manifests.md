!!! info "إذا قمت بتشغيل عدة عقد Wallarm"
    يجب أن تكون جميع عقد Wallarm المُنشرة في بيئتك من **الإصدارات نفسها**. يجب أن تكون وحدات ما بعد التحليل المُثبتة على الخوادم المنفصلة من **الإصدارات نفسها** أيضًا.

    قبل تثبيت العقدة الإضافية، يرجى التأكد من أن إصدارها يطابق إصدار الوحدات المُنشرة بالفعل. إذا كان إصدار الوحدة المُنشرة [مهجورًا أو سيتم إهماله قريبًا (`4.0` أو أقل)][versioning-policy]، قم بترقية جميع الوحدات إلى أحدث إصدار.

    يُحدد إصدار صورة عقدة تصفية Wallarm المُنشرة في قالب النشر → قسم `spec.template.spec.containers` → `image` لحاوية Wallarm.