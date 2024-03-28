[img-gsuite-sso-provider-wl]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-sso-provider-wl.png
[img-sp-metadata]:              ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-metadata.png

[doc-setup-idp]:                setup-idp.md

# الخطوة 1: توليد المعاملات على جانب Wallarm (G Suite)

للربط بين G Suite وخدمة الدخول الموحد SSO، يجب أولاً توليد بعض المعاملات على جانب Wallarm.

!!! warning "يجب تفعيل خدمة الدخول الموحد SSO على جانب Wallarm أولاً"
    بشكل افتراضي، لا تتوفر اتصالات الدخول الموحد SSO على Wallarm بدون تفعيل الخدمة المناسبة. لتفعيل خدمة الدخول الموحد SSO، يرجى التواصل مع مدير حسابك أو فريق دعم Wallarm عبر [فريق دعم Wallarm](mailto:support@wallarm.com).

    بعد تفعيل الخدمة، ستتمكن من تنفيذ إجراء اتصال الدخول الموحد SSO التالي.

قم بتسجيل الدخول إلى لوحة تحكم Wallarm باستخدام حساب المدير وتابع إلى إعداد الدمج مع G Suite من خلال **الإعدادات → الدمج → Google SSO**.

![كتلة "Google SSO"][img-gsuite-sso-provider-wl]

سيؤدي ذلك إلى ظهور معالج تكوين SSO. في الخطوة الأولى من المعالج، سيتم تقديمك بنموذج يحتوي على المعاملات (بيانات مزود الخدمة) التي يجب إرسالها إلى خدمة G Suite:
*   **معرف كيان Wallarm** هو معرف تطبيق فريد تم إنشاؤه بواسطة تطبيق Wallarm لمزود الهوية.
*   **عنوان URL لخدمة استهلاك الادعاءات (ACS URL)** هو العنوان على جانب Wallarm للتطبيق الذي يرسل إليه مزود الهوية الطلبات مع المعامل SamlResponse.

![بيانات مزود الخدمة][img-sp-metadata]

سيتعين إدخال المعاملات المولدة في الحقول المقابلة على جانب خدمة G Suite (انظر [الخطوة 2][doc-setup-idp]).