[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md

# Çok Kiracılı Düğümün Kurulumu ve Yapılandırılması

[Multi-tenant](overview.md) düğümü, aynı anda birden fazla bağımsız şirket altyapısını veya izole edilmiş ortamı korur.

## Çok Kiracılı Düğüm Dağıtım Seçenekleri

Altyapınıza ve ele alınan soruna bağlı olarak çok kiracılı düğüm dağıtım seçeneğini seçin:

* Tüm müşterilerin veya izole edilmiş ortamların trafiğini filtrelemek için tek bir Wallarm node dağıtın:

    ![Partner node scheme](../../images/partner-waf-node/partner-traffic-processing-4.0.png)

    * Tek bir Wallarm node, birden fazla kiracının (Tenant 1, Tenant 2) trafiğini işler.

        --8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"
        
    * Wallarm node, trafiği alan kiracıyı, kiracının benzersiz tanımlayıcısı ([`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) veya Envoy kurulumu sırasında [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md)) ile tanımlar.
    * `https://tenant1.com` ve `https://tenant2.com` domainleri için, partner veya client IP adresi olan `225.130.128.241` ile DNS A kayıtları yapılandırılmıştır. Bu ayar örnek olarak gösterilmiştir; partner ve kiracı tarafında farklı bir ayar kullanılabilir.
    * Partner tarafında, yasal isteklerin Tenant 1 için (`http://upstream1:8080`) ve Tenant 2 için (`http://upstream2:8080`) adreslere proxy edilmesi yapılandırılmıştır. Bu ayar örnek olarak gösterilmiştir; partner ve kiracı tarafında farklı bir ayar kullanılabilir.

* Belirli bir kiracının trafiğini filtreleyen birkaç Wallarm node dağıtın:

    ![Client several nodes scheme](../../images/partner-waf-node/client-several-nodes.png)

    * Belirli bir kiracının (Tenant 1, Tenant 2) trafiğini filtreleyen birden fazla Wallarm node.
    * `https://tenant1.com` domaini için, client IP adresi 225.130.128.241 ile DNS kaydı yapılandırılmıştır.
    * `https://tenant2.com` domaini için, client IP adresi 225.130.128.242 ile DNS kaydı yapılandırılmıştır.
    * Her düğüm, kendi kiracısının trafiğini aşağıdaki adreslere proxy eder:
        * Node 1, Tenant 1 için (http://upstream1:8080).
        * Node 2, Tenant 2 için (http://upstream2:8080).

## Çok Kiracılı Düğüm Özellikleri

Çok kiracılı düğüm:

* Standart bir filtreleme düğümü ile aynı [platformlarda](../../installation/supported-deployment-options.md) ve aynı talimatlara göre kurulabilir, **ancak** aşağıdakiler hariç:

    * MuleSoft connector
    * Amazon CloudFront connector
    * Cloudflare connector
    * Broadcom Layer7 API Gateway connector
    * Fastly connector
    * Kong API Gateway connector
    * Istio connector
* **Teknik tenant** veya **tenant** seviyesinde kurulabilir. Bir kiracıya Wallarm Console erişimi sağlamak istiyorsanız, filtreleme düğümü ilgili tenant seviyesinde kurulmalıdır.
* Standart bir filtreleme düğümü ile aynı talimatlara göre yapılandırılabilir.
* Trafiği kiracılar arasında bölmek için [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) yönergesi kullanılır.
* Ayarları uygulamalar arasında bölmek için [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) yönergesi kullanılır.

## Dağıtım Gereksinimleri

* [Yapılandırılmış tenant hesapları](configure-accounts.md)
* [Teknik tenant hesabı](overview.md#tenant-accounts) altında eklenmiş **Global administrator** rolüne sahip kullanıcı tarafından ek komutların yürütülmesi
* [Filtreleme düğümü kurulumu için desteklenen platform](../../installation/supported-deployment-options.md)

## Çok Kiracılı Düğüm Dağıtımı İçin Öneriler

* Kiracının Wallarm Console erişimine ihtiyacı varsa, filtreleme düğümünü uygun tenant hesabı içinde oluşturun.
* Filtreleme düğümünü, kiracının NGINX yapılandırma dosyası üzerinden yapılandırın.

## Çok Kiracılı Düğüm Dağıtım İşlemleri

1. Wallarm Console → **Nodes** bölümüne gidin, **Create node** seçeneğine tıklayın ve **Wallarm node** seçeneğini seçin.

    !!! info "Mevcut bir Wallarm node'un çok kiracılı moda geçişi"
        Mevcut bir Wallarm node'u çok kiracılı moda geçirmek istiyorsanız, **Nodes** bölümündeki ilgili düğüm menüsünden **Make it multi-tenant** seçeneğini kullanın.

        Geçiş yapılıp onaylandıktan sonra 4. adıma geçin.
1. **Multi-tenant node** seçeneğini seçin.

    ![Multi-tenant node creation](../../images/user-guides/nodes/create-multi-tenant-node.png)
1. Düğüm adını belirleyin ve **Create** butonuna tıklayın.
1. Filtreleme düğüm token'ını kopyalayın.
1. Filtreleme düğümü dağıtım formuna bağlı olarak, [uygun talimatları](../../installation/supported-deployment-options.md) izleyerek adımları gerçekleştirin.
1. Kiracılar arasında benzersiz tanımlayıcıları kullanarak trafiği bölün.

    === "NGINX and NGINX Plus"
        Tenant'ın NGINX yapılandırma dosyasını açın ve [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) yönergesini kullanarak trafiği kiracılar arasında bölün. Aşağıdaki örneğe bakın.
    === "NGINX Ingress Controller"
        Her Ingress kaynağı için tenant UUID ayarlamak amacıyla Ingress [yorum satırını](../../admin-en/configure-kubernetes-en.md#ingress-annotations) kullanın: `nginx.ingress.kubernetes.io/wallarm-partner-client-uuid`. Bir kaynak bir kiracıya ilişkindir:

        ```
        kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-partner-client-uuid=VALUE
        ```
    === "Docker NGINX‑based image"
        1. NGINX yapılandırma dosyasını açın ve [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) yönergesini kullanarak trafiği kiracılar arasında bölün. Aşağıdaki örneğe bakın.
        1. Docker konteynerini, [yapılandırma dosyası mount edilerek](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file) çalıştırın.
    === "Docker Envoy‑based image"
        1. `envoy.yaml` yapılandırma dosyasını açın ve [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#partner_client_id_param) parametresini kullanarak trafiği kiracılar arasında bölün.
        1. Docker konteynerini, [hazır `envoy.yaml` dosyası mount edilerek](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml) çalıştırın.
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

    * Kiracı tarafında, partner IP adresi ile DNS A kayıtları yapılandırılmıştır.
    * Partner tarafında, isteklerin ilgili kiracının adreslerine proxy edilmesi yapılandırılmıştır (`wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` olan kiracı için `http://upstream1:8080` ve `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222` olan kiracı için `http://upstream2:8080`).
    * Tüm gelen istekler partner adresinde işlenir; yasal istekler ilgili kiracıya sırasıyla `http://upstream1:8080` ve `http://upstream2:8080` adreslerine proxy edilir.

1. Gerekirse, tenant uygulamalarının ID'lerini [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) yönergesini kullanarak belirtin.

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

    İki uygulama, `11111111-1111-1111-1111-111111111111` kiracısına aittir:
    
    * `tenant1.com/login` uygulaması 21'dir
    * `tenant1.com/users` uygulaması 22'dir

## Çok Kiracılı Düğümün Yapılandırılması

Filtreleme düğümü ayarlarını özelleştirmek için [mevcut yönergeleri](../../admin-en/configure-parameters-en.md) kullanın.

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"