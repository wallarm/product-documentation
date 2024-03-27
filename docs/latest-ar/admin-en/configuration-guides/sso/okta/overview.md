# ربط SSO مع أوكتا

[doc-setup-sp]:                     setup-sp.md
[doc-setup-idp]:                    setup-idp.md    
[doc-metadata-transfer]:            metadata-transfer.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.md

[doc-employ-sso]:                   ../employ-user-auth.md
[doc-disable-sso]:                  ../change-sso-provider.md

[link-okta]:                        https://www.okta.com/

هذا الدليل سوف يشرح عملية ربط خدمة [أوكتا][link-okta] كمزود هوية بـ Wallarm، الذي يعمل كمزود خدمة.

!!! ملاحظة

    افتراضيًا، لا يتوفر اتصال SSO على Wallarm بدون تفعيل الخدمة المناسبة. لتفعيل خدمة SSO، يرجى التواصل مع مدير حسابك أو [فريق دعم Wallarm](mailto:support@wallarm.com).
    
    بعد تفعيل الخدمة
    
    *   ستكون قادرًا على أداء إجراء اتصال SSO التالي، و
    *   ستكون الكتل المتعلقة بـ SSO مرئية في تبويب "التكاملات".
    
    بالإضافة إلى ذلك، تحتاج إلى حسابات بحقوق الإدارة لكل من Wallarm وأوكتا.

عملية ربط SSO مع أوكتا تتضمن الخطوات التالية:
1.  [إنشاء البارامترات على جانب Wallarm.][doc-setup-sp]
2.  [إنشاء وتكوين تطبيق في أوكتا.][doc-setup-idp]
3.  [نقل Metadata من أوكتا إلى معالج إعداد Wallarm.][doc-metadata-transfer]
4.  [السماح بالوصول إلى تطبيق Wallarm من جانب أوكتا][doc-allow-access-to-wl]

بعد ذلك، [قم بتكوين مصادقة SSO][doc-employ-sso] لمستخدمي Wallarm.