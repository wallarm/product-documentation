# Adım 4: Okta Tarafında Wallarm Uygulamasına Erişim İzni Verme

[img-dashboard]:    ../../../../images/admin-guides/configuration-guides/sso/okta/okta-assign-app.png
[img-assignments]:  ../../../../images/admin-guides/configuration-guides/sso/okta/assignments.png
[img-user-list]:    ../../../../images/admin-guides/configuration-guides/sso/okta/user-list.png

[doc-use-user-auth]:   ../employ-user-auth.md 

Okta üzerinden kimlik doğrulama yapmak için, Okta tarafında bir hesap oluşturulmalı ve kullanıcının Wallarm uygulamasına erişim haklarına sahip olması gerekmektedir. Erişim haklarının verilmesi için gereken aksiyon sıralaması aşağıda açıklanmıştır.

Okta portalının sağ üst köşesindeki *Admin* butonuna tıklayın. *Dashboard* bölümünde, *Assign Applications* bağlantısına tıklayın.

![Okta dashboard][img-dashboard]

Seçili uygulamalara bu kullanıcıların erişebilmesi için, uygulamaların ilgili kullanıcılara atanması istenecektir. Bunu yapmak için, gerekli uygulamaların ve kullanıcıların yanındaki onay kutularını işaretleyin ve *Next* butonuna tıklayın.

![Assigning users to the application][img-assignments]

Sonraki adımda, uygulama atamalarını kontrol etmeniz ve onaylamanız istenecektir. Her şey doğru ise, *Confirm Assignments* butonuna tıklayarak atamaları onaylayın.

Bunun ardından, *Assignments* sekmesindeki uygulama ayarları sayfasına gidebilirsiniz. Burada, SSO yapılandırması yapılan uygulamaya erişimi olan kullanıcıların listesini görebileceksiniz.

![User list for the Wallarm application][img-user-list]

Wallarm uygulamasına erişim hakları artık ayarlandı. Artık, uygulamaya atanan kullanıcılar Okta servisi üzerinden SSO kimlik doğrulaması kullanarak uygulamaya erişebilirler.

##  Kurulum Tamamlandı

Bu, Okta tabanlı SSO yapılandırmasının tamamlandığını belirtir; şimdi Wallarm tarafında [user specific][doc-use-user-auth] SSO kimlik doğrulamasını yapılandırmaya başlayabilirsiniz.