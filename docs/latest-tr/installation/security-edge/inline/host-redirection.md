# Security Edge Inline'de Ana Makine Yönlendirme <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

Wallarm [Security Edge Inline](deployment.md), trafik giriş noktalarını birleştirmenize yardımcı olmak için ana makine yönlendirme özelliği sağlar.

## Nasıl çalışır

Ana makine yönlendirme etkinleştirildiğinde, Edge Node istemci isteklerini bir ana makineden (yönlendiren ana makine) diğerine (hedef ana makine) otomatik olarak yönlendirir.

Yönlendirilen istek daha sonra hedef ana makinenin yapılandırmasına göre — Origin, Filtration mode ve diğer ayarlar dahil — işlenir.

!!! info "TLS gereksinimi"
    Yönlendiren ana makinenin DNS bölgesinde [sertifika verme özelliği etkinleştirilmiş](deployment.md#5-certificate-cname-configuration) olmalıdır.

![!](../../../images/waf-installation/security-edge/inline/host-redirection.png)

Edge Node, yönlendiren ana makineye gelen isteklere HTTP 301 veya 302 yönlendirmesiyle yanıt verir ve istemciye aynı kaynağı hedef ana makineden istemesini söyler.

Yönlendirme sırasında özgün yol (path) ve sorgu dizesi (query string) korunur.

## Ana makine yönlendirmeyi etkinleştirme

Ana makine yönlendirmeyi etkinleştirmek için:

1. Hedef [ana makineyi](deployment.md#4-hosts) ekleyin — istemci isteklerinin yönlendirileceği ana makine.
1. Gerekli Origin, Filtration mode ve diğer ayarlarla tamamen yapılandırın.

    ![!](../../../images/waf-installation/security-edge/inline/redirect-target-host.png)
1. Yönlendiren ana makineyi ekleyin — kullanıcıların yönlendirilileceği kaynak ana makine.
1. **Redirect to another host** onay kutusunu etkinleştirin ve listeden hedef ana makineyi seçin.

    ![!](../../../images/waf-installation/security-edge/inline/redirecting-host.png)

Yönlendiren ana makine için Origin gerekli değildir — yalnızca bir HTTPS yönlendirmesi döndürür ve trafiği proxy'lemez.

## Örnekler

Aşağıda, ana makine yönlendirmenin faydalı olduğu bazı yaygın kullanım senaryaları yer almaktadır.

### Önerilir: apex alan adından `www.*`'e yönlendirme

* Yönlendiren ana makine: `example.com`
* Korumalı ana makine: `www.example.com`

Apex alan adınıza gelen trafiği güvenli biçimde işlemek için, mümkün olduğunda birincil korumalı ana makine olarak `www.example.com` gibi bir alt alan adı kullanmanızı öneririz.

Bu yaklaşım, Wallarm'ın bir global CNAME kullanarak birden çok bölge ve bulut sağlayıcısı arasında trafik yönlendirmesini yönetmesine olanak tanır; böylece [birden çok A kaydı](deployment.md#a-records) ve manuel trafik dağıtımı ihtiyacını ortadan kaldırır.

Yapılandırma adımları:

1. `www.example.com` [ana makinesini](deployment.md#4-hosts) Security Edge'e ekleyin ve tamamen yapılandırın (Origin, mode, vb.).
1. `example.com` ana makinesini ayrı bir ana makine olarak ekleyin ve `www.example.com`'a yönlendirmeyi etkinleştirin.

### Eski API uç noktası yönlendirmesi

* Eski ana makine: `old-api.customer.com`
* Yeni korumalı ana makine: `new-api.customer.com`

API'niz daha önce `old-api.customer.com` üzerinde erişilebilirken `new-api.customer.com`'a taşındıysa, geriye dönük uyumluluğu sağlamak için ana makine yönlendirmesini kullanın.

Yapılandırma adımları:

1. `new-api.customer.com` [ana makinesini](deployment.md#4-hosts) Security Edge'e ekleyin ve tamamen yapılandırın (Origin, mode, vb.).
1. `old-api.customer.com` ana makinesini ayrı bir ana makine olarak ekleyin ve `new-api.customer.com`'a yönlendirmeyi etkinleştirin.