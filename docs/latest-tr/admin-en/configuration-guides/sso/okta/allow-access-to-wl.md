# Adım 4: Okta Tarafında Wallarm Uygulamasına Erişime İzin Verme

[img-dashboard]:    ../../../../images/admin-guides/configuration-guides/sso/okta/okta-assign-app.png
[img-assignments]:  ../../../../images/admin-guides/configuration-guides/sso/okta/assignments.png
[img-user-list]:    ../../../../images/admin-guides/configuration-guides/sso/okta/user-list.png

[doc-use-user-auth]:   ../employ-user-auth.md 

Okta üzerinden kimlik doğrulama yapmak için, Okta tarafında bir hesap oluşturulmalı ve kullanıcının Wallarm uygulamasına erişim hakları olmalıdır. Erişim haklarını verme işlemi için gereken adımlar aşağıda açıklanmıştır.

Okta portalının sağ üst köşesindeki *Admin* düğmesini tıklayın. *Dashboard* bölümünde, *Uygulamaları Atamak* bağlantısını tıklayın.

![Okta gösterge paneli][img-dashboard]

Seçili uygulamalara erişim hakkı vermek üzere uygulamaları doğru kullanıcılara atamanız istenecektir. Bunu yapmak için, gerekli uygulamaların ve kullanıcıların yanındaki kutuları işaretleyin ve *Sonraki*’yi tıklayın.

![Atanan kullanıcılar uygulama][img-assignments]

Daha sonra, uygulama atamalarını kontrol etmeniz ve onaylamanız istenecektir. Her şey doğruysa, atamaları *Atamaları Onayla* düğmesini tıklayarak onaylayın.

Bundan sonra, *Atamalar* sekmesindeki uygulama ayarları sayfasına gidebilirsiniz. Burada, SSO’nun yapılandırıldığı uygulamaya erişimi olan kullanıcıların listesini görebilirsiniz.

![Wallarm uygulaması için kullanıcı listesi][img-user-list]

Wallarm uygulamasına erişim hakları artık ayarlandı. Şimdi, uygulamaya atanan kullanıcılar Okta hizmeti üzerinden SSO kimlik doğrulaması kullanarak uygulamaya erişebilir.

## Kurulum Tamamlandı

Bu, Okta tabanlı SSO'nun yapılandırmasını tamamlar ve şimdi Wallarm tarafındaki [kullanıcıya özel][doc-use-user-auth] SSO kimlik doğrulamasını yapılandırmaya başlayabilirsiniz.