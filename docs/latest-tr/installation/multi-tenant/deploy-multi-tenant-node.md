[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md

# Çok Kiracılı Düğümün Dağıtımı ve Yapılandırılması

[çok kiracılı](overview.md) düğüm, aynı anda birden fazla bağımsız şirket altyapısını veya izole ortamı korur.

## Çok kiracılı düğüm dağıtım seçenekleri

Altyapınıza ve ele alınan ihtiyaca göre çok kiracılı düğüm dağıtım seçeneğini seçin:

* Tüm müşterilerin veya izole ortamların trafiğini filtrelemek için tek bir Wallarm node aşağıdaki gibi dağıtın:

    ![İş ortağı düğüm şeması](../../images/partner-waf-node/partner-traffic-processing-4.0.png)

    * Tek bir Wallarm node birden fazla kiracının (Tenant 1, Tenant 2) trafiğini işler.

        --8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"
        
    * Wallarm düğümü, trafiği alacak kiracıyı, kiracıya özgü benzersiz tanımlayıcıya ([`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)) göre belirler.
    * `https://tenant1.com` ve `https://tenant2.com` alan adları için, iş ortağı veya müşteri IP adresi `225.130.128.241` ile DNS A kayıtları yapılandırılmıştır. Bu ayar örnek olarak gösterilmiştir, iş ortağı ve kiracı tarafında farklı bir ayar kullanılabilir.
    * İş ortağı tarafında, meşru isteklerin Tenant 1 (`http://upstream1:8080`) ve Tenant 2 (`http://upstream2:8080`) kiracılarının adreslerine yönlendirilmesi (proxy) yapılandırılmıştır. Bu ayar örnek olarak gösterilmiştir, iş ortağı ve kiracı tarafında farklı bir ayar kullanılabilir.

* Her biri belirli bir kiracının trafiğini filtreleyen birden çok Wallarm node'u aşağıdaki gibi dağıtın:

    ![Müşteri - birden çok düğüm şeması](../../images/partner-waf-node/client-several-nodes.png)

    * Birden çok Wallarm node, her biri belirli bir kiracının trafiğini filtreler (Tenant 1, Tenant 2).
    * https://tenant1.com alan adı için, müşteri IP adresi 225.130.128.241 ile DNS kaydı yapılandırılmıştır.
    * https://tenant2.com alan adı için, müşteri IP adresi 225.130.128.242 ile DNS kaydı yapılandırılmıştır.
    * Her düğüm meşru istekleri kendi kiracısının adreslerine yönlendirir (proxy):
        * Düğüm 1 Tenant 1'e (http://upstream1:8080).
        * Düğüm 2 Tenant 2'ye (http://upstream2:8080).

## Çok kiracılı düğümün özellikleri

Çok kiracılı düğüm:

* Bir normal filtreleme düğümüyle aynı [platformlara](../../installation/supported-deployment-options.md) ve aynı talimatlara göre kurulabilir, **ancak** aşağıdakiler hariç:

    * MuleSoft Mule ve Flex Gateway bağlayıcısı
    * Amazon CloudFront bağlayıcısı
    * Cloudflare bağlayıcısı
    * Broadcom Layer7 API Gateway bağlayıcısı
    * Fastly bağlayıcısı
    * Kong API Gateway bağlayıcısı
    * Istio bağlayıcısı
* **Teknik kiracı** veya **kiracı** seviyesinde kurulabilir. Kiracıya Wallarm Console erişimi sağlamak istiyorsanız, filtreleme düğümü ilgili kiracı seviyesinde kurulmalıdır.
* Normal bir filtreleme düğümüyle aynı talimatlara göre yapılandırılabilir.
* Trafiği kiracılara göre bölmek için [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) yönergesi kullanılır.
* Ayarları uygulamalara göre bölmek için [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) yönergesi kullanılır.

## Dağıtım gereksinimleri

* [Yapılandırılmış kiracı hesapları](configure-accounts.md)
* [technical tenant account](overview.md#tenant-accounts) altında eklenmiş **Global administrator** rolüne sahip kullanıcı tarafından sonraki komutların yürütülmesi
* [Filtreleme düğümü kurulumu için desteklenen platform](../../installation/supported-deployment-options.md)

## Çok kiracılı düğüm dağıtımı için öneriler

* Kiracının Wallarm Console'a erişmesi gerekiyorsa, filtreleme düğümünü uygun kiracı hesabı içinde oluşturun.
* Filtreleme düğümünü kiracının NGINX yapılandırma dosyası üzerinden yapılandırın.

## Çok kiracılı düğüm dağıtımı prosedürü

1. Wallarm Console → **Nodes** içinde, **Create node**'a tıklayın ve **Wallarm node** seçin.

    !!! info "Mevcut bir Wallarm düğümünü çok kiracılı moda geçirme"
        Mevcut bir Wallarm düğümünü çok kiracılı moda geçirmek istiyorsanız, **Nodes** bölümünde ilgili düğüm menüsünden **Make it multi-tenant** seçeneğini kullanın.

        Geçiş ve onay sonrası, 4. adıma ilerleyin.
1. **Multi-tenant node** seçeneğini belirleyin.

    ![Çok kiracılı düğüm oluşturma](../../images/user-guides/nodes/create-multi-tenant-node.png)
1. Düğüm adını belirleyin ve **Create**'e tıklayın.
1. Filtreleme düğümü jetonunu kopyalayın.
1. Filtreleme düğümünün dağıtım biçimine bağlı olarak, [uygun talimatlardaki](../../installation/supported-deployment-options.md) adımları uygulayın.
1. Trafiği kiracıların benzersiz tanımlayıcılarını kullanarak kiracılar arasında bölün.

    === "NGINX ve NGINX Plus"
        Kiracının NGINX yapılandırma dosyasını açın ve [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) yönergesini kullanarak trafiği kiracılar arasında bölün. Aşağıdaki örneğe bakın.
    === "NGINX Ingress Controller"
        Her Ingress kaynağı için kiracı UUID'sini ayarlamak üzere Ingress [annotation](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-partner-client-uuid` öğesini kullanın. Bir kaynak bir kiracı ile ilişkilidir:

        ```
        kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-partner-client-uuid=VALUE
        ```
    === "Docker NGINX tabanlı imaj"
        1. NGINX yapılandırma dosyasını açın ve [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) yönergesini kullanarak trafiği kiracılar arasında bölün. Aşağıdaki örneğe bakın.
        1. Yapılandırma dosyasını [bağlayarak konteyneri çalıştırın](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file).
    === "Kubernetes Sidecar"
        1. NGINX yapılandırma dosyasını açın ve [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) yönergesini kullanarak trafiği kiracılar arasında bölün.
        1. Bir NGINX yapılandırma dosyasını [Wallarm sidecar konteynerine](../../installation/kubernetes/sidecar-proxy/customization.md#using-custom-nginx-configuration) mount edin.

    İki müşterinin trafiğini işleyen filtreleme düğümü için NGINX yapılandırma dosyası örneği:

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

    * Kiracı tarafında, iş ortağı IP adresi ile DNS A kayıtları yapılandırılır
    * İş ortağı tarafında, kiracı adreslerine isteklerin yönlendirilmesi (proxy) yapılandırılır (`wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` olan kiracı için `http://upstream1:8080` ve `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222` olan kiracı için `http://upstream2:8080`)
    * Gelen tüm istekler iş ortağının adresinde işlenir, meşru istekler `wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` olan kiracı için `http://upstream1:8080` adresine ve `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222` olan kiracı için `http://upstream2:8080` adresine yönlendirilir

1. Gerekirse, [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) yönergesini kullanarak kiracı uygulamalarının kimliklerini belirtin.

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

    `11111111-1111-1111-1111-111111111111` kiracısına ait iki uygulama vardır:
    
    * `tenant1.com/login` uygulama `21`'dir
    * `tenant1.com/users` uygulama `22`'dir

## Çok kiracılı düğümün yapılandırılması

Filtreleme düğümü ayarlarını özelleştirmek için [mevcut yönergeleri](../../admin-en/configure-parameters-en.md) kullanın.

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"