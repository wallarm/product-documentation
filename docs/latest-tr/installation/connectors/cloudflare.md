[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Wallarm Connector for Cloudflare

[Cloudflare](https://www.cloudflare.com/) güvenlik ve performans hizmetidir. Bu hizmet; CDN, WAF, DNS hizmetleri ve SSL/TLS şifreleme gibi, web sitelerinin ve internet uygulamalarının güvenliğini, hızını ve güvenilirliğini artırmaya yönelik özellikler sunar. Wallarm, Cloudflare üzerinde çalışan API'leri korumak için bir connector görevi görebilir.

Cloudflare için Wallarm'ı bir connector olarak kullanmak için, **Wallarm Node’u dışarıda konuşlandırmanız** ve trafiği analiz için Wallarm tarafından sağlanan kodu kullanarak Cloudflare worker’ı çalıştırıp Wallarm Node’a yönlendirmeniz gerekir.

<a name="cloudflare-modes"></a> Cloudflare connector, her iki [in-line](../inline/overview.md) ve [out-of-band](../oob/overview.md) trafik akışını destekler:

=== "In-line traffic flow"

    Eğer Wallarm, kötü niyetli etkinlikleri engelleyecek şekilde yapılandırılmışsa:

    ![Cloudflare with Wallarm - in-line scheme](../../images/waf-installation/gateways/cloudflare/cloudflare-traffic-flow-inline.png)
=== "Out-of-band traffic flow"
    ![Cloudflare with Wallarm - out-of-band scheme](../../images/waf-installation/gateways/cloudflare/cloudflare-traffic-flow-oob.png)

## Use cases

Desteklenen tüm [Wallarm deployment options](../supported-deployment-options.md) arasında, uygulamalarınıza Cloudflare üzerinden erişim sağladığınız durumlarda bu çözüm önerilir.

## Limitations

* Wallarm kuralı tarafından uygulanan [Rate limiting](../../user-guides/rules/rate-limiting.md) desteklenmemektedir.
* [Multitenancy](../multi-tenant/overview.md) henüz desteklenmemektedir.

## Requirements

Dağıtım işlemine devam etmeden önce, aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* Cloudflare teknolojilerini anlama.
* Cloudflare üzerinden çalışan API'ler veya trafik.

## Deployment

### 1. Deploy a Wallarm Node

Wallarm Node, dağıtmanız gereken Wallarm platformunun temel bileşenidir. Gelen trafiği inceler, kötü niyetli etkinlikleri tespit eder ve tehditleri azaltmak için yapılandırılabilir.

Wallarm Node’u, ihtiyaç duyduğunuz kontrol seviyesine bağlı olarak Wallarm tarafından barındırılan ya da kendi altyapınızda konuşlandırabilirsiniz.

=== "Edge node"
    Bağlayıcı için Wallarm tarafından barındırılan bir node’u konuşlandırmak için [talimatları](../se-connector.md) izleyin.
=== "Self-hosted node"
    Self-hosted node dağıtımı için bir artefakt seçin ve ekli talimatları izleyin:

    * Bare metal veya sanal makinelerdeki Linux altyapıları için [All-in-one installer](../native-node/all-in-one.md)
    * Konteynerleştirilmiş dağıtımlar kullanan ortamlar için [Docker image](../native-node/docker-image.md)
    * Kubernetes kullanan altyapılar için [Helm chart](../native-node/helm-chart.md)

### 2. Obtain and deploy the Wallarm worker code

Wallarm Node’a trafiği yönlendiren bir Cloudflare worker çalıştırmak için:

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** bölümüne gidin ve platformunuz için bir kod paketi indirin.

    Eğer self-hosted bir node kullanıyorsanız, kod paketini almak için sales@wallarm.com ile iletişime geçin.
1. İndirdiğiniz kodu kullanarak bir [Cloudflare worker](https://developers.cloudflare.com/workers/get-started/dashboard/) oluşturun.
1. `wallarm_node` parametresine, [Wallarm Node instance](#1-deploy-a-wallarm-node) adresinizi ayarlayın.
1. Gerekirse, [diğer parametreleri](#configuration-options) değiştirin.

    ![Cloudflare worker](../../images/waf-installation/gateways/cloudflare/worker-deploy.png)
1. **Website** → kendi domaininizde, **Workers Routes** → **Add route** bölümüne gidin:

    * **Route** alanında, analiz için Wallarm’a yönlendirilecek yolları belirtin (ör. tüm yollar için `*.example.com/*`).
    * **Worker** alanında, oluşturduğunuz Wallarm worker’ı seçin.

    ![Cloudflare add route](../../images/waf-installation/gateways/cloudflare/add-route.png)

## Testing

Dağıtılan çözümün işlevselliğini test etmek için, aşağıdaki adımları takip edin:

1. API'nize, test [Path Traversal][ptrav-attack-docs] saldırısını içeren isteği gönderin:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinden açın ve saldırının listede görüntülendiğinden emin olun.
    
    ![Attacks in the interface][attacks-in-ui-image]

    Eğer Wallarm Node modu [blocking](../../admin-en/configure-wallarm-mode.md) olarak ayarlandıysa ve trafik in-line akışındaysa, istek de engellenecektir.

## Configuration options

Worker kodunda, aşağıdaki parametreleri belirtebilirsiniz:

| Parametre | Açıklama | Gerekli? |
| --------- | ----------- | --------- |
| `wallarm_node` | [Wallarm Node instance](#1-deploy-a-wallarm-node) adresinizi ayarlar. | Evet |
| `wallarm_mode` | Trafik işleme modunu belirler: Varsayılan `inline` modu trafiği doğrudan Wallarm Node üzerinden işlerken, `async` modu orijinal akışı etkilemeden trafiğin bir [kopyasını](../oob/overview.md) analiz eder. | Hayır |
| `wallarm_send_rsp_body` | Şema [discovery](../../api-discovery/overview.md) ve [brute force](../../admin-en/configuration-guides/protecting-against-bruteforce.md) gibi gelişmiş saldırı tespiti için response body analizini etkinleştirir. Varsayılan: `true` (etkin). | Hayır |
| `wallarm_response_body_limit` | Node'un ayrıştırıp analiz edebileceği response body boyutunun (bayt cinsinden) sınırı. Varsayılan: `0x4000`. | Hayır |
| `wallarm_block_page.custom_path`<br>(Worker version 1.0.1+) | Node tarafından HTTP 403 yanıtlarında döndürülen, örneğin: `https://example.com/block-page.html` gibi özel engelleme sayfasının URL'si.<br>Varsayılan: `null` (eğer `html_page` `true` ise detaylı Wallarm tarafından sağlanan hata sayfası kullanılır). | Hayır |
| `wallarm_block_page.html_page`<br>(Worker version 1.0.1+) | Kötü niyetli istekler için özel HTML engelleme sayfasını etkinleştirir. Varsayılan: `false` (basit bir HTTP 403 döner). | Hayır |
| `wallarm_block_page.support_email`<br>(Worker version 1.0.1+) | Sorun bildirmek için engelleme sayfasında görüntülenen e-posta. Varsayılan: `support@mycorp.com`. | Evet, eğer `html_page` `true` ise |

??? info "Show Wallarm-provided error page"
    HTTP 403 yanıtlarında döndürülen Wallarm tarafından sağlanan hata sayfası aşağıdaki gibidir:

    ![Wallarm blocking page](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

## Upgrading the Cloudflare worker

Dağıtılmış Cloudflare worker'ını [yeni bir sürüme](code-bundle-inventory.md#cloudflare) güncellemek için:

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** bölümüne gidin ve güncellenmiş Wallarm Cloudflare kod paketini indirin.

    Eğer self-hosted node kullanıyorsanız, güncellenmiş kod paketini almak için sales@wallarm.com ile iletişime geçin.
1. Dağıtılmış Cloudflare worker'ınızdaki kodu, güncellenmiş paket ile değiştirin.

    `wallarm_node`, `wallarm_mode` ve benzeri parametrelerin mevcut değerlerini koruyun.
1. **Deploy** edin.

Worker güncellemeleri, özellikle büyük sürüm güncellemelerinde, Wallarm Node güncellemesi gerektirebilir. Sürüm güncellemeleri ve yükseltme talimatları için [Wallarm Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md)'a bakın. Gelecekteki yükseltmeleri kolaylaştırmak ve kullanım dışı bırakmayı önlemek için düzenli node güncellemeleri önerilir.