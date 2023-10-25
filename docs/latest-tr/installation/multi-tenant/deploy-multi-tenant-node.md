[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md

# Çok Kiracılı Node'un Yayınlanması ve Yapılandırılması

[Çok kiracılı](overview.md) node, birden fazla bağımsız şirket altyapısını veya izole ortamları aynı anda korur.

## Çok kiracılı node yayınlanma seçenekleri

Altyapınıza ve ele alınan soruna göre çok kiracılı node yayınlanma seçeneğini seçin:

* Tüm müşterilerin veya izole ortamların trafiğini filtrelemek üzere bir Wallarm node'u şu şekilde yayınlayın:

    ![Ortak node şeması](../../images/partner-waf-node/partner-traffic-processing-4.0.png)

    * Bir Wallarm node'u, birkaç kiracının (Kiracı 1, Kiracı 2) trafiğini işler.

        --8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"
        
    * Wallarm node'u, trafiği alan kiracıyı, kiracının benzersiz tanımlayıcısı olan ([`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) veya [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#configuration-options-for-the-envoy‑based-wallarm-node) Envoy kurulumunda) ile tanımlar.
    * `https://tenant1.com` ve `https://tenant2.com` alan adları için, ortak veya müşteri IP adresi `225.130.128.241` ile DNS A kayıtları yapılandırılmıştır. Bu ayar bir örnek olarak gösterilmiştir, ortak ve kiracı tarafında farklı bir ayar kullanılabilir.
    * Ortağın tarafında, meşru isteklerin Kiracı 1 (`http://upstream1:8080`) ve Kiracı 2 (`http://upstream2:8080`) adreslerine yönlendirilmesi yapılandırılmıştır. Bu ayar bir örnek olarak gösterilmiştir, ortak ve kiracı tarafında farklı bir ayar kullanılabilir.

    !!! warning "Eğer Wallarm node'u CDN tipindeyse"
        [Wallarm CDN node'u](../cdn-node.md) tarafından `wallarm_application` yapılandırması desteklenmediği için bu yayın seçeneği CDN node tipi tarafından da desteklenmez. Kullanılan node tipi CDN ise, lütfen her biri belirli bir kiracının trafiğini filtreleyen birkaç node yayınlamanızı öneririz.

* Her biri belirli bir kiracının trafiğini filtreleyen birkaç Wallarm node'u aşağıdaki gibi yayınlayın:

    ![Müşteriye ait birkaç node şeması](../../images/partner-waf-node/client-several-nodes.png)

    * Her biri belirli bir kiracının (Kiracı 1, Kiracı 2) trafiğini filtreleyen birkaç Wallarm node'u.
    * https://tenant1.com alan adı için, müşteri IP adresi 225.130.128.241 ile DNS kaydı yapılandırılmıştır.
    * https://tenant2.com alan adı için, müşteri IP adresi 225.130.128.242 ile DNS kaydı yapılandırılmıştır.
    * Her node, meşru istekleri kendi kiracısının adreslerine yönlendirir:
        * Node 1 kiracı 1'e (http://upstream1:8080).
        * Node 2 kiracı 2'ye (http://upstream2:8080).

## Çok kiracılı node özellikleri

Çok kiracılı node:

* Aynı [platformlarda](../../installation/supported-deployment-options.md) ve aynı talimatlara göre bir düzenli filtreleme node'u gibi yüklenebilir.
* **Teknik kiracı** veya **kiracı** düzeyine yüklenebilir. Bir kiracıya Wallarm Konsolu'na erişim sağlamak isterseniz, filtreleme node'u ilgili kiracı seviyesine yüklenmelidir.
* Bir düzenli filtreleme node'u gibi aynı talimatlara göre yapılandırılabilir.
* Kiracılar arasında trafiği bölmek için [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) yönergesi kullanılır.
* Uygulamalar arasında ayarları bölmek için [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) yönergesi kullanılır.

## Yayın gereklilikleri

* [Yapılandırılmış kiracı hesapları](configure-accounts.md)
* [Teknik kiracı hesabı](configure-accounts.md#tenant-account-structure) altında eklenmiş **Global yönetici** rolüne sahip kullanıcı tarafından daha sonraki komutların gerçekleştirilmesi
* [Filtreleme node'u kurulumu için desteklenen platform](../../installation/supported-deployment-options.md)

## Çok kiracılı bir node yayını için öneriler

* Bir kiracının Wallarm Konsolu'na erişmesi gerekiyorsa, filtreleme node'unu uygun bir kiracı hesabı içinde oluşturun.
* Filtreleme node'unu, kiracının NGINX yapılandırma dosyası aracılığıyla yapılandırın.

## Çok kiracılı bir node yayını prosedürü

1. Wallarm Konsolu → **Node'lar**'da, **Node oluştur**'u tıklayın ve **Wallarm node**'unu seçin.

    !!! info "Mevcut bir Wallarm node'unu çok kiracılı moda geçirme"
        Mevcut bir Wallarm node'unu çok kiracılı moda geçirmek isterseniz, **Node'lar** bölümündeki gerekli node menüsünden **Çok kiracılı yap** seçeneğini kullanın.

        Geçiş yapıldıktan ve onaylandıktan sonra, 4. adıma geçin.
1. **Çok kiracılı node** seçeneğini seçin.

    ![Çok kiracılı node oluşturma](../../images/user-guides/nodes/create-multi-tenant-node.png)
1. Node adını ayarlayın ve **Oluştur**'u tıklayın.
1. Filtreleme node'u belirteci'nizi kopyalayın.
1. Bir filtreleme node'u dağıtım şekline bağlı olarak, [uygun talimatlardaki](../../installation/supported-deployment-options.md) adımları gerçekleştirin.
1. Kiracılar arasında trafik paylaşımı yapmak için benzersiz tanımlayıcılarını kullanın.

    === "NGINX ve NGINX Plus"
        Kiracının NGINX yapılandırma dosyasını açın ve kiracılar arasında trafiği [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) yönergesi kullanarak ayırın. Aşağıdaki örneğe bakın.
    === "NGINX Ingress Controller"
        Her bir Ingress kaynağı için kiracı UUID'sini ayarlamak için Ingress [notasyonu](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-partner-client-uuid` kullanın. Bir kaynak bir kiracıyla ilişkilidir:

        ```
        kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-partner-client-uuid=DEĞER
        ```
    === "Docker NGINX tabanlı imaj"
        1. NGINX yapılandırma dosyasını açın ve kiracılar arasında trafiği [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) yönergesi kullanarak ayırın. Aşağıdaki örneğe bakın.
        1. Docker container'ını [yapılandırma dosyasını monte ederek çalıştırın](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file).
    === "Docker Envoy tabanlı imaj"
        1. `envoy.yaml` yapılandırma dosyasını açın ve kiracılar arasında trafiği [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#partner_client_id_param) parametresi kullanarak ayırın.
        1. Docker container'ını [hazırlanan `envoy.yaml`ı monte ederek çalıştırın](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml).
    === "Kubernetes Sidecar"
        1. NGINX yapılandırma dosyasını açın ve kiracılar arasında trafiği [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) yönergesi kullanarak ayırın.
        1. Bir NGINX yapılandırma dosyasını [Wallarm sidecar container'ına](../../installation/kubernetes/sidecar-proxy/customization.md#using-custom-nginx-configuration) monte edin.

    İki müşterinin trafiğini işleyen filtreleme node'u için NGINX yapılandırma dosyası örneği:

    ```
    server {
        listen       80;
        server_name  tenant1.com;
        wallarm_mode block;
        wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
        
        location / {
            proxy_pass      http://upstream1:8080;
        }
    }
    
    server {
        listen       80;
        server_name  tenant2.com;
        wallarm_mode monitoring;
        wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222;
        
        location / {
            proxy_pass      http://upstream2:8080;
        }
    }
    ```

    * Kiracı tarafında, ortak IP adresi ile DNS A kayıtları yapılandırılmıştır
    * Ortağın tarafında, kiracılar için isteklerin adreslere (`http://upstream1:8080` - `wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` olan kiracı için ve `http://upstream2:8080` - `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222` olan kiracı için) yönlendirilmesi yapılandırılmıştır
    * Tüm gelen istekler ortağın adresinde işlenir, meşru istekler `http://upstream1:8080` - `wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` olan kiracı için ve `http://upstream2:8080` - `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222` olan kiracı için yönlendirilir.

1. Gerekirse, kiracının uygulamalarının id'lerini [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) yönergesi kullanarak belirtin.

    Örnek:

    ```
    server {
        listen       80;
        server_name  tenant1.com;
        wallarm_mode block;
        wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
        
        location / {
            proxy_pass      http://upstream1:8080;
        }

        location /login {
            wallarm_application 21;
            ...
        }
        location /users {
            wallarm_application 22;
            ...
        }
    }
    ```

    `11111111-1111-1111-1111-111111111111` id'li kiracıya iki uygulama aittir:
    
    * `tenant1.com/login` alan adı, `21` id'li uygulamadır
    * `tenant1.com/users` alan adı, `22` id'li uygulamadır

## Çok kiracılı node'un yapılandırılması

Filtreleme node'u ayarlarını özelleştirmek için, [kullanılabilir yönergeleri](../../admin-en/configure-parameters-en.md) kullanın.

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"