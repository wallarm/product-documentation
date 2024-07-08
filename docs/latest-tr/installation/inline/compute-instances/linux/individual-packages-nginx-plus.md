[img-wl-console-users]: ../../../../images/check-user-no-2fa.png
[wallarm-status-instr]: ../../../../admin-en/configure-statistics-service.md
[memory-instr]: ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]: ../../../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]: ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]: ../../../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]: ../../../../admin-en/configure-wallarm-mode.md
[logging-instr]: ../../../../admin-en/configure-logging.md
[proxy-balancer-instr]: ../../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]: ../../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]: ../../../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]: ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]: ../../../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]: ../../../../admin-en/installation-postanalytics-en/
[waf-mode-recommendations]: ../../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]: ../../../../user-guides/ip-lists/overview.md
[versioning-policy]: ../../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]: ../../../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]: /installation/nginx-plus/
[img-node-with-several-instances]: ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]: ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]: ../../../custom/custom-nginx-version.md
[node-token]: ../../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]: ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]: ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]: ../../../../installation/supported-deployment-options.md
[img-grouped-nodes]: ../../../../images/user-guides/nodes/grouped-nodes.png

# NGINX Plus için Dinamik Modül Olarak Kurulum

Bu talimatlarda, Wallarm filtreleme düğümünün resmi ticari sürüm olan NGINX Plus için bir dinamik modül olarak nasıl kurulacağı adım adım anlatılmaktadır. Düğüm, trafiği çevrimiçi olarak analiz edecektir.

!!! bilgi "Her şey dahil kurulum"
    Wallarm düğümü 4.6'dan itibaren, aşağıdaki adımlarda listelenen tüm işlemleri otomatikleştiren ve düğüm dağıtımını çok daha kolay hale getiren [her şey dahil kurulum](../../../../installation/nginx/all-in-one.md) önerilmektedir.

## Kullanım Senaryoları

--8<-- "../include-tr/waf/installation/linux-packages/nginx-plus-use-cases.md"

## Gereklilikler

--8<-- "../include-tr/waf/installation/linux-packages/requirements-nginx-plus.md"

--8<-- "../include-tr/waf/installation/linux-packages/common-steps-to-install-node-nginx-plus.md"

## 6. Wallarm'ın trafiği analiz etmesini etkinleştirin

--8<-- "../include-tr/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

## 7. NGINX Plus'ı yeniden başlatın

--8<-- "../include-tr/waf/root_perm_info.md"

--8<-- "../include-tr/waf/restart-nginx-4.4-and-above.md"

## 8. Trafik göndermeyi Wallarm örneğine yapılandırın

--8<-- "../include-tr/waf/installation/sending-traffic-to-node-inline.md"

## 9. Wallarm düğüm işlemini test edin

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"

## 10. Dağıtılan çözümü ince ayarla

NGINX Plus için varsayılan ayarları ile dinamik Wallarm modülü kurulmuştur. Filtreleme düğümü, dağıtım sonrasında bazı ek yapılandırmalar gerektirebilir.

Wallarm ayarları [NGINX yönergeleri](../../../../admin-en/configure-parameters-en.md) veya Wallarm Konsol Arayüzü kullanılarak tanımlanır. Yönergeler, Wallarm düğümü ile makinedeki aşağıdaki dosyalara ayarlanmalıdır:

* `/etc/nginx/conf.d/default.conf` NGINX ayarları ile
* `/etc/nginx/conf.d/wallarm.conf` global filtreleme düğüm ayarları ile

    Bu dosya, tüm alan adlarına uygulanan ayarlar için kullanılır. Farklı ayarları farklı alan adı gruplarına uygulamak için `default.conf` dosyasını kullanın veya her alan adı grubu için yeni yapılandırma dosyaları oluşturun (örneğin, `example.com.conf` ve `test.com.conf`). NGINX yapılandırma dosyaları hakkında daha ayrıntılı bilgi [resmi NGINX belgelerinde](https://nginx.org/en/docs/beginners_guide.html) bulunabilir.
* `/etc/nginx/conf.d/wallarm-status.conf` Wallarm düğümü izleme ayarları ile. Detaylı açıklama [buradan][wallarm-status-instr] ulaşılabilir.
* `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool` Tarantool veritabanı ayarları ile

Aşağıda, ihtiyaç duymanız durumunda uygulayabileceğiniz birkaç tipik ayar bulunmaktadır:

* [Filtrasyon modu yapılandırması][waf-mode-instr]

--8<-- "../include-tr/waf/installation/linux-packages/common-customization-options.md"