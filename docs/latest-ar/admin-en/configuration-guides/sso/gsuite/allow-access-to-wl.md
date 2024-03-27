#   الخطوة 4: السماح بالوصول إلى تطبيق Wallarm من جانب G Suite

[img-gsuite-console]:           ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-user-list]:                ../../../../images/admin-guides/configuration-guides/sso/gsuite/user-list.png
[img-gsuite-navigation-saml]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-navigation-saml.png
[img-app-page]:                 ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png

[doc-use-user-auth]:            ../employ-user-auth.md

للمصادقة من خلال G Suite، يجب إنشاء حساب من جانب G Suite، ويجب أن يمتلك المستخدم حقوق الوصول إلى تطبيق Wallarm. يُوصف أدناه التسلسل المطلوب للإجراءات لمنح حقوق الوصول.

انتقل إلى قسم إدارة المستخدمين في G Suite بالنقر على كتلة *المستخدمين*.

![واجهة G Suite][img-gsuite-console]

تأكد من أن المستخدم الذي ستمنحه الوصول إلى التطبيق عبر مصادقة SSO موجود في قائمة مستخدمي مؤسستك.

![قائمة مستخدمي G Suite][img-user-list]

انتقل إلى قسم تطبيقات SAML بالنقر على عنصر قائمة *تطبيقات SAML* كما هو موضح أدناه.

![الانتقال إلى تطبيقات SAML][img-gsuite-navigation-saml]

ادخل إعدادات التطبيق المطلوب وتأكد من أن حالة التطبيق هي "مفعل للجميع". إذا كانت حالة التطبيق "معطل للجميع"، انقر على زر *تعديل الخدمة*.

![صفحة التطبيق في G Suite][img-app-page]

حدد حالة "مفعل للجميع" وانقر على *حفظ*.

بعد ذلك ستتلقى رسالة تفيد بأن حالة الخدمة قد تم تحديثها. تطبيق Wallarm متاح الآن لمصادقة SSO لجميع مستخدمي مؤسستك في G Suite.


##  اكتمال الإعداد

هذا يكمل إعداد SSO المبني على G Suite، والآن يمكنك البدء في تهيئة المصادقة الخاصة بالمستخدم [لمستخدم معين][doc-use-user-auth] على جانب Wallarm.