# الخطوة 4: السماح بالوصول إلى تطبيق Wallarm من جهة Okta

[img-dashboard]:    ../../../../images/admin-guides/configuration-guides/sso/okta/okta-assign-app.png
[img-assignments]:  ../../../../images/admin-guides/configuration-guides/sso/okta/assignments.png
[img-user-list]:    ../../../../images/admin-guides/configuration-guides/sso/okta/user-list.png

[doc-use-user-auth]:   ../employ-user-auth.md 

للمصادقة من خلال Okta، يجب إنشاء حساب على جانب Okta ويجب أن يكون للمستخدم حقوق الوصول إلى تطبيق Wallarm. الإجراء المطلوب لمنح حقوق الوصول موصوف أدناه.

اضغط على زر *Admin* في الجانب الأيمن العلوي من بوابة Okta. في قسم *Dashboard*، اضغط على رابط *Assign Applications*.

![لوحة تحكم Okta][img-dashboard]

سيُطلب منك تعيين التطبيقات للمستخدمين المناسبين لمنح هؤلاء المستخدمين الوصول إلى التطبيقات المختارة. للقيام بذلك، ضع علامات في المربعات بجانب التطبيقات والمستخدمين المطلوبين واضغط *Next*.

![تعيين المستخدمين للتطبيق][img-assignments]

بعد ذلك، سيُطلب منك التحقق وتأكيد تعيينات التطبيق. إذا كان كل شيء صحيحًا، أكد التعيينات بالضغط على زر *Confirm Assignments*.

بعد ذلك، يمكنك الانتقال إلى صفحة إعدادات التطبيق على علامة التبويب *Assignments*. هنا، ستتمكن من رؤية قائمة المستخدمين الذين لديهم الوصول إلى التطبيق الذي تم تكوين SSO له.

![قائمة المستخدمين لتطبيق Wallarm][img-user-list]

تم الآن إعداد حقوق الوصول إلى تطبيق Wallarm. الآن، يمكن للمستخدمين المعينين للتطبيق الوصول إلى التطبيق باستخدام مصادقة SSO من خلال خدمة Okta.


##  اكتمال الإعداد

هذا يكمل تكوين SSO المبني على Okta، والآن يمكنك البدء في تكوين مصادقة SSO [المحددة للمستخدم][doc-use-user-auth] على جانب Wallarm.