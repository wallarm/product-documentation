# Engelleme sayfası ve hata kodunun yapılandırılması (NGINX)

Bu talimatlar, engellenen isteklere verilen yanıtta döndürülen engelleme sayfasını ve hata kodunu özelleştirme yöntemini açıklar. Yapılandırma yalnızca self-hosted NGINX Node'ları için geçerlidir.

Özel engelleme sayfası, aşağıdaki nedenlerle engellenen isteklere yanıt olarak döndürülür:

* İstek aşağıdaki türlerde kötü amaçlı payload içerir: [girdi doğrulama saldırıları](../../attacks-vulns-list.md#attack-types), [vpatch saldırıları](../../user-guides/rules/vpatch-rule.md) veya [düzenli ifadelere dayalı tespit edilen saldırılar](../../user-guides/rules/regex-rule.md).
* Yukarıdaki listeden kötü amaçlı payload içeren istek [graylisted IP address](../../user-guides/ip-lists/overview.md) üzerinden gelmiştir ve node, istekleri güvenli engelleme [mode](../configure-wallarm-mode.md) ayarında filtrelemektedir.
* İstek [denylisted IP address](../../user-guides/ip-lists/overview.md) üzerinden gelmiştir.

## Yapılandırma kısıtlamaları

Engelleme sayfası ve hata kodunun yapılandırılması self-hosted NGINX tabanlı Wallarm node dağıtımlarında desteklenir, ancak Native Node’da desteklenmez.

## Yapılandırma yöntemleri

Varsayılan olarak, 403 yanıt kodu ve varsayılan NGINX engelleme sayfası istemciye döndürülür. Varsayılan ayarları aşağıdaki NGINX yönergelerini kullanarak değiştirebilirsiniz:

* `wallarm_block_page`
* `wallarm_block_page_add_dynamic_path`

### NGINX yönergesi `wallarm_block_page`

Engelleme sayfasını ve hata kodunu, `wallarm_block_page` NGINX yönergesine aşağıdaki parametreleri geçirerek yapılandırabilirsiniz:

* Engelleme sayfasının HTM veya HTML dosyasının yolu. Yolu, özel bir engelleme sayfasına veya Wallarm tarafından sağlanan [örnek engelleme sayfasına](#customizing-sample-blocking-page) belirtebilirsiniz.
* Engellenen bir isteğe yanıt olarak döndürülecek mesajın metni.
* İstemci yönlendirmesi için URL.
* `response_code`: yanıt kodu.
* `type`: belirtilen yapılandırmanın hangi engellenen istek türü için döndürülmesi gerektiği. Parametre aşağıdaki listeden bir veya birden fazla (virgülle ayrılmış) değer alır:

    * Varsayılan `attack`: istekleri engelleme veya güvenli engelleme [mode](../configure-wallarm-mode.md) ayarında filtrelerken filtering node tarafından engellenen istekler için.
    * `acl_ip`: [denylist](../../user-guides/ip-lists/overview.md)'e tek bir nesne veya alt ağ olarak eklenmiş IP adreslerinden gelen istekler için.
    * `acl_source`: [denylisted](../../user-guides/ip-lists/overview.md) ülke, bölge veya veri merkezlerinde kayıtlı IP adreslerinden gelen istekler için.

`wallarm_block_page` yönergesi listelenen parametreleri aşağıdaki formatlarda kabul eder:

* HTM veya HTML dosyasının yolu, hata kodu (opsiyonel) ve engellenen istek türü (opsiyonel)

    ```bash
    wallarm_block_page &/<PATH_TO_FILE/HTML_HTM_FILE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```
    
    Wallarm, [özelleştirmeniz](#customizing-sample-blocking-page) için başlangıç noktası olarak kullanabileceğiniz örnek bir engelleme sayfası sağlar. Sayfa aşağıdaki yollardan birinde bulunur:
    
    === "Tümleşik yükleyici, AMI veya GCP imajı, NGINX tabanlı Docker imajı"
        ```
        &/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html
        ```
    === "Diğer dağıtım seçenekleri"
        ```
        &/usr/share/nginx/html/wallarm_blocked.html
        ```

    Engelleme sayfasında [NGINX değişkenlerini](https://nginx.org/en/docs/varindex.html) kullanabilirsiniz. Bunun için değişken adını engelleme sayfası koduna `${variable_name}` formatında ekleyin, örn. engellenen isteğin geldiği IP adresini göstermek için `${remote_addr}`.

    !!! warning "Debian ve CentOS kullanıcıları için önemli bilgi"
        CentOS/Debian depolarından kurulmuş 1.11’in altındaki bir NGINX sürümü kullanıyorsanız, dinamik engelleme sayfasını doğru görüntülemek için sayfa kodundan `request_id` değişkenini kaldırmalısınız:
        ```
        UUID ${request_id}
        ```

        Bu, hem `wallarm_blocked.html` için hem de özel engelleme sayfası için geçerlidir.

    [Yapılandırma örneği →](#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code)
* İstemci yönlendirmesi için URL ve engellenen istek türü (opsiyonel)

    ``` bash
    wallarm_block_page /<REDIRECT_URL> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [Yapılandırma örneği →](#url-for-the-client-redirection)
* İsimlendirilmiş NGINX `location` ve engellenen istek türü (opsiyonel)

    ``` bash
    wallarm_block_page @<NAMED_LOCATION> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [Yapılandırma örneği →](#named-nginx-location)
* HTM veya HTML dosyasının yolunu ayarlayan değişken adı, hata kodu (opsiyonel) ve engellenen istek türü (opsiyonel)

    ``` bash
    wallarm_block_page &<VARIABLE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```

    !!! warning "Kodu NGINX değişkenleri içeren engelleme sayfasını başlatma"
        Bu yöntemi, kodunda [NGINX değişkenleri](https://nginx.org/en/docs/varindex.html) bulunan engelleme sayfasını ayarlamak için kullanıyorsanız, lütfen bu sayfayı [`wallarm_block_page_add_dynamic_path`](#nginx-directive-wallarm_block_page_add_dynamic_path) yönergesi aracılığıyla başlatın.

    [Yapılandırma örneği →](#variable-and-error-code)

`wallarm_block_page` yönergesi NGINX yapılandırma dosyasının `http`, `server`, `location` bloklarının içinde ayarlanabilir.

<a name="nginx-directive-wallarm_block_page_add_dynamic_path"></a>
### NGINX yönergesi `wallarm_block_page_add_dynamic_path`

`wallarm_block_page_add_dynamic_path` yönergesi, kodunda NGINX değişkenleri bulunan ve bu engelleme sayfasının yolunun da bir değişken kullanılarak ayarlandığı engelleme sayfasını başlatmak için kullanılır. Aksi halde, yönerge kullanılmaz.

Yönerge, NGINX yapılandırma dosyasının `http` bloğu içinde ayarlanabilir.

<a name="customizing-sample-blocking-page"></a>
## Örnek engelleme sayfasını özelleştirme

Wallarm tarafından sağlanan örnek engelleme sayfası aşağıdaki gibidir:

![Wallarm engelleme sayfası](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

Özelleştirmenize başlangıç noktası olarak örnek sayfayı kullanabilir ve aşağıdakilerle geliştirebilirsiniz:

* Şirket logonuzu ekleme – varsayılan olarak sayfada logo yoktur.
* Şirket destek e-postanızı ekleme – varsayılan olarak e-posta bağlantıları kullanılmaz ve `contact us` ifadesi herhangi bir bağlantı olmadan düz metindir.
* Diğer HTML öğelerini değiştirme veya kendi öğelerinizi ekleme.

!!! info "Özel engelleme sayfası varyantları"
    Wallarm tarafından sağlanan örnek sayfayı değiştirmek yerine, sıfırdan özel bir sayfa oluşturabilirsiniz.

### Genel prosedür

Örnek sayfanın kendisini değiştirirseniz, Wallarm bileşenlerini güncellediğinizde değişiklikleriniz kaybolabilir. Bu nedenle, örnek sayfayı kopyalayıp yeni bir ad vererek ardından değiştirmeniz önerilir. Aşağıdaki bölümlerde açıklandığı gibi kurulum türünüze göre hareket edin.

**<a name="copy"></a>Kopyalama için örnek sayfa**

Filtreleme node’unuzun kurulu olduğu ortamda bulunan `/usr/share/nginx/html/wallarm_blocked.html` (`/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`) dosyasının bir kopyasını oluşturabilirsiniz. Alternatif olarak, aşağıdaki kodu kopyalayıp yeni dosyanız olarak kaydedin:

??? info "Örnek sayfa kodunu göster"

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
            // Destek e-postanızı buraya yazın
            const SUPPORT_EMAIL = "";
        </script>
    </head>

    <body>
        <div class="content">
            <div id="logo" class="logo">
                <!--
                    Logonuzu buraya yerleştirin.
                    Harici bir görsel kullanabilirsiniz:
                    <img src="https://example.com/logo.png" width="160" alt="Company Name" />
                    Veya logo kaynak kodunuzu (ör. svg) doğrudan buraya koyun:
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
            // Uyarı: Sadece ES5 kodu

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

**Ortak dosya sistemi**

`/usr/share/nginx/html/wallarm_blocked.html` (`/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`) dosyasının bir kopyasını yeni bir adla dilediğiniz bir yere (NGINX’in okuma izni olmalı) — aynı klasör dahil — oluşturabilirsiniz.

**Docker container**

Örnek engelleme sayfasını değiştirmek veya sıfırdan kendi özel sayfanızı sağlamak için Docker’ın [bind mount](https://docs.docker.com/storage/bind-mounts/) işlevini kullanabilirsiniz. Bunu kullandığınızda, ana makinenizdeki sayfa ve NGINX yapılandırma dosyası container’a kopyalanır ve sonrasında orijinalleriyle referanslanır; böylece ana makinedeki dosyaları değiştirirseniz kopyaları senkronize edilir ve tersi de geçerlidir.

Bu nedenle, örnek engelleme sayfasını değiştirmek veya kendi sayfanızı sağlamak için aşağıdakileri yapın:

1. İlk çalıştırmadan önce, değiştirilmiş `wallarm_blocked_renamed.html` dosyanızı [hazırlayın](#copy).
1. Engelleme sayfanızın yolunu içeren NGINX yapılandırma dosyasını hazırlayın. [Yapılandırma örneğine](#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code) bakın.
1. Container’ı hazırladığınız engelleme sayfasını ve yapılandırma dosyasını [mount ederek](../installation-docker-en.md#run-the-container-mounting-the-configuration-file) çalıştırın.
1. Çalışan bir container’da engelleme sayfanızı daha sonra güncellemeniz gerekirse, ana makinede referans verilen `wallarm_blocked_renamed.html` dosyasını değiştirin ve ardından container içindeki NGINX’i yeniden başlatın.

**Ingress controller**

Örnek engelleme sayfasını değiştirmek veya kendi sayfanızı sağlamak için aşağıdakileri yapın:

1. Değiştirilmiş `wallarm_blocked_renamed.html` dosyanızı [hazırlayın](#copy).
1. `wallarm_blocked_renamed.html` dosyasından [ConfigMap oluşturun](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files).
1. Oluşturulan ConfigMap’i Wallarm Ingress controller’ın bulunduğu pod’a mount edin. Bunun için, Wallarm Ingress controller’a karşılık gelen Deployment nesnesini [talimatları](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap) izleyerek güncelleyin.

    !!! info "Mount edilen ConfigMap için dizin"
        ConfigMap’i mount etmek için kullanılan dizindeki mevcut dosyalar silinecektir.
1. Ingress annotation sağlayarak pod’u özel sayfanızı kullanacak şekilde yönlendirin:

    ```bash
    kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="<PAGE_ADDRESS>"
    ```

Ayrıntılı [örneğe](#ingress-annotations) bakın.

### Sık yapılan değişiklikler

Şirket logonuzu eklemek için, `wallarm_blocked_renamed.html` dosyasında aşağıdakini değiştirip yorum satırından çıkarın:

```html
<div class="content">
    <div id="logo" class="logo">
        <!--
            Logonuzu buraya yerleştirin.
            Harici bir görsel kullanabilirsiniz:
            <img src="https://example.com/logo.png" width="160" alt="Company Name" />
            Veya logo kaynak kodunuzu (ör. svg) doğrudan buraya koyun:
            <svg width="160" height="80"> ... </svg>
        -->
    </div>
```

Şirket destek e-postanızı eklemek için, `wallarm_blocked_renamed.html` dosyasında `SUPPORT_EMAIL` değişkenini değiştirin:

```html
<script>
    // Destek e-postanızı buraya yazın
    const SUPPORT_EMAIL = "support@company.com";
</script>
```

Değerinde `$` içeren özel bir değişkeni başlatıyorsanız, bu sembolü değişken adından önce `{wallarm_dollar}` ekleyerek kaçışlayın, örn.: `${wallarm_dollar}{variable_name}`. `wallarm_dollar` değişkeni `&` döndürür.

## Yapılandırma örnekleri

Aşağıda, `wallarm_block_page` ve `wallarm_block_page_add_dynamic_path` yönergeleri aracılığıyla engelleme sayfası ve hata kodu yapılandırmasına ilişkin örnekler bulunmaktadır.

`wallarm_block_page` yönergesinin `type` parametresi her örnekte açıkça belirtilmiştir. `type` parametresini kaldırırsanız, yapılandırılan engelleme sayfası, mesaj vb. yalnızca filtering node tarafından engelleme veya güvenli engelleme [mode](../configure-wallarm-mode.md) ayarında engellenen isteğe yanıtta döndürülür.

<a name="path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code"></a>
### Engelleme sayfasının bulunduğu HTM veya HTML dosyasının yolu ve hata kodu

Bu örnek aşağıdaki yanıt ayarlarını gösterir:

* [Değiştirilmiş](#customizing-sample-blocking-page) örnek Wallarm engelleme sayfası `/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html` ve hata kodu 445; istek filtering node tarafından engelleme veya güvenli engelleme modunda engellenirse döndürülür.
* Özel engelleme sayfası `/usr/share/nginx/html/block.html` ve hata kodu 445; istek denylist’e alınmış herhangi bir IP adresinden gelmişse döndürülür.

#### NGINX yapılandırma dosyası

```bash
wallarm_block_page &/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html response_code=445 type=attack;
wallarm_block_page &/usr/share/nginx/html/block.html response_code=445 type=acl_ip,acl_source;
```

Ayarları Docker container’a uygulamak için, uygun ayarlara sahip NGINX yapılandırma dosyası `wallarm_blocked_renamed.html` ve `block.html` dosyalarıyla birlikte container’a mount edilmelidir. [Yapılandırma dosyasını mount ederek container’ı çalıştırma →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

<a name="ingress-annotations"></a>
#### Ingress annotations

Ingress annotation’ı eklemeden önce:

1. Engellenen saldırılar için `wallarm_blocked_renamed.html` ve denylist’teki IP’lerden engellenen istekler için `wallarm_blocked_renamed-2.html` dosyalarınızı [hazırlayın](#copy).
1. Dosyalardan [ConfigMap oluşturun](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files):

    ```
    kubectl -n <CONTROLLER_NAMESPACE> create configmap customized-pages --from-file=wallarm_blocked_renamed.html --from-file=wallarm_blocked_renamed-2.html
    ```

1. Oluşturulan ConfigMap’i Wallarm Ingress controller’ın bulunduğu pod’a [mount etmek]((https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap)) için aşağıdakileri yapın:

    * Ingress chart’ı dağıtmak için kullandığınız values.yaml’ı güncelleyin:

        ```
        controller:
            wallarm:
            <...>
            # -- Denetleyici ana container'ına ek volumeMount'lar.
            extraVolumeMounts:
            - name: custom-block-pages
              mountPath: /usr/share/nginx/blockpages
            # -- Denetleyici pod'una ek volume'lar.
            extraVolumes:
            - name: custom-block-pages
              configMap:
              name: customized-pages
            <...>
        ```

    * Değişiklikleri controller sürümünüze uygulayın:

        ```
        helm -n <CONTROLLER_NAMESPACE> upgrade <CHART-RELEASE-NAME> wallarm/wallarm-ingress --reuse-values -f values.yaml
        ```
        
        !!! info "Mount edilen ConfigMap için dizin"
            ConfigMap’i mount etmek için kullanılan dizindeki mevcut dosyalar silinebileceğinden, ConfigMap aracılığıyla mount edilen dosyalar için yeni bir dizin oluşturmanız önerilir.

Ingress annotations:

```bash
kubectl -n <INGRESS_NAMESPACE> annotate ingress <INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/blockpages/wallarm_blocked_renamed.html response_code=445 type=attack;&/usr/share/nginx/blockpages/wallarm_blocked_renamed-2.html response_code=445 type=acl_ip,acl_source"
```

#### Pod annotations (Sidecar controller kullanılıyorsa)

Engelleme sayfası, `sidecar.wallarm.io/wallarm-block-page` [annotation](../../installation/kubernetes/sidecar-proxy/pod-annotations.md) kullanılarak pod bazında yapılandırılabilir, örn.:

```yaml hl_lines="18"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
      annotations:
        sidecar.wallarm.io/wallarm-mode: block
        sidecar.wallarm.io/wallarm-block-page: "&/path/to/block/page1.html response_code=403 type=attack;&/path/to/block/page2.html response_code=403 type=acl_ip,acl_source"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

<a name="url-for-the-client-redirection"></a>
### İstemci yönlendirmesi için URL

Bu örnek, istek denylist’teki ülke, bölge veya veri merkezlerinden gelmişse filtering node’un istemciyi `host/err445` sayfasına yönlendirmesi için ayarları gösterir.

#### NGINX yapılandırma dosyası

```bash
wallarm_block_page /err445 type=acl_source;
```

Ayarları Docker container’a uygulamak için, uygun ayarlara sahip NGINX yapılandırma dosyası container’a mount edilmelidir. [Yapılandırma dosyasını mount ederek container’ı çalıştırma →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingress annotations

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="/err445 type=acl_source"
```

<a name="named-nginx-location"></a>
### İsimlendirilmiş NGINX `location`

Bu örnek, engelleme nedeni ne olursa olsun (engelleme veya güvenli engelleme modu, kaynağın tek IP / alt ağ / ülke veya bölge / veri merkezi olarak denylist’e alınması), istemciye `The page is blocked` mesajı ve 445 hata kodu döndürülmesi için ayarları gösterir.

#### NGINX yapılandırma dosyası

```bash
wallarm_block_page @block type=attack,acl_ip,acl_source;
location @block {
    return 445 'The page is blocked';
}
```

Ayarları Docker container’a uygulamak için, uygun ayarlara sahip NGINX yapılandırma dosyası container’a mount edilmelidir. [Yapılandırma dosyasını mount ederek container’ı çalıştırma →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingress annotations

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="location @block {return 445 'The page is blocked';}"
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="@block type=attack,acl_ip,acl_source"
```

<a name="variable-and-error-code"></a>
### Değişken ve hata kodu

Bu yapılandırma, istek tek bir IP veya alt ağ olarak denylist’e alınmış bir kaynaktan gelmişse istemciye döndürülür. Wallarm node’u 445 kodunu ve içeriği `User-Agent` başlık değerine bağlı olan engelleme sayfasını döndürür:

* Varsayılan olarak, [değiştirilmiş](#customizing-sample-blocking-page) örnek Wallarm engelleme sayfası `/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html` döndürülür. NGINX değişkenleri engelleme sayfası kodunda kullanıldığından, bu sayfa `wallarm_block_page_add_dynamic_path` yönergesi aracılığıyla başlatılmalıdır.
* Firefox kullanıcıları için — `/usr/share/nginx/html/block_page_firefox.html` (Wallarm Ingress controller’ı dağıtıyorsanız, özel engelleme sayfası dosyaları için ayrı bir dizin oluşturmanız önerilir, örn. `/usr/custom-block-pages/block_page_firefox.html`):

    ```bash
    You are blocked!

    IP ${remote_addr}
    Blocked on ${time_iso8601}
    UUID ${request_id}
    ```

    NGINX değişkenleri engelleme sayfası kodunda kullanıldığından, bu sayfa `wallarm_block_page_add_dynamic_path` yönergesi aracılığıyla başlatılmalıdır.
* Chrome kullanıcıları için — `/usr/share/nginx/html/block_page_chrome.html` (Wallarm Ingress controller’ı dağıtıyorsanız, özel engelleme sayfası dosyaları için ayrı bir dizin oluşturmanız önerilir, örn. `/usr/custom-block-pages/block_page_chrome.html`):

    ```bash
    You are blocked!
    ```

    NGINX değişkenleri engelleme sayfası kodunda KULLANILMADIĞINDAN, bu sayfa BAŞLATILMAMALIDIR.

#### NGINX yapılandırma dosyası

```bash
wallarm_block_page_add_dynamic_path /usr/share/nginx/html/block_page_firefox.html /opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html;

map $http_user_agent $block_page {
  "~Firefox"  &/usr/share/nginx/html/block_page_firefox.html;
  "~Chrome"   &/usr/share/nginx/html/block_page_chrome.html;
  default     &/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html;
}

wallarm_block_page $block_page response_code=445 type=acl_ip;
```

Ayarları Docker container’a uygulamak için, uygun ayarlara sahip NGINX yapılandırma dosyası `wallarm_blocked_renamed.html`, `block_page_firefox.html` ve `block_page_chrome.html` dosyalarıyla birlikte container’a mount edilmelidir. [Yapılandırma dosyasını mount ederek container’ı çalıştırma →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingress controller

1. Dağıtılan Helm chart’a [`helm upgrade`](https://helm.sh/docs/helm/helm_upgrade/) komutunu kullanarak `controller.config.http-snippet` parametresini geçin:

    ```bash
    helm upgrade --reuse-values --set controller.config.http-snippet='wallarm_block_page_add_dynamic_path /usr/custom-block-pages/block_page_firefox.html /opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html; map $http_user_agent $block_page { "~Firefox" &/usr/custom-block-pages/block_page_firefox.html; "~Chrome" &/usr/custom-block-pages/block_page_chrome.html; default &/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html;}' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
2. `wallarm_blocked_renamed.html`, `block_page_firefox.html` ve `block_page_chrome.html` dosyalarından [ConfigMap oluşturun](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files).
3. Oluşturulan ConfigMap’i Wallarm Ingress controller’ın bulunduğu pod’a mount edin. Bunun için, Wallarm Ingress controller’a karşılık gelen Deployment nesnesini [talimatları](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap) izleyerek güncelleyin.

    !!! info "Mount edilen ConfigMap için dizin"
        ConfigMap’i mount etmek için kullanılan dizindeki mevcut dosyalar silinebileceğinden, ConfigMap aracılığıyla mount edilen dosyalar için yeni bir dizin oluşturmanız önerilir.
4. Aşağıdaki annotation’ı Ingress’e ekleyin:

    ```bash
    kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page='$block_page response_code=445 type=acl_ip'
    ```