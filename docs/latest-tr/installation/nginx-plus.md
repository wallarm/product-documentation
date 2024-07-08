[img-wl-console-users]:             ../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[memory-instr]:                     ../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../admin-en/installation-postanalytics-en/
[waf-mode-recommendations]:          ../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[versioning-policy]:                ../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx-plus/
[img-node-with-several-instances]:  ../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 custom/custom-nginx-version.md
[node-token]:                       ../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../installation/supported-deployment-options.md
[inline-docs]:                      inline/overview.md
[oob-docs]:                         oob/overview.md
[oob-advantages-limitations]:       oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../images/user-guides/nodes/grouped-nodes.png

# NGINX Plus için Dinamik Modül Olarak Yükleme

Bu talimatlar Wallarm filtreleme düğümünün resmi ticari sürüm NGINX Plus için bir dinamik modül olarak nasıl kurulacağını anlatır.

!!! bilgi "Her şey bir arada kurulum"
    Wallarm düğümü 4.6'dan başlayarak, aşağıda listelenen tüm etkinlikleri otomatikleştiren ve düğüm dağıtımını çok daha kolay hale getiren [her şey dahil kurulum](../installation/nginx/all-in-one.md) kullanmanız önerilir.

## Kullanım durumları

--8<-- "../include-tr/waf/installation/linux-packages/nginx-plus-use-cases.md"

## Gereksinimler

--8<-- "../include-tr/waf/installation/linux-packages/requirements-nginx-plus.md"

--8<-- "../include-tr/waf/installation/linux-packages/common-steps-to-install-node-nginx-plus.md"

## 6. Trafik analizini etkinleştirin

--8<-- "../include-tr/waf/installation/common-steps-to-enable-traffic-analysis.md"

## 7. NGINX Plus'ı yeniden başlatın

--8<-- "../include-tr/waf/root_perm_info.md"

--8<-- "../include-tr/waf/restart-nginx-4.4-and-above.md"

## 8. Trafik göndermeyi Wallarm örneğine yapılandırın

--8<-- "../include-tr/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. Wallarm düğüm işlemini test edin

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"

## 10. Dağıtılan çözümü ince ayar yapın

NGINX Plus için varsayılan ayarlarla dinamik Wallarm modülü kurulmuştur. Filtreleme düğümü, dağıtımdan sonra bazı ek yapılandırmalar gerektirebilir.

Wallarm ayarları, [NGINX direktifleri](../admin-en/configure-parameters-en.md) veya Wallarm Console UI kullanılarak tanımlanır. Direktifler, Wallarm düğümü olan makinedeki aşağıdaki dosyalarda ayarlanmalıdır:

* NGINX ayarlarıyla `/etc/nginx/conf.d/default.conf`
* Genel filtre düğümü ayarlarıyla `/etc/nginx/conf.d/wallarm.conf` 

    Bu dosya, tüm alan adlarına uygulanan ayarlar için kullanılır. Farklı ayarları farklı alan adı gruplarına uygulamak için, `default.conf` dosyasını kullanın veya her alan adı grubu için yeni yapılandırma dosyaları oluşturun (örneğin, `example.com.conf` ve `test.com.conf`). NGINX yapılandırma dosyaları hakkında daha ayrıntılı bilgiler [resmi NGINX belgelerinde](https://nginx.org/en/docs/beginners_guide.html) mevcuttur.
* Wallarm düğümü izleme ayarlarıyla `/etc/nginx/conf.d/wallarm-status.conf`. Ayrıntılı açıklama, [bağlantıda][wallarm-status-instr] mevcuttur.
* Tarantool veritabanı ayarlarıyla `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool`

Aşağıda, gerektiğinde uygulayabileceğiniz tipik ayarların birkaçı bulunmaktadır:

* [Filtrasyon modu yapılandırması][waf-mode-instr]

--8<-- "../include-tr/waf/installation/linux-packages/common-customization-options.md"