#   Adım 3: G Suite Metadata'yı Wallarm Kurulum Sihirbazına Aktarma

[img-sp-wizard-transfer-metadata]:  ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-transfer-metadata.png
[img-transfer-metadata-manually]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-finish.png
[img-integration-tab]:              ../../../../images/admin-guides/configuration-guides/sso/gsuite/integration-tab.png

[doc-setup-idp]:                    setup-idp.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[anchor-upload-metadata-xml]:       #uploading-metadata-using-an-xml-file
[anchor-upload-metadata-manually]:  #copying-parameters-manually

Wallarm Konsolunda G Suite SSO kurulum sihirbazına geri dönün ve bir sonraki kurulum adımına devam etmek için *İleri* düğmesine tıklayın.

Bu aşamada, G Suite servisi tarafından üretilen metadata'yı Wallarm SSO kurulum sihirbazına sağlamanız gerekmektedir.

Metadata'yı aktarmanın iki yolu vardır:
*   [Metadata'yı içeren bir XML dosyasını Wallarm kurulum sihirbazına yükleyin.][anchor-upload-metadata-xml]
*   [Gerekli parametreleri manuel olarak kopyalayıp Wallarm kurulum sihirbazına yapıştırın.][anchor-upload-metadata-manually]


##  Metadata'yı Bir XML Dosyası Kullanarak Yükleme

Eğer daha önce G Suite'de uygulamayı yapılandırırken G Suite'in metadata'sını bir XML dosyası olarak kaydettiyseniz ( [Adım 2'de][doc-setup-idp] ),*Yükle* düğmesine tıklayın ve istenen dosyayı seçin. Bu işlemi dosyayı dosya yöneticinizden “XML” simgesine sürükleyerek de gerçekleştirebilirsiniz. Dosyayı yükledikten sonra bir sonraki adıma geçmek için *İleri* düğmesine tıklayın.

![Metadata'yı yükleme][img-sp-wizard-transfer-metadata]


##  Parametreleri Manuel Olarak Kopyalama

G Suite'deki uygulamayı yapılandırırken sağlanan kimlik sağlayıcı parametrelerini kopyaladıysanız, kopyalanan parametreleri manuel olarak girmek ve formu doldurmak için *Manuel olarak gir* bağlantısına tıklayın.

G Suite tarafından üretilen parametreleri, Wallarm kurulum sihirbazındaki alanlarına aşağıdaki şekilde girin:

*   **SSO URL** → **Kimlik sağlayıcı SSO URL**
*   **Entity ID** → **Kimlik sağlayıcı issuer**
*   **Certificate** → **X.509 Sertifikası**

Bir sonraki adıma geçmek için *İleri* düğmesine tıklayın. Önceki adıma geri dönmek isterseniz, *Geri* düğmesine tıklayın.

![Metadata'yı manuel olarak girme][img-transfer-metadata-manually]


##  SSO Sihirbazını Tamamlama

Wallarm kurulum sihirbazının son adımında, G Suite hizmetine otomatik olarak bir test bağlantısı gerçekleştirilir ve SSO sağlayıcısı kontrol edilir.

Testin başarılı bir şekilde tamamlanmasının ardından (tüm gerekli parametreler doğru bir şekilde doldurulmuşsa), kurulum sihirbazı size G Suite hizmetinin bir kimlik sağlayıcı olarak bağlandığını ve kullanıcılarınızı doğrulamak için SSO mekanizmasını bağlamaya başlayabileceğinizi bildirir.

SSO yapılandırmasını *Bitir* düğmesine tıklayarak tamamlayın veya ilgili düğmeye tıklayarak kullanıcı sayfasına geçin ve SSO'yu yapılandırın.

![SSO sihirbazını tamamlama][img-sp-wizard-finish]

SSO yapılandırma sihirbazını tamamladıktan sonra, Entegrasyon sekmesinde G Suite hizmetinin bir kimlik sağlayıcı olarak bağlandığını ve başka SSO sağlayıcılarının bulunmadığını göreceksiniz.

![SSO sihirbazını bitirdikten sonra "Entegrasyon" sekmesi][img-integration-tab]

Şimdi, SSO yapılandırma sürecinin [bir sonraki adımına][doc-allow-access-to-wl] geçin.