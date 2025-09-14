# Wallarm Node 6.x ve 0.14.x’te Neler Yeni

Bu değişiklik günlüğü NGINX Node 6.x ve Native Node 0.14.x+ güncellemelerini kapsar. Daha eski bir sürümden yükseltiyorsanız [bu](../updating-migrating/older-versions/what-is-new.md) belgeye bakın.

Wallarm Node’un küçük sürümlerine ait ayrıntılı değişiklik günlüğü için [NGINX Node eser (artifact) envanteri](node-artifact-versions.md) veya [Native Node eser (artifact) envanteri](native-node/node-artifact-versions.md) sayfalarına bakın.

Bu sürüm, Wallarm Node’un performansını ve sürdürülebilirliğini artırmayı amaçlayan temel mimari iyileştirmeler içerir. Bu yenilikler, yakında gelecek özellikler için de zemin hazırlar.

## Postanalytics için Tarantool’un wstore ile değiştirilmesi

Wallarm Node, yerel postanalytics işlemede Tarantool yerine artık **Wallarm tarafından geliştirilen wstore hizmetini** kullanır.

Bunun sonucunda NGINX Node’da aşağıdaki değişiklikler yapılmıştır:

* [All-in-one yükleyici](../installation/nginx/all-in-one.md), [AWS](../installation/cloud-platforms/aws/ami.md)/[GCP](../installation/cloud-platforms/gcp/machine-image.md) imajları:

    * Postanalytics modülü ayrı bir NGINX hizmetinden konuşlandırıldığında sunucu adresini tanımlayan NGINX yönergesi `wallarm_tarantool_upstream`, [`wallarm_wstore_upstream`](../admin-en/configure-parameters-en.md#wallarm_wstore_upstream) olarak yeniden adlandırıldı.

        Geriye dönük uyumluluk, kullanım dışı uyarısıyla korunur:

        ```
        2025/03/04 20:43:04 [warn] 3719#3719: "wallarm_tarantool_upstream" directive is deprecated, use "wallarm_wstore_upstream" instead in /etc/nginx/nginx.conf:19
        ```
    
    * [Günlük dosyasının](../admin-en/configure-logging.md) adı değişti: `/opt/wallarm/var/log/wallarm/tarantool-out.log` → `/opt/wallarm/var/log/wallarm/wstore-out.log`.
    * Yeni wstore yapılandırma dosyası `/opt/wallarm/wstore/wstore.yaml`, `/etc/default/wallarm-tarantool` veya `/etc/sysconfig/wallarm-tarantool` gibi eski Tarantool yapılandırma dosyalarının yerini alır.
    * `/opt/wallarm/etc/wallarm/node.yaml` içindeki `tarantool` bölümü artık `wstore`. Geriye dönük uyumluluk, kullanım dışı uyarısıyla korunur.
* [Docker imajı](../admin-en/installation-docker-en.md):

    * Yukarıdaki tüm değişiklikler konteyner içinde uygulanmıştır.
    * Önceden, Tarantool için bellek `TARANTOOL_MEMORY_GB` ortam değişkeniyle ayrılıyordu. Artık aynı ilkeye uyularak yeni değişken kullanılır: `TARANTOOL_MEMORY_GB` → `SLAB_ALLOC_ARENA`.
    * Konteyner dizin yapısı Alpine Linux kurallarına uyacak şekilde düzenlendi. Özellikle:

        * `/etc/nginx/modules-available` ve `/etc/nginx/modules-enabled` içeriği `/etc/nginx/modules` konumuna taşındı.
        * `/etc/nginx/sites-available` ve `/etc/nginx/sites-enabled` içeriği `/etc/nginx/http.d` konumuna taşındı.
    
    * `/wallarm-status` servisi için izinli IP adreslerini belirleyen varsayılan `allow` değeri 127.0.0.8/8 yerine artık 127.0.0.0/8’tir.
* [Kubernetes Ingress Controller](../admin-en/installation-kubernetes-en.md):
    
    * Tarantool artık ayrı bir pod değildir, wstore ana `<CHART_NAME>-wallarm-ingress-controller-xxx` pod’unda çalışır.
    * Helm değerleri yeniden adlandırıldı: `controller.wallarm.tarantool` → `controller.wallarm.postanalytics`.
* [Kubernetes Sidecar Controller](../installation/kubernetes/sidecar-proxy/deployment.md):

    * Helm değerleri yeniden adlandırıldı: `postanalytics.tarantool.*` → [`postanalytics.wstore.*`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L625).
    * Sidecar konuşlandırması için Helm chart’ından aşağıdaki Docker imajları kaldırılmıştır:

        * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
        * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
        * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
        * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)
        
        Bu imajların yerini ilgili servisleri çalıştıran [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers) imajı almıştır.

Aşağıda verilen Node yükseltme talimatlarına bu değişiklikler dahil edilmiştir.

## collectd’nin kaldırılması

