[img-okta-sso-provider-wl]:     ../../../../images/admin-guides/configuration-guides/sso/okta/okta-sso-provider-wl.png
[img-sp-metadata]:              ../../../../images/admin-guides/configuration-guides/sso/okta/sp-metadata.png

[doc-setup-idp]:                setup-idp.md

# الخطوة 1: توليد المعاملات على جانب Wallarm (Okta)

للربط بخدمة SSO مع Okta، ستحتاج أولًا إلى توليد بعض المعاملات على جانب Wallarm.

!!! تحذير "يُرجى تفعيل خدمة SSO على جانب Wallarm أولًا"
    بشكل افتراضي، الاتصال بخدمة SSO على Wallarm غير متاح بدون تفعيل الخدمة المناسبة. لتفعيل خدمة SSO، يُرجى التواصل مع مدير حسابك أو [فريق دعم Wallarm](mailto:support@wallarm.com).

    بعد تفعيل الخدمة، ستتمكن من أداء إجراء الاتصال بخدمة SSO التالي.

قم بتسجيل الدخول إلى واجهة Wallarm الإدارية باستخدام حساب المدير وتابع إلى إعداد التكامل مع Okta عبر **الإعدادات → التكامل → Okta SSO**.

![كتلة “Okta SSO”][img-okta-sso-provider-wl]

هذا سيُظهر لك معالج تكوين SSO. في الخطوة الأولى من المعالج، ستُقدم لك استمارة بالمعاملات (بيانات مزود الخدمة) التي يجب تمريرها إلى خدمة Okta:
*   **معرف كيان Wallarm** هو معرف تطبيق فريد تم توليده بواسطة تطبيق Wallarm لمزود الهوية.
*   **عنوان URL لخدمة استهلاك الادعاء (ACS URL)** هو عنوان على جانب تطبيق Wallarm الذي يرسل إليه مزود الهوية طلبات مع معلمة SamlResponse.

![بيانات مزود الخدمة][img-sp-metadata]

ستحتاج المعاملات المولدة إلى إدخالها في الحقول المقابلة على جانب خدمة Okta (انظر [الخطوة 2][doc-setup-idp]).