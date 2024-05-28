# Wallarm düğümünde (EOL düğümünün yükseltilmesi durumunda) yeni olan nedir

Bu sayfa, kullanım dışı sürümün (3.6 ve daha düşük) düğümünü 4.8 sürümüne kadar yükseltirken mevcut olan değişiklikleri listeler. Listelenen değişiklikler hem normal (müşteri) hem de çok kiracılı Wallarm düğümleri için mevcuttur.

!!! Uyarı "Wallarm düğümleri 3.6 ve daha düşük sürümler kullanımdan kalkmıştır"
    Wallarm düğümleri 3.6 ve daha düşük sürümler, [kullanımdan kalktıkları](../versioning-policy.md#version-list) için yükseltmeleri önerilir.

    Düğüm yapılandırması ve trafik filtrasyonu, 4.x sürümündeki Wallarm düğümünde önemli ölçüde basitleştirilmiştir. 4.x düğümünün bazı ayarları, eski sürümlerdeki düğümlerle **uyumlu değildir**. Modülleri yükseltmeden önce lütfen değişiklikler listesini ve [genel önerileri](../general-recommendations.md) dikkatlice inceleyin.

## Her şey dahil yükleyici

Artık, çeşitli ortamlarda NGINX için bir dinamik modül olarak Wallarm düğümünü yüklerken ve yükseltirken, kurulum sürecini kolaylaştırmak ve standardize etmek için tasarlanmış **her şey dahil yükleyiciyi** kullanabilirsiniz. Bu yükleyici otomatik olarak işletim sisteminizin ve NGINX sürümlerini belirler ve tüm gerekli bağımlılıkları yükler.

Yükleyici, aşağıdaki işlemleri otomatik olarak gerçekleştirerek süreci basitleştirir:

1. İşletim sisteminizi ve NGINX sürümünü kontrol eder.
1. Tespit edilen İS ve NGINX sürümü için Wallarm depolarını ekler.
1. Bu depolardan Wallarm paketlerini yükler.
1. Yüklenen Wallarm modülünü NGINX'inize bağlar.
1. Sağlanan belirteç kullanılarak filtreleme düğümünü Wallarm Buluta bağlar.

[Düğümü her şey dahil yükleyici ile nasıl dağıtacağınıza dair ayrıntıları görün →](../../installation/nginx/all-in-one.md)

## Silinen metriklere bağlı hata oluşturan değişiklikler

4.0 sürümünden başlayarak, Wallarm düğümü aşağıdaki collectd metriklerini toplamaz:

* `curl_json-wallarm_nginx/gauge-requests` - bunun yerine [`curl_json-wallarm_nginx/gauge-abnormal`](../../admin-en/monitoring/available-metrics.md#number-of-requests) metriğini kullanabilirsiniz
* `curl_json-wallarm_nginx/gauge-attacks`
* `curl_json-wallarm_nginx/gauge-blocked`
* `curl_json-wallarm_nginx/gauge-time_detect`
* `curl_json-wallarm_nginx/derive-requests`
* `curl_json-wallarm_nginx/derive-attacks`
* `curl_json-wallarm_nginx/derive-blocked`
* `curl_json-wallarm_nginx/derive-abnormal`
* `curl_json-wallarm_nginx/derive-requests_lost`
* `curl_json-wallarm_nginx/derive-tnt_errors`
* `curl_json-wallarm_nginx/derive-api_errors`
* `curl_json-wallarm_nginx/derive-segfaults`
* `curl_json-wallarm_nginx/derive-memfaults`
* `curl_json-wallarm_nginx/derive-softmemfaults`
* `curl_json-wallarm_nginx/derive-time_detect`

## Hız limitleri

Uygun hız limitinin olmaması, API güvenliği için önemli bir sorun olmuştur, çünkü saldırganlar hizmeti kesme (DoS) veya sistem üzerinde aşırı yük oluşturan yüksek hacimli istekler başlatabilirler, bu da meşru kullanıcıları etkiler.

Wallarm'ın Wallarm düğüm 4.6'dan itibaren desteklenen hız sınırlama özelliği, güvenlik ekiplerinin hizmetin yükünü etkin bir şekilde yönetmelerine ve yanıltıcı alarmları önlemelerine olanak tanır, böylece hizmet meşru kullanıcılar için mevcut ve güvenli kalır. Bu özellik, geleneksel IP bazlı hız sınırlamanın yanı sıra JSON alanları, base64 kodlu veriler, çerezler, XML alanları ve daha fazlasını da içeren istek ve oturum parametrelerine dayalı çeşitli bağlantı limitlerini sunar.

Örneğin, her kullanıcının API bağlantılarını sınırlayabilir, böylece dakikada binlerce istekte bulunmalarını önleyebilirsiniz. Bu, sunucularınız üzerinde büyük bir yük oluşturabilir ve hizmetin çökmesine neden olabilir. Hız sınırlamasını uygulayarak, sunucularınızı aşırı yüklemeden koruyabilir ve tüm kullanıcıların API'ye adil erişime sahip olmasını sağlayabilirsiniz.

Hız sınırlarını, belirli bir kullanım durumu için hız sınırlama kapsamı, hız, patlama, gecikme ve yanıt kodunu belirterek, Wallarm Konsol UI'sinde **Kurallar** → **Hız sınırlamasını ayarla** seçeneklerinden kolayca yapılandırabilirsiniz.

[Hız sınırlaması yapılandırması ile ilgili kılavuz →](../../user-guides/rules/rate-limiting.md)

Hız sınırlama kuralı, özelliği kurmak için önerilen yöntem olsa da, aşağıdaki yeni NGINX direktiflerini kullanarak hız sınırlarını da yapılandırabilirsiniz:

* [`wallarm_rate_limit`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit)
* [`wallarm_rate_limit_enabled`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_enabled)
* [`wallarm_rate_limit_log_level`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_log_level)
* [`wallarm_rate_limit_status_code`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_status_code)
* [`wallarm_rate_limit_shm_size`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_shm_size)

## Yeni saldırı türlerinin tespiti

Wallarm yeni saldırı türlerini algılar:

* [Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa1-broken-object-level-authorization.md) (BOLA), ayrıca [Insecure Direct Object References](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/04-Testing_for_Insecure_Direct_Object_References) (veya IDOR) olarak da bilinir, en yaygın API güvenlik açıklarından biri haline gelmiştir. Bir uygulama bir IDOR / BOLA güvenlik açığına sahip olduğunda, hassas bilgileri veya verileri saldırganlara açma olasılığı yüksektir. Saldırganların yapması gereken tek şey, API çağrısındaki kendi kaynaklarının kimliğini başka bir kullanıcıya ait bir kaynağın kimliği ile değiştirmektir. Uygun yetkilendirme kontrollerinin olmaması, saldırganların belirtilen kaynağa erişmesini sağlar. Dolayısıyla, bir nesnenin kimliğini alıp nesne üzerinde herhangi bir tür aksiyon gerçekleştiren herhangi bir API uç noktası saldırı hedefi olabilir.

    Bu zafiyetin istismarını önlemek için, Wallarm düğümü 4.2 ve üzeri, uç noktalarınızı BOLA saldırılarından korumak için kullanabileceğiniz [yeni bir tetikleme](../../admin-en/configuration-guides/protecting-against-bola.md) içerir. Tetikleyici, belirli bir uç noktasına gelen istek sayısını izler ve tetikleyiciden aşılan eşikler olduğunda bir BOLA saldırı olayı oluşturur.
* [Mass Assignment](../../attacks-vulns-list.md#mass-assignment)

    Bir Mass Assignment saldırısı sırasında, saldırganlar HTTP istek parametrelerini program kodu değişkenlerine veya nesnelerine bağlamayı dener. Bir API hassas olduğu ve bağlamaya izin verdiği durumda, saldırganlar, maruz bırakılması amaçlanmayan hassas nesne özelliklerini değiştirebilir, bu da ayrıcalıkların yükseltilmesine, güvenlik mekanizmalarının atlatılmasına ve daha fazlasına yol açabilir.
* [SSRF](../../attacks-vulns-list.md#serverside-request-forgery-ssrf)

    Başarılı bir SSRF saldırısı, saldırganın saldırıya uğramış web sunucusu adına istekte bulunmasına olanak sağlayabilir; bu da web uygulamasının kullanılan ağ portlarını gösterebilir, dahili ağları tarayabilir ve yetkilendirmeyi aşabilir.

## JSON Web Token gücünün kontrol edilmesi

[JSON Web Token (JWT)](https://jwt.io/), API'ler gibi kaynaklar arasında güvenli bir şekilde veri alışverişi yapmak için kullanılan popüler bir kimlik doğrulama standardıdır. JWT'nin uzlaşması, saldırganların genellikle tam erişim sağlayan kimlik doğrulama mekanizmalarını kırmak için yaygın bir hedeftir. JWT'ler ne kadar zayıfsa, uzlaşma şansı o kadar yüksektir.

4.4 sürümünden itibaren, Wallarm'ı aşağıdaki JWT zayıflıklarını tespit etmeye açabilirsiniz:

* Şifrelenmemiş JWT'ler
* Kompromis edilmiş gizli anahtarları kullanarak imzalanan JWT'ler

Etkinleştirmek için, [**Zayıf JWT** tetikleyicisini](../../user-guides/triggers/trigger-examples.md#detect-weak-jwts) kullanabilirsiniz.

## JSON Web Token'lerin saldırılar için kontrol edilmesi

JSON Web Token (JWT), en popüler kimlik doğrulama yöntemlerinden biridir. Bu, onun, verilerin JWT'de kodlanmış ve istekte herhangi bir yerde bulunabileceği için çok zor bulunan saldırıları (örneğin SQLi veya RCE) gerçekleştirmek için favori bir araç olmasını sağlar.

Wallarm düğümü 4.2 ve üzeri, [aracılığıyla](../../admin-en/configure-wallarm-mode.md) herhangi bir saldırı girişimini bloke eden (uygun [filtrasyon modunda](../../admin-en/configure-wallarm-mode.md) olduğunda) isteği bulur, onu çözer ve bu kimlik doğrulama yöntemi.

## Desteklenen kurulum seçenekleri

* Wallarm Ingress denetleyicisi, en son sürümü olan Community Ingress NGINX Controller, 1.9.5 temel alınarak oluşturulmuştur.

    [Wallarm Ingress denetleyicisine geçiş talimatları →](ingress-controller.md)
* [Kullanım dışı](https://www.centos.org/centos-linux-eol/) olan CentOS 8.x yerine AlmaLinux, Rocky Linux ve Oracle Linux 8.x desteği eklendi.

    Alternatif işletim sistemleri için Wallarm düğüm paketleri, CentOS 8.x deposunda saklanacaktır.
* Debian 11 Bullseye desteği eklendi
* Ubuntu 22.04 LTS (jammy) desteği eklendi
* CentOS 6.x (CloudLinux 6.x) desteği kaldırıldı
* Debian 9.x desteği kaldırıldı
* NGINX kararlı veya NGINX Plus modülü olarak kurulacak olan Wallarm için Debian 10.x desteği kaldırıldı
* İşletim sistemi Ubuntu 16.04 LTS (xenial) için desteğin sonlandırılması
* [Wallarm Envoy tabanlı Docker imajında](../../admin-en/installation-guides/envoy/envoy-docker.md) kullanılan Envoy sürümü [1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4) olarak artırıldı.

[Desteklenen kurulum seçeneklerinin tam listesine bakınız →](../../installation/supported-deployment-options.md)

## Sunucusuz Wallarm düğümünün dağıtımı için yeni yöntem

Yeni dağıtım yöntemi, Wallarm CDN düğümünü altyapınızın dışında 15 dakikada yapılandırmanıza olanak sağlar. Korunacak alanı belirtmeniz ve alanın DNS kayıtlarına Wallarm CNAME kaydını eklemeniz yeterlidir.

[CDN düğümünün dağıtım talimatları](../../installation/cdn-node.md)

## Filtreleme düğümünün kurulumu için sistem gereksinimleri

* Wallarm node instances now require access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers.

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        ```
* Filtreleme düğümü artık verileri `us1.api.wallarm.com:443` (ABD Bulutu) ve `api.wallarm.com:443` (AB Bulutu) üzerinden Buluta yükler, bunun yerine `us1.api.wallarm.com:444` ve `api.wallarm.com:444` kullanmaz.

    Dağıtılmış düğümle sunucunuzun dış kaynaklara sınırlı erişimi varsa ve erişim her kaynağa ayrı ayrı verilirse, 4.x sürümüne yükseltildikten sonra filtreleme düğümü ve Bulut arasındaki senkronizasyon duracaktır. Yükseltilen düğümün, yeni porta sahip API uç noktasına erişim hakkı verilmesi gerekmektedir.

## Wallarm Cloud'da düğümlerin belirteçlerle birleşik kaydı

Yeni Wallarm düğüm sürümü ile Cloud'daki Wallarm düğümlerinin e-posta parola tabanlı kaydı kaldırıldı. Wallarm düğümü 4.8 ile devam etmek için yeni belirteç tabanlı düğüm kayıt yöntemine geçmek zorunlu hale geldi.

Yeni sürüm, Wallarm düğümünü Wallarm Cloud'a [herhangi bir desteklenen platformda](../../installation/supported-deployment-options.md) **belirteç** ile kaydetmenizi sağlar, bu da şunları içerir:

* Yalnızca düğümün kurulmasına izin veren **Deploy** rolüne sahip özel kullanıcı hesaplarına artık gerek yoktur.
* Kullanıcıların verileri güvenli bir şekilde Wallarm Cloud'da saklanır.
* Kullanıcı hesapları için iki faktörlü kimlik doğrulama etkinleştirildiyse, düğümlerin Wallarm Cloud'da kaydedilmesini engellemez.
* İlk trafik işleme ve istek sonrası analitik modülleri ayrı düğüm belirteciyle Cloud'a kaydedilebilir.

Düğüm kayıt yöntemlerindeki değişiklikler, düğüm türlerinde bazı güncellemelerle sonuçlanır:

* Birleşik kayıt için belirteci destekleyen düğümün türü **Wallarm düğümüdür**. Düğümün kaydını sunucuda çalıştırmak için kullanılan betik `register-node` olarak adlandırılır.

    Daha önce Wallarm düğümü [**cloud node**](/2.18/user-guides/nodes/cloud-node/) olarak adlandırılmıştı. Belirteci desteklemeye devam ediyor ancak farklı bir betik olan `addcloudnode` ile.

    Cloud düğümünün yeni düğüm tipine geçirilmesi gerekmektedir.
* "E-posta-parola"nın `addnode` betiğine geçirildiği [**regular node**](/2.18/user-guides/nodes/regular-node/) desteklenmiyor.

    4.0 sürümünden itibaren, düğümün NGINX, NGINX Plus modülü veya Docker konteyneri olarak dağıtılması aşağıdaki gibi görünür:

    1. Wallarm Konsol'da **Wallarm düğümü** oluşturun ve oluşturulan belirteci kopyalayın.
    1. Düğüm belirteci ile `register-node` scripti çalıştırın veya `WALLARM_API_TOKEN` değişkenini tanımlamak için Docker konteyneri çalıştırın.

    !!! bilgi "Regular node desteği"
        Regular node türü 4.x sürümünde kullanımdan kalkmıştır ve gelecekteki sürümlerde kaldırılacaktır.

        Regular node'nun **Wallarm düğümü** ile değiştirilmesi önerilir. Regular türünün kaldırılmasından önce, düğüm yükseltme rehberlerinde uygun talimatları bulacaksınız.

## Wallarm'ın AWS üzerinde dağıtılması için Terraform modülü

4.0 sürümünden itibaren, Wallarm'ı [AWS](https://aws.amazon.com/) hedefinde Infrastructure as Code (IaC) tabanlı bir ortamdan [Wallarm Terraform modülünü](https://registry.terraform.io/modules/wallarm/wallarm/aws/) kullanarak kolayca dağıtabilirsiniz.

Wallarm Terraform modülü, en iyi sektör standartlarından güvenlik ve failover sağlamayı karşılayan ölçeklenebilir bir çözümdür. Dağıtımı sırasında, trafiğin akışı için gereksinimlerinize dayalı olarak **proxy** veya **mirror** dağıtım seçeneğinden birini seçebilirsiniz.

Ayrıca, AWS VPC Trafik Aynalama gibi çözümlerle uyumlu olan temel dağıtım yapılandırmalarının yanı sıra gelişmiş olanları içeren her iki dağıtım seçeneği için kullanım örnekleri de hazırladık.

[Wallarm'ın AWS için Terraform modülü üzerine belgelendirme](../../installation/cloud-platforms/aws/terraform-module/overview.md)

## reddedilmiş kaynaklardan engellenen isteklere ilişkin istatistiklerin toplanması

4.8 sürümünden itibaren, Wallarm NGINX tabanlı filtreleme düğümleri artık, kaynağı reddedilmiş listeye girdiğinde engellenen istekler hakkında istatistik toplar, saldırı gücünü değerlendirme yeteneklerinizi artırır. Bu, engellenmiş istek istatistiklerine ve örneklerine erişimi içerir, böylece fark edilmeden kalan etkinliği en aza indirir. Bu verilere Wallarm Konsol UI'nin **Etkinlikler** bölümünden ulaşabilirsiniz.

Otomatik IP engelleme kullanılırken (örneğin, kaba kuvvet tetikleyicisi yapılandırılmışsa), şimdi ilk tetiklenen istekleri ve ardından engellenen isteklerin örneklerini analiz edebilirsiniz. Kaynakların manuel olarak reddedilmesi nedeniyle engellenen istekler için, yeni işlevsellik engellenen kaynak eylemlerinin görünürlüğünü artırır.

**Etkinlikler** bölümünde yeni tanıtılan verilere rahatça erişmek için **Olaylar** bölümünde yeni [arama etiketleri ve filtreler](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) tanıttık:

* `blocked_source` aramasını kullanarak, IP adresleri, alt ağlar, ülkeler, VPN'ler ve daha fazlasının manuel olarak reddedilmesi nedeniyle engellenen istekleri belirleyin.
* `multiple_payloads` aramasını kullanarak, **kötü niyetli yük sayısı** tetikleyicisi tarafından engellenen istekleri belirleyin. Bu tetikleyici, birden çok yük içeren kötü niyetli isteklerden kaynaklanan kaynakları reddedilmiş listeye almak için tasarlanmıştır ve bu, çoklu saldırı faillerinin yaygın bir özelliğidir.
* Ek olarak, `api_abuse`, `brute`, `dirbust` ve `bola` arama etiketleri artık kendi ilgili saldırı türleri için ilgili Wallarm tetikleyicileri tarafından otomatik olarak reddedilmiş listeye eklenen istekleri içeriyor.

Bu değişiklik, işlevselliği etkinleştirmek için 'on' olarak ayarlanan ancak 'kapalı' olarak deaktive edilebilecek yeni yapılandırma parametrelerini tanıtır:

* [`wallarm_acl_export_enable`](../../admin-en/configure-parameters-en.md#wallarm_acl_export_enable) NGINX direktifi.
* [`controller.config.wallarm-acl-export-enable`](../../admin-en/configure-kubernetes-en.md#global-controller-settings) NGINX Ingress denetleyicisi şeması için değer.
* [`config.wallarm.aclExportEnable`](../../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#configwallarmaclexportenable) şema değeri ve [`sidecar.wallarm.io/wallarm-acl-export-enable`](../../installation/kubernetes/sidecar-proxy/pod-annotations.md) yan arabası için belirtim.

## Wallarm AWS imajının hazır-to-use `cloud-init.py` scriptiyle dağıtılması

Infrastructure as Code (IaC) yaklaşımını takip ederseniz, Wallarm düğümünü AWS'ye dağıtmak için [`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html) scriptini kullanmanız gerekebilir. 4.0 sürümünden itibaren, Wallarm AWS bulut imajını hazır-to-use `cloud-init.py` scripti ile dağıtır.

[Wallarm `cloud-init` scriptinin özellikleri](../../installation/cloud-platforms/cloud-init.md)

## Basitleştirilmiş çok kiracılı düğüm yapılandırması

[Çok kiracılı düğümler](../../installation/multi-tenant/overview.md) için kiracılar ve uygulamalar artık kendi direktiflerine ayrı ayrı tanımlanmaktadır:

* Tekil bir kiracının benzersiz tanımlayıcısını yapılandırmak için [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) NGINX direktifi ve [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#partner_client_id_param) Envoy parametresi eklendi.
* [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) NGINX direktifi ve [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#application_param) Envoy parametresi davranışı değiştirildi. Artık sadece bir uygulama kimliğini yapılandırmak için **kullanılıyor**.

[Müşteri birden çok yönlü düğümünün yükselme talimatları](../multi-tenant.md)

## Filtrasyon modları

* Yeni **güvenli engelleme** filtreleme modu.

    Bu mod, yalnızca [gri listeye alınmış IP adreslerinden](../../user-guides/ip-lists/graylist.md) kaynaklanan kötü niyetli isteklerin engellenmesi ile [yanlış pozitif](../../about-wallarm/protecting-against-attacks.md#false-positives) sayısını önemli ölçüde azaltabilir.
* İstek kaynaklarının analizi artık yalnızca `safe_blocking` ve `block` modlarında gerçekleştirilmektedir.

     * Wallarm düğümü `off` veya `monitoring` modunda çalışırken ve [reddedilmiş](../../user-guides/ip-lists/denylist.md) IP'den kaynaklanan bir isteği tespit ederse, bu isteği engellemez.
     * Wallarm düğümü `monitoring` modunda çalışırken, [izin verilen IP adreslerinden](../../user-guides/ip-lists/allowlist.md) kaynaklanan tüm saldırıları Wallarm Buluta yükler.

[Wallarm düğüm modları hakkında daha fazla detay →](../../admin-en/configure-wallarm-mode.md)

## İstek kaynağı kontrolü

Aşağıdaki istek kaynağı kontrol parametreleri kullanımdan kaldırıldı:

* IP adresi reddedilmiş listeyi yapılandırmak için kullanılan tüm `acl` NGINX direktifleri, Envoy parametreleri ve ortam değişkenleri. IP reddedilmiş listesinin manuel yapılandırması artık gerekli değildir.

    [Reddedilmiş liste yapılandırmasının taşınma detayları →](../migrate-ip-lists-to-node-3.md)

İstek kaynağı kontrolü için aşağıdaki yeni özellikler mevcuttur:

* Wallarm Konsol bölümü ile tam IP adresi izin verilmiş, reddedilmiş ve gri liste kontrolü.
* Yeni [filtrasyon modu](../../admin-en/configure-wallarm-mode.md) `safe_blocking` ve [IP address graylisting](../../user-guides/ip-lists/graylist.md) desteği.

    **Güvenli engelleme** modu, yalnızca gri listeye alınmış IP adreslerinden kaynaklanan kötü niyetli isteklerin engellenmesi ile [yanlış pozitif](../../about-wallarm/protecting-against-attacks.md#false-positives) sayısını önemli ölçüde azaltır.

    Otomatik IP adresi gri listelemesi için yeni bir [trigger **Add to graylist**](../../user-guides/triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) yayımlandı.
* [Wallarm Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vunerability-scanner) IP adreslerinin otomatik izin listesidir. Scanner IP adreslerinin manuel izin listesine gerek yoktur.
* Bir alt ağı, Tor ağı IP'lerini, VPN IP'lerini, belirli bir ülke, bölge veya veri merkezinde kayıtlı olan bir grup IP adresini izin listesine alma, reddedilmiş listeye alma veya gri listeye alma yeteneği.
* Belirli uygulamalar için istek kaynaklarını izin listesine alma, reddedilmiş listeye alma veya gri listeye alma yeteneği.
* Wallarm'ın 'disable_acl' parametresi, [reddedilmiş](../../user-guides/ip-lists/denylist.md) IP'lerden gelen isteklerin analizini atlayarak Wallarm düğümünün performansını arttırmak için yeni bir parametredir.

    [disable_acl NGINX direktifine dair ayrıntılar →](../../admin-en/configure-parameters-en.md#disable_acl)

    [disable_acl Envoy parametresine dair ayrıntılar →](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

[IP'leri izin listesine alma, reddedilmiş listeye alma ve gri listeye alma ile ilgili detaylar →](../../user-guides/ip-lists/overview.md)

## Yeni API envanteri keşfi modülü

Wallarm, uygulama API'sını otomatik olarak tanımlayan modül **API Discovery** ile dağıtılır. Bu modül varsayılan olarak devre dışıdır.

[API Discovery modülü üzerine ayrıntılar →](../../about-wallarm/api-discovery.md)

## libdetection kütüphanesi ile iyileştirilmiş saldırı analizi

Wallarm tarafından gerçekleştirilen saldırı analizi, ek bir saldırı doğrulama katmanı dahil edilerek güçlendirilmiştir. Wallarm düğümü 4.4 ve üzeri tüm form faktörlerinde (Envoy dahil), varsayılan olarak etkinleştirilmiş libdetection kütüphanesi ile dağıtılır. Bu kütüphane, tüm [SQLi](../../attacks-vulns-list.md#sql-injection) saldırıları için tamamen dil bilgisi tabanlı ikincil bir doğrulama gerçekleştirir ve SQL enjeksiyonları arasında tespit edilen yanlış pozitif sayısını azaltır.

!!! uyarı "Bellek tüketiminin artması"
    **libdetection** kütüphanesi etkinleştirildiğinde, NGINX/Envoy ve Wallarm işlemleri tarafından tüketilen bellek miktarı yaklaşık %10 artabilir.

[Wallarm'ın saldırıları nasıl tespit ettiği üzerine ayrıntılar →](../../about-wallarm/protecting-against-attacks.md)

## `overlimit_res` saldırı tespitinin ince ayarını sağlayan kural

[overlimit_res saldırı tespitini ince ayarlamaya izin veren yeni bir kural](../../user-guides/rules/configure-overlimit-res-detection.md) tanıttık.

NGINX ve Envoy yapılandırma dosyalarında `overlimit_res` saldırı tespitinin ince ayarının yapılması, deprecated bir şekilde kabul edilir:

* Kural, `wallarm_process_time_limit` NGINX direktifi ve `process_time_limit` Envoy parametresinin yaptığı gibi tek bir istek işleme süresi limitini ayarlamayı sağlar.
* Kural, [düğüm filtrasyon moduna](../../admin-en/configure-wallarm-mode.md) uygun olarak `overlimit_res` saldırılarını engellemeye veya geçirmeye olanak sağlar, `wallarm_process_time_limit_block` NGINX direktifi ve `process_time_limit_block` Envoy parametresinin yapılandırmasının aksine.

Belirtilen direktifler ve parametreler kullanımdan kaldırılmıştır ve gelecekteki sürümlerde silinecektir. `overlimit_res` saldırı tespit yapısının eski direktiflerden kurallara taşınması önerilir. Her [düğüm dağıtım seçeneği](../general-recommendations.md#update-process) için ilgili talimatlar sağlanmıştır.

Belirtilen parametreler açıkça yapılandırma dosyalarında belirtilmişse ve kural henüz oluşturulmamışsa, düğüm istekleri yapılandırma dosyalarında belirtildiği gibi işler.

## Yeni engelleme sayfası

Örnek engelleme sayfası `/usr/share/nginx/html/wallarm_blocked.html` güncellendi. Yeni düğüm sürümünde, yeni bir düzene sahip ve logo ve destek e-postası özelleştirme işlemlerini destekliyor.
    
Yeni düzene sahip yeni engelleme sayfası varsayılan olarak şöyle görünür:

![Wallarm engelleme sayfası](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

[Engelleme sayfası kurulumu hakkında daha fazla detay →](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)

## Temel düğüm kurulumu için yeni parametreler

* Wallarm NGINX tabanlı Docker konteynerine geçirilecek yeni ortam değişkenleri:

    * `WALLARM_APPLICATION`, kullanılacak olan Wallarm Cloud'da korunan uygulamanın tanımlayıcısını ayarlar.
    * `NGINX_PORT`, NGINX'in Docker konteyneri içinde kullanacağı portu ayarlar.

    [Wallarm NGINX tabanlı Docker konteynerinin kurulum talimatları →](../../admin-en/installation-docker-en.md)
* Wallarm Bulutu ve filtreleme düğümlerinin senkronizasyonunu yapılandırmak için `node.yaml` dosyasının yeni parametreleri: `api.local_host` ve `api.local_port`. Yeni parametreler, Wallarm API'ye istekte bulunmak için bir ağ arayüzünün yerel IP adresini ve portunu belirtmenize olanak tanır.

    [Wallarm Bulutu ve filtreleme düğümlerinin senkronizasyon kurulumu için `node.yaml` parametrelerinin tam listesi →](../../admin-en/configure-cloud-node-synchronization-en.md#access-parameters)

## IPv6 bağlantılarının devre dışı bırakılması için NGINX tabanlı Wallarm Docker konteyneri

NGINX tabanlı Wallarm Docker imajı 4.2 ve üzeri, IPv6 bağlantı işlemesini önleyen ve yalnızca IPv4 bağlantılarını işlemesine olanak sağlayan yeni bir ortam değişkenini destekler: `DISABLE_IPV6`.

## Yeniden adlandırılan parametreler, dosyalar ve metrikler

* Aşağıdaki NGINX direktifleri ve Envoy parametreleri yeniden adlandırıldı:

    * NGINX: `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * NGINX: `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * NGINX: `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * NGINX: `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)
    * Envoy: `lom` → [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * Envoy: `instance` → [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)
    * Envoy: `tsets` → `rulesets`, ve bu bölümde sırasıyla `tsN` girdileri → `rsN`
    * Envoy: `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * Envoy: `ts` → [`ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)

    Önceki isimlere sahip parametreler hala desteklenmektedir ancak gelecekteki sürümlerde kullanımdan kaldırılacaktır. Parametre mantığı değişmemiştir.
* Ingress [bildirimi](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-instance` yeniden adlandırıldı: `nginx.ingress.kubernetes.io/wallarm-application`.

    Önceki isimleki bildirim hala desteklenmektedir ancak gelecekteki sürümlerde kullanımdan kaldırılacaktır. Bildirim mantığı değişmemiştir.
* Özel kurallar seti derlemi `/etc/wallarm/lom` dosyası `/etc/wallarm/custom_ruleset` olarak yeniden adlandırıldı. Yeni düğüm sürümlerinin dosya sistemlerinde sadece yeni adla dosya bulunmaktadır.

    NGINX diretifi [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path) ve Envoy parametresi [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings) varsayılan değerleri de buna göre değiştirilmiştir. Yeni varsayılan değer `/etc/wallarm/custom_ruleset`'tir.
* Özel anahtar dosyası `/etc/wallarm/license.key` yeniden adlandırıldı: `/etc/wallarm/private.key`. Düğüm sürümünün 4.0'dan itibaren, yeni isim varsayılan olarak kullanılır.
* `gauge-lom_id` collectd metriği yeniden adlandırıldı: `gauge-custom_ruleset_id`.

    Yeni düğüm sürümleri collectd hizmeti, hem kullanımdan kalkan hem de yeni metriklerin koleksiyonunu toplar. Kullanımdan kalkan metriğin koleksiyonu, gelecekteki sürüm sonrada durdurulacaktır.

    [Tüm collectd metrikleri →](../../admin-en/monitoring/available-metrics.md#nginx-metrics-and-nginx-wallarm-module-metrics)
* Docker konteynerlerindeki [`addnode_loop.log`](../../admin-en/configure-logging.md) [log dosyası](../../admin-en/configure-logging.md) `/var/log/wallarm/registernode_loop.log` olarak yeniden adlandırıldı.

## Statistics service parametreleri

* Prometheus metriği `wallarm_custom_ruleset_id`, `format` özelliğinin eklenmesiyle güçlendirildi. Bu yeni özellik, özel kurallar setinin biçimini temsil eder. Bu arada, başlıca değer özel kurallar seti derleme sürümü olarak devam eder. İşte `wallarm_custom_ruleset_id` değerinin güncellenmiş bir örneği:

    ```
    wallarm_custom_ruleset_id{format="51"} 386
    ```
* Wallarm statistics hizmeti, [Wallarm hız sınırlama](#hiz-sinirlari) modülünün verileri ile yeni `rate_limit` parametrelerini döndürür. Yeni parametreler red edilen ve geciken istekleri ve modülün işleyişindeki herhangi bir sorunu işaretler.
* Reddedilmiş listeye giren IP'lerden kaynaklanan isteklerin sayısı, yeni parametre `blocked_by_acl` ve mevcut parametreler `requests`, `blocked` olarak istatistik hizmeti çıktısında görüntülenir.
* Hizmet, düğüm tarafından kullanılan [özel kurallar setini](../../glossary-en.md#custom-ruleset-the-former-term-is-lom) işaret eden bir parametre daha döndürür: `custom_ruleset_ver`.
* Aşağıdaki düğüm istatistikleri parametreleri yeniden adlandırıldı:

    * `lom_apply_time` → `custom_ruleset_apply_time`
    * `lom_id` → `custom_ruleset_id`

    Yeni düğüm sürümlerinde, http://127.0.0.8/wallarm-status endpointi geçici olarak kullanımdan kalkan ve yeni parametreleri döndürür. Kullanımdan kalkan parametreler hizmet çıktısından gelecekteki sürümlerde kaldırılacak.

[Statistics hizmeti hakkında ayrıntılar →](../../admin-en/configure-statistics-service.md)

## Node loglama formatını yapılandırmak için yeni değişkenler

Aşağıdaki [düğüm loglama değişkenleri](../../admin-en/configure-logging.md#filter-node-variables) değiştirildi:

* `wallarm_request_time` yeniden adlandırıldı: `wallarm_request_cpu_time`

    Bu değişken, CPU'nun isteği işlemek için harcadığı saniye cinsinden süreyi ifade eder.

    Önceki isimdeki değişken kullanımdan kaldırıldı ve gelecekteki sürümlerde kaldırılacak. Değişken mantığı değişmeden devam eder.
* `wallarm_request_mono_time` eklendi.

    Bu değişken, CPU'nun isteği işlemek için harcadığı saniye cinsinden süreyi + kuyruktaki süreyi ifade eder.

## Reddedilmiş listeye giren IP'lerden gelen isteklerde saldırı aramasını atlayarak performansı artırmak

Yeni [`wallarm_acl_access_phase`](../../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) direktifi, Wallarm düğümünün performansını, [reddedilmiş](../../user-guides/ip-lists/denylist.md) IP'lerden gelen isteklerin analizi sırasındaki saldırı arama aşamasını atlayarak artırmanıza olanak sağlar. Bu yapılandırma seçeneği, bir çok reddedilmiş IP'si (örneğin, bir bütün ülke) olan ve çalışmak için yüksek trafik oluşturarak işlemciyi aşırı yükleyen yüksek trafikli bir durumda yararlıdır.

[ `disable_acl` NGINX direktifi hakkında ayrıntılar →](../../admin-en/configure-parameters-en.md#disable_acl)

[ `disable_acl` Envoy parametresi hakkında ayrıntılar →](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

[IP'leri izin listesine alma, reddedilmiş listeye alma ve gri listeye alma ile ilgili detaylar →](../../user-guides/ip-lists/overview.md)

## Düğüm örneklerinin kolay gruplandırılması

Artık düğüm örneklerini, düğümün kurulumu için kullanılan bir [**API tokenı**](../../user-guides/settings/api-tokens.md) ile `WALLARM_LABELS` değişkenini ve `group` etiketini kullanarak kolayca gruplayabilirsiniz.

Örneğin:

```bash
docker run -d -e WALLARM_API_TOKEN='<DEPLOY ROLE İLE API TOKENI>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -e WALLARM_LABELS='group=<GROUP>' -p 80:80 wallarm/node:4.8.1-1
```
...düğüm örneğini <GROUP> örnek grubuna yerleştirecektir (mevcutsa veya mevcut değilse, oluşturulacaktır).

## Yükseltme süreci

1. [Modülleri yükseltme önerilerini](../general-recommendations.md) gözden geçirin.
2. Wallarm düğüm dağıtım seçeneğinize göre kurulu modülleri yükseltme talimatlarını izleyin:

      * [NGINX, NGINX Plus için modülleri yükseltme](nginx-modules.md)
      * [NGINX veya Envoy için modülleri içeren Docker konteynerini yükseltme](docker-container.md)
      * [Entegre Wallarm modülleri ile NGINX Ingress denetleyicisini yükseltme](ingress-controller.md)
      * [Cloud node image](cloud-image.md)
      * [Multi-tenant node](multi-tenant.md)
      * [CDN node](../cdn-node.md)
3. 4.8'e önceki Wallarm düğüm sürümlerinden izin vermeyi, reddedilmeyi ve gri listeye alınmayı [taşıyın](../migrate-ip-lists-to-node-3.md).

----------

[Wallarm ürünleri ve bileşenlerindeki diğer güncellemeler →](https://changelog.wallarm.com/)