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
[install-postanalytics-docs]:        ../../../../../admin-en/installation-postanalytics-en/
[versioning-policy]:               ../../../../updating-migrating/versioning-policy.md#version-list
[dynamic-dns-resolution-nginx]:     ../../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[install-postanalytics-instr]:      ../../../../admin-en/installation-postanalytics-en.md
[img-node-with-several-instances]:  ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../../custom/custom-nginx-version.md
[node-token]:                       ../../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../../installation/supported-deployment-options.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png

# Dağıtım Sağlanan NGINX için Dinamik Modül Olarak Kurulum

Bu talimatlar, Wallarm filtreleme düğümünü, Debian/CentOS depolarından yüklenen NGINX açık kaynak sürümü için bir dinamik modül olarak kurma adımlarını anlatmaktadır. Düğüm, trafik analizini çevrimiçi olarak gerçekleştirecektir.

!!! bilgi "Tekli kurulum"
    Wallarm düğümünün 4.6 sürümünden itibaren, aşağıdaki adımlarda listelenen tüm aktiviteleri otomatikleştiren ve düğüm dağıtımını çok daha kolaylaştıran [tekli kurulum](all-in-one.md) kullanmanız önerilir.

NGINX Açık Kaynak, nginx.org veya Debian/CentOS varsayılan depolarından elde edilebilir. Wallarm, hem [nginx.org](individual-packages-nginx-stable.md) hem de dağıtım sağlanan sürümler için paketler sunmaktadır. Bu kılavuz, Debian/CentOS depolarından gelen NGINX'e odaklanmaktadır.

## Kullanım Senaryoları

--8<-- "../include-tr/waf/installation/linux-packages/nginx-distro-use-cases.md"

## Gereklilikler

--8<-- "../include-tr/waf/installation/linux-packages/requirements-nginx-distro.md"

--8<-- "../include-tr/waf/installation/linux-packages/common-steps-to-install-node-nginx-distro.md"

## 5. Trafik analizini Wallarm'ın yapmasını etkinleştirin

--8<-- "../include-tr/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

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
=== "AlmaLinux, Rocky Linux ya da Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

## 7. Trafik gönderimini Wallarm örneğine ayarlama

--8<-- "../include-tr/waf/installation/sending-traffic-to-node-inline.md"

## 8. Wallarm düğüm işleminin testi

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"

## 9. Dağıtılan çözümün ince ayarını yapma

Varsayılan ayarlarla dinamik Wallarm modülü, NGINX `stable` için kuruludur. Filtreleme düğümü, dağıtımdan sonra bazı ek konfigürasyonlar gerektirebilir.

Wallarm ayarları, [NGINX direktifleri](../../../../admin-en/configure-parameters-en.md) veya Wallarm Console UI kullanılarak tanımlanır. Direktifler, Wallarm düğümü olan makinedeki aşağıdaki dosyalara ayarlanmalıdır:

* Wallarm düğüm ayarları olan `/etc/nginx/conf.d/default.conf` NGINX ayarları
* Genel filtreleme düğüm ayarları ile `/etc/nginx/conf.d/wallarm.conf`

    Bu dosya, tüm alan adlarına uygulanan ayarlar için kullanılır. Farklı alan adı gruplarına farklı ayarlar uygulamak için `default.conf` dosyasını kullanın veya her alan adı grubu için yeni konfigürasyon dosyaları oluşturun (örneğin, `example.com.conf` ve `test.com.conf`). NGINX konfigürasyon dosyaları hakkında daha ayrıntılı bilgi, [resmi NGINX belgelerinde](https://nginx.org/en/docs/beginners_guide.html) mevcuttur.
* Wallarm düğüm izleme ayarları ile `/etc/nginx/conf.d/wallarm-status.conf`. Ayrıntılı açıklama, [bağlantı][wallarm-status-instr] içinde mevcuttur
* Tarantool veritabanı ayarları ile `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool`

Aşağıda, gerektiği takdirde uygulayabileceğiniz tipik ayarların birkaçı bulunmaktadır:

* [Filtrasyon modu konfigürasyonu][waf-mode-instr]

--8<-- "../include-tr/waf/installation/linux-packages/common-customization-options.md"

* [NGINX'te dinamik DNS çözümlemesinin yapılandırılması][dynamic-dns-resolution-nginx]