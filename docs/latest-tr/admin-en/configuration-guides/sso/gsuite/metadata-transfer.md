# Adım 3: G Suite Metadata'sını Wallarm Setup Wizard'a Aktarma

[img-sp-wizard-transfer-metadata]:  ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-transfer-metadata.png
[img-transfer-metadata-manually]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-finish.png
[img-integration-tab]:               ../../../../images/admin-guides/configuration-guides/sso/gsuite/integration-tab.png

[doc-setup-idp]:                    setup-idp.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[anchor-upload-metadata-xml]:       #uploading-metadata-using-an-xml-file
[anchor-upload-metadata-manually]:  #copying-parameters-manually

Wallarm Console'daki G Suite SSO kurulum sihirbazına dönün ve bir sonraki kurulum adımına geçmek için *Next* düğmesine tıklayın.

Bu aşamada, G Suite hizmeti tarafından oluşturulan metadata'yı Wallarm SSO kurulum sihirbazına sağlamanız gerekmektedir.

Metadata aktarmanın iki yolu vardır:
*   [XML dosyası ile metadata'yı Wallarm setup wizard'a yükleyin.][anchor-upload-metadata-xml]
*   [Gerekli parametreleri Wallarm setup wizard'a manuel olarak kopyalayıp yapıştırın.][anchor-upload-metadata-manually]

## XML Dosyası Kullanarak Metadata Yükleme

Daha önce G Suite'de uygulamayı yapılandırırken metadata'yı bir XML dosyası olarak kaydettiyseniz (bakınız [Adım 2][doc-setup-idp]), *Upload* düğmesine tıklayın ve istenen dosyayı seçin. Dosyayı dosya yöneticinizden “XML” simgesine sürükleyerek de bunu gerçekleştirebilirsiniz. Dosyayı yükledikten sonra, bir sonraki adıma geçmek için *Next* düğmesine tıklayın.

![Metadata yükleniyor][img-sp-wizard-transfer-metadata]

## Parametreleri Manuel Olarak Kopyalama

G Suite'de uygulamayı yapılandırırken sağlanan kimlik sağlayıcı parametrelerini kopyaladıysanız, kopyalanan parametreleri manuel olarak girmek için *Enter manually* bağlantısına tıklayın ve formu doldurun. 

Wallarm setup wizard'ın alanlarına G Suite tarafından oluşturulan parametreleri aşağıdaki şekilde yerleştirin:

*   **SSO URL** → **Identity provider SSO URL**
*   **Entity ID** → **Identity provider issuer**
*   **Certificate** → **X.509 Certificate**

Bir sonraki adıma geçmek için *Next* düğmesine tıklayın. Önceki adıma geri dönmek isterseniz, *Back* düğmesine tıklayın.

![Parametreler manuel giriliyor][img-transfer-metadata-manually]

## SSO Sihirbazını Tamamlama

Wallarm setup wizard'ın son adımında, G Suite hizmetine otomatik olarak bir test bağlantısı yapılacak ve SSO sağlayıcısı kontrol edilecektir.

Gerekli tüm parametreler doğru şekilde doldurulduysa test başarılı bir şekilde tamamlandığında, kurulum sihirbazı G Suite hizmetinin kimlik sağlayıcı olarak bağlı olduğunu bildirecektir ve kullanıcılarınızı doğrulamak için SSO mekanizmasını bağlamaya başlayabilirsiniz.

SSO yapılandırmasını tamamlamak için *Finish* düğmesine tıklayın veya ilgili düğmeye tıklayarak SSO'yu yapılandırmak üzere kullanıcı sayfasına gidin.

![SSO sihirbazının tamamlanması][img-sp-wizard-finish]

SSO yapılandırma sihirbazını tamamladıktan sonra, Integration sekmesinde G Suite hizmetinin kimlik sağlayıcı olarak bağlı olduğunu ve başka SSO sağlayıcısının bulunmadığını görürsünüz.

![SSO sihirbazını tamamladıktan sonraki “Integration” sekmesi][img-integration-tab]

Şimdi, SSO yapılandırma sürecinin [bir sonraki adımına][doc-allow-access-to-wl] gidin.