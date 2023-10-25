# Adım 4: G Suite Tarafında Wallarm Uygulamasına Erişime İzin Verme

[img-gsuite-console]:           ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-user-list]:                ../../../../images/admin-guides/configuration-guides/sso/gsuite/user-list.png
[img-gsuite-navigation-saml]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-navigation-saml.png
[img-app-page]:                 ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png

[doc-use-user-auth]:            ../employ-user-auth.md

G Suite üzerinden kimlik doğrulama için, G Suite tarafında bir hesap oluşturulmalı ve kullanıcının Wallarm uygulamasına erişim hakları olmalıdır. Erişim haklarının verilmesi için gereken eylem dizisi aşağıda açıklanmıştır.

*Users* blokuna tıklayarak G Suite'ın kullanıcı yönetim bölümüne gidin.

![G Suite konsolu][img-gsuite-console]

SSO kimlik doğrulaması aracılığıyla uygulamaya erişim vermek üzere olduğunuz kullanıcının organizasyonunuzun kullanıcı listesinde olduğundan emin olun.

![G Suite kullanıcı listesi][img-user-list]

Aşağıda gösterildiği gibi *SAML apps* menü öğesine tıklayarak SAML uygulamaları bölümüne gidin.

![SAML uygulamalarına gidin][img-gsuite-navigation-saml]

İstenilen uygulamanın ayarlarını girin ve uygulamanın durumunun "Herkes için AÇIK" olduğundan emin olun. Uygulamanın durumu "Herkes için KAPALI" ise *Edit service* düğmesine tıklayın.

![G Suite'teki uygulama sayfası][img-app-page]

"Herkes için AÇIK" durumunu seçin ve *Save* tıklayın.

Bunun ardından servisin durumunun güncellendiğine dair bir mesaj alacaksınız. Wallarm uygulaması şimdi G Suite'teki organizasyonunuzun tüm kullanıcılarına SSO kimlik doğrulaması için kullanılabilecek.


##  Kurulum Tamamlandı

G Suite tabanlı SSO'nun yapılandırması bu şekilde tamamlanmıştır ve şimdi [kullanıcıya özel][doc-use-user-auth] SSO kimlik doğrulamasını Wallarm tarafında yapılandırmaya başlayabilirsiniz.