# ربط SSO مع G Suite

[doc-setup-sp]: setup-sp.md
[doc-setup-idp]: setup-idp.md
[doc-metadata-transfer]: metadata-transfer.md
[doc-allow-access-to-wl]: allow-access-to-wl.md

[doc-user-sso-guide]: ../../../../user-guides/use-sso.md

[doc-employ-sso]: ../employ-user-auth.md
[doc-disable-sso]: ../change-sso-provider.md

[link-gsuite]: https://gsuite.google.com/

يغطي هذا الدليل عملية ربط خدمة [G Suite][link-gsuite] (Google) كمزود هوية مع Wallarm، والذي يتصرف كمزود خدمة.

!!! note
    بشكل افتراضي، لا يتوفر اتصال SSO في Wallarm دون تفعيل الخدمة المناسبة. لتفعيل خدمة SSO، يرجى التواصل مع مدير حسابك أو فريق دعم [Wallarm](mailto:support@wallarm.com).
    
    بعد تفعيل الخدمة
    
    * ستتمكن من أداء إجراء اتصال SSO التالي، و
    * ستكون القطع المتعلقة بSSO ظاهرة في تبويب "التكاملات".
    
    بالإضافة إلى ذلك، تحتاج إلى حسابات بحقوق إدارة لكل من Wallarm وG Suite.

تتضمن عملية ربط SSO مع G Suite الخطوات التالية:
1. [توليد المعلمات على جانب Wallarm.][doc-setup-sp]
2. [إنشاء وتكوين تطبيق في G Suite.][doc-setup-idp]
3. [نقل بيانات التعريف من G Suite إلى معالج إعداد Wallarm.][doc-metadata-transfer]
4. [السماح بالوصول إلى تطبيق Wallarm من جانب G Suite][doc-allow-access-to-wl]

بعد ذلك، [اضبط مصادقة SSO][doc-employ-sso] لمستخدمي Wallarm.