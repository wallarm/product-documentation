# Wallarm çözümünün dağıtımı ve bakımı için en iyi uygulamalar

Bu makale, Wallarm çözümünün dağıtımı ve bakımı için en iyi uygulamaları ortaya koyar.

## NGINX'in gücünü anlayın

Wallarm filtreleme düğümlerinin çoğu dağıtım seçeneği, ters proxy sunucusu olarak NGINX'i (Wallarm modülünün temeli) kullanır; bu da geniş bir işlevsellik, modül ve performans/güvenlik rehberleri yelpazesi sunar. Aşağıda yararlı İnternet makalelerinin bir derlemesi bulunmaktadır:

* [Awesome NGINX](https://github.com/agile6v/awesome-nginx)
* [NGINX: Temeller ve En İyi Uygulamalar slayt gösterisi](https://www.slideshare.net/Nginx/nginx-basics-and-best-practices-103340015)
* [NGINX yapılandırması nasıl optimize edilir](https://www.digitalocean.com/community/tutorials/how-to-optimize-nginx-configuration)
* [NGINX sunucunuzu optimize etmek için 3 hızlı adım](https://www.techrepublic.com/article/3-quick-steps-to-optimize-the-performance-of-your-nginx-server/)
* [15 Adımda Dayanıklı bir NGINX Sunucusu Nasıl Kurulur](https://www.upguard.com/blog/how-to-build-a-tough-nginx-server-in-15-steps)
* [NGINX Web Sunucusunun Performansı Nasıl Ayarlanır ve Optimize Edilir](https://hostadvice.com/how-to/how-to-tune-and-optimize-performance-of-nginx-web-server/)
* [NGINX sunucunuzu güçlendirmenin ve performansını artırmanın güçlü yolları](https://www.freecodecamp.org/news/powerful-ways-to-supercharge-your-nginx-server-and-improve-its-performance-a8afdbfde64d/)
* [TLS Yaygınlaştırma En İyi Uygulamaları](https://www.linode.com/docs/guides/tls-deployment-best-practices-for-nginx/)
* [NGINX Web Sunucusu Güvenlik ve Sertleştirme Rehberi](https://geekflare.com/nginx-webserver-security-hardening-guide/)
* [En İyi Performans için NGINX Ayarları](https://github.com/denji/nginx-tuning)
* [NGINX Web Sunucusu için En İyi 25 Güvenlik Uygulaması](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html)

## Önerilen başlangıç adımlarını izleyin

1. Şunlar için mevcut Wallarm düğüm dağıtım seçeneklerini öğrenin:

    * [Security Edge](../installation/security-edge/overview.md)
    * [Self-hosted deployment](../installation/supported-deployment-options.md)
    * [Connector deployment](../installation/connectors/overview.md)
2. [Ortamlarınız için Wallarm düğüm yapılandırmasını ayrı ayrı yönetme](../installation/multi-tenant/overview.md#issues-addressed-by-multitenancy) seçeneklerini (gerekirse) öğrenin.
3. Wallarm filtreleme düğümlerini üretim dışı ortamlarınıza [çalışma modu](../admin-en/configure-wallarm-mode.md) `monitoring` olarak ayarlanmış şekilde dağıtın.
4. Wallarm çözümünü nasıl işleteceğinizi, ölçeklendireceğinizi ve izleyeceğinizi öğrenin ve yeni ağ bileşeninin stabilitesini doğrulayın.
5. Wallarm filtreleme düğümlerini üretim ortamınıza [çalışma modu](../admin-en/configure-wallarm-mode.md) `monitoring` olarak ayarlanmış şekilde dağıtın.
6. Yeni Wallarm bileşeni için uygun yapılandırma yönetimi ve [izleme süreçlerini](#enable-proper-monitoring-of-the-filtering-nodes) uygulayın.
7. Wallarm bulut tabanlı arka ucunun uygulamanızı öğrenmesi için tüm ortamlarınızda (test ve üretim dahil) trafiği 7‑14 gün boyunca filtreleme düğümleri üzerinden akıtın.
8. Tüm üretim dışı ortamlarınızda Wallarm `block` [modu](../admin-en/configure-wallarm-mode.md)nu etkinleştirin ve korunan uygulamanın beklendiği gibi çalıştığını doğrulamak için otomatik veya manuel testler kullanın.
9. Üretim ortamında Wallarm `block` [modu](../admin-en/configure-wallarm-mode.md)nu etkinleştirin ve uygulamanın beklendiği gibi çalıştığını doğrulamak için mevcut yöntemleri kullanın.

## Filtreleme düğümlerini yalnızca üretimde değil, test ve staging ortamlarında da dağıtın

Wallarm hizmet sözleşmelerinin çoğu, müşterinin dağıttığı Wallarm düğümü sayısını sınırlamaz, bu nedenle geliştirme, test, staging vb. dahil tüm ortamlarınıza filtreleme düğümlerini dağıtmamanız için bir neden yoktur.

Filtreleme düğümlerini yazılım geliştirme ve/veya hizmet işletim faaliyetlerinizin tüm aşamalarında dağıtıp kullanarak, tüm veri akışını uygun şekilde test etme ve kritik üretim ortamınızdaki beklenmedik durum riskini en aza indirme şansınızı artırırsınız.

## libdetection kitaplığını etkinleştirin

İstekleri [**libdetection** kitaplığı](protecting-against-attacks.md#library-libdetection) ile analiz etmek, filtreleme düğümünün SQLi saldırılarını algılama yeteneğini önemli ölçüde artırır. Tüm Wallarm müşterilerinin filtreleme düğümü yazılımının en son sürümüne [yükseltmeleri](/updating-migrating/general-recommendations/) ve **libdetection** kitaplığını etkin halde tutmaları önemle tavsiye edilir.

* Filtreleme düğümü 4.4 ve üzeri sürümlerde **libdetection** varsayılan olarak etkindir.
* Daha düşük sürümlerde, dağıtım seçeneğinize uygun [yaklaşımı](protecting-against-attacks.md#managing-libdetection-mode) kullanarak etkinleştirmeniz önerilir.

## Son kullanıcı IP adreslerinin doğru raporlanmasını yapılandırın

Bir yük dengeleyici veya CDN arkasında bulunan Wallarm filtreleme düğümleri için, filtreleme düğümlerinizi son kullanıcı IP adreslerini doğru raporlayacak şekilde yapılandırdığınızdan emin olun (aksi takdirde [IP list functionality](../user-guides/ip-lists/overview.md), [Threat Replay Testing](detecting-vulnerabilities.md#threat-replay-testing) ve bazı diğer özellikler çalışmayacaktır):

* [NGINX tabanlı Wallarm düğümleri için talimatlar](../admin-en/using-proxy-or-balancer-en.md) (AWS / GCP imajları ve Docker düğüm konteyneri dahil)
* [Wallarm Kubernetes Ingress controller olarak dağıtılan filtreleme düğümleri için talimatlar](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## Filtreleme düğümlerini uygun şekilde izlemeyi etkinleştirin

Wallarm filtreleme düğümlerinin uygun şekilde izlenmesini etkinleştirmeniz önemle tavsiye edilir.

Filtreleme düğümünün izlenmesini ayarlama yöntemi dağıtım seçeneğine bağlıdır:

* [Wallarm Kubernetes Ingress controller olarak dağıtılan filtreleme düğümleri için talimatlar](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [NGINX tabanlı Docker imajı için talimatlar](../admin-en/installation-docker-en.md#monitoring-configuration)

## Uygun yedeklilik ve otomatik failover işlevselliğini uygulayın

Üretim ortamınızdaki diğer tüm kritik bileşenlerde olduğu gibi, Wallarm düğümleri de uygun düzeyde yedeklilik ve otomatik failover ile tasarlanmalı, dağıtılmalı ve işletilmelidir. Kritik son kullanıcı isteklerini yöneten **en az iki aktif Wallarm filtreleme düğümüne** sahip olmalısınız. Aşağıdaki makaleler konu hakkında ilgili bilgiler sağlar:

* [NGINX tabanlı Wallarm düğümleri için talimatlar](../admin-en/configure-backup-en.md) (AWS / GCP imajları, Docker düğüm konteyneri ve Kubernetes sidecar'ları dahil)
* [Wallarm Kubernetes Ingress controller olarak dağıtılan filtreleme düğümleri için talimatlar](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)

## IP adresi allowlist, denylist ve graylist'i nasıl kullanacağınızı öğrenin

Bireysel kötü amaçlı istekleri engellemenin yanı sıra, Wallarm filtreleme düğümleri bireysel son kullanıcı IP adreslerini de engelleyebilir. IP engelleme kuralları allowlist, denylist ve graylist kullanılarak yapılandırılır.

[IP lists kullanımına ilişkin daha fazla ayrıntı →](../user-guides/ip-lists/overview.md)

## Wallarm yapılandırma değişikliklerinin kademeli yayılımını nasıl yapacağınızı öğrenin

* Tüm form faktörlerdeki Wallarm filtreleme düğümleri için düşük seviyeli yapılandırma değişikliklerinde standart DevOps değişiklik yönetimini ve kademeli yayılım politikalarını kullanın.
* Trafik filtreleme kuralları için, farklı uygulama [ID'leri](../admin-en/configure-parameters-en.md#wallarm_application) veya `Host` istek başlıkları kullanın.
* [Create regexp-based attack indicator](../user-guides/rules/regex-rule.md#creating-and-applying-rule) kuralı, yukarıda belirtilen belirli bir uygulama ID'siyle ilişkilendirilebilmenin yanı sıra, Wallarm düğümü blocking mode'da çalışırken bile monitoring modunda (**Experimental** onay kutusu) etkinleştirilebilir.
* [Set filtration mode](../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode) kuralı, Wallarm Console üzerinden Wallarm düğümünün çalışma modunu (`monitoring`, `safe_blocking` veya `block`) kontrol etmenizi sağlar; bu, NGINX yapılandırmasındaki [`wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode) ayarına (ve [`wallarm_mode_allow_override`](../admin-en/configure-parameters-en.md#wallarm_mode_allow_override) ayarına) benzer şekilde çalışır.

## Sistemden bildirim almak için mevcut entegrasyonları yapılandırın

Wallarm, platform tarafından üretilen farklı güvenlik bildirimlerini size hızla göndermek için Slack, Telegram, PagerDuty, Opsgenie ve diğer sistemlerle kullanışlı [yerel entegrasyonlar](../user-guides/settings/integrations/integrations-intro.md) sağlar; örneğin:

* Yeni keşfedilen güvenlik açıkları
* Şirket ağ çevresindeki değişiklikler
* Wallarm Console üzerinden şirket hesabına yeni eklenen kullanıcılar vb.

Sistemde gerçekleşen farklı olaylar hakkında özel uyarılar ayarlamak için [Triggers](../user-guides/triggers/triggers.md) işlevini de kullanabilirsiniz.

## Triggers işlevinin gücünü öğrenin

Özel ortamınıza bağlı olarak aşağıdaki [triggers](../user-guides/triggers/triggers.md) yapılandırmanızı öneririz:

* Wallarm düğümleri tarafından algılanan kötü amaçlı istek seviyesindeki artışı izlemek. Bu trigger aşağıdaki potansiyel sorunlardan birini işaret edebilir:

    * Saldırı altındasınız ve Wallarm düğümü kötü amaçlı istekleri başarıyla engelliyor. Algılanan saldırıları gözden geçirmeyi ve raporlanan saldırgan IP adreslerini manuel olarak denylist (block) etmeyi düşünebilirsiniz.
    * Wallarm düğümleri tarafından algılanan false positive saldırı seviyesi arttı. Bunu [Wallarm teknik destek ekibine](mailto:support@wallarm.com) iletmeyi veya istekleri manuel olarak [false positive olarak işaretlemeyi](../user-guides/events/check-attack.md#false-positives) düşünebilirsiniz.
    * [Denylisting trigger](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) etkinse ancak yine de artan saldırı seviyesine ilişkin uyarılar alıyorsanız, bu uyarı trigger'ın beklendiği gibi çalışmadığını gösteriyor olabilir.

    [Yapılandırılmış trigger örneğini görün →](../user-guides/triggers/trigger-examples.md#slack-notification-if-2-or-more-sqli-hits-are-detected-in-one-minute)
* Wallarm Console içinde şirket hesabınıza yeni bir kullanıcı eklendiğinde bildirim gönderin

    [Yapılandırılmış trigger örneğini görün →](../user-guides/triggers/trigger-examples.md#slack-and-email-notification-if-new-user-is-added-to-the-account)
* İstekleri brute-force veya zorla dizin gezme (forced browsing) saldırısı olarak işaretleyin ve isteklerin kaynaklandığı IP adreslerini engelleyin

    [Brute force korumasını yapılandırma talimatları →](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* Yeni IP adreslerinin engellendiğini bildirin

    [Yapılandırılmış trigger örneğini görün →](../user-guides/triggers/trigger-examples.md#notification-to-webhook-url-if-ip-address-is-added-to-the-denylist)
* IP adreslerini, [safe blocking](../admin-en/configure-wallarm-mode.md) modunda kullanılan [graylist](../user-guides/ip-lists/overview.md)'e otomatik olarak ekleyin.

Trafik işleme ve saldırı yüklemeyi optimize etmek için, Wallarm bazı triggers'ları [önceden yapılandırır](../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers).

## Wallarm Console hesabınız için SAML SSO'yu etkinleştirin

Wallarm Console hesabınızdaki kullanıcıların kimlik doğrulamasını merkezileştirmek için G Suite, Okta veya OneLogin gibi bir SAML SSO sağlayıcısı kullanabilirsiniz.

Hesabınız için SAML SSO'yu etkinleştirmek üzere Wallarm müşteri temsilciniz veya teknik destek ekibi ile iletişime geçin ve ardından SAML SSO yapılandırmasını gerçekleştirmek için [bu talimatları](../admin-en/configuration-guides/sso/intro.md) izleyin.

## Wallarm Cloud yapılandırma yönetimi için Wallarm Terraform provider'ını kullanın

[Wallarm'ın resmi Terraform provider'ı](../admin-en/managing/terraform-provider.md), modern Kod Olarak Altyapı (IaC) yaklaşımını kullanarak Wallarm Cloud yapılandırmanızı (kullanıcılar, uygulamalar, kurallar, entegrasyonlar vb.) yönetmenize olanak tanır.

## Yeni yayımlanan Wallarm düğüm sürümlerine hızlıca güncellemek için bir planınız olsun

Wallarm, filtreleme düğümü yazılımını geliştirmek için sürekli çalışmaktadır ve yaklaşık her çeyrekte yeni sürümler yayınlanmaktadır. Yükseltmeleri gerçekleştirmek için önerilen yaklaşım, ilişkili riskler ve ilgili yükseltme prosedürleri hakkında bilgi için lütfen [bu belgeyi](../updating-migrating/general-recommendations.md) okuyun.

## Bilinen dikkat noktalarını öğrenin

* Aynı Wallarm hesabına bağlı tüm Wallarm düğümleri, trafik filtreleme için aynı varsayılan ve özel kurallar setini alır. Yine de uygun uygulama ID'lerini veya başlıklar, sorgu dizesi parametreleri vb. gibi benzersiz HTTP istek parametrelerini kullanarak farklı uygulamalar için farklı kurallar uygulayabilirsiniz.
* Bir IP adresini otomatik olarak engelleyecek şekilde yapılandırılmış bir trigger'a sahipseniz ([trigger örneği](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)), sistem Wallarm hesabındaki tüm uygulamalar için IP'yi engelleyecektir.

## Threat Replay Testing için en iyi uygulamaları izleyin <a href="../subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

Wallarm'ın [güvenlik açıklarını tespit etmek](../about-wallarm/detecting-vulnerabilities.md) için kullandığı yöntemlerden biri **Threat Replay Testing**'dir.

**Threat Replay Testing**, saldırganları penetrasyon test uzmanlarına dönüştürmenizi ve uygulamalarınızı/API'lerinizi güvenlik açıkları için yoklarken faaliyetlerinden olası güvenlik sorunlarını keşfetmenizi sağlar. Bu modül, trafikten gelen gerçek saldırı verilerini kullanarak uygulama uç noktalarını yoklayıp olası güvenlik açıklarını bulur. Varsayılan olarak bu yöntem devre dışıdır.

**Threat Replay Testing** modülü yapılandırması için en iyi uygulamaları öğrenin →](../vulnerability-detection/threat-replay-testing/setup.md)