Önceden tüm filtreleme nodelarına kurulan collectd servisi ve ilişkili eklentileri kaldırılmıştır. Metrikler artık Wallarm’ın yerleşik mekanizmalarıyla toplanıp gönderilir; bu da harici araçlara bağımlılığı azaltır.

Collectd’nin sağladığı Prometheus ve JSON biçimindeki aynı metrikleri sunan [`/wallarm-status` endpointini](../admin-en/configure-statistics-service.md) kullanın.

Bu değişikliğin sonucu olarak yapılandırma kurallarında da şunlar değişti:

* `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` collectd yapılandırma dosyası artık kullanılmamaktadır.
* Önceden metrikleri bir ağ eklentisi üzerinden iletmek için collectd kullandıysanız, örneğin:

    ```
    LoadPlugin network

    <Plugin "network">
        Server "<Server IPv4/v6 address or FQDN>" "<Server port>"
    </Plugin>
    ```

    artık Prometheus ile `/wallarm-status` endpointinin scrape edilmesine geçmelisiniz.

## Mitigation Controls

Tüm Wallarm saldırı azaltma ayarlarının birleşik yönetimi için [**Mitigation Controls**](../about-wallarm/mitigation-controls-overview.md) merkezini sunuyoruz. Mitigation Controls ile şunları yapabilirsiniz:

* Tüm Wallarm azaltma ayarlarını tek bir yerden görüntüleyip yönetmek.
* Hepsini birleşik bir şekilde yönetmek (tüm kontroller benzer yapılandırma arayüzü ve seçeneklere sahiptir).
* Her bir kontrolün mevcut modunu kolayca görmek: aktif mi? sadece izliyor mu yoksa engelliyor mu?
* Her kontrol tarafından yakalanan saldırılara hızlı bir genel bakış almak.

![UI’de Mitigation Controls sayfası](../images/user-guides/mitigation-controls/mc-main-page.png)

### Numaralandırma saldırısı koruması

!!! tip ""
    [NGINX Node 6.1.0 ve üzeri](node-artifact-versions.md) ve [Native Node 0.14.1 ve üzeri](native-node/node-artifact-versions.md)

