[img-wl-console-users]:             ../../../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../../../admin-en/installation-postanalytics-en.md
[img-node-with-several-instances]:  ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../../custom/custom-nginx-version.md
[node-token]:                       ../../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../../installation/supported-deployment-options.md
[oob-advantages-limitations]:       ../../overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png

# Linux Paketlerini Kullanarak NGINX Plus için Wallarm OOB Dinamik Modülünün Kurulumu

Bu talimatlar, Wallarm'ı NGINX Plus için bir [OOB](../overview.md) dinamik modül olarak kurma adımlarını anlatmaktadır.

Wallarm, aşağıdaki işletim sistemlerini desteklemektedir:

* Debian 11.x (bullseye)
* Ubuntu 18.04 LTS (bionic)
* Ubuntu 20.04 LTS (focal)
* Ubuntu 22.04 LTS (jammy)
* CentOS 7.x
* Amazon Linux 2.0.2021x ve daha düşük
* AlmaLinux, Rocky Linux veya Oracle Linux 8.x
* RHEL 8.x

## Kullanım Durumları

--8<-- "../include-tr/waf/installation/linux-packages/nginx-plus-use-cases.md"

## Gereksinimler

--8<-- "../include-tr/waf/installation/linux-packages/requirements-nginx-plus.md"

--8<-- "../include-tr/waf/installation/linux-packages/common-steps-to-install-node-nginx-plus.md"

## 6. Wallarm'ın trafik analizini aktifleştirin

--8<-- "../include-tr/waf/installation/oob/steps-for-mirroring-linux.md"

## 7. NGINX Plus'ı Yeniden Başlatın

--8<-- "../include-tr/waf/root_perm_info.md"

--8<-- "../include-tr/waf/restart-nginx-4.4-and-above.md"

## 8. Trafik göndermeyi Wallarm örneğine yapılandırın

--8<-- "../include-tr/waf/installation/sending-traffic-to-node-oob.md"

## 9. Wallarm düğüm işlemlerini test edin

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"

## 10. Yüklenen çözümü uygulamaya özel yapın

NGINX Plus için varsayılan ayarlarla dinamik Wallarm modülü kuruludur. Filtralama düğümü, dağıtımdan sonra bazı ek ayarlar gerektirebilir.

Wallarm ayarları, [NGINX directives](../../../../admin-en/configure-parameters-en.md) veya Wallarm Console UI kullanılarak tanımlanır. Yönergeler, Wallarm düğümü olan makinedeki aşağıdaki dosyalara ayarlanmalıdır:

* Wallarm düğüm izleme ayarları içeren `/etc/nginx/conf.d/wallarm-status.conf`. Detaylı açıklama [linke][wallarm-status-instr] bulunabilir.
* Tarantool veritabanı ayarlarıyla `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool`

Aşağıda, gerekirse uygulayabileceğiniz tipik ayarların birkaçı bulunmaktadır:

--8<-- "../include-tr/waf/installation/linux-packages/common-customization-options.md"