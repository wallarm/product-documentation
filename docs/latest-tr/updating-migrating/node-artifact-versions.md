# NGINX Node Artifact Sürümleri ve Değişiklik Günlüğü

Bu belge, yükseltmeleri takip etmenize ve planlamanıza yardımcı olmak için çeşitli form faktörlerdeki [NGINX Wallarm Node](../installation/nginx-native-node-internals.md#nginx-node) 5.x'in mevcut [sürümlerini](versioning-policy.md) listeler.

## All-in-one Yükleyici

4.10 sürümünden itibaren, Wallarm node'larının kurulumu ve yükseltmesi **sadece** tüm [all-in-one yükleyici](../installation/nginx/all-in-one.md) ile gerçekleştirilmektedir. Bireysel Linux paketleri ile manuel yükseltme artık desteklenmemektedir.

All-in-one yükleyici güncellemelerinin geçmişi, hem x86_64 hem de ARM64 (beta) sürümleri için geçerlidir.

[DEB/RPM paketlerinden nasıl geçilir](nginx-modules.md)

[Önceki all-in-one yükleyici sürümünden nasıl geçilir](all-in-one.md)

### 5.3.0 (2024-01-29)

* Kullanıcı aktivitelerinin tam bağlamını sağlamak ve daha hassas [oturum gruplaması](../api-sessions/setup.md#session-grouping) için [API Sessions](../api-sessions/overview.md) içindeki yanıt parametrelerine destek eklendi (ayrıntılı [değişiklik açıklamasına](../updating-migrating/what-is-new.md#response-parameters-in-api-sessions) bakınız)
* Tam teşekküllü bir [GraphQL parser](../user-guides/rules/request-processing.md#gql) eklendi (ayrıntılı [değişiklik açıklamasına](../updating-migrating/what-is-new.md#full-fledged-graphql-parser) bakınız) ve şunları sağlamaktadır:
  
    * GraphQL'e özgü istek noktalarında giriş doğrulama saldırılarının tespitinin iyileştirilmesi
    * Belirli GraphQL noktaları için saldırı tespiti ince ayarı (örneğin, belirli noktalarda belirli saldırı türlerinin tespitinin devre dışı bırakılması)
    * API oturumlarındaki GraphQL isteklerinin belirli kısımlarının analiz edilmesi

* Serileştirilmiş isteklerdeki geçersiz zaman değerinin düzeltilmesi ile [resource overlimit](../user-guides/rules/configure-overlimit-res-detection.md) saldırılarının doğru şekilde gösterilmesi sağlandı

### 5.2.11 (2024-12-25)

* NGINX Mainline v1.27.2 ve 1.27.3 desteği eklendi
* NGINX Plus R33 desteği eklendi
* [API Discovery](../api-discovery/sbf.md) ve [API Sessions](../api-sessions/exploring.md#sensitive-business-flows) için hassas iş akışları desteği eklendi
* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) ve [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) güvenlik açıkları giderildi
* Bazı isteklerin başarısız işlenmesine bağlı olarak API Sessions, Credential Stuffing ve API Abuse Prevention gibi alanları etkileyebilecek sorun düzeltildi

### 5.2.1 (2024-12-07)

* [Extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node) için yeni `$wallarm_attack_point_list` ve `$wallarm_attack_stamp_list` değişkenleri eklendi

    Bu değişkenler, kötü amaçlı yük içeren istek noktalarını ve saldırı işareti ID'lerini kaydederek, Node davranışının gelişmiş hata ayıklamasına olanak sağlar.
* Küçük hata düzeltmeleri

### 5.1.1 (2024-11-08)

* `wallarm-status` servis işletimindeki bazı hatalar giderildi

### 5.1.0 (2024-11-06)

* [API Sessions](../api-sessions/overview.md) desteği eklendi
* İstek işleme süresinin sınırlandırılmasında [iyileştirme](what-is-new.md#new-in-limiting-request-processing-time) yapıldı
* Node kaydı sırasında bellek kullanımı azaltıldı

### 5.0.3 (2024-10-10)

* API Discovery'de [hassas veri tespiti özelleştirme](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection) desteği eklendi
* [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton) içindeki yinelenen yanıt başlıklarında oluşan bellek sızıntısı giderildi
* [IP lists](../user-guides/ip-lists/overview.md) içerisinde yer almayan fakat [bilinen kaynağa](../user-guides/ip-lists/overview.md#select-object) sahip IP adresleriyle ilgili bellek sızıntısı giderildi

### 5.0.2 (2024-09-18)

* WAAP + API Security aboneliği etkin olmadığı durumlarda kurulum başarısızlık sorunu giderildi
* Saldırı dışa aktarma gecikmeleri düzeltildi

### 5.0.1 (2024-08-21)

* İlk 5.0 sürümü yayımlandı, [değişiklik günlüğüne](what-is-new.md) bakınız
* NGINX v1.26.2 stable desteği eklendi

## Helm chart for Wallarm NGINX Ingress controller

[Yükseltme nasıl yapılır](ingress-controller.md)

### 5.3.0 (2024-01-29)

* Kullanıcı aktivitelerinin tam bağlamını sağlamak ve daha hassas [oturum gruplaması](../api-sessions/setup.md#session-grouping) için [API Sessions](../api-sessions/overview.md) içindeki yanıt parametrelerine destek eklendi (ayrıntılı [değişiklik açıklamasına](../updating-migrating/what-is-new.md#response-parameters-in-api-sessions) bakınız)
* Tam teşekküllü bir [GraphQL parser](../user-guides/rules/request-processing.md#gql) eklendi (ayrıntılı [değişiklik açıklamasına](../updating-migrating/what-is-new.md#full-fledged-graphql-parser) bakınız) ve şunları sağlamaktadır:
  
    * GraphQL'e özgü istek noktalarında giriş doğrulama saldırılarının tespitinde iyileştirme
    * Belirli GraphQL noktaları için saldırı tespitinde ince ayar yapma (örneğin, belirli noktalarda belirli saldırı türlerinin tespitini devre dışı bırakma)
    * API oturumlarındaki GraphQL isteklerinin belirli bölümlerinin analiz edilmesi

* Serileştirilmiş isteklerdeki geçersiz zaman değerinin düzeltilmesi ile [resource overlimit](../user-guides/rules/configure-overlimit-res-detection.md) saldırılarının doğru şekilde gösterilmesi sağlandı

### 5.2.12 (2025-01-08)

* [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) kontrolör güvenlik açığı giderildi

### 5.2.11 (2024-12-27)

* [API Discovery](../api-discovery/sbf.md) ve [API Sessions](../api-sessions/exploring.md#sensitive-business-flows) için hassas iş akışları desteği eklendi
* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) ve [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) güvenlik açıkları giderildi
* Bazı isteklerin başarısız işlenmesine bağlı olarak API Sessions, Credential Stuffing ve API Abuse Prevention gibi alanları etkileyebilecek sorun düzeltildi

### 5.2.2 (2024-12-11)

* [GHSA-c5pj-mqfh-rvc3](https://scout.docker.com/vulnerabilities/id/GHSA-c5pj-mqfh-rvc3) güvenlik açığı için düzeltme yeniden uygulandı

### 5.2.1 (2024-12-07)

* Community Ingress NGINX Controller sürümü 1.11.3'e yükseltildi, upstream Helm chart sürümü 4.11.3 ile uyumlu hale getirildi
* Community Ingress NGINX Controller yükseltmesiyle getirilen kırıcı değişiklikler:
  
    * Opentracing ve Zipkin modüllerinin desteği sonlandırıldı, artık yalnızca Opentelemetry destekleniyor
    * `PodSecurityPolicy` desteği kaldırıldı
* Uyumluluk Kubernetes 1.30 sürümüne kadar genişletildi
* NGINX 1.25.5'e güncellendi
* Küçük hata düzeltmeleri

### 5.1.1 (2024-11-14)

* [GHSA-c5pj-mqfh-rvc3](https://scout.docker.com/vulnerabilities/id/GHSA-c5pj-mqfh-rvc3) güvenlik açığı giderildi
* `wallarm-status` servis işletimindeki bazı hatalar düzeltildi

### 5.1.0 (2024-11-06)

* [API Sessions](../api-sessions/overview.md) desteği eklendi
* İstek işleme süresinin sınırlandırılmasında [iyileştirme](what-is-new.md#new-in-limiting-request-processing-time) yapıldı
* Node kaydı sırasında bellek kullanımı azaltıldı
* API Specification Enforcement için yeni ayarlar eklendi:

    * `readBufferSize`
    * `writeBufferSize`
    * `maxRequestBodySize`
    * `disableKeepalive`
    * `maxConnectionsPerIp`
    * `maxRequestsPerConnection`

    Açıklamalar ve varsayılan değerler [burada](../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall) belirtilmiştir.

### 5.0.3 (2024-10-10)

* API Discovery'de [hassas veri tespiti özelleştirme](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection) desteği eklendi
* [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton) içindeki yinelenen yanıt başlıklarındaki bellek sızıntısı giderildi
* [IP lists](../user-guides/ip-lists/overview.md) içerisinde yer almayan fakat [bilinen kaynağa](../user-guides/ip-lists/overview.md#select-object) sahip IP adresleriyle ilgili bellek sızıntısı giderildi

### 5.0.2 (2024-09-18)

* WAAP + API Security aboneliği aktif olmadığında kurulum başarısızlık sorunu giderildi
* Saldırı dışa aktarma gecikmeleri düzeltildi

### 5.0.1 (2024-08-21)

* İlk 5.0 sürümü yayınlandı, [değişiklik günlüğüne](what-is-new.md) bakınız

<!-- ## Helm chart for Kong Ingress controller

[Yükseltme nasıl yapılır](kong-ingress-controller.md)

### 4.8.0 (2023-03-28)

* İlk 4.8 sürümü, [değişiklik günlüğüne](what-is-new.md) bakınız -->

## Helm chart for Sidecar

[Yükseltme nasıl yapılır](sidecar-proxy.md)

### 5.3.0 (2024-01-29)

* Kullanıcı aktivitelerinin tam bağlamını sağlamak ve daha hassas [oturum gruplaması](../api-sessions/setup.md#session-grouping) için [API Sessions](../api-sessions/overview.md) içindeki yanıt parametrelerine destek eklendi (ayrıntılı [değişiklik açıklamasına](../updating-migrating/what-is-new.md#response-parameters-in-api-sessions) bakınız)
* Tam teşekküllü bir [GraphQL parser](../user-guides/rules/request-processing.md#gql) eklendi (ayrıntılı [değişiklik açıklamasına](../updating-migrating/what-is-new.md#full-fledged-graphql-parser) bakınız) ve şunları sağlamaktadır:
  
    * GraphQL'e özgü istek noktalarında giriş doğrulama saldırılarının tespitinin iyileştirilmesi
    * Belirli GraphQL noktaları için saldırı tespitinde ince ayar yapma (örneğin, belirli noktalarda belirli saldırı türlerinin tespitinin devre dışı bırakılması)
    * API oturumlarındaki GraphQL isteklerinin belirli bölümlerinin analiz edilmesi

* Serileştirilmiş isteklerdeki geçersiz zaman değerinin düzeltilmesi ile [resource overlimit](../user-guides/rules/configure-overlimit-res-detection.md) saldırılarının doğru şekilde gösterilmesi sağlandı
* API Specification Enforcement için yeni ayarlar eklendi:

    * `readBufferSize`
    * `writeBufferSize`
    * `maxRequestBodySize`
    * `disableKeepalive`
    * `maxConnectionsPerIp`
    * `maxRequestsPerConnection`

    Açıklamalar ve varsayılan değerler [burada](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#configwallarmapifirewall) belirtilmiştir.
* NGINX'de genişletilmiş loglamayı etkinleştirmek için [`config.nginx.logs.extended`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#confignginxlogsextended) ve [`config.nginx.logs.format`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#confignginxlogsformat) Helm chart değerleri eklendi

### 5.2.11 (2024-12-27)

* [API Discovery](../api-discovery/sbf.md) ve [API Sessions](../api-sessions/exploring.md#sensitive-business-flows) için hassas iş akışları desteği eklendi
* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) ve [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) güvenlik açıkları giderildi
* Bazı isteklerin başarısız işlenmesine bağlı olarak API Sessions, Credential Stuffing ve API Abuse Prevention gibi alanları etkileyebilecek sorun düzeltildi

### 5.2.1 (2024-12-09)

* [Extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node) için yeni `$wallarm_attack_point_list` ve `$wallarm_attack_stamp_list` değişkenleri eklendi

    Bu değişkenler, kötü amaçlı yük içeren istek noktalarını ve saldırı işareti ID'lerini kaydederek, Node davranışının gelişmiş hata ayıklamasına olanak sağlar.
* Küçük hata düzeltmeleri

### 5.1.0 (2024-11-06)

* [API Sessions](../api-sessions/overview.md) desteği eklendi
* İstek işleme süresinin sınırlandırılmasında [iyileştirme](what-is-new.md#new-in-limiting-request-processing-time) yapıldı
* Node kaydı sırasında bellek kullanımı azaltıldı

### 5.0.3 (2024-10-10)

* API Discovery'de [hassas veri tespiti özelleştirme](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection) desteği eklendi
* [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton) içindeki yinelenen yanıt başlıklarındaki bellek sızıntısı giderildi
* [IP lists](../user-guides/ip-lists/overview.md) içerisinde yer almayan fakat [bilinen kaynağa](../user-guides/ip-lists/overview.md#select-object) sahip IP adresleriyle ilgili bellek sızıntısı giderildi

### 5.0.2 (2024-09-19)

* WAAP + API Security aboneliği aktif olmadığında kurulum başarısızlık sorunu giderildi
* Saldırı dışa aktarma gecikmeleri düzeltildi

### 5.0.1 (2024-08-21)

* İlk 5.0 sürümü yayınlandı, [değişiklik günlüğüne](what-is-new.md) bakınız

<!-- ## Helm chart for Wallarm eBPF‑based solution

### 0.10.22 (2024-03-01)

* [İlk sürüm](../installation/oob/ebpf/deployment.md) -->

## NGINX Tabanlı Docker İmajı

[Yükseltme nasıl yapılır](docker-container.md)

### 5.3.0 (2024-01-29)

* Kullanıcı aktivitelerinin tam bağlamını sağlamak ve daha hassas [oturum gruplaması](../api-sessions/setup.md#session-grouping) için [API Sessions](../api-sessions/overview.md) içindeki yanıt parametrelerine destek eklendi (ayrıntılı [değişiklik açıklamasına](../updating-migrating/what-is-new.md#response-parameters-in-api-sessions) bakınız)
* Tam teşekküllü bir [GraphQL parser](../user-guides/rules/request-processing.md#gql) eklendi (ayrıntılı [değişiklik açıklamasına](../updating-migrating/what-is-new.md#full-fledged-graphql-parser) bakınız) ve şunları sağlamaktadır:
  
    * GraphQL'e özgü istek noktalarında giriş doğrulama saldırılarının tespitindeki iyileştirme
    * Belirli GraphQL noktaları için saldırı tespitinde ince ayar yapma (örneğin, belirli noktalarda belirli saldırı türlerinin tespitinin devre dışı bırakılması)
    * API oturumlarındaki GraphQL isteklerinin belirli bölümlerinin analiz edilmesi

* Serileştirilmiş isteklerdeki geçersiz zaman değerinin düzeltilmesi ile [resource overlimit](../user-guides/rules/configure-overlimit-res-detection.md) saldırılarının doğru şekilde gösterilmesi sağlandı

### 5.2.11 (2024-12-25)

* [API Discovery](../api-discovery/sbf.md) ve [API Sessions](../api-sessions/exploring.md#sensitive-business-flows) için hassas iş akışları desteği eklendi
* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) ve [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) güvenlik açıkları giderildi
* Bazı isteklerin başarısız işlenmesine bağlı olarak API Sessions, Credential Stuffing ve API Abuse Prevention gibi alanları etkileyebilecek sorun düzeltildi

### 5.2.1 (2024-12-07)

* [Extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node) için yeni `$wallarm_attack_point_list` ve `$wallarm_attack_stamp_list` değişkenleri eklendi

    Bu değişkenler, kötü amaçlı yük içeren parametreleri ve saldırı işareti ID'lerini kaydederek Node davranışının gelişmiş hata ayıklamasına olanak sağlar.
* İmaj kaynağı ve Dockerfile, [GitHub](https://github.com/wallarm/docker-wallarm-node)'dan dahili GitLab deposuna taşındı

### 5.1.0-1 (2024-11-06)

* [API Sessions](../api-sessions/overview.md) desteği eklendi
* İstek işleme süresinin sınırlandırılmasında [iyileştirme](what-is-new.md#new-in-limiting-request-processing-time) yapıldı
* Node kaydı sırasında bellek kullanımı azaltıldı

### 5.0.3-1 (2024-10-10)

* API Discovery'de [hassas veri tespiti özelleştirme](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection) desteği eklendi
* [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton) içindeki yinelenen yanıt başlıklarında oluşan bellek sızıntısı giderildi
* [IP lists](../user-guides/ip-lists/overview.md) içerisinde yer almayan fakat [bilinen kaynağa](../user-guides/ip-lists/overview.md#select-object) sahip IP adresleriyle ilgili bellek sızıntısı giderildi

### 5.0.2-1 (2024-09-18)

* WAAP + API Security aboneliği etkin olmadığında kurulum başarısızlık sorunu giderildi
* Saldırı dışa aktarma gecikmeleri düzeltildi

### 5.0.1-1 (2024-08-21)

* İlk 5.0 sürümü yayımlandı, [değişiklik günlüğüne](what-is-new.md) bakınız
* NGINX v1.26.2 stable desteği eklendi

<!-- ## Envoy Tabanlı Docker İmajı

!!! info "4.10'a yükseltme bekleniyor"
    Bu artifact, Wallarm node 4.10'a henüz güncellenmedi; yükseltme bekleniyor. 4.10 özellikleri, bu artifact ile dağıtılan node'larda desteklenmiyor.

[Yükseltme nasıl yapılır](docker-container.md)

### 4.8.0-1 (2023-10-19)

* İlk 4.8 sürümü, [değişiklik günlüğüne](what-is-new.md) bakınız -->

## Amazon Machine Image (AMI)

[Yükseltme nasıl yapılır](cloud-image.md)

### 5.3.0 (2024-01-30)

* Kullanıcı aktivitelerinin tam bağlamını sağlamak ve daha hassas [oturum gruplaması](../api-sessions/setup.md#session-grouping) için [API Sessions](../api-sessions/overview.md) içindeki yanıt parametrelerine destek eklendi (ayrıntılı [değişiklik açıklamasına](../updating-migrating/what-is-new.md#response-parameters-in-api-sessions) bakınız)
* Tam teşekküllü bir [GraphQL parser](../user-guides/rules/request-processing.md#gql) eklendi (ayrıntılı [değişiklik açıklamasına](../updating-migrating/what-is-new.md#full-fledged-graphql-parser) bakınız) ve şunları sağlamaktadır:
  
    * GraphQL'e özgü istek noktalarında giriş doğrulama saldırılarının tespitinin iyileştirilmesi
    * Belirli GraphQL noktaları için saldırı tespitinde ince ayar yapma (örneğin, belirli noktalarda belirli saldırı türlerinin tespitinin devre dışı bırakılması)
    * API oturumlarındaki GraphQL isteklerinin belirli bölümlerinin analiz edilmesi

* Serileştirilmiş isteklerdeki geçersiz zaman değerinin düzeltilmesi ile [resource overlimit](../user-guides/rules/configure-overlimit-res-detection.md) saldırılarının doğru şekilde gösterilmesi sağlandı

### 5.2.11 (2024-12-28)

* [API Discovery](../api-discovery/sbf.md) ve [API Sessions](../api-sessions/exploring.md#sensitive-business-flows) için hassas iş akışları desteği eklendi
* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) ve [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) güvenlik açıkları giderildi
* Bazı isteklerin başarısız işlenmesine bağlı olarak API Sessions, Credential Stuffing ve API Abuse Prevention gibi alanları etkileyebilecek sorun düzeltildi

### 5.2.1 (2024-12-07)

* [Extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node) için yeni `$wallarm_attack_point_list` ve `$wallarm_attack_stamp_list` değişkenleri eklendi

    Bu değişkenler, kötü amaçlı yük içeren parametreleri ve saldırı işareti ID'lerini kaydederek Node davranışının gelişmiş hata ayıklamasına olanak sağlar.
* Küçük hata düzeltmeleri

### 5.1.0-1 (2024-11-06)

* [API Sessions](../api-sessions/overview.md) desteği eklendi
* İstek işleme süresinin sınırlandırılmasında [iyileştirme](what-is-new.md#new-in-limiting-request-processing-time) yapıldı
* Node kaydı sırasında bellek kullanımı azaltıldı

### 5.0.3-1 (2024-10-10)

* API Discovery'de [hassas veri tespiti özelleştirme](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection) desteği eklendi
* [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton) içindeki yinelenen yanıt başlıklarındaki bellek sızıntısı giderildi
* [IP lists](../user-guides/ip-lists/overview.md) içerisinde yer almayan fakat [bilinen kaynağa](../user-guides/ip-lists/overview.md#select-object) sahip IP adresleriyle ilgili bellek sızıntısı giderildi

### 5.0.2-1 (2024-09-19)

* WAAP + API Security aboneliği aktif olmadığında kurulum başarısızlık sorunu giderildi
* Saldırı dışa aktarma gecikmeleri düzeltildi

### 5.0.1-1 (2024-08-21)

* İlk 5.0 sürümü yayınlandı, [değişiklik günlüğüne](what-is-new.md) bakınız

## Google Cloud Platform Image

[Yükseltme nasıl yapılır](cloud-image.md)

### wallarm-node-5-3-20250129-150255 (2025-01-30)

* Kullanıcı aktivitelerinin tam bağlamını sağlamak ve daha hassas [oturum gruplaması](../api-sessions/setup.md#session-grouping) için [API Sessions](../api-sessions/overview.md) içindeki yanıt parametrelerine destek eklendi (ayrıntılı [değişiklik açıklamasına](../updating-migrating/what-is-new.md#response-parameters-in-api-sessions) bakınız)
* Tam teşekküllü bir [GraphQL parser](../user-guides/rules/request-processing.md#gql) eklendi (ayrıntılı [değişiklik açıklamasına](../updating-migrating/what-is-new.md#full-fledged-graphql-parser) bakınız) ve şunları sağlamaktadır:
  
    * GraphQL'e özgü istek noktalarında giriş doğrulama saldırılarının tespitinin iyileştirilmesi
    * Belirli GraphQL noktaları için saldırı tespitinde ince ayar yapma (örneğin, belirli noktalarda belirli saldırı türlerinin tespitinin devre dışı bırakılması)
    * API oturumlarındaki GraphQL isteklerinin belirli bölümlerinin analiz edilmesi

* Serileştirilmiş isteklerdeki geçersiz zaman değerinin düzeltilmesi ile [resource overlimit](../user-guides/rules/configure-overlimit-res-detection.md) saldırılarının doğru şekilde gösterilmesi sağlandı

### wallarm-node-5-2-20241227-095327 (2024-12-27)

* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) ve [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) güvenlik açıkları giderildi
* Bazı isteklerin başarısız işlenmesine bağlı olarak API Sessions, Credential Stuffing ve API Abuse Prevention gibi alanları etkileyebilecek sorun düzeltildi

### wallarm-node-5-2-20241209-114655 (2024-12-07)

* [Extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node) için yeni `$wallarm_attack_point_list` ve `$wallarm_attack_stamp_list` değişkenleri eklendi

    Bu değişkenler, kötü amaçlı yük içeren parametreleri ve saldırı işareti ID'lerini kaydederek Node davranışının gelişmiş hata ayıklamasına olanak sağlar.
* Küçük hata düzeltmeleri

### wallarm-node-5-1-20241108-120238 (2024-11-08)

* İlk 5.x sürümü yayımlandı, [değişiklik günlüğüne](what-is-new.md) bakınız