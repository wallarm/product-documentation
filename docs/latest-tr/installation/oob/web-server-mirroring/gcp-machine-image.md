```markdown
[link-launch-instance]:     https://cloud.google.com/deep-learning-vm/docs/quickstart-marketplace

[img-ssh-key-generation]:       ../../../images/installation-gcp/common/ssh-key-generation.png
[versioning-policy]:            ../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../installation/supported-deployment-options.md
[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../installation/supported-deployment-options.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../../admin-en/configure-parameters-en.md
[autoscaling-docs]:                 ../../../admin-en/installation-guides/google-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../../admin-en/configure-logging.md
[oob-advantages-limitations]:       ../overview.md#limitations
[wallarm-mode]:                     ../../../admin-en/configure-wallarm-mode.md
[wallarm-api-via-proxy]:            ../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[img-grouped-nodes]:                ../../../images/user-guides/nodes/grouped-nodes.png
[cloud-init-spec]:                  ../../cloud-platforms/cloud-init.md
[wallarm_force_directive]:          ../../../admin-en/configure-parameters-en.md#wallarm_force
[web-server-mirroring-examples]:    overview.md#configuration-examples-for-traffic-mirroring
[ip-lists-docs]:                    ../../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../../api-specification-enforcement/overview.md

# GCP Makine Görüntüsünden Wallarm OOB Dağıtımı

Bu makale, [Wallarm OOB](overview.md)'un, [resmi Makine Görüntüsü](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) kullanılarak Google Cloud Platform üzerinde dağıtımı için talimatlar sunmaktadır. Burada tanımlanan çözüm, bir web veya proxy sunucu tarafından aynalanan trafiği analiz etmek üzere tasarlanmıştır.

## Kullanım Senaryoları

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. Filtreleme Düğümünü Wallarm Cloud'a Bağlayın

Bulut örneğindeki düğüm, [cloud-init.py][cloud-init-spec] betiği aracılığıyla Cloud'a bağlanır. Bu betik, sağlanan bir jeton kullanarak düğümü Wallarm Cloud'a kaydeder, küresel olarak izleme [modu][wallarm-mode]na ayarlar ve NGINX'in `location /` bloğunda yalnızca aynalanan trafik kopyalarını analiz etmek üzere [`wallarm_force`][wallarm_force_directive] yönergelerini uygular. NGINX'in yeniden başlatılması, kurulumu tamamlar.

Cloud görüntüsünden oluşturulan örnekte `cloud-init.py` betiğini aşağıdaki gibi çalıştırın:

=== "US Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
    ```
=== "EU Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
    ```

* `WALLARM_LABELS='group=<GROUP>'` mevcut bir düğüm grubu adı ayarlar (varsa mevcut, yoksa oluşturulur). Bu yalnızca bir API jetonu kullanılıyorsa uygulanır.
* `<TOKEN>` jetonun kopyalanan değeridir.

## 6. Web veya Proxy Sunucunuzu, Trafiği Wallarm Düğümüne Yansıtacak Şekilde Yapılandırın

1. Web veya proxy sunucunuzu (örneğin NGINX, Envoy) gelen trafiği Wallarm düğümüne yansıtacak şekilde yapılandırın. Yapılandırma ayrıntıları için web veya proxy sunucunuzun belgelerine başvurmanızı öneririz.

    [web-server-mirroring-examples] bağlantısı içinde, en popüler web ve proxy sunucularından (NGINX, Traefik, Envoy) biri için örnek yapılandırmayı bulabilirsiniz.
1. Düğümün bulunduğu örnekteki `/etc/nginx/sites-enabled/default` dosyasına aşağıdaki yapılandırmayı ekleyin:

    ```
    location / {
        include /etc/nginx/presets.d/mirror.conf;
        
        # 222.222.222.22 adresini, aynalama sunucusunun adresi ile değiştirin
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
    }
    ```

    Wallarm Console'un [saldırganların IP adreslerini görüntülemesi][real-ip-docs] için `set_real_ip_from` ve `real_ip_header` yönergeleri gereklidir.

## 7. Wallarm İşlemini Test Edin

--8<-- "../include/waf/installation/cloud-platforms/test-operation-oob.md"

## 8. Dağıtılmış Çözümü İnce Ayar Yapın

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"
```