```markdown
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Wallarm Connector for Fastly

[Fastly](https://www.fastly.com/) güçlü bir edge bulut platformudur; İçerik Dağıtım Ağı (CDN) hizmetleri, gerçek zamanlı uygulama teslimi, önbellekleme ve kenarda özel mantık çalıştırmak için Compute@Edge sunar. Wallarm connector ile Fastly üzerinde çalışan API'lerinizi güvence altına alabilirsiniz.

Wallarm'u Fastly connector olarak kullanmak için, **Wallarm Node'u harici olarak dağıtmanız** ve **Wallarm tarafından sağlanan ikili dosyaları kullanarak Fastly Compute servisini çalıştırmanız** gerekmektedir; böylece trafiği analiz için Wallarm Node'a yönlendirebilirsiniz.

Fastly connector, hem [in-line](../inline/overview.md) hem de [out-of-band](../oob/overview.md) trafik akışlarını destekler.

<!-- === "In-line traffic flow"

    If Wallarm is configured to block malicious activity:

    ![Fastly with Wallarm - in-line scheme](../../images/waf-installation/gateways/fastly/fastly-traffic-flow-inline.png)
=== "Out-of-band traffic flow"
    ![Fastly with Wallarm - out-of-band scheme](../../images/waf-installation/gateways/fastly/fastly-traffic-flow-oob.png) -->

## Kullanım Senaryoları

Desteklenen tüm [Wallarm deployment options](../supported-deployment-options.md) arasında, bu çözüm Fastly üzerinden trafik dağıttığınız durumlarda tavsiye edilmektedir.

## Sınırlamalar

* Wallarm kuralı tarafından [Rate limiting](../../user-guides/rules/rate-limiting.md) desteklenmemektedir.
* [Multitenancy](../multi-tenant/overview.md) henüz desteklenmemektedir.

## Gereksinimler

Dağıtıma devam edebilmek için aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* Fastly teknolojilerinin anlaşılması.
* Fastly üzerinden çalışan API'ler veya trafik.
* [Fastly CLI'nin kurulmuş olması](https://www.fastly.com/documentation/reference/tools/cli/#installing).

## Dağıtım

### 1. Bir Wallarm Node Dağıtın

Wallarm Node, gelen trafiği inceleyen, kötü niyetli faaliyetleri tespit eden ve tehditleri azaltmak üzere yapılandırılabilen Wallarm platformunun temel bileşenidir.

Bunu, ihtiyacınız olan kontrol seviyesine bağlı olarak Wallarm tarafından barındırılan veya kendi altyapınızda barındırılan bir şekilde dağıtabilirsiniz.

=== "Edge node"
    Connector için Wallarm tarafından barındırılan node dağıtmak üzere, [talimatları](../se-connector.md) izleyin.
=== "Self-hosted node"
    Kendi barındırdığınız node dağıtımı için bir artefakt seçin ve ekli talimatları izleyin:

    * Bare metal veya VM'lerde Linux altyapıları için [All-in-one installer](../native-node/all-in-one.md)
    * Konteynerleştirilmiş dağıtımları kullanan ortamlar için [Docker image](../native-node/docker-image.md)
    * Kubernetes kullanılan altyapılar için [Helm chart](../native-node/helm-chart.md)

### 2. Wallarm kodunu Fastly üzerinde dağıtın

Fastly’den gelen trafiği Wallarm Node’a yönlendirmek için, uygun Wallarm mantığına sahip bir Fastly Compute servisi dağıtmanız gerekmektedir:

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** yolunu izleyerek Wallarm paketini indirin.

    Eğer self-hosted node kullanıyorsanız, paket için sales@wallarm.com ile iletişime geçin.
1. **Fastly** UI → **Account** → **API tokens** → **Personal tokens** → **Create token** bölümüne gidin:

    * Tür: Automation token
    * Kapsam: Global API erişimi
    * Diğer ayarları, özel bir değişiklik gerekmedikçe varsayılan bırakın

    ![](../../images/waf-installation/gateways/fastly/generate-token.png)
1. **Fastly** UI → **Compute** → **Compute services** → **Create service** → **Use a local project** yolunu izleyerek Wallarm için bir örnek oluşturun.

    Oluşturulduktan sonra, üretilen `--service-id` değerini kopyalayın:

    ![](../../images/waf-installation/gateways/fastly/create-compute-service.png)
1. Wallarm paketini içeren yerel dizine gidin ve dağıtımı gerçekleştirin:

    ```
    fastly compute deploy --service-id=<SERVICE_ID> --package=wallarm-api-security.tar.gz --token=<FASTLY_TOKEN>
    ```

    Başarı mesajı:

    ```
    SUCCESS: Deployed package (service service_id, version 1)
    ```

    ??? warning "Error reading fastly.toml"
        Aşağıdaki hatayı alırsanız:

        ```
        ✗ Verifying fastly.toml

        ERROR: error reading fastly.toml.
        ```

        Sağlanan `fastly compute deploy` komutunu, `fastly compute publish` yerine kullandığınızdan emin olun.

### 3. Wallarm Node’un ve arka uç sunucusunun hostlarını belirtin

Analiz ve iletim için düzgün trafik yönlendirmesi yapabilmek adına, Fastly servis yapılandırmasında Wallarm Node ve arka uç sunucu hostlarını tanımlamanız gerekmektedir:

1. **Fastly** UI → **Compute** → **Compute services** → Wallarm servisine gidin → **Edit configuration** bölümüne geçin.
1. **Origins** kısmına gidin ve **Create hosts** seçeneğini kullanın:

    * Trafiğin analiz için Wallarm Node’a yönlendirilmesi amacıyla, [Wallarm Node adresini](#1-deploy-a-wallarm-node) `wallarm-node` hostu olarak ekleyin.
    * Node’dan orijinal arka uca trafik iletimi için, arka uç adresinizi başka bir host (örneğin, `backend`) olarak ekleyin.

    ![](../../images/waf-installation/gateways/fastly/hosts.png)
1. Yeni servis versiyonunu **Activate** edin.

### 4. Wallarm config store’u oluşturun

Wallarm’a özgü ayarları tanımlayan `wallarm_config` konfigürasyonunu oluşturun:

1. **Fastly** UI → **Resources** → **Config stores** → **Create a config store** yolunu izleyerek, aşağıdaki anahtar-değer çiftleriyle `wallarm_config` store’unu oluşturun:

    | Parameter | Açıklama | Zorunlu mu? |
    | --------- | ----------- | --------- |
    | `WALLARM_BACKEND` | Compute servis ayarlarında belirtilen [Wallarm Node instance](#1-deploy-a-wallarm-node) için host adı. | Evet |
    | `ORIGIN_BACKEND` | Compute servis ayarlarında belirtilen arka uç için host adı. | Evet |
    | `WALLARM_MODE_ASYNC` | Trafiğin kopyasını analiz ederken orijinal akışı etkilemeden (`true`) veya inline analiz (`false`, varsayılan) yapar. | Hayır |
    | `WALLARM_DEBUG` | Hata ayıklama bilgilerini loglamayı etkinleştirir (`true`) veya devre dışı bırakır (`false`, varsayılan). | Hayır |
    | `WALLARM_RESPONSE_BODY_SIZE_LIMIT` | Node’un analiz edip işleyebileceği yanıt gövdesi boyut limiti (bayt cinsinden). `none` gibi sayısal olmayan ifadeler (varsayılan) limitsiz demektir. | Hayır |
    | `ORIGIN_PASS_CACHE` | Fastly’nin önbellek katmanını atlayarak istekleri arka uca iletmek için zorunlu geçiş davranışı sağlar (`true`). Varsayılan olarak Fastly’nin önbellek katmanı kullanılır (`false`). | Hayır |
    | `ORIGIN_PRESERVE_HOST` | İstemci isteğindeki orijinal `Host` başlığını, arka uç sunucusunun hostname’i ile değiştirmek yerine korur. Rotalama veya loglama için orijinal `Host` bilgisine ihtiyaç duyan arka uçlar için yararlıdır. Varsayılan: `false`. | Hayır |
    | `LOGGING_ENDPOINT` | Connector için bir [logging endpoint](https://www.fastly.com/documentation/guides/integrations/logging/) belirler. Varsayılan: loglar (stderr). | Hayır |

1. Config store’u Wallarm Compute servisine **Link** edin.

![](../../images/waf-installation/gateways/fastly/config-store.png)

!!! info "Birden fazla servis ile config store paylaşımı"
    Birden fazla Wallarm Compute servisi çalıştırıyorsanız, `wallarm_config` tüm servisler arasında paylaşılır. Dolayısıyla, tüm servislerin aynı origin backend adını kullanması gerekir; ancak gerçek backend değeri her servisin ayarlarında özelleştirilebilir.

### 5. (Opsiyonel) Özel bir engelleme sayfası oluşturun

Wallarm Node inline modda çalışırken ve [saldırıları engelliyorsa](../../admin-en/configure-wallarm-mode.md), kötü niyetli isteklere HTTP 403 durum kodu ile yanıt verir. Yanıtı özelleştirmek için, Fastly’de KV store kullanarak özel bir HTML engelleme sayfası yapılandırabilirsiniz:

1. **Fastly** UI → **Resources** → **KV stores** → **Create a KV store** yolunu izleyerek `wallarm` adlı bir KV store oluşturun.
1. `block_page.html` adında bir anahtar ekleyin ve özel HTML engelleme sayfanızı yükleyin. Bu sayfa, engellenen isteklere dönecektir.
1. KV store’u Wallarm Compute servisine **Link** edin.

![](../../images/waf-installation/gateways/fastly/custom-block-page.png)

??? info "Özel engelleme sayfası için Wallarm şablonunu göster"
    Başlangıç noktası olarak, özel bir engelleme sayfası için Wallarm tarafından sağlanan aşağıdaki şablonu kullanabilirsiniz. İstediğiniz bilgileri gösterecek şekilde ve tasarımınıza uygun olarak düzenleyin:

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
            // Place your support email here
            const SUPPORT_EMAIL = "";
        </script>
    </head>

    <body>
        <div class="content">
            <div id="logo" class="logo">
                <!--
                    Place you logo here.
                    You can use an external image:
                    <img src="https://example.com/logo.png" width="160" alt="Company Name" />
                    Or put your logo source code (like svg) right here:
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
            // Warning: ES5 code only

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

## Test Etme

Dağıtılan çözümün işleyişini test etmek için aşağıdaki adımları izleyin:

1. Wallarm Compute servisi domainine [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl http://<WALLARM_FASTLY_SERVICE>/etc/passwd
    ```
