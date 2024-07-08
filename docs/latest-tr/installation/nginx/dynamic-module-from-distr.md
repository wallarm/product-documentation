[img-wl-console-users]:             ../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../admin-en/installation-postanalytics-en/
[versioning-policy]:               ../../updating-migrating/versioning-policy.md#version-list
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[img-node-with-several-instances]:  ../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../custom/custom-nginx-version.md
[node-token]:                       ../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../installation/supported-deployment-options.md
[inline-docs]:                      ../inline/overview.md
[oob-docs]:                         ../oob/overview.md
[oob-advantages-limitations]:       ../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png

# Dağıtım Sağlamak için Dinamik Modül Olarak Yükleme

Bu talimatlar, Debian/CentOS depolarından yüklenen açık kaynaklı NGINX sürümü için dinamik bir modül olarak Wallarm filtreleme düğümünü nasıl yükleyeceğinizi tarif eder.

!!! bilgi "Her şey dahil kurulum"
    Wallarm düğümü 4.6'dan başlayarak, aşağıdaki adımlardaki tüm aktiviteleri otomatikleştiren ve düğüm dağıtımını çok daha kolaylaştıran [her şey dahil kurulumu](all-in-one.md) kullanmanız önerilir.

NGINX Açık Kaynak, nginx.org veya Debian/CentOS'ın varsayılan depolarından alınabilir. Bu, gereksinimlerinize, NGINX sürüm tercihlerinize ve depo yönetim politikalarınıza bağlıdır. Wallarm, hem [nginx.org](dynamic-module.md) hem de dağıtım tarafından sağlanan sürümler için paketler sunar. Bu rehber, Debian/CentOS depolarından NGINX üzerinde yoğunlaşır.

## Kullanım durumları

--8<-- "../include-tr/waf/installation/linux-packages/nginx-distro-use-cases.md"

## Gereksinimler

--8<-- "../include-tr/waf/installation/linux-packages/requirements-nginx-distro.md"

--8<-- "../include-tr/waf/installation/linux-packages/common-steps-to-install-node-nginx-distro.md"

## 5. Wallarm'ın trafiği analiz etmesini etkinleştirin

--8<-- "../include-tr/waf/installation/common-steps-to-enable-traffic-analysis.md"

## 6. NGINX'i Yeniden Başlatın

--8<-- "../include-tr/waf/root_perm_info.md"

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

## 7. Trafiğin Wallarm örneğine gönderilmesini yapılandırın

--8<-- "../include-tr/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. Wallarm düğüm işlemi test edin

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"

## 9. Dağıtılan çözümü ince ayarlayın

Varsayılan ayarlarla dinamik Wallarm modülü NGINX `stable` için yüklüdür. Filtreleme düğümü, dağıtımın ardından ek yapılandırmayı gerektirebilir.

Wallarm ayarları, [NGINX yönergeleri](../../admin-en/configure-parameters-en.md) veya Wallarm Console UI kullanılarak tanımlanır. Yönergeler, Wallarm düğümü bulunan makinedeki aşağıdaki dosyalarda ayarlanmalıdır:

* NGINX ayarlarıyla `/etc/nginx/conf.d/default.conf`
* Genel filtreleme düğümü ayarlarıyla `/etc/nginx/conf.d/wallarm.conf`

    Dosya, tüm alan adlarına uygulanan ayarlar için kullanılır. Farklı alan adı gruplarına farklı ayarlar uygulamak için, `default.conf` dosyasını kullanabilir veya her alan adı grubu için yeni yapılandırma dosyaları oluşturabilirsiniz (örneğin, `example.com.conf` ve `test.com.conf`). NGINX yapılandırma dosyaları hakkında daha detaylı bilgi, [resmi NGINX belgelerinde](https://nginx.org/en/docs/beginners_guide.html) mevcuttur.
* Wallarm düğüm izleme ayarlarıyla `/etc/nginx/conf.d/wallarm-status.conf`. Detaylı açıklama [bağlantı][wallarm-status-instr] içerisinde mevcuttur.
* Tarantool veritabanı ayarlarıyla `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool`

İhtiyaç duymanız halinde uygulayabileceğiniz tipik ayarların birkaçı aşağıda listelenmiştir:

* [Filtrasyon modu yapılandırması][waf-mode-instr]

--8<-- "../include-tr/waf/installation/linux-packages/common-customization-options.md"

* [NGINX'de dinamik DNS çözümlemesini yapılandırma][dynamic-dns-resolution-nginx]