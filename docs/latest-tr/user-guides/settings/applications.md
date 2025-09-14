# Uygulamaları Ayarlama

Şirketinizin birden fazla uygulaması varsa, yalnızca tüm şirket trafiğinin istatistiklerini değil, her bir uygulama için ayrı ayrı istatistikleri de görüntülemek isteyebilirsiniz. Trafiği uygulamalara göre ayırmak için Wallarm sistemindeki "uygulama" varlığını kullanabilirsiniz.

Uygulamaları kullanarak şunları yapabilirsiniz:

* Her uygulama için ayrı ayrı [Görüntüle](#viewing-events-and-statistics-by-application) etkinlikleri ve istatistikleri
* Belirli uygulamalar için Wallarm özelliklerini, ör. [Yapılandır](#configuring-wallarm-features-by-application) tetikleyiciler, kurallar ve diğerleri
* Ortamları (production, testing vb.) ayrı uygulamalar olarak ele almak

    !!! info "İzole ortamlar"
        Uygulamalar olarak yönetilen ortamlar, geçerli Wallarm hesabının tüm kullanıcıları tarafından erişilebilir. Verilerini yalnızca belirli kullanıcıların erişebileceği şekilde yalıtmanız gerekiyorsa, uygulamalar yerine [multitenancy](../../installation/multi-tenant/overview.md) özelliğini kullanın.

Wallarm’ın uygulamalarınızı tanıyabilmesi için, düğüm yapılandırmasındaki uygun yönerge aracılığıyla onlara benzersiz tanımlayıcılar atamanız gerekir. Tanımlayıcılar hem uygulama alan adları hem de alan adı yolları için ayarlanabilir.

Varsayılan olarak, Wallarm her uygulamayı kimliği (ID) `-1` olan `default` uygulaması olarak kabul eder.

## Uygulama ekleme

1. (İsteğe bağlı) Wallarm Console → **Settings** → **Applications** bölümünden bir uygulama ekleyin.

    ![Uygulama ekleme](../../images/user-guides/settings/configure-app.png)

    !!! warning "Yönetici erişimi"
        Yalnızca **Administrator** rolüne sahip kullanıcılar **Settings** → **Applications** bölümüne erişebilir.
2. Düğüm yapılandırması üzerinden uygulamaya benzersiz bir ID atayın:

    * Wallarm, NGINX modülü, bulut pazar yeri imajı, yapılandırma dosyası bağlanmış NGINX tabanlı Docker konteyneri, sidecar konteyner olarak kuruluysa [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) yönergesi.
    * Wallarm, NGINX tabanlı Docker konteyneri olarak kuruluysa [ortam değişkeni](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) `WALLARM_APPLICATION`.
    * Wallarm, Ingress controller olarak kuruluysa [Ingress açıklaması](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `wallarm-application`.
    * Native Node all-in-one installer, Docker imajı ve AWS AMI için [`route_config.wallarm_application`](../../installation/native-node/all-in-one-conf.md#route_configwallarm_application) parametresi.
    * Native Node Helm chart için [`config.connector.route_config.wallarm_application`](../../installation/native-node/helm-chart-conf.md#configconnectorroute_configwallarm_application) parametresi.
    * Edge inline veya connector kurulum penceresindeki uygulama yapılandırması.

    Değer, `0` hariç pozitif bir tamsayı olabilir.

    Wallarm Console → **Settings** → **Applications** içinde belirtilen ID’ye sahip bir uygulama ekli değilse, listeye otomatik olarak eklenecektir. Uygulama adı, belirtilen tanımlayıcıya göre otomatik olarak oluşturulacaktır (ör. ID’si `-1` olan uygulama için `Application #1`). Ad daha sonra Wallarm Console üzerinden değiştirilebilir.

Uygulama doğru şekilde yapılandırıldıysa, bu uygulamayı hedefleyen saldırıların ayrıntılarında adı görüntülenecektir. Uygulama yapılandırmasını test etmek için uygulama adresine [test attack](../../admin-en/uat-checklist-en.md#node-registers-attacks) gönderebilirsiniz.

## Otomatik uygulama tanımlama

Otomatik uygulama tanımlamayı şu temellere göre yapılandırabilirsiniz:

* Belirli istek başlıkları
* `map` NGINX yönergesini kullanarak belirli bir istek başlığı veya URL’lerin bir bölümü

!!! info "Yalnızca NGINX"
    Listelenen yaklaşımlar yalnızca NGINX tabanlı self-hosted düğüm dağıtımları için geçerlidir.

### Belirli istek başlıklarını temel alarak uygulama tanımlama

Bu yaklaşım iki adımdan oluşur:

1. Ağınızı, uygulama ID’sini içeren başlığın her isteğe ekleneceği şekilde yapılandırın.
1. Bu başlığın değerini `wallarm_application` yönergesinin değeri olarak kullanın. Aşağıdaki örneğe bakın.

NGINX yapılandırma dosyası örneği:

```
server {
    listen       80;
    server_name  example.com;
    wallarm_mode block;
    wallarm_application $http_custom_id;
    
    location / {
        proxy_pass      http://upstream1:8080;
    }
}    
```

Saldırı isteği örneği:

```
curl -H "Cookie: SESSID='UNION SELECT SLEEP(5)-- -" -H "CUSTOM-ID: 222" http://example.com
```

Bu istek:

* Bir saldırı olarak kabul edilir ve **Attacks** bölümüne eklenir.
* ID’si `222` olan uygulama ile ilişkilendirilir.
* İlgili uygulama yoksa, **Settings** → **Applications** bölümüne eklenir ve otomatik olarak `Application #222` olarak adlandırılır.

![İstek başlığı temelinde uygulama ekleme](../../images/user-guides/settings/configure-app-auto-header.png)

### `map` NGINX yönergesini kullanarak belirli istek başlığına veya URL’lerin bir bölümüne göre uygulama tanımlama

`map` NGINX yönergesini kullanarak, belirli bir istek başlığına veya uç nokta URL’lerinin bir bölümüne göre uygulamalar ekleyebilirsiniz. Yönergenin ayrıntılı açıklaması için NGINX [belgelerine](https://nginx.org/en/docs/http/ngx_http_map_module.html#map) bakın.

<a id="viewing-events-and-statistics-by-application"></a>
## Etkinlikleri ve istatistikleri uygulamaya göre görüntüleme

Uygulamalarınızı kurduktan sonra, ayrı ayrı şunları görüntüleyebilirsiniz:

* İlginizi çeken yalnızca ilgili uygulama için [Attacks](../../user-guides/events/check-attack.md) ve [incidents](../../user-guides/events/check-incident.md)
* Yalnızca ilgili uygulama ile ilişkili [API sessions](../../api-sessions/overview.md)
* Yalnızca ilgili uygulama ile ilişkili [dashboards](../../user-guides/dashboards/threat-prevention.md) üzerindeki istatistikler

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(61.23% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/njvywcvjddzd?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

<a id="configuring-wallarm-features-by-application"></a>
## Wallarm özelliklerini uygulamaya göre yapılandırma

Uygulamalarınızı kurduktan sonra, her uygulama için Wallarm koruma özelliklerini ayrı ayrı yapılandırabilirsiniz; örneğin:

* [Rules](../rules/rules.md#conditions)
* [Triggers](../triggers/triggers.md#understanding-filters)
* [IP lists](../ip-lists/overview.md#limit-by-target-application)
* [API Abuse Prevention](../../api-abuse-prevention/setup.md#creating-profiles)

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(61.23% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/1dsy6claa8wb?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Wallarm özelliklerini uygulamalara atamak, bu özelliklerin uygulanması gereken koşulları belirtmenin ve altyapınızın farklı bölümleri için yapılandırmaları farklılaştırmanın en kolay yoludur.

## Uygulamaları silme

Bir uygulamayı Wallarm sisteminden silmek için, düğüm yapılandırma dosyasından ilgili yönergeyi silin. Uygulama yalnızca **Settings** → **Applications** bölümünden silinirse, listede geri yüklenecektir.