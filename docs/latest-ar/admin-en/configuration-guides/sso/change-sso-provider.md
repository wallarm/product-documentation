# تغيير التوثيق SSO المُعد

[img-disable-sso-provider]:     ../../../images/admin-guides/configuration-guides/sso/disable-sso-provider.png

[doc-setup-sso-gsuite]:     gsuite/overview.md
[doc-setup-sso-okta]:       okta/overview.md

[anchor-edit]:      #editing
[anchor-disable]:   #disabling
[anchor-remove]:    #removing

يمكنك [تعديل][anchor-edit]، [تعطيل][anchor-disable] أو [إزالة][anchor-remove] توثيق SSO المُعد.

!!! warning "انتبه: سيتم تعطيل SSO لجميع المستخدمين"
    احرص على أن تعطيل أو إزالة توثيق SSO سيؤدي إلى تعطيله لجميع المستخدمين. سيتم إعلام المستخدمين بأن توثيق SSO قد تم تعطيله وأنه يجب استعادة كلمة المرور.

## التعديل

لتعديل توثيق SSO المُعد:

1. اذهب إلى **الإعدادات → الاندماج** في واجهة Wallarm.
2. اختر خيار **تعديل** في قائمة مزود SSO المُعد.
3. حدث تفاصيل مزود SSO و **احفظ التغييرات**.

## التعطيل

لتعطيل SSO، اذهب إلى *الإعدادات → الاندماج*. انقر على القسم الخاص بمزود SSO المعني ثم على زر *تعطيل*.

![تعطيل مزود SSO][img-disable-sso-provider]

في النافذة المنبثقة، يجب تأكيد تعطيل مزود SSO، بالإضافة إلى تعطيل توثيق SSO لجميع المستخدمين.
اضغط على *نعم، تعطيل*.

بعد التأكيد، سيتم فصل المزود SSO، لكن ستُحفظ إعداداته ويمكنك تفعيل هذا المزود مجددًا في المستقبل. بالإضافة إلى ذلك، بعد التعطيل، ستتمكن من الاتصال بمزود SSO آخر (خدمة أخرى كمزود هوية).

## الإزالة

!!! warning "انتبه: بخصوص إزالة مزود SSO"
    بالمقارنة مع التعطيل، سيؤدي إزالة مزود SSO إلى فقدان جميع إعداداته دون إمكانية للتعافي.
    
    إذا كنت بحاجة إلى إعادة الاتصال بمزودك، ستحتاج إلى إعادة تكوينه.

تشابه عملية إزالة مزود SSO مع عملية التعطيل.

اذهب إلى *الإعدادات → الاندماج*. انقر على القسم الخاص بمزود SSO المعني ثم على زر *إزالة*.

في النافذة المنبثقة، يجب تأكيد إزالة المزود، بالإضافة إلى تعطيل توثيق SSO لجميع المستخدمين.
اضغط على *نعم، إزالة*.

بعد التأكيد، سيتم إزالة مزود SSO المختار ولن يكون متاحًا بعد الآن. كذلك، ستتمكن من الاتصال بمزود SSO آخر.