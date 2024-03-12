# نظرة عامة على التكامل مع حل SAML SSO

[doc-admin-sso-gsuite]:     gsuite/overview.md
[doc-admin-sso-okta]:       okta/overview.md

[link-saml]:                https://wiki.oasis-open.org/security/FrontPage
[link-saml-sso-roles]:      https://www.oasis-open.org/committees/download.php/27819/sstc-saml-tech-overview-2.0-cd-02.pdf     

يمكنك استخدام تقنية Single Sign‑On (SSO) لتوثيق مستخدمي شركتك لبوابة Wallarm إذا كانت شركتك تستخدم بالفعل حل SSO بـ[SAML][link-saml].

يمكن دمج Wallarm مع أي حل يدعم معيار SAML. تصف أدلة SSO التكامل باستخدام [Okta][doc-admin-sso-okta] أو [Google Suite (G Suite)][doc-admin-sso-gsuite] كمثال.

الوثائق المتعلقة بتكوين وتشغيل Wallarm مع SSO تفترض ما يلي:
*   Wallarm يعمل كـ **مزود خدمة** (SP).
*   Google أو Okta يعمل كـ **مزود هوية** (IdP).

يمكن العثور على مزيد من المعلومات حول الأدوار في SAML SSO هنا ([PDF][link-saml-sso-roles]).

!!! تحذير "تمكين خدمة SSO"
    بشكل افتراضي، لا يتوفر اتصال SSO على Wallarm بدون تفعيل الخدمة المناسبة. لتفعيل خدمة SSO، يرجى الاتصال بمدير حسابك أو [فريق دعم Wallarm](mailto:support@wallarm.com).
    
    إذا لم يتم تفعيل خدمة SSO، فلن تكون الكتل المتعلقة بـSSO ظاهرة في قسم **التكاملات** في واجهة Wallarm.