# Adım 4: G Suite Tarafında Wallarm Uygulamasına Erişim İzni Verme

[img-gsuite-console]:           ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-user-list]:                ../../../../images/admin-guides/configuration-guides/sso/gsuite/user-list.png
[img-gsuite-navigation-saml]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-navigation-saml.png
[img-app-page]:                 ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png

[doc-use-user-auth]:            ../employ-user-auth.md

G Suite üzerinden kimlik doğrulaması yapmak için, G Suite tarafında bir hesap oluşturulmalı ve kullanıcının Wallarm uygulamasına erişim hakkı olmalıdır. Erişim haklarının verilmesi için gereken işlem sırası aşağıda açıklanmıştır.

*Users* bloğuna tıklayarak G Suite'in kullanıcı yönetimi bölümüne gidin.

![G Suite console][img-gsuite-console]

SSO kimlik doğrulaması yoluyla uygulamaya erişim vereceğiniz kullanıcının, kuruluşunuzun kullanıcı listesinde yer aldığından emin olun.

![G Suite user list][img-user-list]

Aşağıda gösterildiği gibi *SAML apps* menü öğesine tıklayarak SAML uygulamaları bölümüne gidin.

![Navigate to the SAML applications][img-gsuite-navigation-saml]

İstediğiniz uygulamanın ayarlarına girin ve uygulamanın durumunun “ON for everyone” olduğundan emin olun. Uygulama durumu “OFF for everyone” ise, *Edit service* düğmesine tıklayın.

![Application page in G Suite][img-app-page]

“ON for everyone” durumunu seçin ve *Save*'e tıklayın.

Bundan sonra, hizmetin durumunun güncellendiğine dair bir mesaj alacaksınız. Wallarm uygulaması artık G Suite içindeki kuruluşunuzdaki tüm kullanıcılar için SSO kimlik doğrulamasına açıktır.

##  Kurulum Tamamlandı

Bu, G Suite‑tabanlı SSO yapılandırmasını tamamlar ve şimdi Wallarm tarafında [user specific][doc-use-user-auth] SSO kimlik doğrulamasını yapılandırmaya başlayabilirsiniz.