[link-launch-instance]:     https://cloud.google.com/deep-learning-vm/docs/quickstart-marketplace

[img-ssh-key-generation]:       ../../../../images/installation-gcp/common/ssh-key-generation.png
[versioning-policy]:            ../../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../../installation/supported-deployment-options.md
[node-token]:                       ../../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../../installation/supported-deployment-options.md
[ptrav-attack-docs]:                ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../../../admin-en/configure-parameters-en.md
[autoscaling-docs]:                 ../../../../admin-en/installation-guides/google-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../../../admin-en/configure-logging.md
[wallarm-mode]:                     ../../../../admin-en/configure-wallarm-mode.md
[wallarm-api-via-proxy]:            ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png
[cloud-init-spec]:                  ../../../cloud-platforms/cloud-init.md
[wallarm_force_directive]:          ../../../../admin-en/configure-parameters-en.md#wallarm_force
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../../../api-specification-enforcement/overview.md

# GCP Makine Görüntüsünden Wallarm Dağıtımı

Bu makale, [resmi Makine Görüntüsü](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) kullanılarak GCP üzerinde satır içi olarak Wallarm’un dağıtımı için talimatlar sunar.

## Kullanım Durumları

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. Filtreleme Düğümünü Wallarm Cloud'a Bağlayın

Bulut örneğinin düğümü, [cloud-init.py][cloud-init-spec] betiği aracılığıyla Cloud'a bağlanır. Bu betik, sağlanan bir token kullanarak düğümü Wallarm Cloud'a kaydeder, genel olarak izleme [mode][wallarm-mode] modunda ayarlar ve düğümü, `--proxy-pass` bayrağına bağlı olarak meşru trafiği iletecek şekilde yapılandırır. NGINX'in yeniden başlatılması yapılandırmayı tamamlar.

Cloud görüntüsünden oluşturulan örnekte `cloud-init.py` betiğini aşağıdaki gibi çalıştırın:

=== "US Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
    ```
=== "EU Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
    ```

* `WALLARM_LABELS='group=<GROUP>'` mevcut bir düğüm grubu adı ayarlar (varsa, yoksa oluşturulur). Bu yalnızca API token kullanıldığında uygulanır.
* `<TOKEN>` token’ın kopyalanmış değeridir.
* `<PROXY_ADDRESS>` Wallarm düğümünün meşru trafiği yönlendireceği adrestir. Bu, mimarinize bağlı olarak bir uygulama örneğinin IP'si, yük dengeleyici veya DNS adı gibi olabilir.

## 6. Wallarm Örneğine Trafik Gönderimini Yapılandırın

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 7. Wallarm Operasyonunu Test Edin

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 8. Dağıtılan Çözümü İnce Ayar Yapın

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"