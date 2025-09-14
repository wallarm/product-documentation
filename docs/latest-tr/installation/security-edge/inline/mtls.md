# Edge Node'dan Origin'lere mTLS <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

Karşılıklı TLS (mTLS), Wallarm Edge Node'un istemci sertifikası kullanarak origin sunucularınıza kendisini kimlik doğrulaması yapmasına olanak tanır. Bu, origin'lerinizin yalnızca güvenilen kaynaklardan gelen istekleri kabul etmesini sağlar.

[Security Edge'i yapılandırırken](deployment.md), Edge Node'lar için istemci sertifikaları oluşturabilir ve yükleyebilirsiniz.

!!! info "Sürüm gereksinimleri"
    mTLS, [Edge Node sürümü](upgrade-and-management.md#upgrading-the-edge-inline) 5.3.14-200 ile desteklenir.

## Nasıl çalışır

Bir origin için mTLS etkinleştirildiğinde:

1. Filtrelenmiş trafiği origin'inize iletmeden önce, Edge Node TLS el sıkışması sırasında bir istemci sertifikası sunar.
1. Origin, sertifikayı güvenilen bir CA (Certificate Authority) demetine karşı doğrular.
1. Sertifika geçerli ise ve beklenen parametrelerle (ör. Common Name veya Subject Alternative Name) eşleşiyorsa, bağlantı kurulur ve istek kabul edilir.

![!](../../../images/waf-installation/security-edge/inline/mtls-logic.png)

## mTLS'i etkinleştirme

Birden fazla sertifika yükleyebilir ve farklı origin'lere farklı sertifikalar atayabilirsiniz.

1. Güvenilen bir CA tarafından imzalanmış bir istemci sertifikası ve özel anahtar çifti oluşturun. Aşağıdaki gereksinimleri karşılamalıdır:

    * **İstemci sertifikası**: X.509, PEM formatı.

        `Extended Key Usage (EKU)` uzantısını `Client Authentication` olarak içermelidir.
    
    * **Özel anahtar**: PEM formatı, istemci sertifikasıyla eşleşmelidir.
    * **CA demeti**: PEM formatı, istemci sertifikasını veren sertifika otoritesini içermelidir.
1. Wallarm Console → **Security Edge** → **Configure** içinde, **General settings** altında sertifikayı, özel anahtarı ve CA demetini yükleyin.
1. **Origins** bölümünde, ilgili origin için **Require mTLS from Edge Node** seçeneğini etkinleştirin ve uygun sertifikayı seçin.

    Gerekirse her origin farklı bir sertifika kullanabilir.
1. **Save** ile ayarları kaydedin.
1. Origin'inizi gelen bağlantılar için mTLS gerektirecek şekilde yapılandırın. İstemci sertifikasını veren CA demetine güvenin.

![!](../../../images/waf-installation/security-edge/inline/mtls-settings-ui.png)