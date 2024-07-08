[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #2-bir-guvenlik-grubu-olustur
[anchor2]:      #1-awsde-bir-ssh-anahtar-cifti-olustur

[img-create-sg]:                ../../../images/installation-ami/common/create_sg.png
[versioning-policy]:            ../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../installation/supported-deployment-options.md
[node-token]:                       ../../../quickstart/getting-started.md#walarm-filtreleme-dugumunu-kur
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#dugum-olusturma-icin-api-ve-dugum-tokenlari
[platform]:                         ../../../installation/supported-deployment-options.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#yol-gezintisi
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../../admin-en/configure-parameters-en.md
[autoscaling-docs]:                 ../../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../../admin-en/configure-logging.md
[oob-advantages-limitations]:       ../overview.md#avantajlar-ve-sınırlamalar
[wallarm-mode]:                     ../../../admin-en/configure-wallarm-mode.md
[wallarm-api-via-proxy]:            ../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[img-grouped-nodes]:                ../../../images/user-guides/nodes/grouped-nodes.png

# Amazon Image'tenWallarm OOB'yi Dağıtma

Bu makale, [Wallarm OOB](overview.md)'un AWS üzerinde [resmi Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD) kullanılarak nasıl dağıtılacağına dair talimatları sağlar. Burada tarif edilen çözüm, bir web veya proxy sunucusu tarafından yansıtılan trafiği analiz etmek üzere tasarlanmıştır.

## Vaka Çalışmaları

--8<-- "../include-tr/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include-tr/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.md"

## 6. Wallarm'ın yansıtılan trafiği analiz etmesini sağlayın

--8<-- "../include-tr/waf/installation/oob/steps-for-mirroring-cloud.md"

## 7. NGINX'i Yeniden Başlatın

--8<-- "../include-tr/waf/installation/cloud-platforms/restart-nginx.md"

## 8. Web veya proxy sunucunuzu Wallarm düğümüne trafiği yansıtmak için yapılandırın

Web veya proxy sunucunuzu (ör. NGINX, Envoy) gelen trafiği Wallarm düğümüne yansıtacak şekilde yapılandırın. Yapılandırma ayrıntıları için web veya proxy sunucunuzun belgelerine bakmanızı öneririz.

[Link](overview.md#web-sunucusunun-trafik-yansıtma-icin-yapilandirmasina-örnekler) içinde, en popüler web ve proxy sunucularının örnek yapılandırmasını (NGINX, Traefik, Envoy) bulacaksınız.

## 9. Wallarm operasyonunu test edin

--8<-- "../include-tr/waf/installation/cloud-platforms/test-operation-oob.md"

## 10. Dağıtılmış çözümü ince ayarlayın

--8<-- "../include-tr/waf/installation/cloud-platforms/fine-tuning-options.md"