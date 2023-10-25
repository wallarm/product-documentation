# Engelleme sayfası ve hata kodunun yapılandırılması (NGINX)

Bu talimatlar, aşağıdaki nedenlerle engellenen isteğin yanıtında döndürülen engelleme sayfasını ve hata kodunu özelleştirmek için yöntemi açıklar:

* İsteğin, aşağıdaki türlerdeki zararlı yükleri içermesi: [giriş doğrulama saldırıları](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [vpatch saldırıları](../../user-guides/rules/vpatch-rule.md) veya [düzenli ifadelere dayalı algılanan saldırılar](../../user-guides/rules/regex-rule.md).
* Yukarıdaki listeye dahil edilen zararlı yükleri içeren istek [gri listeye alınmış IP adresi](../../user-guides/ip-lists/graylist.md)'nden çıktı ve düğüm talepleri güvenli engelleme [modunda](../configure-wallarm-mode.md) filtreler.
* İsteğin, [reddedilmiş IP adresi](../../user-guides/ip-lists/denylist.md)'nden çıkması.

## Yapılandırma sınırlamaları

Engelleme sayfası ve hata kodunun yapılandırması, NGINX tabanlı Wallarm düğüm dağıtımlarında desteklenir, ancak Envoy- ve CDN- tabanlı Wallarm düğüm dağıtımlarında desteklenmez. Envoy- ve CDN tabanlı Wallarm düğümleri, engellenen isteğin yanıtında her zaman `403` kodunu döndürür.

## Yapılandırma yöntemler

Varsayılan olarak, yanıt kodu 403 ve varsayılan NGINX engelleme sayfası istemciye döndürülür. Aşağıdaki NGINX yönergelerini kullanarak varsayılan ayarları değiştirebilirsiniz:

* `wallarm_block_page`
* `wallarm_block_page_add_dynamic_path`

### NGINX yönergesi `wallarm_block_page`

Engelleme sayfasını ve hata kodunu `wallarm_block_page` NGINX yönergesinde aşağıdaki parametreleri ileteceğiniz gibi yapılandırabilirsiniz:

* Engelleme sayfasının HTM veya HTML dosyasına yol. Yolu, özel bir engelleme sayfasına veya Wallarm tarafından sağlanan [örnek engelleme sayfasına](#customizing-sample-blocking-page) belirtebilirsiniz.
* Engellenmiş bir isteğe yanıt olarak döndürülecek mesajın metni.
* İstemci yeniden yönlendirmesi için URL.
* `response_code`: yanıt kodu.
* `type`: belirtilen yapılandırılmasının hangi türdeki engellenen isteğe yanıt olarak döndürülmesi gerektiği: parametre, virgülle ayrılmış bir veya birkaç değer alır:
    * `attack` (varsayılan): filtreleme düğümü tarafından engellenen istekler için, talepleri engelleme veya güvenli engelleme [modunda](../configure-wallarm-mode.md) filtrelerken.
    * `acl_ip`: tek bir nesne veya ağ alt kümesi olarak [reddedilen listeye](../../user-guides/ip-lists/denylist.md) eklenen IP adreslerinden çıkan istekler için.
    * `acl_source`: [reddedilen liste](../../user-guides/ip-lists/denylist.md)'de kayıtlı ülkelerden, bölgelerden veya veri merkezlerinden çıkan IP adreslerinden çıkan istekler için.

`wallarm_block_page` yönergesi, aşağıdaki formatlarda listelenen parametreleri kabul eder:

* HTM veya HTML dosyanın yolu, hata kodu (isteğe bağlı) ve engellenmiş istek türü (isteğe bağlı)

    ```bash
    wallarm_block_page &/<PATH_TO_FILE/HTML_HTM_FILE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```
    
    Wallarm, `&/usr/share/nginx/html/wallarm_blocked.html` adında bir örnek engelleme sayfası sağlar. Bu sayfayı [özelleştirmeleriniz](#customizing-sample-blocking-page) için bir başlangıç ​​noktası olarak kullanabilirsiniz.

    Engelleme sayfasında [NGINX değişkenlerini](https://nginx.org/en/docs/varindex.html) kullanabilirsiniz. Bunun için, engelleme sayfası koduna `${variable_name}` formatında değişken adını ekleyin, ör. engellenen isteğin geldiği IP adresini göstermek için `${remote_addr}`.

    !!! warning "Debian ve CentOS kullanıcıları için önemli bilgi"
        [CentOS/Debian](../../installation/nginx/dynamic-module-from-distr.md) depolarından yüklenen ve 1.11'den düşük bir NGINX sürümünü kullanıyorsanız, dinamik engelleme sayfasını doğru bir şekilde göstermek için sayfa kodundaki `request_id` değişkenini kaldırmanız gerekir:
        ```
        UUID ${request_id}
        ```

        Bu, `wallarm_blocked.html` ve özel engelleme sayfasına da geçerlidir.

    [Yapılandırma örneği →](#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code)
* İstemci yeniden yönlendirme URL'si ve engellenen istek türü (isteğe bağlı)

    ``` bash
    wallarm_block_page /<REDIRECT_URL> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [Yapılandırma örneği →](#url-for-the-client-redirection)
* İsimlendirilmiş NGINX `location` ve engellenen istek türü (isteğe bağlı)

    ``` bash
    wallarm_block_page @<NAMED_LOCATION> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [Yapılandırma örneği →](#named-nginx-location)
* HTM veya HTML dosyasının yolunu ayarlayan değişkenin adı, hata kodu (isteğe bağlı) ve engellenen istek türü (isteğe bağlı)

    ``` bash
    wallarm_block_page &<VARIABLE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```

    !!! warning "Kodundaki NGINX değişkenleri ile engelleme sayfasını başlatmak"
        Engelleme sayfasını ayarlarken [NGINX değişkenleri](https://nginx.org/en/docs/varindex.html) kullanıyorsanız, bu sayfayı [`wallarm_block_page_add_dynamic_path`](#nginx-directive-wallarm_block_page_add_dynamic_path) yönergesi ile başlatmanız gerekir.

    [Yapılandırma örneği →](#variable-and-error-code)

`wallarm_block_page` yönergesi, NGINX yapılandırma dosyasının `http`, `server`, `location` blokları içinde ayarlanabilir.

### NGINX yönergesi `wallarm_block_page_add_dynamic_path`

`wallarm_block_page_add_dynamic_path` yönergesi, kodunda NGINX değişkenleri bulunan ve bu engelleme sayfasının yolunun da bir değişken kullanılarak ayarlandığı engelleme sayfasını başlatmak için kullanılır. Aksi halde, yönerge kullanılmaz.

Yönerge, NGINX yapılandırma dosyasının `http` bloğu içinde ayarlanabilir.

## Örnek engelleme sayfasının özelleştirilmesi

Wallarm tarafından sağlanan örnek engelleme sayfası `/usr/share/nginx/html/wallarm_blocked.html` şu şekildedir:

![Wallarm engelleme sayfası](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

Örneği, şunları yaparak özelleştirme başlama noktası olarak kullanabilirsiniz:

* Şirket logonuzu ekleyin - varsayılan olarak sayfada logo No İstenmiştir.
* Şirketinizin destek e-postasını ekleyin - varsayılan olarak e-posta bağlantıları kullanılmamış ve "bizimle iletişime geçin" ifadesi herhangi bir bağlantı içermeyen basit bir metindir.
* Diğer HTML öğelerini değiştirme veya kendi öğelerinizi ekletme.

!!! info "Özel engelleme sayfası çeşitlemeleri"
    Wallarm tarafından sağlanan örnek sayfayı değiştirmek yerine, sıfırdan bir özel sayfa oluşturabilirsiniz.

### Genel prosedür

Örnek sayfayı kendiniz değiştirirseniz, Wallarm bileşenlerini güncellerken değişiklikleriniz kaybolabilir. Bu yüzden, örnek sayfayı kopyalamanız, ona yeni bir isim vermeniz ve sonra onu değiştirmeniz önerilir. Hizmet türünüzü aşağıdaki bölümlere göre kullanın.

**<a name="copy"></a>Kopyalama için örnek sayfa**

`/usr/share/nginx/html/wallarm_blocked.html`'i filtreleme düğümünün kurulu olduğu ortamda kopyalayabilirsiniz. Alternatif olarak, aşağıdaki kodu kopyalayın ve yeni dosyanız olarak kaydedin:

??? info " Örnek sayfa kodunu göster"

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

**Ortak dosya sistemi**

`/usr/share/nginx/html/wallarm_blocked.html` dosyasını istediğiniz yerde (NGINX'in okuma izni olmalı) yeni bir ad altında yapabilirsiniz, aynı klasör dahil.

**Docker konteyneri**

Örnek engelleme sayfasını değiştirmek veya baştan özelleştirilmiş bir sayfa sağlamak için Docker'ın [bind mount](https://docs.docker.com/storage/bind-mounts/) işlevselliğini kullanabilirsiniz. Bunu kullanırken, ana makinenizdeki sayfanız ve NGINX yapılandırma dosyanız konteynere kopyalanır ve ardından orijinalleri ile başvurulur, yani ana makinenizdeki dosyaları değiştirirseniz, kopyaları senkronize edilir ve tam tersi.

Bu nedenle, örnek engelleme sayfasını değiştirmek veya özelleştirilmiş bir sayfa sağlamak için aşağıdakileri yapın:

1. İlk çalışmadan önce, değiştirilmiş `wallarm_blocked_renamed.html`'nizı [hazırlayın](#copy).
2. Engelleme sayfanıza adıyla NGINX yapılandırma dosyasını hazırlayın. [Yapılandırma örneğine](#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code) bakın.
3. Hazırlanan engelleme sayfasını ve yapılandırma dosyasını [dağıtarak](../installation-docker-en.md#run-the-container-mounting-the-configuration-file) konteyneri çalıştırın.
4. Çalışan bir konteynerde daha sonra engelleme sayfanızı güncellemeniz gerekiyorsa, ana makinede, başvurulan `wallarm_blocked_renamed.html`'i değiştirin ve ardından konteynerdeki NGINX'i yeniden başlatın.

**Ingress denetleyicisi**

Örnek engelleme sayfasını değiştirmek veya kendi sayfanızı sağlamak için aşağıdakileri yapın:

1. [Hazırlayın](#copy) değiştirilmiş `wallarm_blocked_renamed.html`'nizi.
2. `wallarm_blocked_renamed.html` dosyasından [ConfigMap oluşturun](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files).
3. Oluşturulan ConfigMap'ı Wallarm Ingress denetleyici poduna bağlayın. Bunun için, lütfen Wallarm Ingress denetleyicisi için ilgili Dağıtım nesnesini [talimatlara](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap) göre güncelleyin.

    !!! info "ConfigMap'ı bağlamak için dizin"
        ConfigMap'ı bağlamak için kullanılan dizindeki mevcut dosyalar silinebilir, bu yüzden ConfigMap ile bağlanan dosyalar için yeni bir dizin oluşturmanız önerilir.

### Sık değişiklikler

Şirket logosunu eklemek için, `wallarm_blocked_renamed.html` dosyasında değiştirebilirsiniz ve yorumu kaldırın:

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

Bir değişkeni `$` ile bir değer içerecek şekilde başlatıyorsanız, `{wallarm_dollar}` ekleyerek bu sembolü geri dönüştürün, ör. değişken adının önüne `${wallarm_sc dolar}{variable_name}`. `wallarm_dollar` değişkeni `&` döndürür.

## Yapılandırma örnekleri

Aşağıda, `wallarm_block_page` ve `wallarm_block_page_add_dynamic_path` yönergeleri aracılığıyla engelleme sayfasını ve hata kodunu yapılandırma örnekleri verilmektedir.

`wallarm_block_page` yönergesinin `type` parametresi her örnekte açıkça belirtilmiştir. `type` parametresini kaldırırsanız, yapılandırılmış blok sayfası, mesaj vb. sadece filtreleme düğümünün engelleme veya güvenli engelleme [modunda](../configure-wallarm-mode.md) engellediği isteğe yanıt olarak döndürülür.

### Engelleme sayfası ve hata kodu ile HTM veya HTML dosyasına yol

Bu örnek, aşağıdaki yanıt ayarlarını gösterir:

* Filtreleme düğümü tarafından engelleme veya güvenli engelleme modunda engellenen isteğin yanıtında döndürülen [değiştirilmiş](#customizing-sample-blocking-page) örnek Wallarm engelleme sayfası `/usr/share/nginx/html/wallarm_blocked_renamed.html` ve hata kodu 445.
* Tek bir nesne veya ağ alt kümesi olarak [reddedilen listeye](../../user-guides/ip-lists/denylist.md) eklenen IP adreslerinden çıkan isteklerin yanıtına döndürülecek özel engelleme sayfası `/usr/share/nginx/html/block.html` ve hata kodu 445.

#### NGINX yapılandırma dosyası

```bash
wallarm_block_page &/usr/share/nginx/html/wallarm_blocked_renamed.html response_code=445 type=attack;
wallarm_block_page &/usr/share/nginx/html/block.html response_code=445 type=acl_ip,acl_source;
```

Docker konteynerine ayarları uygulamak için, uygun ayarların bulunduğu NGINX yapılandırma dosyası, `wallarm_blocked_renamed.html` ve `block.html` dosyaları ile birlikte konteynere monte edilmelidir. [Yapılandırma dosyasını monte ederek konteyneri çalıştırma →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingress annotations

Ingress tanımlaması yapılmadan önce:

1. Dosyalardan `wallarm_blocked_renamed.html` ve `block.html`'den [ConfigMap oluşturun](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files).
2. Oluşturulan ConfigMap'ı Wallarm Ingress denetleyici poduna bağlayın. Bunun için, lütfen [talimatlara](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap) göre Wallarm Ingress denetleyicisi için ilgili Dağıtım nesnesini güncelleyin.

    !!! info "ConfigMap'ı bağlamak için dizin"
        ConfigMap'ı bağlamak için kullanılan dizindeki mevcut dosyalar silinebilir, bu yüzden ConfigMap ile bağlanan dosyalar için yeni bir dizin oluşturmanız önerilir.

Ingress annotations:

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked_renamed.html response_code=445 type=attack;&/usr/share/nginx/html/block.html response_code=445 type=acl_ip,acl_source"
```

### İstemci yeniden yönlendirme URL'si

Bu örnek, filtreleme düğümünün reddedilen listeye eklenmiş olarak kaydedilen ülkelerden, bölgelerden veya veri merkezlerinden çıkan isteği engellediği durumlarda istemciyi `host/err445` sayfasına yönlendirmek için ayarları gösterir.

#### NGINX configuration file

```bash
wallarm_block_page /err445 type=acl_source;
```

Docker konteynerine ayarları uygulamak için, uygun ayarların bulunduğu NGINX yapılandırma dosyası konteynere monte edilmelidir. [Yapılandırma dosyasını monte ederek konteyneri çalıştırma →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingress annotations

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="/err445 type=acl_source"
```

### İsimlendirilmiş NGINX `location`

Engelleme düğümü veya güvenli engelleme modunda engellenen isteğin yanıtı ile ilgili ayarları gösterir: ayarlar, isteğin engellenmesi nedenine bakılmaksızın (engelleme veya güvenli engelleme modu, tek bir IP / alt ağ / ülke veya bölge / veri merkezi olarak reddedilen kökene dayalı) istemciye `The page is blocked` mesajı ve 445 hata kodunu döndürür.

#### NGINX configuration file

```bash
wallarm_block_page @block type=attack,acl_ip,acl_source;
location @block {
    return 445 'The page is blocked';
}
```

Docker konteynerine ayarları uygulamak için, uygun ayarların bulunduğu NGINX yapılandırma dosyası konteynere monte edilmelidir. [Yapılandırma dosyasını monte ederek konteyneri çalıştırma →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingress annotations

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="location @block {return 445 'The page is blocked';}"
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="@block type=attack,acl_ip,acl_source"
```

### Değişken ve hata kodu

Bu yapılandırma, engellenen isteğin tek bir nesne veya ağ alt kümesi olarak [reddedilen listeye](../../user-guides/ip-lists/denylist.md) eklenmiş olarak kaydedilen bir yerden çıktığı durumda istemciye döndürülür. Wallarm düğümü, `User-Agent` başlık değerine bağlı olarak 445 kodunu ve engelleme sayfasını döndürür:

* Varsayılan olarak, [değiştirilmiş](#customizing-sample-blocking-page) örnek Wallarm engelleme sayfası `/usr/share/nginx/html/wallarm_blocked_renamed.html` döndürülür. NGINX değişkenleri, engelleme sayfası kodunda kullanılır, bu nedenle bu sayfa, `wallarm_block_page_add_dynamic_path` yönergesi ile başlatılmalıdır.
* Firefox kullanıcıları için — `/usr/share/nginx/html/block_page_firefox.html` (Wallarm Ingress denetleyicisi dağıtılıyorsa, özel engelleme sayfası dosyaları için ayrı bir dizin oluşturmanız önerilir, örneğin `/usr/custom-block-pages/block_page_firefox.html`):

    ```bash
    You are blocked!

    IP ${remote_addr}
    Blocked on ${time_iso8601}
    UUID ${request_id}
    ```

    NGINX değişkenleri, engelleme sayfası kodunda kullanılır, bu nedenle bu sayfa, `wallarm_block_page_add_dynamic_path` yönergesi ile başlatılmalıdır.
* Chrome kullanıcıları için — `/usr/share/nginx/html/block_page_chrome.html` (Wallarm Ingress denetleyicisi dağıtılıyorsa, özel engelleme sayfası dosyaları için ayrı bir dizin oluşturmanız önerilir, örneğin `/usr/custom-block-pages/block_page_chrome.html`):

    ```bash
    You are blocked!
    ```

    NGINX değişkenleri, engelleme sayfası kodunda KULLANILMAZ, bu nedenle bu sayfa başlatılmamalıdır.

#### NGINX configuration file

```bash
wallarm_block_page_add_dynamic_path /usr/share/nginx/html/block_page_firefox.html /usr/share/nginx/html/wallarm_blocked_renamed.html;

map $http_user_agent $block_page {
  "~Firefox"  &/usr/share/nginx/html/block_page_firefox.html;
  "~Chrome"   &/usr/share/nginx/html/block_page_chrome.html;
  default     &/usr/share/nginx/html/wallarm_blocked_renamed.html;
}

wallarm_block_page $block_page response_code=445 type=acl_ip;
```

Docker konteynerine ayarları uygulamak için, uygun ayarların bulunduğu NGINX yapılandırma dosyası, `wallarm_blocked_renamed.html`, `block_page_firefox.html`, ve `block_page_chrome.html` dosyaları ile birlikte konteynere monte edilmelidir. [Yapılandırma dosyasını monte ederek konteyneri çalıştırma →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingress denetleyicisi

1. Helm şemasını [`helm upgrade`](https://helm.sh/docs/helm/helm_upgrade/) komutunu kullanarak dağıttığınızda `controller.config.http-snippet` parametresini aktarın:

    ```bash
    helm upgrade --reuse-values --set controller.config.http-snippet='wallarm_block_page_add_dynamic_path /usr/custom-block-pages/block_page_firefox.html /usr/share/nginx/html/wallarm_blocked_renamed.html; map $http_user_agent $block_page { "~Firefox" &/usr/custom-block-pages/block_page_firefox.html; "~Chrome" &/usr/custom-block-pages/block_page_chrome.html; default &/usr/share/nginx/html/wallarm_blocked_renamed.html;}' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
2. Dosyalardan `wallarm_blocked_renamed.html`, `block_page_firefox.html`, ve `block_page_chrome.html`'den [ConfigMap oluşturun](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files).
3. Oluşturulan ConfigMap'ı Wallarm Ingress denetleyici poduna bağlayın. Bunun için, lütfen [talimatlara](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap) göre Wallarm Ingress denetleyicisi için ilgili Dağıtım nesnesini güncelleyin.

    !!! info "ConfigMap'ı bağlamak için dizin"
        ConfigMap'ı bağlamak için kullanılan dizindeki mevcut dosyalar silinebilir, bu yüzden ConfigMap ile bağlanan dosyalar için yeni bir dizin oluşturmanız önerilir.
4. İngresse aşağıdaki bildirim ekleyin:

    ```bash
    kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page='$block_page response_code=445 type=acl_ip'
    ```