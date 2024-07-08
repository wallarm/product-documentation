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

# NGINX Kararlı Linux Paketlerini Kullanarak Wallarm OOB Dinamik Modül Yükleme

Bu talimatlar, Wallarm'ın [OOB](../overview.md) dinamik modülünün nginx.org'dan NGINX `stable` için Linux paketlerini kullanarak nasıl kurulacağını adım adım açıklar. 

Wallarm aşağıdaki işletim sistemlerini destekler:

* Debian 11.x (bullseye)
* Ubuntu 18.04 LTS (bionic)
* Ubuntu 20.04 LTS (focal)
* Ubuntu 22.04 LTS (jammy)
* CentOS 7.x
* Amazon Linux 2.0.2021x ve düşük
* AlmaLinux, Rocky Linux veya Oracle Linux 8.x
* RHEL 8.x

## Kullanım Durumları

--8<-- "../include-tr/waf/installation/linux-packages/nginx-stable-use-cases.md"

## Gereklilikler

--8<-- "../include-tr/waf/installation/linux-packages/requirements-nginx-stable.md"

--8<-- "../include-tr/waf/installation/linux-packages/common-steps-to-install-node-nginx-stable.md"

## 6. Wallarm'ın Trafiği Analiz Etmesini Etkinleştirme

--8<-- "../include-tr/waf/installation/oob/steps-for-mirroring-linux.md"

## 7. NGINX'i Yeniden Başlatma

--8<-- "../include-tr/waf/root_perm_info.md"

--8<-- "../include-tr/waf/restart-nginx-4.4-and-above.md"

## 8. Trafiğin Wallarm Örneğine Gönderilmesini Yapılandırma

--8<-- "../include-tr/waf/installation/sending-traffic-to-node-oob.md"

## 9. Wallarm Düğüm İşleminin Test Edilmesi

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"

## 10. Yerleştirilen Çözümün İnce Ayarını Yapmak

NGINX `stable` için varsayılan ayarlarla dinamik Wallarm modülü yüklendi. Filtrasyon düğümü, dağıtımdan sonra bazı ek yapılandırmalar gerektirebilir.

Wallarm ayarları, [NGINX direktifleri](../../../../admin-en/configure-parameters-en.md) veya Wallarm Konsolu UI kullanılarak tanımlanır. Direktifler, Wallarm düğümü ile makinedeki aşağıdaki dosyalara ayarlanmalıdır:

* Wallarm düğümü ile makinede NGINX ayarları ile `/etc/nginx/conf.d/default.conf`
* Küresel filtreleme düğümü ayarları ile `/etc/nginx/conf.d/wallarm.conf`

    Bu dosya, tüm alan adlarına uygulanan ayarlar için kullanılır. Farklı alan adı gruplarına farklı ayarlar uygulamak için, `default.conf` dosyasını kullanın veya her alan adı grubu için yeni yapılandırma dosyaları oluşturun (örneğin, `example.com.conf` ve `test.com.conf`). NGINX yapılandırma dosyaları hakkında daha ayrıntılı bilgi [resmi NGINX belgelerinde](https://nginx.org/en/docs/beginners_guide.html) mevcuttur.
* Wallarm düğüm izleme ayarları ile `/etc/nginx/conf.d/wallarm-status.conf`. Detaylı açıklama [bağlantı][wallarm-status-instr] içerisindedir.
* Tarantool veritabanı ayarları ile `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool`

Gerektiğinde uygulayabileceğiniz tipik ayarların birkaçı aşağıda belirtilmiştir:

--8<-- "../include-tr/waf/installation/linux-packages/common-customization-options.md"

* [NGINX'de dinamik DNS çözümlemesinin yapılandırılması][dynamic-dns-resolution-nginx]