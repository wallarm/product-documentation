# ترقية عقدة CDN

تصف هذه التعليمات الخطوات لترقية عقدة CDN الخاصة بـ Wallarm والمتاحة ابتداءً من الإصدار 3.6.

1. قم بحذف سجل CNAME الخاص بـ Wallarm من سجلات DNS للنطاق المحمي.

    !!! warning "سيتوقف تخفيف الطلبات الخبيثة"
        بمجرد إزالة سجل CNAME وتفعيل التغييرات على الإنترنت، ستتوقف عقدة CDN الخاصة بـ Wallarm عن توكيل الطلبات، وسيتم توجيه حركة البيانات الشرعية والخبيثة مباشرةً إلى المورد المحمي.
        
        ينتج عن ذلك خطر استغلال ثغرات الخادم المحمي عندما يصبح حذف سجل DNS فعالًا لكن سجل CNAME المولد لنسخة العقدة الجديدة لم يصبح فعالًا بعد.
1. انتظر حتى يتم نشر التغييرات. يتم عرض حالة سجل CNAME الفعلية في واجهة مستخدم Wallarm → **العقد** → **CDN** → **حذف عقدة**.
1. احذف عقدة CDN من واجهة مستخدم Wallarm → **العقد**.

    ![حذف العقدة](../images/user-guides/nodes/delete-cdn-node.png)
1. أنشئ عقدة CDN بالنسخة الأحدث لحماية نفس النطاق وفقًا لـ[التعليمات](../installation/cdn-node.md).

بما أن جميع إعدادات عقدة CDN محفوظة في سحابة Wallarm، ستحصل العقدة الجديدة عليها تلقائيًا. لا تحتاج إلى نقل تكوين العقدة يدويًا إذا لم يتغير النطاق المحمي.