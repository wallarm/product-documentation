# NGINX ile Engelleme Sayfası ve Hata Kodunun Yapılandırılması

Bu talimatlar, engellenen isteklere yanıt olarak dönen engelleme sayfasının ve hata kodunun nasıl özelleştirileceğini açıklar. Yapılandırma yalnızca kendi kendine barındırılan NGINX Düğümleri için geçerlidir.

Özel engelleme sayfası, aşağıdaki nedenlerden dolayı engellenen isteklere yanıt olarak döner:

* İstekte, şu tiplerdeki kötü amaçlı yükler bulunuyorsa: [input validation attacks](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [vpatch attacks](../../user-guides/rules/vpatch-rule.md) veya [düzenli ifadeler kullanılarak tespit edilen saldırılar](../../user-guides/rules/regex-rule.md).
* Yukarıdaki listeden gelen kötü amaçlı yük içeren istek, [graylisted IP address](../../user-guides/ip-lists/overview.md)’den kaynaklanıyor ve düğüm, istekleri safe blocking [mode](../configure-wallarm-mode.md) ile filtreliyor.
* İstek, [denylisted IP address](../../user-guides/ip-lists/overview.md)’den kaynaklanıyorsa.

## Yapılandırma Sınırlamaları

Engelleme sayfası ve hata kodunun yapılandırılması, NGINX tabanlı Wallarm düğüm dağıtımlarında desteklenir ancak Native Node, Envoy- ve CDN tabanlı Wallarm düğüm dağıtımlarında desteklenmez. Envoy- ve CDN tabanlı Wallarm düğümleri, engellenen isteğe yanıt olarak her zaman `403` kodunu döner.

## Yapılandırma Yöntemleri

Varsayılan olarak, istemciye yanıt olarak 403 hata kodu ve varsayılan NGINX engelleme sayfası döner. Aşağıdaki NGINX yönergelerini kullanarak varsayılan ayarları değiştirebilirsiniz:

* `wallarm_block_page`
* `wallarm_block_page_add_dynamic_path`

### NGINX Yönergesi `wallarm_block_page`

`wallarm_block_page` NGINX yönergesinde aşağıdaki parametreleri geçirerek engelleme sayfası ve hata kodunu yapılandırabilirsiniz:

* Engelleme sayfasının HTM veya HTML dosyasının yolu. Yolu, özel bir engelleme sayfasına ya da Wallarm tarafından sunulan [sample blocking page](#customizing-sample-blocking-page) örnek engelleme sayfasına yönlendirebilirsiniz.
* Engellenen isteğe yanıt olarak dönecek mesaj metni.
* İstemci yönlendirmesi için URL.
* `response_code`: yanıt kodu.
* `type`: Belirtilen yapılandırmanın dönmesi gereken, engellenen isteğin tipi. Parametre, listeden virgülle ayrılmış bir veya birkaç değeri kabul eder:

    * `attack` (varsayılan): filtreleme modundaki engelleme veya safe blocking [mode](../configure-wallarm-mode.md) sırasında filtreleme düğümü tarafından engellenen istekler için.
    * `acl_ip`: Tek bir nesne veya alt ağ olarak [denylist’e](../../user-guides/ip-lists/overview.md) eklenen IP adreslerinden kaynaklanan istekler için.
    * `acl_source`: [denylisted](../../user-guides/ip-lists/overview.md) ülke, bölge veya veri merkezlerinde kayıtlı IP adreslerinden kaynaklanan istekler için.

`wallarm_block_page` yönergesi, aşağıdaki formatlarda belirtilen parametreleri kabul eder:

* Engelleme sayfasının HTM veya HTML dosyasının yolu, hata kodu (isteğe bağlı) ve engellenen istek tipi (isteğe bağlı)

    ```bash
    wallarm_block_page &/<PATH_TO_FILE/HTML_HTM_FILE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```
    
    Wallarm, düzenlemeniz için başlangıç noktası olarak kullanabileceğiniz örnek engelleme sayfasını sağlar. Sayfa, aşağıdaki yolda bulunmaktadır:
    
    === "All-in-one installer, AMI or GCP image, NGINX-based Docker image"
        ```
        &/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html
        ```
    === "Other deployment options"
        ```
        &/usr/share/nginx/html/wallarm_blocked.html
        ```

    Engelleme sayfasında [NGINX değişkenlerini](https://nginx.org/en/docs/varindex.html) kullanabilirsiniz. Bunun için, engelleme sayfası koduna `${variable_name}` formatında değişken adını ekleyin, örneğin, engellenen isteğin geldiği IP adresini göstermek için `${remote_addr}`.

    !!! warning "Debian ve CentOS kullanıcıları için Önemli Bilgi"
        CentOS/Debian depolarından yüklenen 1.11’den düşük bir NGINX sürümü kullanıyorsanız, dinamik engelleme sayfasının doğru görüntülenebilmesi için sayfa kodundan `request_id` değişkenini kaldırmalısınız:
        ```
        UUID ${request_id}
        ```

        Bu, hem `wallarm_blocked.html` hem de özel engelleme sayfası için geçerlidir.

    [Örnek yapılandırma →](#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code)
* İstemci yönlendirmesi için URL ve engellenen istek tipi (isteğe bağlı)

    ``` bash
    wallarm_block_page /<REDIRECT_URL> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [Örnek yapılandırma →](#url-for-the-client-redirection)
* İsimlendirilmiş NGINX `location` ve engellenen istek tipi (isteğe bağlı)

    ``` bash
    wallarm_block_page @<NAMED_LOCATION> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [Örnek yapılandırma →](#named-nginx-location)
* HTM veya HTML dosyasının yolunu, hata kodunu (isteğe bağlı) ve engellenen istek tipini (isteğe bağlı) belirten değişkenin ismi

    ``` bash
    wallarm_block_page &<VARIABLE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```

    !!! warning "NGINX değişkenlerini içeren kod ile engelleme sayfasını başlatma"
        Bu yöntemi kullanarak, kodunda [NGINX değişkenlerini](https://nginx.org/en/docs/varindex.html) barındıran engelleme sayfasını belirliyorsanız, lütfen bu sayfayı [`wallarm_block_page_add_dynamic_path`](#nginx-directive-wallarm_block_page_add_dynamic_path) yönergesi vasıtasıyla başlatın.

    [Örnek yapılandırma →](#variable-and-error-code)

`wallarm_block_page` yönergesi, NGINX yapılandırma dosyasının `http`, `server`, `location` blokları içinde ayarlanabilir.

### NGINX Yönergesi `wallarm_block_page_add_dynamic_path`

`wallarm_block_page_add_dynamic_path` yönergesi, kodunda NGINX değişkenleri bulunan ve yolu bir değişken kullanılarak ayarlanan engelleme sayfasını başlatmak için kullanılır. Aksi halde, bu yönerge kullanılmaz.

Yönerge, NGINX yapılandırma dosyasının `http` bloğu içinde ayarlanabilir.

## Örnek Engelleme Sayfasının Özelleştirilmesi

Wallarm tarafından sağlanan örnek engelleme sayfası aşağıdaki gibi görünür:

![Wallarm blocking page](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

Örnek sayfayı, aşağıdaki yollarla geliştirilerek özelleştirme noktası olarak kullanabilirsiniz:

* Şirket logonuzu eklemek – varsayılan olarak, sayfada herhangi bir logo sunulmaz.
* Şirket destek e-postanızı eklemek – varsayılan olarak, herhangi bir e-posta bağlantısı kullanılmaz ve `contact us` ifadesi bağlantısız basit bir metindir.
* Diğer HTML öğelerini değiştirmek veya kendi öğelerinizi eklemek.

!!! info "Özel engelleme sayfası varyantları"
    Wallarm tarafından sağlanan örnek sayfayı değiştirmek yerine sıfırdan özel bir sayfa oluşturabilirsiniz.

### Genel İşlem

Örnek sayfayı doğrudan değiştirirseniz, Wallarm bileşenlerinin güncellenmesi durumunda yaptığınız değişiklikler kaybolabilir. Bu nedenle, örnek sayfayı kopyalayıp yeni bir isim vermeniz ve değişiklikleri yalnızca kopya üzerinde yapmanız önerilir. Kurulum tipinize bağlı olarak aşağıdaki bölümlerde belirtilen adımları izleyin.

**<a name="copy"></a>Kopyalama için Örnek Sayfa**

Filtreleme düğümünüzün kurulu olduğu ortamda bulunan `/usr/share/nginx/html/wallarm_blocked.html` (`/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`) dosyasının bir kopyasını alabilirsiniz. Alternatif olarak, aşağıdaki kodu kopyalayıp yeni dosyanız olarak kaydedebilirsiniz:

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

**Ortak Dosya Sistemi**

NGINX, okunabilirlik iznine sahip olmak şartıyla, `/usr/share/nginx/html/wallarm_blocked.html` (`/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`) dosyasını dilediğiniz yere (aynı klasör de dahil) yeni bir isimle kopyalayabilirsiniz.

**Docker Konteyner**

Örnek engelleme sayfasını değiştirmek veya sıfırdan kendi özel sayfanızı sunmak için Docker’ın [bind mount](https://docs.docker.com/storage/bind-mounts/) işlevselliğini kullanabilirsiniz. Kullanıldığında, sayfanız ve ana makinedeki NGINX yapılandırma dosyanız konteynere kopyalanır ve orijinal dosyalar ile referanslanır, böylece ana makinede dosyalarda yaptığınız değişiklikler kopyalara senkronize olur.

Dolayısıyla, örnek engelleme sayfasını değiştirmek veya kendi sayfanızı sunmak için şunları yapın:

1. İlk çalıştırmadan önce, [kopyalayın](#copy) ve değiştirdiğiniz `wallarm_blocked_renamed.html` dosyasını hazırlayın.
2. Engelleme sayfanızın yolunu içeren NGINX yapılandırma dosyasını hazırlayın. Bakınız [yapılandırma örneği](#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code).
3. Hazırlanan engelleme sayfası ve yapılandırma dosyasını [mounting](../installation-docker-en.md#run-the-container-mounting-the-configuration-file) ile konteynere çalıştırın.
4. Çalışan bir konteynerde daha sonra engelleme sayfasını güncellemeniz gerekirse, ana makinede referans verilen `wallarm_blocked_renamed.html` dosyasını değiştirin ve ardından konteynerdeki NGINX’i yeniden başlatın.

**Ingress Denetleyicisi**

Örnek engelleme sayfasını değiştirmek veya kendi sayfanızı sunmak için şunları yapın:

1. [Kopyalayın](#copy) ve değiştirdiğiniz `wallarm_blocked_renamed.html` dosyasını hazırlayın.
2. Dosyadan ConfigMap oluşturun: [Create ConfigMap from the file](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) `wallarm_blocked_renamed.html`.
3. Oluşturulan ConfigMap’i Wallarm Ingress denetleyicisinin bulunduğu pod’a mount edin. Bunun için, lütfen ilgili Wallarm Ingress denetleyicisine dair Deployment nesnesini [talimatlar](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap) doğrultusunda güncelleyin.

    !!! info "Mount Edilen ConfigMap için Dizin"
        ConfigMap ile mount edilen dizindeki mevcut dosyalar silinecektir.
4. Ingress açıklaması sağlayarak pod’u özel sayfanızı kullanması için yönlendirin:

    ```bash
    kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="<PAGE_ADDRESS>"
    ```

Detaylı [örneğe bakınız](#ingress-annotations).

### Sık Yapılan Değişiklikler

Şirket logonuzu eklemek için, `wallarm_blocked_renamed.html` dosyasında aşağıdaki kısmı değiştirip yorum satırından çıkartın:

```html
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
```

Şirket destek e-postanızı eklemek için, `wallarm_blocked_renamed.html` dosyasında `SUPPORT_EMAIL` değişkenini değiştirin:

```html
<script>
    // Place your support email here
    const SUPPORT_EMAIL = "support@company.com";
</script>
```

Bir değerde `$` içeren özel bir değişken başlatılırken, bu simgeyi, değişken isminden önce `{wallarm_dollar}` ekleyerek kaçırın, örneğin: `${wallarm_dollar}{variable_name}`. `wallarm_dollar` değişkeni `&` değerini döner.

## Yapılandırma Örnekleri

Aşağıda, `wallarm_block_page` ve `wallarm_block_page_add_dynamic_path` yönergeleri aracılığıyla engelleme sayfası ve hata kodunun nasıl yapılandırılacağına dair örnekler yer almaktadır.

`wallarm_block_page` yönergesinin `type` parametresi her örnekte açıkça belirtilmiştir. `type` parametresini kaldırırsanız, yapılandırılan engelleme sayfası, mesaj vb. yalnızca filtreleme düğümü tarafından engellendiğinde (blocking veya safe blocking [mode](../configure-wallarm-mode.md) durumunda) yanıt olarak dönecektir.

### Engelleme Sayfası ve Hata Koduyla İlgili HTM veya HTML Dosyasına Yol

Bu örnek aşağıdaki yanıt ayarlarını göstermektedir:

* [Özelleştirilmiş](#customizing-sample-blocking-page) örnek Wallarm engelleme sayfası `/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html` ve isteğin, filtreleme düğümü tarafından engellenmesi durumunda dönen 445 hata kodu.
* Tek bir denylisted IP adresinden kaynaklanan isteklerde dönen özel engelleme sayfası `/usr/share/nginx/html/block.html` ve 445 hata kodu.

#### NGINX Yapılandırma Dosyası

```bash
wallarm_block_page &/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html response_code=445 type=attack;
wallarm_block_page &/usr/share/nginx/html/block.html response_code=445 type=acl_ip,acl_source;
```

Ayarların Docker konteynerine uygulanabilmesi için, uygun ayarları içeren NGINX yapılandırma dosyasının, `wallarm_blocked_renamed.html` ve `block.html` dosyaları ile birlikte konteynere mount edilmesi gerekir. [Konteyneri yapılandırma dosyası mount edilerek çalıştırmak →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingress Açıklamaları

Ingilizce orijinal metindeki gibi:

```bash
kubectl -n <INGRESS_NAMESPACE> annotate ingress <INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/blockpages/wallarm_blocked_renamed.html response_code=445 type=attack;&/usr/share/nginx/blockpages/wallarm_blocked_renamed-2.html response_code=445 type=acl_ip,acl_source"
```

#### Pod Açıklamaları (Sidecar Controller kullanılıyorsa)

Engelleme sayfası, `sidecar.wallarm.io/wallarm-block-page` [annotation](../../installation/kubernetes/sidecar-proxy/pod-annotations.md) kullanılarak pod bazında yapılandırılabilir, örneğin:

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

### İstemci Yönlendirmesi için URL

Bu örnek, filtreleme düğümünün [denylisted](../../user-guides/ip-lists/overview.md) ülkeler, bölgeler veya veri merkezlerinden kaynaklanan istekleri engellediğinde, istemciyi `host/err445` sayfasına yönlendirmek için ayarları gösterir.

#### NGINX Yapılandırma Dosyası

```bash
wallarm_block_page /err445 type=acl_source;
```

Ayarların Docker konteynerine uygulanabilmesi için, uygun ayarları içeren NGINX yapılandırma dosyasının konteynere mount edilmesi gerekir. [Konteyneri yapılandırma dosyası mount edilerek çalıştırmak →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingress Açıklamaları

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="/err445 type=acl_source"
```

### İsimlendirilmiş NGINX `location`

Bu örnek, engellenme veya safe blocking [mode](../configure-wallarm-mode.md), tekil IP/alt ağ veya ülkeler, bölgeler veya veri merkezlerinden kaynaklı olsun fark etmeksizin, istemciye `The page is blocked` mesajını ve 445 hata kodunu dönecek ayarları gösterir.

#### NGINX Yapılandırma Dosyası

```bash
wallarm_block_page @block type=attack,acl_ip,acl_source;
location @block {
    return 445 'The page is blocked';
}
```

Ayarların Docker konteynerine uygulanabilmesi için, uygun ayarları içeren NGINX yapılandırma dosyasının konteynere mount edilmesi gerekir. [Konteyneri yapılandırma dosyası mount edilerek çalıştırmak →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingress Açıklamaları

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="location @block {return 445 'The page is blocked';}"
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="@block type=attack,acl_ip,acl_source"
```

### Değişken ve Hata Kodu

Bu yapılandırma, isteğin tek bir IP veya alt ağ şeklinde denylisted kaynaklardan gelmesi durumunda istemciye döndürülür. Wallarm düğümü, 445 hata kodunu döner ve blok edilen sayfayı, `User-Agent` başlık değerine bağlı içeriğe göre döner:

* Varsayılan olarak, [özelleştirilmiş](#customizing-sample-blocking-page) örnek Wallarm engelleme sayfası `/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html` döner. Engelleme sayfası kodunda NGINX değişkenleri kullanıldığı için, bu sayfa `wallarm_block_page_add_dynamic_path` yönergesi ile başlatılmalıdır.
* Firefox kullanıcıları için — `/usr/share/nginx/html/block_page_firefox.html` (Wallarm Ingress denetleyicisi kullanılırsa, özel engelleme sayfası dosyaları için ayrı bir dizin oluşturulması önerilir, örn. `/usr/custom-block-pages/block_page_firefox.html`):

    ```bash
    You are blocked!

    IP ${remote_addr}
    Blocked on ${time_iso8601}
    UUID ${request_id}
    ```

    Engelleme sayfası kodunda NGINX değişkenleri kullanıldığı için, bu sayfa `wallarm_block_page_add_dynamic_path` yönergesi ile başlatılmalıdır.
* Chrome kullanıcıları için — `/usr/share/nginx/html/block_page_chrome.html` (Wallarm Ingress denetleyicisi kullanılırsa, özel engelleme sayfası dosyaları için ayrı bir dizin oluşturulması önerilir, örn. `/usr/custom-block-pages/block_page_chrome.html`):

    ```bash
    You are blocked!
    ```

    Engelleme sayfası kodunda NGINX değişkenleri kullanılmadığından, bu sayfa başlatılmamalıdır.

#### NGINX Yapılandırma Dosyası

```bash
wallarm_block_page_add_dynamic_path /usr/share/nginx/html/block_page_firefox.html /opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html;

map $http_user_agent $block_page {
  "~Firefox"  &/usr/share/nginx/html/block_page_firefox.html;
  "~Chrome"   &/usr/share/nginx/html/block_page_chrome.html;
  default     &/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html;
}

wallarm_block_page $block_page response_code=445 type=acl_ip;
```

Ayarların Docker konteynerine uygulanabilmesi için, uygun ayarları içeren NGINX yapılandırma dosyasının, `wallarm_blocked_renamed.html`, `block_page_firefox.html` ve `block_page_chrome.html` dosyaları ile birlikte konteynere mount edilmesi gerekir. [Konteyneri yapılandırma dosyası mount edilerek çalıştırmak →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingress Denetleyicisi

1. Yayınlanan Helm chart’ına [`helm upgrade`](https://helm.sh/docs/helm/helm_upgrade/) komutu kullanılarak `controller.config.http-snippet` parametresini aktarın:

    ```bash
    helm upgrade --reuse-values --set controller.config.http-snippet='wallarm_block_page_add_dynamic_path /usr/custom-block-pages/block_page_firefox.html /opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html; map $http_user_agent $block_page { "~Firefox" &/usr/custom-block-pages/block_page_firefox.html; "~Chrome" &/usr/custom-block-pages/block_page_chrome.html; default &/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html;}' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
2. `wallarm_blocked_renamed.html`, `block_page_firefox.html` ve `block_page_chrome.html` dosyalarından ConfigMap oluşturun: [Create ConfigMap from the files](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files).
3. Oluşturulan ConfigMap’i Wallarm Ingress denetleyicisinin bulunduğu pod’a mount edin. Bunun için, lütfen ilgili Wallarm Ingress denetleyicisine ait Deployment nesnesini [talimatlar](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap) doğrultusunda güncelleyin.

    !!! info "Mount Edilen ConfigMap için Dizin"
        ConfigMap ile mount edilen dizindeki mevcut dosyalar silinebilir, bu yüzden ConfigMap ile mount edilen dosyalar için yeni bir dizin oluşturulması önerilir.
4. Aşağıdaki açıklamayı Ingress’e ekleyin:

    ```bash
    kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page='$block_page response_code=445 type=acl_ip'
    ```