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
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx/dynamic-module/
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

# NGINX Stable için Dinamik Modül Olarak Kurulum

Bu talimatlar, NGINX deposundan kurulmuş açık kaynak sürümü olan NGINX `stable` için Wallarm filtreleme düğümünün dinamik modül olarak nasıl kurulacağını anlatıyor.

!!! bilgi "Hepsi bir arada kurulum"
    Wallarm düğüm 4.6’dan itibaren, aşağıda listelenen tüm işlemleri otomatikleştiren [hepsi bir arada kurulum](all-in-one.md) önerilmektedir.

## Kullanım durumları

--8<-- "../include-tr/waf/installation/linux-packages/nginx-stable-use-cases.md"

## Gereksinimler

--8<-- "../include-tr/waf/installation/linux-packages/requirements-nginx-stable.md"

--8<-- "../include-tr/waf/installation/linux-packages/common-steps-to-install-node-nginx-stable.md"

## 6. Wallarm'ın trafiği analiz etmesini etkinleştirin

--8<-- "../include-tr/waf/installation/common-steps-to-enable-traffic-analysis.md"

## 7. NGINX'i yeniden başlatın

--8<-- "../include-tr/waf/root_perm_info.md"

--8<-- "../include-tr/waf/restart-nginx-4.4-and-above.md"

## 8. Trafik gönderimini Wallarm örneğine ayarlayın

--8<-- "../include-tr/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. Wallarm düğüm operasyonunu test edin

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"

## 10. Yüklenen çözümü ince ayar yapın

Varsayılan ayarlarla dinamik Wallarm modülü NGINX `stable` için kurulmuştur. Filtre düğümü kurulumdan sonra bazı ek konfigürasyonlar gerektirebilir.

Wallarm ayarları [NGINX yönergeleri](../../admin-en/configure-parameters-en.md) veya Wallarm Console UI kullanılarak belirlenir. Yönergeler Wallarm düğümü olan makinedeki aşağıdaki dosyalarda ayarlanmalıdır:

* NGINX ayarlarıyla `/etc/nginx/conf.d/default.conf` 
* Genel filtreleme düğümü ayarlarıyla `/etc/nginx/conf.d/wallarm.conf` 

    Bu dosya tüm alan adlarına uygulanan ayarlar için kullanılır. Farklı ayarları farklı alan adı gruplarına uygulamak için `default.conf` dosyasını kullanın veya her alan adı grubu için yeni konfigürasyon dosyaları oluşturun (örneğin, `example.com.conf` ve `test.com.conf`). NGINX konfigürasyon dosyaları hakkında daha ayrıntılı bilgi [resmi NGINX belgelerinde](https://nginx.org/en/docs/beginners_guide.html) bulunabilir.
* Wallarm düğümü izleme ayarlarıyla `/etc/nginx/conf.d/wallarm-status.conf`. Ayrıntılı açıklama [bağlantı][wallarm-status-instr] 'da mevcuttur.
* Tarantool veritabanı ayarlarıyla `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool`.

Aşağıda, gerektiğinde uygulayabileceğiniz tipik ayarların birkaçı verilmiştir:

* [Filtrasyon modunun konfigürasyonu][waf-mode-instr]

--8<-- "../include-tr/waf/installation/linux-packages/common-customization-options.md"

* [NGINX'de dinamik DNS çözünürlüğünü yapılandırma][dynamic-dns-resolution-nginx]