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

# Dağıtılan NGINX için Wallarm OOB Dinamik Modülünün Kurulumu

Bu talimatlar, dağıtılan NGINX için Linux paketlerini kullanarak Wallarm'ı bir [OOB](../overview.md) dinamik modül olarak kurmayı tarif eder.

NGINX Açık Kaynak, nginx.org ya da Debian/CentOS varsayılan depolarından ihtiyaçlarınıza, NGINX sürüm tercihlerinize ve depo yönetim politikalarınıza bağlı olarak elde edilebilir. Wallarm, hem [nginx.org](nginx-stable.md) hem de dağıtılan sürümleri için paketler sağlar. Bu kılavuz, Debian/CentOS depolarından NGINX'e odaklanmaktadır.

Wallarm modülü, aşağıdaki işletim sistemlerinde dağıtılan NGINX ile uyumludur:

* Debian 10.x (buster)
* Debian 11.x (bullseye)
* CentOS 7.x
* AlmaLinux, Rocky Linux ya da Oracle Linux 8.x
* RHEL 8.x

## Kullanım durumları

--8<-- "../include-tr/waf/installation/linux-packages/nginx-distro-use-cases.md"

## Gereksinimler

--8<-- "../include-tr/waf/installation/linux-packages/requirements-nginx-distro.md"

--8<-- "../include-tr/waf/installation/linux-packages/common-steps-to-install-node-nginx-distro.md"

## 5. Wallarm'ın trafiği analiz etmesini etkinleştirin

--8<-- "../include-tr/waf/installation/oob/steps-for-mirroring-linux.md"

## 6. NGINX'i yeniden başlatın

--8<-- "../include-tr/waf/root_perm_info.md"

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux ya da Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

## 7. Trafiği Wallarm örneğine göndermeyi yapılandırın

--8<-- "../include-tr/waf/installation/sending-traffic-to-node-oob.md"

## 8. Wallarm düğüm işlemini test edin

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"

## 9. Dağıtılmış çözümü hızlıca ayarlayın

Dinamik Wallarm modülü, NGINX `stable` için varsayılan ayarlarla kurulmuştur. Filtreleme düğümü, dağıtımdan sonra bazı ek konfigürasyonları gerektirebilir.

Wallarm ayarları [NGINX yönergeleri](../../../../admin-en/configure-parameters-en.md) veya Wallarm Konsol UI kullanılarak tanımlanır. Yönergeler, Wallarm düğümü olan makinedeki aşağıdaki dosyalarda belirlenmelidir:

* NGINX ayarlarıyla `/etc/nginx/conf.d/default.conf`
* Global filtreleme düğümü ayarları ile `/etc/nginx/conf.d/wallarm.conf`

    Dosya, tüm alan adlarına uygulanan ayarlar için kullanılır. Farklı ayarları farklı alan adı gruplarına uygulamak için, `default.conf` dosyasını kullanın veya her alan adı grubu için yeni yapılandırma dosyaları oluşturun (örneğin, `example.com.conf` ve `test.com.conf`). NGINX yapılandırma dosyaları hakkında daha ayrıntılı bilgi [resmi NGINX belgelerinde](https://nginx.org/en/docs/beginners_guide.html) mevcuttur.
* Wallarm düğümü izleme ayarlarıyla `/etc/nginx/conf.d/wallarm-status.conf`. Detaylı açıklama [bağlantıda][wallarm-status-instr] mevcuttur.
* Tarantool veritabanı ayarları ile `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool`

Aşağıda, gerektiğinde uygulayabileceğiniz tipik ayarların bir kaçı bulunmaktadır:

--8<-- "../include-tr/waf/installation/linux-packages/common-customization-options.md"

* [NGINX'de dinamik DNS çözümlemesini yapılandırma][dynamic-dns-resolution-nginx]
