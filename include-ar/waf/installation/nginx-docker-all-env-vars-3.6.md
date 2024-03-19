| متغير البيئة | الوصف | مطلوب |
| --- | ---- | ---- |
| `DEPLOY_USER` | البريد الإلكتروني لحساب المستخدم بصفة **الموظف** أو **المدير** في واجهة Wallarm Console. | نعم |
| `DEPLOY_PASSWORD` | كلمة المرور لحساب المستخدم بصفة **الموظف** أو **المدير** في واجهة Wallarm Console. | نعم |
| `NGINX_BACKEND` | النطاق أو عنوان IP للمورد المراد حمايته بواسطة حل Wallarm. | نعم |
| `WALLARM_API_HOST` | خادم API من Wallarm:<ul><li>`us1.api.wallarm.com` للسحابة الأمريكية</li><li>`api.wallarm.com` للسحابة الأوروبية</li></ul>القيمة الافتراضية: `api.wallarm.com`. | لا |
| `WALLARM_MODE` | وضع العقدة:<ul><li>`block` لحجب الطلبات الضارة</li><li>`safe_blocking` لحجب الطلبات الضارة التي تأتي من عناوين IP المدرجة في القائمة الرمادية فقط</li><li>`monitoring` لتحليل الطلبات دون حجبها</li><li>`off` لتعطيل تحليل ومعالجة حركة المرور</li></ul>القيمة الافتراضية: `monitoring`.<br>[الوصف التفصيلي لأوضاع التصفية →][filtration-modes-docs] | لا |
| `WALLARM_APPLICATION` | معرف فريد للتطبيق المحمي المستخدم في سحابة Wallarm. يمكن أن تكون القيمة عددًا صحيحًا موجبًا باستثناء `0`.<br><br>القيمة الافتراضية (إذا لم يتم تمرير المتغير إلى الحاوية) هي `-1` والتي تشير إلى التطبيق **الافتراضي** المعروض في Wallarm Console → **الإعدادات** → **التطبيق**.<br><br>[المزيد من التفاصيل حول إعداد التطبيقات →][application-configuration]<div class="admonition info"> <p class="admonition-title">دعم المتغير `WALLARM_APPLICATION`</p> <p>يتم دعم المتغير `WALLARM_APPLICATION` بدءًا من نسخة صورة Docker `3.4.1-1`.</div> | لا |
| `TARANTOOL_MEMORY_GB` | [كمية الذاكرة][allocating-memory-guide] المخصصة لـ Tarantool. يمكن أن تكون القيمة عددًا صحيحًا أو عددًا عشريًا (نقطة <code>.</code> هي فاصلة عشرية). القيمة الافتراضية: 0.2 غيغابايت. | لا |
| `DEPLOY_FORCE` | يستبدل عقدة Wallarm موجودة بأخرى جديدة إذا تطابق اسم العقدة الموجودة مع معرف الحاوية التي تقوم بتشغيلها. يمكن تعيين القيم التالية للمتغير:<ul><li>`true` لاستبدال العقدة المصفية</li><li>`false` لتعطيل استبدال العقدة المصفية</li></ul>القيمة الافتراضية (إذا لم يتم تمرير المتغير إلى الحاوية) هي `false`.<br>اسم عقدة Wallarm دائمًا ما يتطابق مع معرف الحاوية التي تقوم بتشغيلها. يكون استبدال العقدة المصفية مفيدًا إذا كانت معرفات حاويات Docker في بيئتك ثابتة وأنت تحاول تشغيل حاوية Docker أخرى بعقدة مصفية (على سبيل المثال، حاوية بنسخة جديدة من الصورة). إذا كانت القيمة في هذه الحالة `false`، فستفشل عملية إنشاء العقدة المصفية. | لا |
| `NGINX_PORT` | <p>يحدد المنفذ الذي سوف يستخدمه NGINX داخل حاوية Docker. هذا يسمح بتجنب تصادم المنافذ عند استخدام هذه الحاوية Docker كـ[حاوية الجانبية][about-sidecar-container] ضمن إحدى الحشود في مجموعة Kubernetes.</p><p>القيمة الافتراضية (إذا لم يتم تمرير المتغير إلى الحاوية) هي `80`.</p><p>صياغة هي `NGINX_PORT='443'`.</p> | لا |