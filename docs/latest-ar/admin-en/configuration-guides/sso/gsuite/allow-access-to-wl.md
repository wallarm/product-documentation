# الخطوة 4: السماح بالوصول إلى تطبيق Wallarm من جانب G Suite

[img-gsuite-console]:           ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-user-list]:                ../../../../images/admin-guides/configuration-guides/sso/gsuite/user-list.png
[img-gsuite-navigation-saml]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-navigation-saml.png
[img-app-page]:                 ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png

[doc-use-user-auth]:            ../employ-user-auth.md

للمصادقة عبر G Suite، يجب إنشاء حساب على جانب G Suiteوأن يمتلك المستخدم حقوق الوصول إلى تطبيق Wallarm. توصف أدناه السلسلة المطلوبة من الإجراءات لمنح حقوق الوصول.

اذهب إلى قسم إدارة مستخدمي G Suiteبالنقر على قطعة *المستخدمين*.

![واجهة G Suite][img-gsuite-console]

تأكد من أن المستخدم الذي ستمنحه الوصول إلى التطبيق عبر المصادقة SSOموجود في قائمة مستخدمي مؤسستك.

![قائمة مستخدمي G Suite][img-user-list]

اذهب إلى قسم تطبيقات SAMLبالنقر على بند القائمة *تطبيقات SAML* كما هو موضح أدناه.

![الانتقال إلى تطبيقات SAML][img-gsuite-navigation-saml]

ادخل إعدادات التطبيق المرغوب وتأكد من أن حالة التطبيق تكون "مفعلة للجميع" (ON for everyone). إذا كانت حالة التطبيق "معطلة للجميع" (OFF for everyone)، انقر على زر *تعديل الخدمة* (Edit service).

![صفحة التطبيق في G Suite][img-app-page]

اختر حالة "مفعلة للجميع" (ON for everyone) وانقر على *حفظ* (Save).

بعد ذلك، ستتلقى رسالة تفيد بأن حالة الخدمة قد تم تحديثها. أصبح تطبيق Wallarm الآن متاحًا للمصادقة SSOلجميع مستخدمي مؤسستك في G Suite.


## اكتمال الإعداد

بذلك تكتمل إعدادات SSOالمستندة إلى G Suite، والآن يمكنك البدء في تكوين المصادقة SSOالمحددة للمستخدم على جانب Wallarm.