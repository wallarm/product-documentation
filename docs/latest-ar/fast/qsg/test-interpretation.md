# تفسير نتائج الاختبار

ستزودك هذه الفصل بنظرة عامة عن أدوات تفسير نتائج الاختبار على [بوابة My Wallarm][link-wl-console]. عند اكتمال هذا الفصل، ستكون قد حصلت على معلومات إضافية حول ثغرة XSS التي تم اكتشافها في [الفصل السابق][link-previous-chapter].

1. انقر على علامة التبويب "لوحات المعلومات → FAST" للحصول على نظرة سريعة على الأحداث الجارية. توفر لك اللوحة ملخصًا عن جميع عمليات تشغيل الاختبار وحالاتها، بالإضافة إلى عدد الثغرات لفترة محددة من الزمن.

    ![لوحة المعلومات][img-dashboard]

2. إذا قمت باختيار علامة التبويب "عمليات تشغيل الاختبار"، يمكنك مراقبة قائمة جميع عمليات تشغيل الاختبار مع بعض المعلومات المختصرة عن كل منها، مثل:

    * حالة تشغيل الاختبار (جارٍ، ناجح، أو فاشل)
    * إذا كان تسجيل الطلب الأساسي جاريًا
    * عدد الطلبات الأساسية المسجلة
    * الثغرات التي تم العثور عليها (إن وجدت)
    * اسم المجال لتطبيق الهدف
    * حيث تمت عملية توليد وتنفيذ الاختبار (عقدة أو سحابة)

    ![عمليات تشغيل الاختبار][img-testrun]

3. استكشف عملية تشغيل الاختبار بالتفصيل بالنقر عليها:

    ![توسيع عملية تشغيل الاختبار][img-test-run-expanded]

    يمكنك الحصول على المعلومات التالية من عملية تشغيل الاختبار الموسعة:

    * عدد الطلبات الأساسية المعالجة
    * تاريخ إنشاء تشغيل الاختبار
    * مدة تشغيل الاختبار
    * عدد الطلبات التي تم إرسالها إلى تطبيق الهدف
    * حالة عملية اختبار الطلبات الأساسية:

        * **ناجح** ![الحالة: ناجح][img-status-passed]
        
            لم يتم العثور على ثغرات للطلب الأساسي المعطى (هذا يعتمد على سياسة الاختبار المختارة- إذا اخترت واحدة أخرى، فقد يتم العثور على بعض الثغرات) أو أن سياسة الاختبار لا تنطبق على الطلب.
        
        * **فاشل** ![الحالة: فاشل][img-status-failed]
        
            تم العثور على ثغرات للطلب الأساسي المعطى.
            
        * **جارٍ** ![الحالة: جارٍ][img-status-inprogress]
              
            الطلب الأساسي يخضع للاختبار للكشف عن الثغرات.
            
        * **خطأ** ![الحالة: خطأ][img-status-error]
            
            توقفت عملية الاختبار بسبب أخطاء.
            
        * **في انتظار** ![الحالة: في انتظار][img-status-waiting]
        
            الطلب الأساسي في قائمة الانتظار للاختبار. يمكن اختبار عدد محدود فقط من الطلبات في وقت واحد.
            
        * **مقاطع** ![الحالة: مقاطع][img-status-interrupted]
        
            تم إيقاف عملية الاختبار إما يدويًا («الإجراءات» → «المقاطعة») أو تم تنفيذ عملية تشغيل اختبار أخرى على نفس عقدة FAST.

4. لاستكشاف طلب أساسي بالتفصيل، انقر عليه:

    ![توسيع عملية تشغيل الاختبار][img-testrun-expanded]
    
    لكل طلب أساسي توفر المعلومات التالية:

    * وقت الإنشاء
    * عدد طلبات الاختبار التي تم توليدها وإرسالها إلى تطبيق الهدف
    * سياسة الاختبار المستخدمة
    * حالة معالجة الطلب

5. لعرض سجل معالجة الطلب بالكامل، حدد رابط "التفاصيل" الموجود على اليمين تمامًا:

    ![سجل معالجة الطلب][img-log]

6. للحصول على نظرة عامة عن الثغرات التي تم العثور عليها، انقر على رابط "المشكلة":

    ![وصف موجز للثغرات][img-vuln-description]

    لاستكشاف ثغرة بالتفصيل، انقر على وصف الثغرة:

    ![تفاصيل الثغرة][img-vuln-details]
            
ينبغي الآن أن تكون على دراية بالأدوات التي تساعدك على تفسير نتائج الاختبار.