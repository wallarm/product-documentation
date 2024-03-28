#   ربط SSO مع Okta

[doc-setup-sp]:                     setup-sp.md
[doc-setup-idp]:                    setup-idp.md    
[doc-metadata-transfer]:            metadata-transfer.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.md

[doc-employ-sso]:                   ../employ-user-auth.md
[doc-disable-sso]:                  ../change-sso-provider.md

[link-okta]:                        https://www.okta.com/

ستغطي هذه الدليل عملية ربط خدمة [Okta][link-okta] كمزود هوية مع Wallarm، الذي يعمل كمزود خدمة.

!!! note

    بشكل افتراضي، لا يتوفر ربط SSO في Wallarm بدون تفعيل الخدمة المناسبة. لتفعيل خدمة SSO، يرجى التواصل مع مدير حسابك أو فريق دعم [Wallarm](mailto:support@wallarm.com).
    
    بعد تفعيل الخدمة
    
    *   ستكون قادرًا على إجراء إجراء الربط لـSSO التالي، و
    *   ستكون الكتل المتعلقة بـSSO مرئية في تبويب “التكاملات”.
    
    بالإضافة إلى ذلك، أنت بحاجة إلى حسابات بحقوق إدارة لكل من Wallarm وOkta.

تشمل عملية ربط SSO مع Okta على الخطوات التالية:
1.  [توليد المعلمات على جانب Wallarm.][doc-setup-sp]
2.  [إنشاء وتكوين تطبيق في Okta.][doc-setup-idp]
3.  [نقل معطيات Okta إلى معالج إعداد Wallarm.][doc-metadata-transfer]
4.  [السماح بالوصول إلى تطبيق Wallarm من جانب Okta][doc-allow-access-to-wl]

بعد ذلك، [قم بتكوين مصادقة SSO][doc-employ-sso] لمستخدمي Wallarm.