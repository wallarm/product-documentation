يوفر لوح التحكم **اكتشاف API** الخاص بـ Wallarm ملخصًا للبيانات حول واجهة برمجة التطبيقات (API) التي جُمعت بواسطة وحدة [**اكتشاف API**][apid-overview]. يُقدم نظرة شاملة على جرد واجهة برمجة التطبيقات الخاصة بك بناءً على المقاييس:

* عدد نقاط النهاية حسب مستوى الخطر
* نقاط النهاية الأكثر خطورة [الأعلى خطورة][apid-risk-score] ضمن جرد واجهة برمجة التطبيقات بالكامل وبين نقاط النهاية المكتشفة حديثًا في آخر 7 أيام

    تُعتبر نقاط النهاية الأعلى خطورة أكثر عرضة لكونها هدفًا للهجمات بسبب الثغرات الأمنية النشطة، وكون نقاط النهاية [جديدة][apid-track-changes] أو [خفية][apid-rogue]، وعوامل الخطر الأخرى. يُقدم لكل نقطة نهاية خطرة عدد الضربات المستهدفة.

* عدد واجهات برمجة التطبيقات [الخفية][apid-rogue] (الظل، الزومبي، واليتيمة) المحددة      
* التغيرات في واجهة برمجة التطبيقات الخاصة بك في آخر 7 أيام حسب النوع (جديدة، تغيرت، غير مستخدمة)
* العدد الإجمالي لنقاط النهاية المكتشفة وكم منها خارجي وداخلي
* البيانات الحساسة في واجهة برمجة التطبيقات حسب المجموعات (الشخصية، المالية، إلخ.) وحسب الأنواع
* جرد واجهة برمجة التطبيقات: عدد نقاط النهاية حسب مُضيف الـ API والتطبيق

![قطعة اكتشاف API][img-api-discovery-widget]

يمكن للوحة التحكم الكشف عن الشذوذ، مثل نقاط النهاية الخطرة المستخدمة بكثرة أو حجم البيانات الحساسة الكبير الذي تنقله واجهة برمجة التطبيقات الخاصة بك. بالإضافة إلى ذلك، يُلفت الانتباه إلى التغييرات في واجهة برمجة التطبيقات التي يجب أن تفحصها دائمًا لاستبعاد مخاطر الأمان. هذا يساعدك على تنفيذ ضوابط الأمان لمنع نقاط النهاية من كونها أهدافًا للهجمات.

اضغط على عناصر القطعة للذهاب إلى قسم **اكتشاف API** وعرض البيانات المُفلترة. إذا نقرت على عدد الضربات، سيتم توجيهك إلى [قائمة الهجمات][check-attack] ببيانات الهجوم لآخر 7 أيام.