[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #2-create-a-security-group
[anchor2]:      #1-create-a-pair-of-ssh-keys-in-aws

[img-create-sg]:                ../../../../images/installation-ami/common/create_sg.png
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
[autoscaling-docs]:                 ../../../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md
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
[link-wallarm-health-check]:        ../../../../admin-en/uat-checklist-en.md

# Amazon Machine Image'den Wallarm Dağıtma

Bu makale, Wallarm'u AWS üzerinde satır içi (in-line) resmi Amazon Machine Image (AMI) kullanarak dağıtmak için yönergeler sunmaktadır.

## Kullanım Durumları

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. Örneği Wallarm Cloud'a Bağlama

Bulut örneğinin düğümü, [cloud-init.py][cloud-init-spec] betiği aracılığıyla Cloud'a bağlanır. Bu betik, sağlanan bir token kullanarak düğümü Wallarm Cloud'a kaydeder, küresel olarak izleme [moduna][wallarm-mode] ayarlar ve düğümü, `--proxy-pass` bayrağı temelinde yasal trafiği iletecek şekilde yapılandırır. NGINX'in yeniden başlatılması, kurulumu tamamlar.

Cloud imajından oluşturulan örnekte `cloud-init.py` betiğini aşağıdaki şekilde çalıştırın:

=== "US Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
    ```
=== "EU Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
    ```

* `WALLARM_LABELS='group=<GROUP>'` ifadesi, mevcutsa var olan ya da mevcut değilse oluşturulacak bir düğüm grubu adı belirler. Bu, yalnızca bir API token kullanıldığında uygulanır.
* `<TOKEN>`, kopyalanan token değeridir.
* `<PROXY_ADDRESS>`, Wallarm düğümünün yasal trafiği iletmek üzere proxy yapacağı adrestir. Bu, mimarinize bağlı olarak bir uygulama örneğinin IP'si, yük dengeleyici veya DNS adı gibi bir değer olabilir.

## 7. Wallarm Örneğine Trafik Gönderimini Yapılandırma

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 8. Wallarm'un Çalışmasını Test Etme

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. Dağıtılan Çözümü İnce Ayar Yapma

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"