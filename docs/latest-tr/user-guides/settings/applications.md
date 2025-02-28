# Uygulamaların Yapılandırılması

Şirketinizde birden fazla uygulama bulunuyorsa, tüm şirket trafiğinin istatistiklerini görüntülemenin yanı sıra her bir uygulamanın istatistiklerini ayrı ayrı görüntülemek uygun olabilir. Trafiği uygulamalara göre ayırmak için Wallarm sistemindeki "application" varlığını kullanabilirsiniz.

Uygulamaları kullanmanın avantajları:

* Her bir uygulama için olayları ve istatistikleri ayrı ayrı görüntüleme
* Belirli uygulamalar için [triggers](../triggers/triggers.md), [rules](../rules/rules.md) ve diğer Wallarm özelliklerini yapılandırma
* [Configure Wallarm in separated environments](../../installation/multi-tenant/overview.md#issues-addressed-by-multitenancy)

Wallarm'ın uygulamalarınızı tanımlayabilmesi için, ilgili direktif aracılığıyla node yapılandırmasında onlara benzersiz tanımlayıcılar atamanız gerekmektedir. Tanımlayıcılar, uygulama domain’leri ve domain yolları için ayarlanabilir.

Varsayılan olarak, Wallarm her uygulamayı tanımlayıcı (ID) `-1` olan `default` uygulama olarak kabul eder.

## Uygulama Ekleme

1. (Opsiyonel) Wallarm Console → **Settings** → **Applications** bölümünden bir uygulama ekleyin.

    ![Uygulama ekleme](../../images/user-guides/settings/configure-app.png)

    !!! warning "Yönetici erişimi"
        **Settings** → **Applications** bölümüne sadece **Administrator** rolüne sahip kullanıcılar erişebilir.
2. Node yapılandırmasında uygulamaya benzersiz bir ID atayın:

    * Wallarm NGINX modülü, cloud marketplace görüntüsü, yapılandırma dosyası monte edilmiş NGINX tabanlı Docker konteyneri veya sidecar konteyner olarak kurulduysa, [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) direktifini kullanın.
    * Wallarm NGINX tabanlı Docker konteyneri olarak kurulduysa, [environment variable](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) `WALLARM_APPLICATION`'ı kullanın.
    * Wallarm Ingress controller olarak kurulduysa, [Ingress annotation](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `wallarm-application`'ı kullanın.
    * Wallarm, yapılandırma dosyası monte edilmiş Envoy tabanlı Docker konteyneri olarak kurulduysa, [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings) parametresini kullanın.
    * Native Node all-in-one kurulumunda ve Docker görüntüsü için [`route_config.wallarm_application`](../../installation/native-node/all-in-one-conf.md#route_configwallarm_application) parametresini kullanın.
    * Native Node Helm chart için [`config.connector.route_config.wallarm_application`](../../installation/native-node/helm-chart-conf.md#configconnectorroute_configwallarm_application) parametresini kullanın.
    * Edge inline veya connector kurulum penceresindeki uygulama yapılandırmasını kullanın.

    Değer, `0` hariç pozitif bir tamsayı olabilir.

    Belirtilen ID'ye sahip bir uygulama Wallarm Console → **Settings** → **Applications** bölümüne eklenmemişse, listeye otomatik olarak eklenecektir. Uygulama adı, belirtilen tanımlayıcıya göre otomatik olarak oluşturulacaktır (örneğin, ID `-1` olan uygulama için `Application #1`). Daha sonra Wallarm Console üzerinden ad değiştirilebilir.

Uygulama doğru bir şekilde yapılandırılmışsa, adı bu uygulamaya yönelik saldırıların ayrıntılarında görüntülenecektir. Uygulama yapılandırmasını test etmek için, uygulama adresine [test saldırısı](../../admin-en/installation-check-operation-en.md#2-run-a-test-attack) gönderebilirsiniz.

## Otomatik Uygulama Tanımlaması

Otomatik uygulama tanımlamasını aşağıdaki temeller üzerine yapılandırabilirsiniz:

* Belirli istek başlıkları
* `map` NGINX direktifi kullanarak belirli istek başlığı veya URL parçaları

!!! info "Sadece NGINX"
    Liste edilen yaklaşımlar yalnızca NGINX tabanlı self-hosted node dağıtımları için geçerlidir.

### Belirli İstek Başlıkları Temelinde Uygulama Tanımlaması

Bu yaklaşım iki adımdan oluşur:

1. Ağınızı, uygulama ID'sine sahip başlığın her isteğe eklenmesini sağlayacak şekilde yapılandırın.
2. Bu başlığın değerini `wallarm_application` direktifi için değer olarak kullanın. Aşağıdaki örneğe bakınız.

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

* Bir saldırı olarak kabul edilecek ve **Attacks** bölümüne eklenecektir.
* `222` ID'li uygulamayla ilişkilendirilecektir.
* Eğer ilgili uygulama mevcut değilse, **Settings** → **Applications** bölümüne eklenecek ve otomatik olarak `Application #222` olarak adlandırılacaktır.

![Başlık isteği temelinde uygulama ekleme](../../images/user-guides/settings/configure-app-auto-header.png)

### `map` NGINX Direktifi Kullanılarak Belirli İstek Başlığı veya URL Parçası Temelinde Uygulama Tanımlaması

Belirli istek başlığı veya uç noktası URL parçalarına dayanarak, `map` NGINX direktifini kullanarak uygulamaları ekleyebilirsiniz. Direktifin detaylı açıklaması NGINX [dökümantasyonunda](https://nginx.org/en/docs/http/ngx_http_map_module.html#map) yer almaktadır.

## Uygulamayı Silme

Wallarm sisteminden bir uygulamayı silmek için, ilgili direktifi node yapılandırma dosyasından kaldırın. Uygulama sadece **Settings** → **Applications** bölümünden silinirse, listeye yeniden eklenecektir.