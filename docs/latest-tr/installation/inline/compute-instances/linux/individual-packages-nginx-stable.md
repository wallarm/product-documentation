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
[dynamic-dns-resolution-nginx]:     ../../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../../custom/custom-nginx-version.md
[node-token]:                       ../../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../../installation/supported-deployment-options.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png

# NGINX Stable için Dinamik Modül Olarak Kurulum

Bu talimatlar, Wallarm filtreleme düğümünün NGINX deposundan kurulan açık kaynaklı NGINX `stable` sürümüne dinamik bir modül olarak nasıl kurulacağını açıklar. Düğüm, trafiği çevrimiçi olarak analiz edecektir.

!!! bilgi "Her şey dahil kurulum"
    Wallarm düğümü 4.6'dan başlayarak, aşağıdaki tüm adımları otomatikleştiren ve düğüm dağıtımını çok daha kolaylaştıran [her şey dahil kurulum](all-in-one.md) kullanmanız önerilir.

## Kullanım durumları

--8<-- "../include-tr/waf/installation/linux-packages/nginx-stable-use-cases.md"

## Gereksinimler

--8<-- "../include-tr/waf/installation/linux-packages/requirements-nginx-stable.md"

--8<-- "../include-tr/waf/installation/linux-packages/common-steps-to-install-node-nginx-stable.md"

## 6. Wallarm'ın trafiği analiz etmesini etkinleştirin

--8<-- "../include-tr/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

## 7. NGINX'i Yeniden Başlatın

--8<-- "../include-tr/waf/root_perm_info.md"

--8<-- "../include-tr/waf/restart-nginx-4.4-and-above.md"

## 8. Trafiği Wallarm örneğine yönlendirmeyi yapılandırın

--8<-- "../include-tr/waf/installation/sending-traffic-to-node-inline.md"

## 9. Wallarm düğüm işlemi test edin

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"

## 10. Dağıtılan çözümü ince ayar yapın

NGINX `stable` için varsayılan ayarlarla dinamik Wallarm modülü kurulu. Filtreleme düğümü, dağıtıldıktan sonra bazı ek yapılandırmalar gerekebilir.

Wallarm ayarları, [NGINX yönergeleri] (../../../../admin-en/configure-parameters-en.md) veya Wallarm Konsol UI aracılığıyla belirlenir. Yönergeler, Wallarm düğümü olan makinedeki aşağıdaki dosyalara ayarlanmalıdır:

* Wallarm düğüm ayarlarının tüm alanlara uygulandığı `/etc/nginx/conf.d/wallarm.conf` ile global filtreleme düğümü ayarları

    Bu dosya, tüm alanlardaki ayarlar için kullanılır. Farklı ayarları farklı alan gruplarına uygulamak için, `default.conf` dosyasını kullanın veya her alan grubu için yeni yapılandırma dosyaları oluşturun (örneğin, `example.com.conf` ve `test.com.conf`). NGINX yapılandırma dosyaları hakkında daha ayrıntılı bilgi [resmi NGINX belgelerinde](https://nginx.org/en/docs/beginners_guide.html) bulunabilir.
* `/etc/nginx/conf.d/wallarm-status.conf` Wallarm düğümü izleme ayarları ile. Ayrıntılı açıklama, [bağlantı] [wallarm-status-instr]'da mevcuttur. 
* Tarantool veritabanı ayarları ile `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool`

Gerekirse uygulayabileceğiniz tipik ayarların birkaçı aşağıda verilmiştir:

* [Filtrasyon modunun yapılandırması] [waf-mode-instr]

--8<-- "../include-tr/waf/installation/linux-packages/common-customization-options.md"

* [NGINX'de dinamik DNS çözümlemesini yapılandırma][dynamic-dns-resolution-nginx]
