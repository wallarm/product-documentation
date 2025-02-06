[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #2-create-a-security-group
[anchor2]:      #1-create-a-pair-of-ssh-keys-in-aws

[img-create-sg]:                ../../../images/installation-ami/common/create_sg.png
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
[autoscaling-docs]:                 ../../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md
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

# Amazon İmajından Wallarm OOB Dağıtımı

Bu makale, AWS üzerinde [Wallarm OOB](overview.md)'nin, resmi [Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD) kullanılarak dağıtılması için talimatları sunmaktadır. Burada anlatılan çözüm, bir web veya proxy sunucusu tarafından aynalanan trafiği analiz etmek üzere tasarlanmıştır.

## Kullanım Durumları

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. Örneği Wallarm Cloud'a Bağlayın

Bulut örneğinin düğümü, [cloud-init.py][cloud-init-spec] betiği aracılığıyla Wallarm Cloud'a bağlanır. Bu betik, sağlanan token ile düğümü Wallarm Cloud'a kaydeder, global olarak izleme [modu][wallarm-mode]'na ayarlar ve NGINX'in `location /` bloğunda yalnızca aynalanan trafik kopyalarını analiz etmek üzere [`wallarm_force`][wallarm_force_directive] yönergelerini uygular. NGINX'in yeniden başlatılması kurulumu tamamlar.

Cloud imajından oluşturulan örnekte `cloud-init.py` betiğini aşağıdaki gibi çalıştırın:

=== "US Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
    ```
=== "EU Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
    ```

* `WALLARM_LABELS='group=<GROUP>'` ifadesi, bir düğüm grubu adı ayarlar (mevcutsa kullanılır, yoksa oluşturulur). Bu ayar yalnızca API token kullanıldığında geçerlidir.
* `<TOKEN>`, kopyalanan token değeridir.

## 7. Web veya Proxy Sunucunuzu Wallarm Düğümüne Aynalanan Trafiği Yansıtacak Şekilde Yapılandırın

1. Web veya proxy sunucunuzu (örneğin, NGINX, Envoy) gelen trafiği Wallarm düğümüne aynalamak üzere yapılandırın. Yapılandırma detayları için web veya proxy sunucusu dokümantasyonunuza başvurmanızı öneririz.

    [web-server-mirroring-examples] bağlantısında, en popüler web ve proxy sunucuları (NGINX, Traefik, Envoy) için örnek yapılandırma bulabilirsiniz.
1. Aşağıdaki yapılandırmayı, düğümlü örnekteki `/etc/nginx/sites-enabled/default` dosyasına ekleyin:

    ```
    location / {
        include /etc/nginx/presets.d/mirror.conf;
        
        # Aynalama sunucusunun adresi için 222.222.222.22 değerini değiştirin
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
    }
    ```

    `set_real_ip_from` ve `real_ip_header` yönergeleri, Wallarm Console'un [atak yapanların IP adreslerini görüntülemesi][real-ip-docs] için gereklidir.

## 8. Wallarm Operasyonunu Test Edin

--8<-- "../include/waf/installation/cloud-platforms/test-operation-oob.md"

## 9. Dağıtılan Çözümü İnce Ayar Yapın

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"