[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# Cloudflare için Wallarm Bağlayıcısı

[Cloudflare](https://www.cloudflare.com/), web sitelerinin ve internet uygulamalarının güvenliğini, hızını ve güvenilirliğini artırmak için tasarlanmış CDN, WAF, DNS hizmetleri ve SSL/TLS şifreleme dahil özellikler sunan bir güvenlik ve performans servisidir. Wallarm, Cloudflare üzerinde çalışan API’leri güvence altına almak için bir bağlayıcı olarak görev yapabilir.

Wallarm’ı Cloudflare için bir bağlayıcı olarak kullanmak için, **Wallarm Node’u harici olarak dağıtmanız** ve trafiği analiz için Wallarm Node’a yönlendirmek üzere **Wallarm tarafından sağlanan kodu kullanarak bir Cloudflare worker çalıştırmanız** gerekir.

<a name="cloudflare-modes"></a> Cloudflare bağlayıcısı hem [in-line](../inline/overview.md) hem de [out-of-band](../oob/overview.md) trafik akışlarını destekler:

=== "Satır içi trafik akışı"

    Wallarm kötü amaçlı etkinliği engelleyecek şekilde yapılandırılmışsa:

    ![Wallarm ile Cloudflare - satır içi şema](../../images/waf-installation/gateways/cloudflare/cloudflare-traffic-flow-inline.png)
=== "Bant dışı trafik akışı"
    ![Wallarm ile Cloudflare - bant dışı şema](../../images/waf-installation/gateways/cloudflare/cloudflare-traffic-flow-oob.png)

## Kullanım senaryoları

Bu çözüm, uygulamalarınıza Cloudflare aracılığıyla erişim sağladığınız durumlarda önerilir.

## Kısıtlamalar

* [Helm chart][helm-chart-native-node] kullanarak `LoadBalancer` türünde Wallarm servisini dağıtırken, Node örneği alan adı için **güvenilir** bir SSL/TLS sertifikası gereklidir. Kendi imzaladığınız sertifikalar henüz desteklenmemektedir.
* Wallarm kuralı ile [hız sınırlama][rate-limiting] desteklenmez.
* [Çok kiracılık][multi-tenancy] henüz desteklenmiyor.

## Gereksinimler

Dağıtıma devam etmeden önce aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* Cloudflare teknolojilerine hakimiyet.
* Cloudflare üzerinden akan API’ler veya trafik.

## Dağıtım

<a name="1-deploy-a-wallarm-node"></a>
### 1. Bir Wallarm Node dağıtın

Wallarm Node, dağıtmanız gereken Wallarm platformunun çekirdek bileşenidir. Gelen trafiği denetler, kötü amaçlı faaliyetleri tespit eder ve tehditleri azaltacak şekilde yapılandırılabilir.

Gereksinim duyduğunuz kontrol düzeyine bağlı olarak, Wallarm tarafından barındırılan veya kendi altyapınızda dağıtabilirsiniz.

=== "Edge node"
    Bağlayıcı için Wallarm tarafından barındırılan bir node dağıtmak için [talimatları](../security-edge/se-connector.md) izleyin.
=== "Self-hosted node"
    Kendinden barındırılan node dağıtımı için bir artifakt seçin ve ekli talimatları izleyin:

    * Bare metal veya VM’lerde Linux altyapıları için [Hepsi-bir-arada yükleyici](../native-node/all-in-one.md)
    * Konteynerleştirilmiş dağıtımlar kullanan ortamlar için [Docker imajı](../native-node/docker-image.md)
    * AWS altyapıları için [AWS AMI](../native-node/aws-ami.md)
    * Kubernetes kullanan altyapılar için [Helm chart](../native-node/helm-chart.md)

### 2. Wallarm worker kodunu edinin ve dağıtın

Trafiği Wallarm Node’a yönlendiren bir Cloudflare worker çalıştırmak için:

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** yoluna gidin ve platformunuz için bir kod paketi indirin.

    Kendinden barındırılan node çalıştırıyorsanız, kod paketini almak için sales@wallarm.com ile iletişime geçin.
1. İndirilen kodu kullanarak [Bir Cloudflare worker oluşturun](https://developers.cloudflare.com/workers/get-started/dashboard/).
1. `wallarm_node` parametresinde Wallarm node URL’sini ayarlayın.
1. [Eşzamansız (bant dışı)](../oob/overview.md) mod kullanıyorsanız, `wallarm_mode` parametresini `async` olarak ayarlayın.
1. Gerekirse, [diğer parametreleri](cloudflare.md#configuration-options) değiştirin.

    ![Cloudflare worker](../../images/waf-installation/gateways/cloudflare/worker-deploy.png)
1. **Website** → your domain içinde, **Workers Routes** → **Add route** yoluna gidin:

    * **Route** alanında, Wallarm tarafından analiz edilmek üzere yönlendirilecek yolları belirtin (örn., tüm yollar için `*.example.com/*`).
    * **Worker** alanında, oluşturduğunuz Wallarm worker’ı seçin.

    ![Cloudflare rota ekle](../../images/waf-installation/gateways/cloudflare/add-route.png)

## Test

Dağıtılan çözümün işlevselliğini test etmek için:

1. API’nize test [Yol Geçişi][ptrav-attack-docs] saldırısını içeren isteği gönderin:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinde açın ve saldırının listede görüntülendiğinden emin olun.
    
    ![Arayüzde saldırılar][attacks-in-ui-image]

    Wallarm Node modu [blocking](../../admin-en/configure-wallarm-mode.md) olarak ayarlıysa ve trafik satır içi akıyorsa, istek aynı zamanda engellenecektir.

<a name="configuration-options"></a>
## Yapılandırma seçenekleri

Worker kodunda aşağıdaki parametreleri belirtebilirsiniz:

| Parametre | Açıklama | Gerekli mi? |
| --------- | ----------- | --------- |
| `wallarm_node` | [Wallarm Node örneğinizin](#1-deploy-a-wallarm-node) adresini ayarlar. | Evet |
| `wallarm_mode` | Trafik işleme modunu belirler: Varsayılan `inline`, trafiği doğrudan Wallarm Node üzerinden işlerken, `async` trafiğin orijinal akışını etkilemeden bir [kopyasını](../oob/overview.md) analiz eder. | Hayır |
| `wallarm_send_rsp_body` | Şema [keşfi](../../api-discovery/overview.md) ve [kaba kuvvet](../../admin-en/configuration-guides/protecting-against-bruteforce.md) gibi gelişmiş saldırı tespiti için yanıt gövdesi analizini etkinleştirir. Varsayılan: `true` (etkin). | Hayır |
| `wallarm_response_body_limit` | Node’un ayrıştırıp analiz edebileceği yanıt gövdesi boyutu (bayt cinsinden) sınırı. Varsayılan: `0x4000`. | Hayır |
| `wallarm_block_page.custom_path`<br>(Worker sürüm 1.0.1+) | Node’dan gelen HTTP 403 yanıtlarıyla döndürülen özel engelleme sayfasının URL’si, örn.: `https://example.com/block-page.html`.<br>Varsayılan: `null` (`html_page` `true` ise ayrıntılı, Wallarm tarafından sağlanan hata sayfası kullanılır). | Hayır |
| `wallarm_block_page.html_page`<br>(Worker sürüm 1.0.1+) | Kötü amaçlı istekler için özel bir HTML engelleme sayfasını etkinleştirir. Varsayılan: `false` (basit bir HTTP 403 döndürür). | Hayır |
| `wallarm_block_page.support_email`<br>(Worker sürüm 1.0.1+) | Engelleme sayfasında sorun bildirmek için görüntülenen e-posta. Varsayılan: `support@mycorp.com`. | Evet, `html_page` `true` ise |

??? info "Wallarm tarafından sağlanan hata sayfasını göster"
    HTTP 403 yanıtlarıyla döndürülen, Wallarm tarafından sağlanan hata sayfası aşağıdaki gibidir:

    ![Wallarm engelleme sayfası](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

## Cloudflare worker’ı yükseltme

Dağıtılan Cloudflare worker’ınızı [daha yeni bir sürüme](code-bundle-inventory.md#cloudflare) yükseltmek için:

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** yoluna gidin ve güncellenmiş Wallarm Cloudflare kod paketini indirin.

    Kendinden barındırılan node çalıştırıyorsanız, güncellenmiş kod paketini almak için sales@wallarm.com ile iletişime geçin.
1. Dağıtılmış Cloudflare worker’ınızdaki kodu güncellenmiş paketle değiştirin.

    `wallarm_node`, `wallarm_mode` ve diğer parametreler için mevcut değerleri koruyun.
1. Güncellenmiş işlevleri **Deploy** edin.

Worker yükseltmeleri, özellikle ana sürüm güncellemelerinde, bir Wallarm Node yükseltmesi gerektirebilir. Kendi barındırdığınız Node sürüm notları ve yükseltme talimatları için [Native Node değişiklik günlüğüne](../../updating-migrating/native-node/node-artifact-versions.md) veya [Edge node yükseltme prosedürüne](../security-edge/se-connector.md#upgrading-the-edge-node) bakın. Eski sürümlerin kullanım dışı kalmasını önlemek ve gelecekteki yükseltmeleri kolaylaştırmak için düzenli node güncellemeleri önerilir.