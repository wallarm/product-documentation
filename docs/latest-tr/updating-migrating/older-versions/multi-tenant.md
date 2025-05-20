[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[link-wallarm-health-check]:        ../../admin-en/uat-checklist-en.md

# Ömrünü Tamamlamış (EOL) Çok Kiracılı Node'un Güncellenmesi

Bu talimatlar, ömrünü tamamlamış (sürüm 3.6 ve altı) çok kiracılı node'un 5.0 sürümüne kadar güncellenmesi için izlenecek adımları açıklar.

## Gereksinimler

* [technical tenant account](../../installation/multi-tenant/overview.md#tenant-accounts) altında eklenmiş **Global administrator** rolüne sahip kullanıcı tarafından sonraki komutların yürütülmesi
* US Wallarm Cloud ile çalışıyorsanız `https://us1.api.wallarm.com` adresine veya EU Wallarm Cloud ile çalışıyorsanız `https://api.wallarm.com` adresine erişim. Lütfen erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun.
* Saldırı tespit kuralları güncellemeleri ve API spesifikasyonlarına erişim sağlamak, ayrıca beyaz listeye alınmış, kara listeye alınmış veya gri listeye alınmış ülkeler, bölgeler ya da veri merkezlerine ilişkin kesin IP'leri almak için aşağıdaki IP adreslerine erişim.

    --8<-- "../include/wallarm-cloud-ips.md"

## Adım 1: Wallarm destek ekibi ile iletişime geçin

Çok kiracılı node güncellemesi sırasında [custom ruleset building](../../user-guides/rules/rules.md#ruleset-lifecycle) özelliğinin en son sürümünü almak için [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçin.

!!! info "Engellenmiş güncelleme"
    Yanlış bir custom ruleset building sürümünün kullanılması güncelleme sürecini engelleyebilir.

Destek ekibi ayrıca çok kiracılı node'un güncellenmesiyle ve gerekli yeniden yapılandırmayla ilgili tüm sorularınızı yanıtlamanıza yardımcı olacaktır.

## Adım 2: Standart güncelleme prosedürünü uygulayın

Standart prosedürler aşağıdakilerdir:

* [Wallarm NGINX modüllerinin güncellenmesi](nginx-modules.md)
* [postanalytics modülünün güncellenmesi](separate-postanalytics.md)
* [Wallarm Docker NGINX tabanlı imajının güncellenmesi](docker-container.md)
* [Entegre Wallarm modüllü NGINX Ingress controller'ın güncellenmesi](ingress-controller.md)
* [cloud node imajının güncellenmesi](cloud-image.md)

!!! warning "Çok kiracılı node oluşturulması"
    Wallarm node oluşturulurken, lütfen **Multi-tenant node** seçeneğini seçin:

    ![Multi-tenant node creation](../../images/user-guides/nodes/create-multi-tenant-node.png)

## Adım 3: Çok kiracılılık yeniden yapılandırması

Trafiğin kiracılarınız ve onların uygulamalarıyla nasıl ilişkilendirileceğine dair yapılandırmayı yeniden yazın. Aşağıdaki örneğe göz atın. Örnekte:

* Tenant, partnerin müşterisini temsil eder. Partnere ait iki müşteri bulunmaktadır.
* `tenant1.com` ve `tenant1-1.com` hedefli trafik, müşteri 1 ile ilişkilendirilmelidir.
* `tenant2.com` hedefli trafik, müşteri 2 ile ilişkilendirilmelidir.
* Müşteri 1'in ayrıca üç uygulaması bulunmaktadır:
    * `tenant1.com/login`
    * `tenant1.com/users`
    * `tenant1-1.com`

    Bu 3 yol hedefli trafik, ilgili uygulama ile ilişkilendirilmelidir; kalan trafik müşteri 1’in genel trafiği olarak kabul edilmelidir.

### Önceki sürüm yapılandırmanızı inceleyin

3.6 sürümünde, bu aşağıdaki gibi yapılandırılabilirdi:

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

Yukarıdaki yapılandırma ile ilgili notlar:

* `tenant1.com` ve `tenant1-1.com` hedefli trafik, bu müşteriye API request aracılığıyla `20` ve `23` değerleriyle ilişkilendirilmiştir.
* Diğer uygulamaları kiracılara bağlamak için benzer API istekleri gönderilmiş olmalıdır.
* Kiracılar ve uygulamalar ayrı varlıklar olduğundan, bunları farklı direktiflerle yapılandırmak mantıklıdır. Ek API isteklerinden kaçınmak da pratik olacaktır. Kiracılar ile uygulamalar arasındaki ilişkilerin yapılandırma üzerinden tanımlanması mantıklıdır. Mevcut yapılandırmada bu eksik olmakla birlikte, aşağıda açıklanan yeni 5.x yaklaşımında yer alacaktır.

### 5.x Yaklaşımını İnceleyin

5.x sürümünde, node yapılandırmasında tenant tanımlamanın yolu UUID kullanımıdır.

Yapılandırmayı yeniden yazmak için aşağıdakileri yapın:

1. Kiracılarınızın UUID'lerini edinin.
1. Kiracıları dahil edip, uygulamalarını NGINX yapılandırma dosyasına ekleyin.

### Kiracılarınızın UUID'lerini Edinin

Kiracı listesini almak için, authenticated istekleri Wallarm API'ye gönderin. Kimlik doğrulama yöntemi, [tenant creation](../../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api) sırasında kullanılan yöntemle aynıdır.

1. Daha sonra UUID ile ilişkili olan `clientid`(leri) bulmak için alın:

    === "Via Wallarm Console"

        Wallarm Console kullanıcı arayüzündeki **ID** sütunundan `clientid`(leri) kopyalayın:
        
        ![Selector of tenants in Wallarm Console](../../images/partner-waf-node/clients-selector-in-console-ann.png)
    === "By sending request to API"
        1. `/v2/partner_client` yoluna GET isteği gönderin:

            !!! info "Kendi client'ınızdan gönderilen isteğe örnek"
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
            
            Burada `PARTNER_ID`, tenant oluşturma prosedüründeki [**Adım 2**](../../installation/multi-tenant/configure-accounts.md#step-1-sign-up-and-send-a-request-to-activate-the-multitenancy-feature)'de elde edilen değerdir.

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

        1. Yanıt içerisinden `clientid`(leri) kopyalayın.
1. Her kiracının UUID'sini almak için, `v1/objects/client` yoluna POST isteği gönderin:

    !!! info "Kendi client'ınızdan gönderilen isteğe örnek"
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

1. Yanıttan, `uuid`(leri) kopyalayın.

### Kiracıları Dahil Edin ve Uygulamalarını NGINX Yapılandırma Dosyasında Ayarlayın

NGINX yapılandırma dosyasında:

1. Yukarıda aldığınız tenant UUID'lerini [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) direktiflerinde belirtin.
1. Korunan uygulama ID'lerini [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) direktiflerinde ayarlayın.

    Node 3.6 veya daha düşük için kullanılan NGINX yapılandırması uygulama yapılandırmasını içeriyorsa, sadece tenant UUID'lerini belirtip uygulama yapılandırmasını değiştirmeden bırakın.

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

* Kiracılar ve uygulamalar farklı direktiflerle yapılandırılmıştır.
* Kiracılar ile uygulamalar arasındaki ilişkiler, ilgili NGINX yapılandırma bloklarındaki `wallarm_application` direktifleri ile tanımlanmıştır.

## Adım 4: Wallarm çok kiracılı node işleyişini test edin

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"