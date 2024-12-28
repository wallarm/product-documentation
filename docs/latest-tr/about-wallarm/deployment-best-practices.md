# Wallarm çözümünün dağıtım ve bakım en iyi uygulamaları

Bu makale, Wallarm çözümünün dağıtımı ve bakımı için en iyi uygulamaları formüle eder.

## NGINX'in gücünü anlayın

Wallarm filtreleme düğümü dağıtım seçeneklerinin çoğunluğu, geniş bir işlevsellik, modül ve performans/güvenlik kılavuzları sağlayan tersten vekil sunucu (Wallarm modülünün temeli) olarak NGINX'i kullanır. İşte yardımcı olabilecek bazı İnternet makalelerinin bir koleksiyonu:

* [Harika NGINX](https://github.com/agile6v/awesome-nginx)
* [NGINX: Temeller ve En İyi Uygulamalar slayt şovu](https://www.slideshare.net/Nginx/nginx-basics-and-best-practices-103340015)
* [NGINX yapılandırmasını nasıl optimize edersiniz](https://www.digitalocean.com/community/tutorials/how-to-optimize-nginx-configuration)
* [NGINX sunucunuzun performansını optimize etmek için 3 hızlı adım](https://www.techrepublic.com/article/3-quick-steps-to-optimize-the-performance-of-your-nginx-server/)
* [15 Adımda Güçlü Bir NGINX Sunucusu Nasıl Oluşturulur](https://www.upguard.com/blog/how-to-build-a-tough-nginx-server-in-15-steps)
* [NGINX Web Sunucusunun Performansını Ayarlama ve Optimize Etme](https://hostadvice.com/how-to/how-to-tune-and-optimize-performance-of-nginx-web-server/)
* [NGINX sunucunuzu süper şarj etmenin ve performansını artırmanın güçlü yolları](https://www.freecodecamp.org/news/powerful-ways-to-supercharge-your-nginx-server-and-improve-its-performance-a8afdbfde64d/)
* [TLS Dağıtım En İyi Uygulamaları](https://www.linode.com/docs/guides/tls-deployment-best-practices-for-nginx/)
* [NGINX Web Sunucusu Güvenlik ve Sertleştirme Kılavuzu](https://geekflare.com/nginx-webserver-security-hardening-guide/)
* [En İyi Performans İçin NGINX Ayarlama](https://github.com/denji/nginx-tuning)
* [En İyi 25 NGINX Web Sunucusu Güvenlik Uygulamaları](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html)

## Önerilen hazırlık adımlarını takip edin

1. Mevcut [Wallarm düğüm dağıtım seçeneklerini](../installation/supported-deployment-options.md) öğrenin.
2. Gerekirse, [ortamlarınız için Wallarm düğüm yapılandırmasını ayrı ayrı yönetme seçeneklerini](../admin-en/configuration-guides/wallarm-in-separated-environments/how-wallarm-in-separated-environments-works.md) öğrenin.
3. [İşletim modunu](../admin-en/configure-wallarm-mode.md) `monitoring` olarak ayarlayarak Wallarm filtreleme düğümlerini üretim dışı ortamlarınızda dağıtın.
4. Wallarm çözümünü nasıl işleteceğinizi, ölçeklendireceğinizi ve izleyeceğinizi öğrenin ve yeni ağ bileşeninin stabilitesini doğrulayın.
5. [İşletim modunu](../admin-en/configure-wallarm-mode.md) `monitoring` olarak ayarlayarak Wallarm filtreleme düğümlerini üretim ortamınızda dağıtın.
6. Yeni Wallarm bileşeni için uygun yapılandırma yönetimini ve [izleme süreçlerini](#enable-proper-monitoring-of-the-filtering-nodes) uygulayın.
7. Uygulamanız hakkında bilgi vermek için Wallarm bulut tabanlı arka uca biraz zaman vermek için tüm ortamlarınızda (test ve üretim de dahil olmak üzere) filtreleme düğümleri üzerinden trafiği 7-14 gün boyunca akışta tutun.
8. Tüm üretim dışı ortamlarınızda Wallarm `block` [modunu](../admin-en/configure-wallarm-mode.md) etkinleştirin ve otomatik veya manuel testler kullanarak korunan uygulamanın beklendiği gibi çalıştığını doğrulayın.
9. Üretim ortamında Wallarm `block` [modunu](../admin-en/configure-wallarm-mode.md) etkinleştirin ve uygulamanın beklendiği gibi çalıştığını doğrulamak için mevcut yöntemleri kullanın.

## Filtreleme düğümlerini sadece üretim ortamında değil, aynı zamanda test ve sahneleme ortamında da dağıtın

Wallarm hizmet sözleşmelerinin çoğunluğu, müşterinin dağıtılan Wallarm düğüm sayısını sınırlamaz, bu nedenle filtreleme düğümlerini tüm ortamlarınıza, geliştirme, test, sahneleme vb. dahil olacak şekilde dağıtma konusunda bir neden yok.

Filtreleme düğümlerini tüm yazılım geliştirme ve/veya hizmet işletim faaliyetlerinizin tüm aşamalarında dağıtarak ve kullanarak, tüm veri akışını uygun bir şekilde test etme ve kritik üretim ortamınızdaki herhangi bir beklenmeyen durum riskini en aza indirme şansınız daha yüksek olacaktır.

## Libdetection kütüphanesini etkinleştirin

[**Libdetection** kütüphanesi](protecting-against-attacks.md#library-libdetection) ile istek analizi, filtreleme düğümünün SQLi saldırılarını tespit etme yeteneğini önemli ölçüde artırır. Tüm Wallarm müşterilerinin, filtreleme düğüm yazılımının en son sürümüne [güncelleme](/updating-migrating/general-recommendations/) yapmaları ve **libdetection** kütüphanesini etkin tutmaları şiddetle önerilir.

* Filtreleme düğümü sürüm 4.4 ve üstünde **libdetection** varsayılan olarak etkindir.
* Daha düşük sürümlerde, dağıtım seçeneğiniz için [yaklaşımı](protecting-against-attacks.md#managing-libdetection-mode) kullanarak etkinleştirilmesi önerilir.

## Son kullanıcı IP adreslerinin doğru raporlanmasını yapılandırın

Bir yük dengeleyici veya CDN'nin arkasında bulunan Wallarm filtreleme düğümleri için, filtreleme düğümlerinin son kullanıcı IP adreslerini doğru bir şekilde raporlamasını sağlamadan emin olun (aksi takdirde [IP listesi işlevselliği](../user-guides/ip-lists/overview.md), [Aktif tehdit doğrulama](detecting-vulnerabilities.md#active-threat-verification) ve bazı diğer özellikler çalışmayacaktır):

* [NGINX tabanlı Wallarm düğümleri için talimatlar](../admin-en/using-proxy-or-balancer-en.md) (AWS / GCP imajları ve Docker düğüm konteyneri dahil)
* [Filtreleme düğümlerinin Wallarm Kubernetes Giriş denetleyicisi olarak dağıtıldığı durumlar için talimatlar](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## Filtreleme düğümlerinin doğru izlenmesini etkinleştirin

Wallarm filtreleme düğümlerinin uygun bir şekilde izlenmesi şiddetle tavsiye edilir. Her Wallarm filtreleme düğümü ile birlikte kurulan `collectd` hizmeti, [bağlantıda](../admin-en/monitoring/available-metrics.md) listelenmiş olan metrikleri toplar.

Filtreleme düğümü izlemenin kurulum yöntemi, dağıtım seçeneğine bağlıdır:

* [NGINX tabanlı Wallarm düğümleri için talimatlar](../admin-en/monitoring/intro.md) (AWS / GCP imajları ve Kubernetes yan kutuları dahil)
* [Filtreleme düğümlerinin Wallarm Kubernetes Giriş denetleyicisi olarak dağıtıldığı durumlar için talimatlar](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [NGINX tabanlı Docker imajı için talimatlar](../admin-en/installation-docker-en.md#monitoring-configuration)

## Uygun yedeklemeyi ve otomatik hata geçiş işlevselliğini uygulayın

Diğer tüm kritik bileşenlerde olduğu gibi, Wallarm düğümlerinin de uygun düzeyde bir yedekliliğe ve otomatik hata geçişine sahip olacak şekilde mimarisi oluşturulmalı, dağıtılmalı ve işletilmelidir. Kritik son kullanıcı isteklerini işlemek için **en az iki aktif Wallarm filtreleme düğümünüz** olmalıdır. Aşağıdaki makaleler konu hakkında ilgili bilgileri sağlar:

* [NGINX tabanlı Wallarm düğümleri için talimatlar](../admin-en/configure-backup-en.md) (AWS / GCP imajları, Docker düğüm konteynırı ve Kubernetes yan kutuları dahil)
* [Filtreleme düğümlerinin Wallarm Kubernetes Giriş denetleyicisi olarak dağıtıldığı durumlar için talimatlar](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)

## IP adreslerinin izin verilen listesi, kara listesi ve gri listesini kullanmayı öğrenin

Wallarm filtreleme düğümleri, tekil kötü niyetli istekleri engellemenin yanı sıra, tekil son kullanıcı IP adreslerini de engelleyebilir. IP'ler için engelleme kuralları, izin verilen listeler, kara listeler ve gri listeler kullanılarak yapılandırılır.

[IP listelerinin kullanımı hakkında daha fazla ayrıntı →](../user-guides/ip-lists/overview.md)

## Wallarm yapılandırma değişikliklerini aşamalı olarak nasıl uygulayacağınızı öğrenin

* Wallarm filtreleme düğümlerinde düşük seviye yapılandırma değişiklikleri için standart DevOps değişiklik yönetimi ve aşamalı dağıtım politikalarını kullanın.
* Trafik filtrasyon kuralları için, farklı bir dizi uygulama [ID'leri](../admin-en/configure-parameters-en.md#wallarm_application) veya `Host` istek üstbilgileri kullanın.
* [Düzenli ifade tabanlı saldırı belirteci oluşturma](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule) kuralı, belirli bir uygulama ID'si ile ilişkilendirilme özelliğinin yanı sıra, Wallarm düğümü engelleme modunda çalışırken bile (Experimental onay kutusunu işaretleyerek) izleme modunda etkinleştirilebilir.
* [Filtrasyon modunu ayarlama](../user-guides/rules/wallarm-mode-rule.md) kuralı, Wallarm Konsolu'ndan Wallarm düğüm işlem modunun (`monitoring`, `safe_blocking` or `block`) kontrolüne izin verir. Bu, NGINX yapılandırmasındaki [`wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode) ayarına benzer ([`wallarm_mode_allow_override`](../admin-en/configure-parameters-en.md#wallarm_mode_allow_override) ayarına bağlıdır).

## Sistemden bildirim almak için mevcut entegrasyonları yapılandırın

Wallarm, platform tarafından oluşturulan farklı güvenlik bildirimlerini size hızlı bir şekilde göndermek için Slack, Telegram, PagerDuty, Opsgenie ve diğer sistemler ile uyumlu kullanışlı [yerel entegrasyonlar](../user-guides/settings/integrations/integrations-intro.md) sağlar, örneğin:

* Yeni keşfedilen güvenlik açıkları
* Şirket ağ çevresindeki değişiklikler
* Kullanıcıların Wallarm Konsolu aracılığıyla şirket hesabına yeni olarak eklenmeleri, vb.

Ayrıca, sistemdeki farklı olaylar hakkında özel uyarılar ayarlamak için [Tetikleyiciler](../user-guides/triggers/triggers.md) işlevselliğini kullanabilirsiniz.

## Tetikleyiciler işlevselliğinin gücünü öğrenin

Belirli bir ortama bağlı olarak, aşağıdaki [tetikleyicileri](../user-guides/triggers/triggers.md) yapılandırmanızı öneririz:

* Wallarm düğümleri tarafından tespit edilen kötü niyetli isteklerin artan düzeyini izleyin. Bu tetikleyici, aşağıdaki potansiyel sorunlardan birini sinyal edebilir:

    * Saldırı altındasınız ve Wallarm düğümü kötü niyetli istekleri başarıyla engelliyor. Saldırıları gözden geçirme ve bildirilen saldırgan IP adreslerini manuel olarak kara listeye alma (engelleme) seçeneğini düşünebilirsiniz.
    * Wallarm düğümleri tarafından tespit edilen kötü tahmin saldırılarının artan düzeyi. Bunun durumunu [Wallarm teknik destek ekibine](mailto:support@wallarm.com) yükseltmeyi veya istekleri manuel olarak [yanlış pozitif olarak işaretlemeyi](../user-guides/events/false-attack.md) düşünebilirsiniz.
    * [Kara listeye alma tetikleyiciniz](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) aktif ama hala saldırıların artan düzeyi hakkında uyarılar alıyorsanız, bu uyarı tetikleyicinin beklendiği gibi çalışmadığını sinyal edebilir.

    [Yapılandırılmış tetikleyici örneğini görün →](../user-guides/triggers/trigger-examples.md#slack-notification-if-2-or-more-sqli-hits-are-detected-in-one-minute)
* Wallarm Konsolu'ndaki şirket hesabınıza yeni bir kullanıcının eklendiğini bildirin

    [Yapılandırılmış tetikleyici örneğini görün →](../user-guides/triggers/trigger-examples.md#slack-and-email-notification-if-new-user-is-added-to-the-account)
* İstekleri zorla tarama veya kaba kuvvet saldırısı olarak işaretleyin ve isteklerin kaynaklandığı IP adreslerini bloke edin

    [Kaba kuvvet korumasının yapılandırılması hakkında talimatlar →](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* Yeni IP adreslerinin engellendiğini bildirin

    [Yapılandırılmış tetikleyici örneğini görün →](../user-guides/triggers/trigger-examples.md#notification-to-webhook-url-if-ip-address-is-added-to-the-denylist)
* IP adreslerini otomatik olarak [güvenli engelleme](../admin-en/configure-wallarm-mode.md) modunda kullanılan [gri listeye](../user-guides/ip-lists/graylist.md) ekleyin.

Trafik işleme ve saldırı yükleme optimizasyonu için, Wallarm bazı tetikleyicileri [önceden yapılandırır](../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers).

## Wallarm Konsol'daki hesabınız için SAML SSO'yu etkinleştirin

G Suite, Okta veya OneLogin gibi bir SAML SSO sağlayıcısını kullanarak Wallarm Konsolu hesabınızda kullanıcıların kimlik doğrulamasını merkezileştirebilirsiniz.

Lütfen SAML SSO'yu hesabınız için etkinleştirmek için Wallarm hesap yöneticinize veya teknik destek ekibine başvurun ve bundan sonra [bu talimatları](../admin-en/configuration-guides/sso/intro.md) takip ederek SAML SSO yapılandırmasını gerçekleştirin.

## Wallarm Bulut yapılandırma yönetimi için Wallarm Terraform sağlayıcısını kullanın

[Wallarm'ın resmi Terraform sağlayıcısı](../admin-en/managing/terraform-provider.md), modern Altyapı Kodu (IaC) yaklaşımını kullanarak Wallarm Bulut yapılandırmanızı (kullanıcılar, uygulamalar, kurallar, entegrasyonlar, vb.) yönetmenize olanak sağlar.

## Yeni yayımlanan Wallarm düğüm sürümlerini hızlı bir şekilde güncelleme planınız olsun

Wallarm, filtreleme düğüm yazılımını geliştirmek için sürekli çalışmaktadır ve yeni sürümler yaklaşık olarak her çeyrek yayımlanmaktadır. Yükseltmeleri gerçekleştirmek için önerilen yaklaşım, ilişkili riskler ve ilgili yükseltme prosedürleri hakkında bilgi almak için [bu belgeyi](../updating-migrating/general-recommendations.md) okuyun.

## Bilinen sınırlamaları öğrenin

* Aynı Wallarm hesabına bağlı olan tüm Wallarm düğümleri, trafik filtrasyonu için varsayılan ve özel kurallar setini alır. Yine de, uygun uygulama ID'leri veya benzersiz HTTP istek parametreleri gibi farklı uygulamalar için farklı kurallar uygulayabilirsiniz.
* Bir IP adresini otomatik olarak engellemek için yapılandırılmış bir tetikleyiciye sahipseniz ([tetikleyici örneği](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)), sistem, tüm uygulamalar için bir Wallarm hesabında IP'yi engelleyecektir.

## Aktif tehdit doğrulama için en iyi uygulamaları takip edin <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

Wallarm'ın [güvenlik açıklarını tespit etme](../about-wallarm/detecting-vulnerabilities.md) metodlarından biri **Aktif tehdit doğrulamasıdır**.

**Aktif tehdit doğrulaması**, uygulamalarınıza/API'larınıza saldırarak olası güvenlik sorunlarını keşfeden saldırganları penetre testçisine dönüştürmenizi sağlar. Bu modül, trafiğin gerçek saldırı verilerini kullanarak uygulama uç noktalarını sonda bulma olasılıklarını bulur. Bu yöntem varsayılan olarak devre dışı bırakılmıştır.

[**Aktif tehdit doğrulama** modülü yapılandırması için en iyi uygulamaları öğrenin →](../vulnerability-detection/threat-replay-testing/setup.md)