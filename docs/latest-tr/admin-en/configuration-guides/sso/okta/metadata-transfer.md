# Adım 3: Okta Metadata'nın Wallarm Kurulum Sihirbazına Aktarılması

[img-transfer-metadata-manually]:   ../../../../images/admin-guides/configuration-guides/sso/okta/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../../images/admin-guides/configuration-guides/sso/okta/sp-wizard-finish.png
[img-integration-tab]:              ../../../../images/admin-guides/configuration-guides/sso/okta/integration-tab.png

[doc-allow-access-to-wl]:           allow-access-to-wl.md

[link-metadata]:                    setup-idp.md#downloading-metadata

Wallarm Konsolunda Okta SSO kurulum sihirbazına dönün ve bir sonraki kurulum adımına devam etmek için *İleri*'yi tıklayın.

Bu adımda, Okta hizmeti tarafından [üretilen][link-metadata] metaveriyi sağlamanız gerekmektedir.

Kimlik sağlayıcı metaverisini (bu durumda Okta) Wallarm kurulum sihirbazına iletmenin iki yolu vardır:
*   Bir XML metaveri dosyasını yükleyerek.

    *Yükle* düğmesini tıklayarak ve uygun dosyayı seçerek XML dosyasını yükleyin. Dosya yöneticinizden dosyayı "XML" simgesi alanına sürükleyerek de bunu yapabilirsiniz.

*   Metaveriyi manuel olarak girerek.

    *Manuel olarak gir* bağlantısını tıklayın ve Okta hizmet parametrelerini aşağıdaki gibi kurulum sihirbazının alanlarına kopyalayın:
   
    *   **Identity Provider Single Sign‑On URL** alanına **Identity provider SSO URL**.
    *   **Identity Provider Issuer** alanına **Identity provider issuer**.
    *   **X.509 Certificate** alanına **X.509 Certificate**.
    
    ![Metaveriyi manuel olarak girme][img-transfer-metadata-manually]
    
Bir sonraki adıma gitmek için *İleri*'yi tıklayın. Önceki adıma dönmek istiyorsanız, *Geri*'yi tıklayın.


##  SSO Sihirbazını Tamamlama

Wallarm kurulum sihirbazının son adımında, Okta hizmetine otomatik olarak bir test bağlantısı yapılır ve SSO sağlayıcısı kontrol edilir.

Testin başarıyla tamamlanmasının ardından (gerekli tüm parametreler doğru bir şekilde doldurulmuşsa), kurulum sihirbazı Okta hizmetinin bir kimlik sağlayıcı olarak bağlandığını ve SSO mekanizmasını kullanıcılarınızı kimlik doğrulamak için bağlamaya başlayabileceğinizi bildirecektir.

SSO'yu yapılandırmayı tamamlamak için *Bitir* düğmesini tıklayın veya SSO'yu yapılandırmak için kullanıcı sayfasına giderek ilgili düğmeyi tıklayın.

![SSO sihirbazını tamamlama][img-sp-wizard-finish]

SSO yapılandırma sihirbazını tamamladıktan sonra, *Entegrasyon* sekmesinde Okta hizmetinin bir kimlik sağlayıcı olarak bağlandığını ve başka SSO sağlayıcılarının mevcut olmadığını göreceksiniz.

![SSO sihirbazını bitirdikten sonra “Entegrasyon” sekmesi][img-integration-tab]


Şimdi, SSO yapılandırma sürecinin [bir sonraki adımına][doc-allow-access-to-wl] gidin.
