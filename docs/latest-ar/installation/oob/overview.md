# نظرة عامة على نشر Wallarm خارج النطاق

يمكن نشر Wallarm كحل أمان خارج النطاق (OOB) يقوم بفحص الطلبات من خلال مرآة للحركة المرورية. يشرح هذا المقال الطريقة بالتفصيل.

تشمل طريقة OOB وضع حل Wallarm في قطاع شبكة منفصل، حيث يمكنه فحص الحركة المرورية الواردة دون التأثير على المسار الرئيسي للبيانات ونتيجة لذلك، على أداء التطبيق. تصل جميع الطلبات الواردة بما في ذلك الضارة إلى الخوادم الموجهة إليها.

## حالات الاستخدام

تعتبر مرآة الحركة المرورية أحد المكونات الأساسية لطريقة OOB. يتم إرسال نسخة (مرآة) من الحركة المرورية الواردة إلى حل Wallarm OOB، الذي يعمل على النسخة، بدلاً من الحركة المرورية الفعلية.

نظرًا لأن حل OOB لا يسجل سوى النشاط الضار دون حظره، يُعد طريقة فعّالة لتنفيذ أمن تطبيقات الويب وواجهات برمجة التطبيقات للمنظمات ذات المتطلبات الأقل صرامة للحماية الفورية. الحل OOB مناسب للحالات الاستخدامية التالية:

* الحصول على معرفة حول جميع التهديدات المحتملة التي قد تواجهها تطبيقات الويب وواجهات برمجة التطبيقات، دون التأثير على أداء التطبيق.
* تدريب حل Wallarm على نسخة الحركة المرورية قبل تشغيل الوحدة [عبر الإنترنت](../inline/overview.md).
* تسجيل سجلات الأمان لأغراض التدقيق. Wallarm توفر [تكاملات أصلية](../../user-guides/settings/integrations/integrations-intro.md) مع العديد من أنظمة SIEM، والرسائل، وما إلى ذلك.

الرسم البياني أدناه يوفر تمثيلًا بصريًا لتدفق الحركة المرورية العام في نشر Wallarm خارج النطاق. قد لا يلتقط الرسم البياني جميع التباينات الممكنة في البنية التحتية. يمكن توليد مرآة الحركة المرورية في أي طبقة داعمة من البنية التحتية وإرسالها إلى عقد Wallarm. بالإضافة إلى ذلك، قد تتضمن الإعدادات المحددة تباينات مختلفة في توازن الحمل وتكوينات أخرى على مستوى البنية التحتية.

![مخطط OOB](../../images/waf-installation/oob/wallarm-oob-deployment-scheme.png)

## المزايا والقيود

توفر طريقة نشر Wallarm خارج النطاق عدة مزايا مقارنة بطرق النشر الأخرى، مثل النشر عبر الإنترنت:

* لا تسبب تأخيرًا أو مشكلات أداء أخرى قد تحدث عندما تعمل الحلول الأمنية عبر الإنترنت مع المسار الرئيسي للبيانات.
* توفر مرونة وسهولة في النشر، حيث يمكن إضافة الحل أو إزالته من الشبكة دون التأثير على المسار الرئيسي للبيانات.

بالرغم من سلامة طريقة نشر OOB، إلا أن لها بعض القيود:

* Wallarm لا تحظر الطلبات الضارة بشكل فوري نظرًا لأن تحليل الحركة المرورية يتم بغض النظر عن تدفق الحركة المرورية الفعلي.

    Wallarm يلاحظ الهجمات فقط ويزودك بـ[التفاصيل في واجهة Wallarm](../..//user-guides/events/analyze-attack.md).
* اكتشاف الثغرات الأمنية باستخدام أسلوب [الكشف السلبي](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) لا يعمل بشكل صحيح. يحدد الحل ما إذا كانت واجهة برمجة التطبيقات معرضة للخطر أم لا بناءً على استجابات الخادم للطلبات الضارة المعتادة للثغرات الأمنية التي يختبرها.
* [اكتشاف API Wallarm](../../api-discovery/overview.md) لا يستكشف جرد API بناءً على حركتك المرورية حيث أن استجابات الخادم المطلوبة لتشغيل الوحدة غير مُعكسة.

    استثناء هو حل [eBPF](ebpf/deployment.md)، الذي يُجري اكتشاف جرد API بتحليل أكواد الاستجابة.
* [الحماية ضد الاستعراض القسري](../../admin-en/configuration-guides/protecting-against-bruteforce.md) غير متاحة نظرًا لأنها تتطلب تحليل أكواد الاستجابة الذي لا يمكن القيام به حاليًا.
    
    استثناء هو حل [eBPF](ebpf/deployment.md)، الذي يحلل أكواد الاستجابة، مما يجعله مناسبًا لهذا الغرض.

## خيارات النشر المدعومة

Wallarm توفر الخيارات التالية لنشر خارج النطاق:

* العديد من القطع المتاحة من Wallarm يمكن استخدامها لـ[نشر Wallarm لتحليل الحركة المرورية المعكوسة بواسطة خدمات مثل NGINX، Envoy، Istio، إلخ.](web-server-mirroring/overview.md) توفر هذه الخدمات عادةً ميزات مدمجة لمرآة الحركة المرورية، وتكون القطع الأثرية من Wallarm مناسبة جيدًا لتحليل الحركة المرورية المعكوسة بواسطة مثل هذه الحلول.
* [حل قائم على eBPF](ebpf/deployment.md)