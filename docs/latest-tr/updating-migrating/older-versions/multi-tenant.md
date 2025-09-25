[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[link-wallarm-health-check]:        ../../admin-en/uat-checklist-en.md

# EOL çok kiracılı düğümün yükseltilmesi

Bu talimatlar, kullanımdan kaldırılmış (EOL) çok kiracılı düğümü (3.6 ve altı sürümler) en son 6.x sürümüne yükseltme adımlarını açıklar.

## Gereksinimler

* [teknik kiracı hesabı](../../installation/multi-tenant/overview.md#tenant-accounts) altında eklenmiş **Global administrator** rolüne sahip kullanıcı tarafından ilerleyen komutların yürütülmesi
* US Wallarm Cloud ile çalışıyorsanız `https://us1.api.wallarm.com` adresine veya EU Wallarm Cloud ile çalışıyorsanız `https://api.wallarm.com` adresine erişim. Lütfen bu erişimin güvenlik duvarı tarafından engellenmediğinden emin olun
* Saldırı tespit kuralları ve API spesifikasyonlarının güncellemelerini indirmek, ayrıca izinli (allowlisted), yasaklı (denylisted) veya gri listeye alınmış (graylisted) ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP’leri almak amacıyla aşağıdaki IP adreslerine erişim.

    --8<-- "../include/wallarm-cloud-ips.md"

## Adım 1: Wallarm destek ekibiyle iletişime geçin

Çok kiracılı düğüm yükseltmesi sırasında [özel kurallar kümesi oluşturma](../../user-guides/rules/rules.md#ruleset-lifecycle) özelliğinin en son sürümünü almak için [Wallarm destek ekibi](mailto:support@wallarm.com) yardımı talep edin.

!!! info "Engellenmiş yükseltme"
    Özel kurallar kümesi oluşturma özelliğinin hatalı bir sürümünü kullanmak, yükseltme sürecini engelleyebilir.

Destek ekibi ayrıca çok kiracılı düğüm yükseltmesi ve gerekli yeniden yapılandırmayla ilgili tüm sorularınızı yanıtlamanıza yardımcı olacaktır.

## Adım 2: Standart yükseltme prosedürünü izleyin

Standart prosedürler şunlardır:

* [Wallarm NGINX modüllerini yükseltme](nginx-modules.md)
* [Postanalytics modülünü yükseltme](separate-postanalytics.md)
* [Wallarm Docker NGINX tabanlı imajını yükseltme](docker-container.md)
* [Wallarm modülleri entegre NGINX Ingress controller’ı yükseltme](ingress-controller.md)
* [Bulut düğüm imajını yükseltme](cloud-image.md)

!!! warning "Çok kiracılı düğümün oluşturulması"
    Wallarm düğümü oluşturma sırasında lütfen **Multi-tenant node** seçeneğini seçin:

    ![Multi-tenant node oluşturma](../../images/user-guides/nodes/create-multi-tenant-node.png)

## Adım 3: Çok kiracılı yapıyı yeniden yapılandırın

Trafiğin kiracılarınız ve onların uygulamalarıyla nasıl ilişkilendirildiğine dair yapılandırmayı yeniden yazın. Aşağıdaki örneği dikkate alın. Örnekte:

* Kiracı, iş ortağının müşterisini ifade eder. İş ortağının iki müşterisi vardır.
* `tenant1.com` ve `tenant1-1.com` hedefli trafik 1. müşteriyle ilişkilendirilmelidir.
* `tenant2.com` hedefli trafik 2. müşteriyle ilişkilendirilmelidir.
* 1. müşterinin ayrıca üç uygulaması vardır:
    * `tenant1.com/login`
    * `tenant1.com/users`
    * `tenant1-1.com`

    Bu 3 yola hedeflenen trafik ilgili uygulama ile ilişkilendirilmeli; geri kalanlar 1. müşterinin genel trafiği olarak kabul edilmelidir.

### Önceki sürüm yapılandırmanızı inceleyin

3.6’da bu şu şekilde yapılandırılabilir:

```
server {
  server_name  tenant1.com;
  wallarm_application 20;
  ...
  location /login {
     wallarm_application 21;
     ...
  }
  location /users {
     wallarm_application 22;
     ...
  }

server {
  server_name  tenant1-1.com;
  wallarm_application 23;
  ...
}

server {
  server_name  tenant2.com;
  wallarm_application 24;
  ...
}
...
}
```

Yukarıdaki yapılandırmaya ilişkin notlar:

* `tenant1.com` ve `tenant1-1.com` hedefli trafik, bu müşteriyle `/v2/partner/111/partner_client` API isteği üzerinden ilişkilendirilen `20` ve `23` değerleri aracılığıyla 1. müşteriyle ilişkilendirilir.
* Diğer uygulamaları kiracılarla ilişkilendirmek için benzer API istekleri gönderilmiş olmalıdır.
* Kiracılar ve uygulamalar ayrı varlıklardır, bu nedenle bunları farklı yönergelerle (directive) yapılandırmak mantıklıdır. Ayrıca ek API isteklerinden kaçınmak da kullanışlı olacaktır. Kiracılar ve uygulamalar arasındaki ilişkileri doğrudan yapılandırma üzerinden tanımlamak mantıklıdır. Tüm bunlar mevcut yapılandırmada eksiktir ancak aşağıda açıklanan yeni 6.x yaklaşımıyla mümkün hale gelecektir.

### 6.x yaklaşımını inceleyin

6.x sürümünde, düğüm yapılandırmasında kiracıyı tanımlamanın yolu UUID kullanmaktır.

Yapılandırmayı yeniden yazmak için şunları yapın:

1. Kiracılarınıza ait UUID’leri alın.
1. Kiracıları dahil edin ve NGINX yapılandırma dosyasında uygulamalarını ayarlayın.

### Kiracılarınıza ait UUID’leri alın

Kiracı listesini almak için Wallarm API’ye kimlik doğrulamalı istekler gönderin. Kimlik doğrulama yaklaşımı, kiracı oluşturma için [kullanılan](../../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api) yöntemle aynıdır.

1. İlgili UUID’leri daha sonra bulmak için `clientid`(leri) alın:

    === "Wallarm Console üzerinden"

        `clientid`(leri) Wallarm Console kullanıcı arayüzündeki **ID** sütunundan kopyalayın:
        
        ![Wallarm Console’da kiracı seçici](../../images/partner-waf-node/clients-selector-in-console-ann.png)
    === "API’ye istek göndererek"
        1. `/v2/partner_client` rotasına GET isteği gönderin:

            !!! info "Kendi istemcinizden gönderilen istek örneği"
                === "US Cloud"
                    ``` bash
                    curl -X GET \
                    'https://us1.api.wallarm.com/v2/partner_client?partnerid=PARTNER_ID' \
                    -H 'accept: application/json' \
                    -H "X-WallarmApi-Token: <YOUR_TOKEN>"
                    ```
                === "EU Cloud"
                    ``` bash
                    curl -X GET \
                    'https://api.wallarm.com/v2/partner_client?partnerid=PARTNER_ID' \
                    -H 'accept: application/json' \
                    -H "X-WallarmApi-Token: <YOUR_TOKEN>"
                    ```
            
            Burada `PARTNER_ID`, kiracı oluşturma prosedürünün [**Adım 2**](../../installation/multi-tenant/configure-accounts.md#step-1-sign-up-and-send-a-request-to-activate-the-multitenancy-feature) aşamasında elde edilendir.

            Yanıt örneği:

            ```
            {
            "body": [
                {
                    "id": 1,
                    "partnerid": <PARTNER_ID>,
                    "clientid": <CLIENT_1_ID>,
                    "params": null
                },
                {
                    "id": 3,
                    "partnerid": <PARTNER_ID>,
                    "clientid": <CLIENT_2_ID>,
                    "params": null
                }
            ]
            }
            ```

        1. `clientid`(leri) yanıttan kopyalayın.
1. Her kiracının UUID’sini almak için `v1/objects/client` rotasına POST isteği gönderin:

    !!! info "Kendi istemcinizden gönderilen istek örneği"
        === "US Cloud"
            ``` bash
            curl -X POST \
            https://us1.api.wallarm.com/v1/objects/client \
            -H 'content-type: application/json' \
            -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
            -d '{ "filter": { "id": [<CLIENT_1_ID>, <CLIENT_2_ID>]}}'
            ```        
        === "EU Cloud"
            ``` bash
            curl -X POST \
            https://api.wallarm.com/v1/objects/client \
            -H 'content-type: application/json' \
            -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
            -d '{ "filter": { "id": [<CLIENT_1_ID>, <CLIENT_2_ID>]}}'
            ```        

    Yanıt örneği:

    ```
    {
    "status": 200,
    "body": [
        {
            "id": <CLIENT_1_ID>,
            "name": "<CLIENT_1_NAME>",
            ...
            "uuid": "11111111-1111-1111-1111-111111111111",
            ...
        },
        {
            "id": <CLIENT_2_ID>,
            "name": "<CLIENT_2_NAME>",
            ...
            "uuid": "22222222-2222-2222-2222-222222222222",
            ...
        }
    ]
    }
    ```

1. Yanıttan `uuid`(leri) kopyalayın.

### NGINX yapılandırma dosyasında kiracıları dahil edin ve uygulamalarını ayarlayın

NGINX yapılandırma dosyasında:

1. Yukarıda aldığınız kiracı UUID’lerini [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) yönergelerinde belirtin.
1. Korumalı uygulama kimliklerini [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) yönergelerinde ayarlayın. 

    Düğüm 3.6 veya daha düşük sürüm için kullanılan NGINX yapılandırması uygulama yapılandırmasını içeriyorsa, yalnızca kiracı UUID’lerini belirtin ve uygulama yapılandırmasını olduğu gibi bırakın.

Örnek:

```
server {
  server_name  tenant1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
  location /login {
     wallarm_application 21;
     ...
  }
  location /users {
     wallarm_application 22;
     ...
  }

server {
  server_name  tenant1-1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  wallarm_application 23;
  ...
}

server {
  server_name  tenant2.com;
  wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222;
  ...
}
...
}
```

Yukarıdaki yapılandırmada:

* Kiracılar ve uygulamalar farklı yönergelerle yapılandırılmıştır.
* Kiracılar ve uygulamalar arasındaki ilişkiler, NGINX yapılandırma dosyasının ilgili bloklarındaki `wallarm_application` yönergeleri aracılığıyla tanımlanmıştır.

## Adım 4: Wallarm çok kiracılı düğümün çalışmasını test edin

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"