[Numaralandırma saldırılarına](../attacks-vulns-list.md#enumeration-attacks) karşı yeni seviye koruma, numaralandırma Mitigation Controls ile gelir:

* [Enumeration attack protection](../api-protection/enumeration-attack-protection.md)
* [BOLA enumeration protection](../api-protection/enumeration-attack-protection.md)
* [Forced browsing protection](../api-protection/enumeration-attack-protection.md)
* [Brute force protection](../api-protection/enumeration-attack-protection.md)

Daha önce bu koruma için kullanılan tetikleyicilerle karşılaştırıldığında, Mitigation Controls:

* Numaralandırma girişimleri için izlenecek parametrelerin seçilmesine izin verir.
* Hangi isteklerin sayılacağı konusunda gelişmiş ve detaylı filtreleme imkanı sağlar.
* [API Sessions](../api-sessions/overview.md) ile derin entegrasyon sağlar: tespit edilen saldırılar ilgili oturum içinde gösterilir ve oturum faaliyetlerinin neden saldırı olarak işaretlenip engellendiğine dair tam bağlam sunulur.

![BOLA protection mitigation control - örnek](../images/user-guides/mitigation-controls/mc-bola-example-01.png)

### DoS protection

!!! tip ""
    [NGINX Node 6.1.0 ve üzeri](node-artifact-versions.md) ve [Native Node 0.14.1 ve üzeri](native-node/node-artifact-versions.md)

[Unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md), en ciddi API güvenlik risklerinin yer aldığı [OWASP API Top 10 2023](../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023) listesine dahildir. Kendi başına bir tehdit olmakla birlikte (yük altında hizmetin yavaşlaması veya tamamen çökmesi), aynı zamanda örneğin numaralandırma saldırıları gibi farklı saldırı türlerinin de temelini oluşturur. Belirli bir zamanda çok fazla isteğe izin verilmesi bu risklerin başlıca nedenlerinden biridir.

Wallarm, API’nize aşırı trafiği önlemeye yardımcı olmak için yeni [**DoS protection**](../api-protection/dos-protection.md) Mitigation Control’ünü sunar.

![DoS protection - JWT örneği](../images/api-protection/mitigation-controls-dos-protection-jwt.png)

### Varsayılan kontroller

Wallarm, etkinleştirildiğinde Wallarm platformunun tespit kabiliyetlerini önemli ölçüde artıran bir dizi [varsayılan Mitigation Controls](../about-wallarm/mitigation-controls-overview.md#default-controls) sağlar. Bu kontroller, çeşitli yaygın saldırı kalıplarına karşı güçlü koruma sunacak şekilde önceden yapılandırılmıştır. Mevcut varsayılan Mitigation Controls şunları içerir:

* [GraphQL protection](../api-protection/graphql-rule.md)
* Kullanıcı kimlikleri, nesne kimlikleri ve dosya adları için [BOLA (Broken Object Level Authorization) enumeration protection](../api-protection/enumeration-attack-protection.md#bola)
* Parolalar, OTP’ler ve kimlik doğrulama kodları için [Brute force protection](../api-protection/enumeration-attack-protection.md#brute-force)
* [Forced browsing protection](../api-protection/enumeration-attack-protection.md#forced-browsing) (404 yoklama)
* [Enumeration attack protection](../api-protection/enumeration-attack-protection.md#generic-enumeration), aşağıdakiler dahil:
    
    * Kullanıcı/e-posta numaralandırması
    * SSRF (Server-Side Request Forgery) numaralandırması
    * User-Agent rotasyonu

## Dosya yükleme kısıtlama politikası

Wallarm artık yüklenen dosyaların boyutunu doğrudan kısıtlamak için araçlar sağlar. Bu, en ciddi API güvenlik risklerinin yer aldığı [OWASP API Top 10 2023](../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023) listesine dahil [unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) riskini önlemeye yönelik önlemler setinin bir parçasıdır.

Abonelik planınıza bağlı olarak, yükleme kısıtlamaları bir Mitigation Control veya kural aracılığıyla uygulanır. Dosya boyutu kısıtlarını tüm istek için veya isteğin seçili bir noktası için belirleyebilirsiniz.

![Dosya yükleme kısıtlama MC - örnek](../images/api-protection/mitigation-controls-file-upload-1.png)

## Unrestricted resource consumption’a karşı koruma

!!! tip ""
    [NGINX Node 6.3.0 ve üzeri](node-artifact-versions.md) ve şu an için [Native Node](../installation/nginx-native-node-internals.md#native-node) tarafından desteklenmiyor.

Wallarm’ın [API Abuse Prevention](../api-abuse-prevention/overview.md) özelliği, [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) — otomatik bir istemcinin uygun sınırlar olmaksızın aşırı API veya uygulama kaynağı tükettiği kötüye kullanım davranışını — önleme olanağı sunar. Buna çok sayıda zararsız isteğin gönderilmesi, işlemci, bellek veya bant genişliğinin tüketilmesi ve meşru kullanıcılar için hizmetin kötüleşmesine yol açılması dahildir.

![API Abuse prevention profile](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

Bu tür otomatik tehditleri tespit etmek için API Abuse Prevention, üç yeni [dedektör](../api-abuse-prevention/overview.md#how-api-abuse-prevention-works) sunar:

* **Response time anomaly** — API yanıt gecikmelerindeki otomatik kötüye kullanım veya arka uç istismarı girişimlerini işaret edebilecek anormal kalıpları belirler.
* **Excessive request consumption** — API’ye anormal derecede büyük istek yükleri gönderen istemcileri belirler; bu, arka uç işlem kaynaklarının kötüye kullanıldığını gösterebilir.
* **Excessive response consumption** — yaşam süreleri boyunca aktarılan toplam yanıt verisi hacmine göre şüpheli oturumları işaretler. Tekil isteklere odaklanan dedektörlerden farklı olarak, bu dedektör tüm bir oturum boyunca yanıt boyutlarını toplayarak damla-damla veri çekme veya dağıtık scraping saldırılarını tespit eder.

## Hangi Wallarm nodelarının yükseltilmesi önerilir?

* Wallarm sürümleriyle güncel kalmak ve [kurulu modüllerin kullanım dışı kalmasını](versioning-policy.md#version-support-policy) önlemek için 4.10 ve 5.x sürümündeki istemci ve çok kiracılı (multi-tenant) Wallarm NGINX Node’ları.
* [Desteklenmeyen](versioning-policy.md#version-list) sürümlerdeki (4.8 ve altı) istemci ve çok kiracılı Wallarm nodeları.

    3.6 veya altı bir sürümden yükseltiyorsanız, tüm değişiklikleri [ayrı listeden](older-versions/what-is-new.md) öğrenin.

## Yükseltme süreci

1. [Modül yükseltme için önerileri](general-recommendations.md) gözden geçirin.
2. Wallarm node konuşlandırma seçeneğinize uygun talimatları izleyerek kurulu modülleri yükseltin:

    * NGINX Node:
        * [DEB/RPM paketleri](nginx-modules.md)
        * [All-in-one yükleyici](all-in-one.md)
        * [NGINX için modüllere sahip Docker konteyneri](docker-container.md)
        * [Wallarm modülleri entegre NGINX Ingress controller](ingress-controller.md)
        * [Sidecar controller](sidecar-proxy.md)
        * [Bulut node imajı](cloud-image.md)
        * [Multi-tenant node](multi-tenant.md)
    
    * Native Node:
        * [All-in-one yükleyici](native-node/all-in-one.md)
        * [Helm chart](native-node/helm-chart.md)
        * [Docker imajı](native-node/docker-image.md)

----------

[Wallarm ürün ve bileşenlerindeki diğer güncellemeler →](https://changelog.wallarm.com/)