1. Wallarm Console → **Attacks** bölümüne gidin (US Cloud için [https://us1.my.wallarm.com/attacks](https://us1.my.wallarm.com/attacks) veya EU Cloud için [https://my.wallarm.com/attacks](https://my.wallarm.com/attacks)) ve saldırının listede gösterildiğinden emin olun.
    
    ![Attacks in the interface][attacks-in-ui-image]

    Eğer Wallarm Node modu [blocking](../../admin-en/configure-wallarm-mode.md) olarak ayarlandıysa ve trafik inline akıyorsa, istek de engellenecektir.

## Fastly üzerindeki Wallarm Compute servisini güncelleme

Dağıtılan Fastly Compute servisini [yeni bir sürüme](code-bundle-inventory.md#fastly) güncellemek için:

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** yolunu izleyerek güncellenmiş kod paketini indirin.

    Eğer self-hosted node kullanıyorsanız, güncellenmiş kod paketi için sales@wallarm.com ile iletişime geçin.
1. Güncellenmiş `wallarm-api-security.tar.gz` Wallarm paket arşivini içeren dizine gidin ve şu komutu çalıştırın:

    ```
    fastly compute deploy --service-id=<SERVICE_ID> --package=wallarm-api-security.tar.gz --token=<FASTLY_TOKEN>
    ```

    * `<SERVICE_ID>`: Dağıtılmış Wallarm servisi ID’niz.
    * `<FASTLY_TOKEN>`: Dağıtım için kullanılan Fastly API token’ınız.
1. Fastly UI üzerinden yeni servis versiyonunu **Activate** edin.

Compute servis güncellemeleri, özellikle büyük sürüm geçişlerinde Wallarm Node güncellemesi gerektirebilir. Sürüm güncellemeleri ve yükseltme talimatları için [Wallarm Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md) bölümüne bakın. Gelecekteki yükseltmeleri kolaylaştırmak ve eskimeyi önlemek adına düzenli node güncellemeleri yapılması önerilir.
```