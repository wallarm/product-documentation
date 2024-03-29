# نظرة عامة على التكامل مع حل SAML SSO

[doc-admin-sso-gsuite]:     gsuite/overview.md
[doc-admin-sso-okta]:       okta/overview.md

[link-saml]:                https://wiki.oasis-open.org/security/FrontPage
[link-saml-sso-roles]:      https://www.oasis-open.org/committees/download.php/27819/sstc-saml-tech-overview-2.0-cd-02.pdf     

يمكنك استخدام تقنية تسجيل الدخول الموحّد (SSO) لمصادقة مستخدمي شركتك إلى بوابة Wallarm إذا كانت شركتك تستخدم بالفعل حل SSO بتقنية [SAML][link-saml].

يمكن تكامل Wallarm مع أي حل يدعم معيار SAML. تصف الأدلة SSO التكامل باستخدام [Okta][doc-admin-sso-okta] أو [مجموعة Google (G Suite)][doc-admin-sso-gsuite] كمثال.

تفترض الوثائق المتعلقة بتكوين وتشغيل Wallarm مع SSO ما يلي:
*   يعمل Wallarm كموفر **خدمة** (SP).
*   تعمل Google أو Okta كموفر **هوية** (IdP).

يمكن العثور على معلومات إضافية حول الأدوار في SAML SSO هنا ([PDF][link-saml-sso-roles]).

!!! تحذير "تفعيل خدمة SSO"
    بشكل افتراضي، لا تتوفر اتصال SSO على Wallarm دون تفعيل الخدمة المناسبة. لتفعيل خدمة SSO، يرجى الاتصال بمدير حسابك أو بفريق دعم [Wallarm](mailto:support@wallarm.com).
    
    إذا لم يتم تفعيل خدمة SSO، فلن تكون كتل المتعلقة بSSO مرئية في قسم **التكاملات** في لوحة تحكم Wallarm.