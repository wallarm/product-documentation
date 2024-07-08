Dilin nazik tonunu koruyun. Sonuç dosyasının tamamen orijinal dosyadaki ile aynı URL'lere sahip olduğundan emin olun:
../../attacks-vulns-list.md#path-traversal
../../images/admin-guides/test-attacks-quickstart.png
../../installation/multi-tenant/configure-accounts.md#tenant-account-structure
mailto:support@wallarm.com
../../user-guides/rules/rules.md
nginx-modules.md
separate-postanalytics.md
docker-container.md
ingress-controller.md
cloud-image.md
https://docs.wallarm.com/3.6/installation/multi-tenant/configure-accounts/#step-4-link-tenants-applications-to-the-appropriate-tenant-account
../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api
../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid
../../admin-en/configure-parameters-en.md#wallarm_application
Aşağıdaki Wallarm.com belgesini İngilizceden Türkçeye çevirin:

[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# EOL çok kiracılı düğümün yükseltilmesi

Bu talimatlar, son ömrüne ulaşmış çok kiracılı düğümün (sürüm 3.6 ve altı) 4.8'e kadar nasıl yükseltileceğini anlatır.

## Gereksinimler

* [Teknik kiracı hesabı](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure) altında eklenen **Global yönetici** rolüne sahip kullanıcı tarafından daha fazla komutların çalıştırılması
* Eğer ABD Wallarm Bulutu ile çalışılıyorsa `https://us1.api.wallarm.com` adresine veya AB Wallarm Bulutu ile çalışılıyorsa `https://api.wallarm.com` adresine erişim. Lütfen erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun.

## Adım 1: Wallarm destek ekibi ile irtibata geçin

Çok kiracılı düğüm yükseltme sırasında [özel kural seti oluşturma](../../user-guides/rules/rules.md) özelliğinin en son sürümünü almak için [Wallarm destek ekibi](mailto:support@wallarm.com)'nden yardım isteyin.

!!! info "Engellenen yükseltme"
    Özel kural seti oluşturma özelliğinin yanlış bir sürümünün kullanılması yükseltme işlemini engelleyebilir.

Destek ekibi, çok kiracılı düğüm yükseltme ve gerekli yeniden yapılandırmayla ilgili tüm sorularınıza yanıt vermenize de yardımcı olacaktır.

## Adım 2: Standart yükseltme prosedürünü izleyin

Standart prosedürler aşağıdakiler içindir:

* [Wallarm NGINX modüllerinin yükseltilmesi](nginx-modules.md)
* [Postanalytics modülünün yükseltilmesi](separate-postanalytics.md)
* [Wallarm Docker NGINX- veya Envoy-tabanlı imajının yükseltilmesi](docker-container.md)
* [Entegre Wallarm modülleri ile NGINX Ingress denetleyicisinin yükseltilmesi](ingress-controller.md)
* [Bulut düğüm imajının yükseltilmesi](cloud-image.md)

!!! warning "Çok kiracılı düğüm oluşturma"
    Wallarm düğümü oluştururken lütfen **Çok kiracılı düğüm** seçeneğini seçin:

    ![Çok kiracılı düğüm oluşturmanın görüntüsü](../../images/user-guides/nodes/create-multi-tenant-node.png)

## Adım 3: Çok kiracılılığı yeniden yapılandırın

Trafik ayarlarınızın kiracılarınızla ve uygulamalarıyla ilişkilendirilmesini yeniden yapılandırın. Aşağıdaki örneği göz önünde bulundurun. Örnekte:

* Kiracı, ortağın müşterisini temsil eder. Ortağın iki müşterisi vardır.
* `tenant1.com` ve `tenant1-1.com`u hedef alan trafik müşteri 1 ile ilişkilendirilmelidir.
* `tenant2.com`u hedef alan trafik müşteri 2 ile ilişkilendirilmelidir.
* Müşteri 1'in ayrıca üç uygulaması vardır:
    * `tenant1.com/login`
    * `tenant1.com/users`
    * `tenant1-1.com`

    Bu 3 yolu hedef alan trafik, ilgili uygulama ile ilişkilendirilmelidir; kalanı müşteri 1'in genel trafiği olarak kabul edilmelidir.

### Önceki sürüm yapılandırmanızı inceleyin

3.6'da, bu aşağıdaki gibi yapılandırılabilirdi:

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

Yukarıdaki yapılandırmadaki notlar:

* `Tenant1.com` ve `tenant1-1.com`u hedef alan trafik, `20` ve `23` değerleri aracılığıyla müşteri 1 ile ilişkilidir, bu değerler [API isteği](https://docs.wallarm.com/3.6/installation/multi-tenant/configure-accounts/#step-4-link-tenants-applications-to-the-appropriate-tenant-account) üzerinden bu müşteriye bağlanmıştır.
* Diğer uygulamalarla kiracıları bağlamak için benzer API istekleri gönderilmiş olmalıdır.
* Kiracılar ve uygulamalar ayrı varlıklardır, bu nedenle onları farklı yönergelerle yapılandırmak mantıklıdır. Ayrıca, ek API isteklerinden kaçınmak da elverişli olabilir. Kiracılar ve uygulamalar arasındaki ilişkileri yapılandırma üzerinden tanımlamak mantıklı olacaktır. Tüm bunlar mevcut yapılandırmada eksik ancak aşağıda açıklanan yeni 4.x yaklaşımında mevcut olacaktır.

### 4.x yaklaşımını inceleyin

Sürüm 4.x'te, UUID düğüm yapılandırmasında kiracıyı tanımlama yoludur.

Yapılandırmayı yeniden yazmak için aşağıdakileri yapın:

1. Kiracılarınızın UUID'lerini alın.
1. NGINX yapılandırma dosyasına kiracıları ekleyin ve uygulamalarını ayarlayın.

### Kiracılarınızın UUID'lerini alın

Kiracıların listesini almak için Wallarm API'ye kimlik doğrulanmış istekler gönderin. Kimlik doğrulama yaklaşımı, [Kiracı oluşturma için kullanılan](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api) ile aynıdır.

1. Daha sonra onlara ilişkin UUID'leri bulmak için `clientid`(ler) alın:

    === "Wallarm Konsolu aracılığıyla"

        Wallarm Konsol kullanıcı arayüzündeki **ID** sütunundan `clientid`(leri) kopyalayın:
        
        ![Wallarm Konsolunda kiracıların seçimi](../../images/partner-waf-node/clients-selector-in-console-ann.png)
    === "API'ye istek göndererek"
        1. `/v2/partner_client` rotasına GET isteği gönderin:

            !!! info "Kendi istemcinizden gönderilen isteğin örneği"
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
            
            Burada `PARTNER_ID`, kiracı oluşturma işleminin [**Adım 2**](../../installation/multi-tenant/configure-accounts.md#step-2-get-access-to-the-tenant-account-creation)'sinde alınan PARTNER_ID’dır.

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

        1. Yanıttan `clientid`(leri) kopyalayın.
1. Her kiracının UUID'sini almak için, `v1/objects/client` rotasına POST isteği gönderin:

    !!! info "Kendi istemcinizden gönderilen isteğin örneği"
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

### NGINX yapılandırma dosyasına kiracıları dahil edin ve uygulamalarını ayarlayın

NGINX yapılandırma dosyasında:

1. Yukarıda aldığınız kiracı UUID'lerini [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) yönergelerinde belirtin.
1. Korunan uygulama kimliklerini [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) yönergelerinde belirleyin.

    Eğer düğüm 3.6 veya altı için kullanılan NGINX yapılandırması uygulama yapılandırmasını içeriyorsa, sadece kiracı UUID'lerini belirtin ve uygulama yapılandırmasını olduğu gibi bırakın.

Örnekleme:

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

* Kiracılar ve uygulamalar farklı yönergelerle yapılandırılır.
* Kiracılar ve uygulamalar arasındaki ilişkiler, NGINX yapılandırma dosyasının ilgili bloklarındaki `wallarm_application` yönergeleri aracılığıyla tanımlanır.

## Adım 4: Wallarm çok kiracılı düğüm işlemini test edin

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"