#   ربط SSO مع G Suite

[doc-setup-sp]:                     setup-sp.md
[doc-setup-idp]:                    setup-idp.md    
[doc-metadata-transfer]:            metadata-transfer.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.md

[doc-employ-sso]:                   ../employ-user-auth.md
[doc-disable-sso]:                  ../change-sso-provider.md

[link-gsuite]:                      https://gsuite.google.com/

هذا الدليل سيغطي عملية ربط خدمة [G Suite][link-gsuite] (جوجل) كموفر هوية مع والارم، الذي يتصرف كموفر خدمة.

!!! ملاحظة
    بشكل افتراضي، الاتصال بـ SSO في والارم غير متاح دون تفعيل الخدمة المناسبة. لتفعيل خدمة SSO، يرجى التواصل مع مدير حسابك أو [فريق دعم والارم](mailto:support@wallarm.com).
    
    بعد تفعيل الخدمة
    
    *   ستتمكن من أداء إجراء الاتصال بـ SSO التالي، و
    *   ستكون الكتل المتعلقة بـ SSO مرئية في علامة التبويب "التكامل".
    
    بالإضافة إلى ذلك، تحتاج إلى حسابات بحقوق الإدارة لكل من والارم و G Suite.

عملية ربط SSO مع G Suite تشمل الخطوات التالية:
1.  [إنشاء البرامترات على جانب والارم.][doc-setup-sp]
2.  [إنشاء وتهيئة تطبيق في G Suite.][doc-setup-idp]
3.  [نقل بيانات G Suite إلى ساحر إعدادات والارم.][doc-metadata-transfer]
4.  [السماح بالوصول إلى تطبيق والارم على جانب G Suite][doc-allow-access-to-wl]

بعد ذلك، [قم بتهيئة مصادقة SSO][doc-employ-sso] لمستخدمي والارم.