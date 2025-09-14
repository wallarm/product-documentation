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

# Fastly için Wallarm Bağlayıcısı

[Fastly](https://www.fastly.com/), İçerik Dağıtım Ağı (CDN) hizmetleri, gerçek zamanlı uygulama teslimi, önbellekleme ve uçta özel mantık çalıştırmak için Compute@Edge sunan güçlü bir edge bulut platformudur. Wallarm bağlayıcısı ile Fastly üzerinde çalışan API’leri güvenceye alabilirsiniz.

Wallarm’ı bir Fastly bağlayıcısı olarak kullanmak için, trafiği analiz için Wallarm Node’a yönlendirmek üzere, **Wallarm Node’u harici olarak dağıtmanız** ve **Wallarm tarafından sağlanan ikilileri kullanarak bir Fastly Compute hizmeti çalıştırmanız** gerekir.

Fastly bağlayıcısı hem [in-line](../inline/overview.md) hem de [out-of-band](../oob/overview.md) trafik akışlarını destekler.

<!-- === "In-line traffic flow"

    If Wallarm is configured to block malicious activity:

    ![Fastly with Wallarm - in-line scheme](../../images/waf-installation/gateways/fastly/fastly-traffic-flow-inline.png)
=== "Out-of-band traffic flow"
    ![Fastly with Wallarm - out-of-band scheme](../../images/waf-installation/gateways/fastly/fastly-traffic-flow-oob.png) -->

## Kullanım senaryoları

Bu çözüm, trafiği Fastly üzerinden ilettiğiniz durumlarda önerilir.

## Sınırlamalar

* [Helm chart][helm-chart-native-node] kullanarak `LoadBalancer` türünde Wallarm hizmeti dağıtılırken, Node örneği alan adı için **güvenilir** bir SSL/TLS sertifikası gereklidir. Öz imzalı sertifikalar henüz desteklenmemektedir.
* Wallarm kuralı ile [Oran sınırlaması][rate-limiting] desteklenmez.
* [Çok kiracılık][multi-tenancy] henüz desteklenmiyor.

## Gereksinimler

Dağıtıma devam etmeden önce aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* Fastly teknolojilerine hakimiyet.
* Fastly üzerinden akan API’ler veya trafik.
* [Fastly CLI kurulu](https://www.fastly.com/documentation/reference/tools/cli/#installing).

## Dağıtım

### 1. Bir Wallarm Node’u dağıtın

Wallarm Node, dağıtmanız gereken Wallarm platformunun çekirdek bileşenidir. Gelen trafiği inceler, kötü niyetli aktiviteleri tespit eder ve tehditleri azaltacak şekilde yapılandırılabilir.

Gerektiğiniz kontrol seviyesine bağlı olarak, Wallarm tarafından barındırılmış şekilde veya kendi altyapınızda dağıtabilirsiniz.

=== "Edge düğümü"
    Bağlayıcı için Wallarm tarafından barındırılan bir düğüm dağıtmak üzere [talimatları](../security-edge/se-connector.md) izleyin.
=== "Kendi barındırılan düğüm"
    Kendi barındırılan bir düğüm dağıtımı için bir yapıt seçin ve iliştirilmiş talimatları izleyin:

    * Bare metal veya VM’lerdeki Linux altyapıları için [Hepsi bir arada yükleyici](../native-node/all-in-one.md)
    * Konteynerleştirilmiş dağıtımlar kullanan ortamlar için [Docker imajı](../native-node/docker-image.md)
    * AWS altyapıları için [AWS AMI](../native-node/aws-ami.md)
    * Kubernetes kullanan altyapılar için [Helm chart](../native-node/helm-chart.md)

### 2. Fastly üzerinde Wallarm kodunu dağıtın

Fastly’den Wallarm Node’a trafiği yönlendirmek için, ilgili Wallarm mantığını içeren bir Fastly Compute hizmeti dağıtmanız gerekir:

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** bölümüne gidip Wallarm paketini indirin.

    Kendi barındırdığınız düğümü çalıştırıyorsanız, paketi almak için sales@wallarm.com ile iletişime geçin.
1. **Fastly** UI → **Account** → **API tokens** → **Personal tokens** → **Create token** yoluna gidin:

    * Type: Automation token
    * Scope: Global API access
    * Özel değişiklikler gerekmiyorsa diğer ayarları varsayılan halinde bırakın

    ![](../../images/waf-installation/gateways/fastly/generate-token.png)
1. **Fastly** UI → **Compute** → **Compute services** → **Create service** → **Use a local project** yoluna gidin ve Wallarm için bir örnek oluşturun.

    Oluşturulduktan sonra, üretilen `--service-id` değerini kopyalayın:

    ![](../../images/waf-installation/gateways/fastly/create-compute-service.png)
1. Wallarm paketini içeren yerel dizine gidin ve dağıtın:

    ```
    fastly compute deploy --service-id=<SERVICE_ID> --package=wallarm-api-security.tar.gz --token=<FASTLY_TOKEN>
    ```

    Başarı mesajı:

    ```
    SUCCESS: Deployed package (service service_id, version 1)
    ```

    ??? warning "fastly.toml okunurken hata"
        Aşağıdaki hatayı alırsanız:

        ```
        ✗ Verifying fastly.toml

        ERROR: error reading fastly.toml.
        ```

        `fastly compute publish` yerine sağlanan `fastly compute deploy` komutunu kullandığınızdan emin olun.

### 3. Wallarm Node’un ve arka ucun hostlarını belirtin

Analiz ve iletim için doğru trafik yönlendirmesi amacıyla, Fastly hizmeti yapılandırmasında Wallarm Node ve arka uç hostlarını tanımlamanız gerekir:

1. **Fastly** UI → **Compute** → **Compute services** → Wallarm service → **Edit configuration** yoluna gidin.
1. **Origins** bölümüne gidin ve **Create hosts**:

    * Analiz için trafiği Wallarm node’una yönlendirmek üzere `wallarm-node` host’u olarak Wallarm node URL’sini ekleyin.
    * Düğümden gelen trafiği kaynak arka ucunuza iletmek için arka uç adresinizi başka bir host (ör. `backend`) olarak ekleyin.

    ![](../../images/waf-installation/gateways/fastly/hosts.png)
1. Yeni hizmet sürümünü **Activate** edin.

### 4. Wallarm config store oluşturun

Wallarm’a özel ayarları tanımlayan `wallarm_config` yapılandırmasını oluşturun:

1. **Fastly** UI → **Resources** → **Config stores** → **Create a config store** yoluna gidin ve aşağıdaki anahtar-değer öğeleriyle `wallarm_config` deposunu oluşturun:

    | Parametre | Açıklama | Gerekli mi? |
    | --------- | -------- | ----------- |
    | `WALLARM_BACKEND` | Compute hizmeti ayarlarında belirtilen Wallarm Node örneği için ana makine adı. | Evet |
    | `ORIGIN_BACKEND` | Compute hizmeti ayarlarında belirtilen arka uç için ana makine adı. | Evet |
    | `WALLARM_MODE_ASYNC` | Orijinal akışı etkilemeden trafiğin [kopya](../oob/overview.md) analizi (`true`) veya satır içi analiz (`false`, varsayılan). | Hayır |

    [Daha fazla parametre](fastly.md#configuration-options)
1. Config store’u Wallarm Compute hizmetine **Link** edin.

![](../../images/waf-installation/gateways/fastly/config-store.png)

!!! info "Birden çok hizmet için Config stores"
    Wallarm için birden fazla Compute services çalıştırıyorsanız, aşağıdakilerden birini yapabilirsiniz:
    
    * Farklı yapılandırmalara sahip birden çok config store oluşturup her birini ilgili hizmete bağlayın.
    * Aynı config store’u (örneğin, `wallarm_config`) birden çok hizmet arasında paylaşın. Tüm hizmetlerin aynı origin backend adını kullanması gerektiğini, ancak gerçek backend değerinin her hizmetin ayarlarında özelleştirilebileceğini unutmayın.

### 5. (İsteğe bağlı) Özel bir engelleme sayfası ayarlayın

Wallarm Node satır içi modda çalışırken ve saldırıları [engellediğinde](../../admin-en/configure-wallarm-mode.md), kötü amaçlı isteklere HTTP 403 durum kodları ile yanıt verir. Yanıtı özelleştirmek için, Fastly’de bir KV store kullanarak özel bir HTML engelleme sayfası yapılandırabilirsiniz:

1. **Fastly** UI → **Resources** → **KV stores** → **Create a KV store** yoluna gidin ve `wallarm` adında bir store oluşturun.
1. `block_page.html` adında bir anahtar ekleyin ve özel HTML engelleme sayfanızı yükleyin. Bu sayfa, engellenen isteklere döndürülecektir.
1. KV store’u Wallarm Compute hizmetine **Link** edin.

![](../../images/waf-installation/gateways/fastly/custom-block-page.png)

??? info "Özel bir engelleme sayfası için Wallarm şablonunu göster"
    Başlangıç noktası olarak, özel bir engelleme sayfası için aşağıdaki Wallarm tarafından sağlanan şablonu kullanabilirsiniz. Kullanıcılara göstermek istediğiniz bilgileri içerecek ve istediğiniz tasarımla eşleşecek şekilde gerektiği gibi uyarlayın:

    ```html
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>You are blocked</title>
        <link href="https://fonts.googleapis.com/css?family=Poppins:700|Roboto|Roboto+Mono&display=swap" rel="stylesheet">
        <style>
            html {
                font-family: 'Roboto', sans-serif;
            }

            body {
                margin: 0;
                height: 100vh;
            }

            .content {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                min-height: 100%;
            }

            .logo {
                margin-top: 32px;
            }

            .message {
                display: flex;
                margin-bottom: 100px;
            }

            .alert {
                padding-top: 20px;
                width: 246px;
                text-align: center;
            }

            .alert-title {
                font-family: 'Poppins', sans-serif;
                font-weight: bold;
                font-size: 24px;
                line-height: 32px;
            }

            .alert-desc {
                font-size: 14px;
                line-height: 20px;
            }

            .info {
                margin-left: 76px;
                border-left: 1px solid rgba(149, 157, 172, 0.24);
                padding: 20px 0 20px 80px;
                width: 340px;
            }

            .info-title {
                font-weight: bold;
                font-size: 20px;
                line-height: 28px;
            }

            .info-text {
                margin-top: 8px;
                font-size: 14px;
                line-height: 20px;
            }

            .info-divider {
                margin-top: 16px;
            }

            .info-data {
                margin-top: 12px;
                border: 1px solid rgba(149, 157, 172, 0.24);
                border-radius: 4px;
                padding: 9px 12px;
                font-size: 14px;
                line-height: 20px;
                font-family: 'Roboto Mono', monospace;
            }

            .info-copy {
                margin-top: 12px;

                padding: 6px 12px;
                border: none;
                outline: none;
                background: rgba(149, 157, 172, 0.08);
                cursor: pointer;
                transition: 0.24s cubic-bezier(0.24, 0.1, 0.24, 1);
                border-radius: 4px;

                font-size: 14px;
                line-height: 20px;
            }

            .info-copy:hover {
                background-color: rgba(149, 157, 172, 0.24);
            }

            .info-copy:active {
                background-color: rgba(149, 157, 172, 0.08);
            }

            .info-mailto,
            .info-mailto:visited {
                color: #fc7303;
            }
        </style>
        <script>
            // Destek e-posta adresinizi buraya yerleştirin
            const SUPPORT_EMAIL = "";
        </script>
    </head>

    <body>
        <div class="content">
            <div id="logo" class="logo">
                <!--
                    Logonuzu buraya yerleştirin.
                    Harici bir resim kullanabilirsiniz:
                    <img src="https://example.com/logo.png" width="160" alt="Company Name" />
                    Ya da logo kaynak kodunuzu (örneğin svg) doğrudan buraya koyabilirsiniz:
                    <svg width="160" height="80"> ... </svg>
                -->
            </div>

            <div class="message">
                <div class="alert">
                    <svg width="207" height="207" viewBox="0 0 207 207" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M88.7512 33.2924L15.6975 155.25C14.1913 157.858 13.3943 160.816 13.3859 163.828C13.3775 166.84 14.1579 169.801 15.6494 172.418C17.141 175.035 19.2918 177.216 21.8877 178.743C24.4837 180.271 27.4344 181.092 30.4462 181.125H176.554C179.566 181.092 182.516 180.271 185.112 178.743C187.708 177.216 189.859 175.035 191.351 172.418C192.842 169.801 193.623 166.84 193.614 163.828C193.606 160.816 192.809 157.858 191.303 155.25L118.249 33.2924C116.711 30.7576 114.546 28.6618 111.963 27.2074C109.379 25.7529 106.465 24.9888 103.5 24.9888C100.535 24.9888 97.6206 25.7529 95.0372 27.2074C92.4538 28.6618 90.2888 30.7576 88.7512 33.2924V33.2924Z"
                            stroke="#F24444" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M103.5 77.625V120.75" stroke="#F24444" stroke-width="16" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M103.5 146.625V146.668" stroke="#F24444" stroke-width="16" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    <div class="alert-title">Malicious activity blocked</div>
                    <div class="alert-desc">Your request is blocked since it was identified as a malicious one.</div>
                </div>
                <div class="info">
                    <div class="info-title">Why it happened</div>
                    <div class="info-text">
                        You might have used symbols similar to a malicious code sequence, or uploaded a specific file.
                    </div>

                    <div class="info-divider"></div>

                    <div class="info-title">What to do</div>
                    <div class="info-text">
                        If your request is considered to be legitimate, please <a id="mailto" href="" class="info-mailto">contact us</a> and provide your last action description and the following data:
                    </div>

                    <div id="data" class="info-data">
                        IP ${remote_addr}<br />
                        Blocked on ${time_iso8601}<br />
                        UUID ${request_id}
                    </div>

                    <button id="copy-btn" class="info-copy">
                        Copy details
                    </button>
                </div>
            </div>
            <div></div>
        </div>
        <script>
            // Uyarı: Yalnızca ES5 kodu

            function writeText(str) {
                const range = document.createRange();

                function listener(e) {
                    e.clipboardData.setData('text/plain', str);
                    e.preventDefault();
                }

                range.selectNodeContents(document.body);
                document.getSelection().addRange(range);
                document.addEventListener('copy', listener);
                document.execCommand('copy');
                document.removeEventListener('copy', listener);
                document.getSelection().removeAllRanges();
            }

            function copy() {
                const text = document.querySelector('#data').innerText;

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    return navigator.clipboard.writeText(text);
                }

                return writeText(text);
            }

            document.querySelector('#copy-btn').addEventListener('click', copy);

            const mailto = document.getElementById('mailto');
            if (SUPPORT_EMAIL) mailto.href = `mailto:${wallarm_dollar}{SUPPORT_EMAIL}`;
            else mailto.replaceWith(mailto.textContent);
        </script>
    </body>
    ```

## Test

Dağıtılan çözümün işlevselliğini test etmek için şu adımları izleyin:

1. Wallarm Compute hizmeti alan adına test [Yol Geçişi (Path Traversal)][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl http://<WALLARM_FASTLY_SERVICE>/etc/passwd
    ```
1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içinde açın ve saldırının listede görüntülendiğinden emin olun.
    
    ![Arayüzde saldırılar][attacks-in-ui-image]

    Wallarm Node modu [engelleme](../../admin-en/configure-wallarm-mode.md) olarak ayarlandıysa ve trafik in-line akıyorsa, istek de engellenecektir.

## Yapılandırma seçenekleri

Wallarm config store içinde aşağıdaki anahtar-değer öğelerini belirtebilirsiniz:

| Parametre | Açıklama | Gerekli mi? |
| --------- | -------- | ----------- |
| `WALLARM_BACKEND` | Compute hizmeti ayarlarında belirtilen Wallarm Node örneği için ana makine adı. | Evet |
| `ORIGIN_BACKEND` | Compute hizmeti ayarlarında belirtilen arka uç için ana makine adı. | Evet |
| `WALLARM_MODE_ASYNC` | Orijinal akışı etkilemeden trafiğin [kopya](../oob/overview.md) analizi (`true`) veya satır içi analiz (`false`, varsayılan). | Hayır |
| `WALLARM_DEBUG` | Hata ayıklama bilgilerini tailing loglara yazar (`true`) veya devre dışı bırakır (`false`, varsayılan). | Hayır |
| `WALLARM_RESPONSE_BODY_SIZE_LIMIT` | Node’un ayrıştırıp analiz edebileceği yanıt gövdesi boyutu sınırı (bayt cinsinden). `none` (varsayılan) gibi sayısal olmayan değerler sınır olmadığı anlamına gelir. | Hayır |
| `ORIGIN_PASS_CACHE` | Fastly’nin önbellekleme katmanı atlanarak, origin backend’e gönderilen istekler için doğrudan iletme davranışını zorlar (`true`). Varsayılan olarak Fastly’nin önbellekleme katmanı kullanılır (`false`). | Hayır |
| `ORIGIN_PRESERVE_HOST` | `Host` başlığını origin backend’in ana makine adı ile `X-Forwarded-Host` başlığı üzerinden değiştirmek yerine istemci isteğindeki orijinal `Host` başlığını korur. Orijinal `Host`’a dayanan yönlendirme veya günlükleme yapan arka uçlar için yararlıdır. Varsayılan: `false`. | Hayır |
| `LOGGING_ENDPOINT` | Bağlayıcı için bir [logging endpoint](https://www.fastly.com/documentation/guides/integrations/logging/) ayarlar. Varsayılan: tailing loglar (stderr). | Hayır |

## Fastly üzerindeki Wallarm Compute hizmetini yükseltme

Dağıtılmış Fastly Compute hizmetini [daha yeni bir sürüme](code-bundle-inventory.md#fastly) yükseltmek için:

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** bölümüne gidin ve güncellenmiş kod paketini indirin.

    Kendi barındırdığınız düğümü çalıştırıyorsanız, güncellenmiş kod paketini almak için sales@wallarm.com ile iletişime geçin.
1. Güncellenmiş `wallarm-api-security.tar.gz` Wallarm paket arşivinin bulunduğu dizine gidin ve şunu çalıştırın:

    ```
    fastly compute deploy --service-id=<SERVICE_ID> --package=wallarm-api-security.tar.gz --token=<FASTLY_TOKEN>
    ```

    * `<SERVICE_ID>`: Dağıttığınız Wallarm hizmetinin kimliği.
    * `<FASTLY_TOKEN>`: Dağıtımda kullanılan Fastly API belirteci.
1. Fastly UI içinde yeni hizmet sürümünü **Activate** edin.

Compute service yükseltmeleri, özellikle majör sürüm güncellemelerinde, bir Wallarm Node yükseltmesi gerektirebilir. Kendi barındırılan Node sürüm notları ve yükseltme talimatları için [Native Node değişiklik günlüğüne](../../updating-migrating/native-node/node-artifact-versions.md) veya [Edge bağlayıcı yükseltme prosedürüne](../security-edge/se-connector.md#upgrading-the-edge-node) bakın. Eskimeyi önlemek ve gelecekteki yükseltmeleri kolaylaştırmak için düzenli node güncellemeleri önerilir.