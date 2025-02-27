# Wallarm çözüm dağıtımı ve bakım en iyi uygulamaları

Bu makale, Wallarm çözümünün dağıtımı ve bakımı için en iyi uygulamaları formüle etmektedir.

## NGINX'in gücünü anlayın

Çoğu Wallarm filtreleme düğümü dağıtım seçeneği, Wallarm modülünün temeli olan ters proxy sunucusu olarak NGINX'i kullanır; bu, geniş bir işlevsellik, modül ve performans/güvenlik rehberleri sunar. Aşağıda, yararlı internet makalelerinin bir koleksiyonu bulunmaktadır:

* [Awesome NGINX](https://github.com/agile6v/awesome-nginx)
* [NGINX: Basics and Best Practices slide show](https://www.slideshare.net/Nginx/nginx-basics-and-best-practices-103340015)
* [How to optimize NGINX configuration](https://www.digitalocean.com/community/tutorials/how-to-optimize-nginx-configuration)
* [3 quick steps to optimize the performance of your NGINX server](https://www.techrepublic.com/article/3-quick-steps-to-optimize-the-performance-of-your-nginx-server/)
* [How to Build a Tough NGINX Server in 15 Steps](https://www.upguard.com/blog/how-to-build-a-tough-nginx-server-in-15-steps)
* [How to Tune and Optimize Performance of NGINX Web Server](https://hostadvice.com/how-to/how-to-tune-and-optimize-performance-of-nginx-web-server/)
* [Powerful ways to supercharge your NGINX server and improve its performance](https://www.freecodecamp.org/news/powerful-ways-to-supercharge-your-nginx-server-and-improve-its-performance-a8afdbfde64d/)
* [TLS Deployment Best Practices](https://www.linode.com/docs/guides/tls-deployment-best-practices-for-nginx/)
* [NGINX Web Server Security and Hardening Guide](https://geekflare.com/nginx-webserver-security-hardening-guide/)
* [NGINX Tuning For Best Performance](https://github.com/denji/nginx-tuning)
* [Top 25 NGINX Web Server Best Security Practices](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html)

## Önerilen işe alım adımlarını izleyin

1. Mevcut [Wallarm node dağıtım seçenekleri](../installation/supported-deployment-options.md) hakkında bilgi edinin.
2. Gerekirse, ortamlarınız için [Wallarm node yapılandırmasının ayrı ayrı yönetilmesi](../installation/multi-tenant/overview.md#issues-addressed-by-multitenancy) seçeneklerini öğrenin.
3. Üretim dışı ortamlarınızda, Wallarm filtreleme düğümlerini [operation mode](../admin-en/configure-wallarm-mode.md) `monitoring` olarak ayarlanmış şekilde dağıtın.
4. Wallarm çözümünü nasıl işletip ölçeklendireceğinizi izleyin, izleyin ve yeni ağ bileşeninin stabilitesini doğrulayın.
5. Üretim ortamınızda, Wallarm filtreleme düğümlerini [operation mode](../admin-en/configure-wallarm-mode.md) `monitoring` olarak ayarlanmış şekilde dağıtın.
6. Yeni Wallarm bileşeni için uygun yapılandırma yönetimi ve [izleme süreçlerini](#enable-proper-monitoring-of-the-filtering-nodes) uygulayın.
7. Wallarm cloud tabanlı arka uç sisteminin uygulamanızı öğrenebilmesi için, filtreleme düğümleri üzerinden tüm ortamlarınızda (test ve üretim dahil) trafik akışını 7‑14 gün boyunca sürdürün.
8. Tüm üretim dışı ortamlarınızda Wallarm `block` [modunu](../admin-en/configure-wallarm-mode.md) etkinleştirin ve korunan uygulamanın beklendiği gibi çalıştığını doğrulamak için otomatik veya manuel testler uygulayın.
9. Üretim ortamında Wallarm `block` [modunu](../admin-en/configure-wallarm-mode.md) etkinleştirin ve uygulamanın beklendiği gibi çalıştığını doğrulamak için mevcut yöntemleri kullanın.

## Filtreleme düğümlerini sadece üretim ortamında değil, aynı zamanda test ve hazırlık aşamasında da dağıtın

Çoğu Wallarm hizmet sözleşmesi, müşterinin dağıttığı Wallarm düğümlerinin sayısını sınırlamadığından, geliştirme, test, hazırlık vb. dahil olmak üzere tüm ortamlarınızda filtreleme düğümlerini dağıtmakta sakınca yoktur.

Filtreleme düğümlerini yazılım geliştirme ve/veya hizmet işletim faaliyetlerinizin tüm aşamalarında dağıtarak kullanmanız, tüm veri akışını doğru şekilde test etme şansınızı artırır ve kritik üretim ortamınızda beklenmeyen durumların oluşma riskini azaltır.

## libdetection kütüphanesini etkinleştirin

[**libdetection** kütüphanesi](protecting-against-attacks.md#library-libdetection) ile istekleri analiz etmek, filtreleme düğümünün SQLi saldırılarını tespit etme yeteneğini önemli ölçüde artırır. Tüm Wallarm müşterilerinin, filtreleme düğümü yazılımının en son sürümüne [yükseltme](/updating-migrating/general-recommendations/) yaparak **libdetection** kütüphanesini etkin tutması şiddetle tavsiye edilir.

* Filtreleme düğümü sürüm 4.4 ve üzerinde **libdetection** varsayılan olarak etkinleştirilmiştir.
* Daha düşük sürümlerde, dağıtım seçeneğiniz için [yöntemi](protecting-against-attacks.md#managing-libdetection-mode) kullanarak etkinleştirilmesi önerilmektedir.

## Son kullanıcı IP adreslerinin doğru raporlanmasını yapılandırın

Yük dengeleyici veya CDN arkasında bulunan Wallarm filtreleme düğümleri için, lütfen filtreleme düğümlerinizin son kullanıcı IP adreslerini doğru şekilde raporlayacak biçimde yapılandırıldığından emin olun (aksi takdirde [IP listesi işlevselliği](../user-guides/ip-lists/overview.md), [Threat Replay Testing](detecting-vulnerabilities.md#threat-replay-testing) ve diğer bazı özellikler çalışmayacaktır):

* [NGINX tabanlı Wallarm düğümleri için talimatlar](../admin-en/using-proxy-or-balancer-en.md) (AWS/GCP imajları ve Docker düğüm konteyneri dahil)
* [Wallarm Kubernetes Ingress denetleyicisi olarak dağıtılan filtreleme düğümleri için talimatlar](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## Filtreleme düğümlerinin doğru izlenmesini sağlayın

Wallarm filtreleme düğümlerinin uygun şekilde izlenmesi şiddetle tavsiye edilir.

Filtreleme düğümü izleme kurulum yöntemi, dağıtım seçeneğine bağlıdır:

* [Wallarm Kubernetes Ingress denetleyicisi olarak dağıtılan filtreleme düğümleri için talimatlar](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [NGINX tabanlı Docker imajı için talimatlar](../admin-en/installation-docker-en.md#monitoring-configuration)

## Uygun yedeklilik ve otomatik devreye geçiş fonksiyonelliğini uygulayın

Üretim ortamınızdaki diğer kritik bileşenlerde olduğu gibi, Wallarm düğümleri de uygun yedeklilik ve otomatik devreye geçiş özellikleri ile tasarlanmalı, dağıtılmalı ve işletilmelidir. Kritik son kullanıcı isteklerini ele alan **en az iki aktif Wallarm filtreleme düğümüne** sahip olmanız gerekir. Aşağıdaki makaleler konu hakkında ilgili bilgileri sağlamaktadır:

* [NGINX tabanlı Wallarm düğümleri için talimatlar](../admin-en/configure-backup-en.md) (AWS/GCP imajları, Docker düğüm konteyneri ve Kubernetes sidecar'ları dahil)
* [Wallarm Kubernetes Ingress denetleyicisi olarak dağıtılan filtreleme düğümleri için talimatlar](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)

## IP adresi allowlist, denylist ve graylist kullanımını öğrenin

Bireysel kötü niyetli istekleri engellemenin yanı sıra, Wallarm filtreleme düğümleri bireysel son kullanıcı IP adreslerini de engelleyebilir. IP'lerin engellenmesi için kurallar allowlist, denylist ve graylist kullanılarak yapılandırılır.

[IP listelerinin kullanımı hakkında daha fazla bilgi →](../user-guides/ip-lists/overview.md)

## Wallarm yapılandırma değişikliklerinin kademeli dağıtımını nasıl gerçekleştireceğinizi öğrenin

* Wallarm filtreleme düğümlerinde tüm form faktörleri için alt seviye yapılandırma değişikliklerinde standart DevOps değişiklik yönetimi ve kademeli dağıtım politikalarını kullanın.
* Trafik filtreleme kuralları için, farklı uygulama [IDs](../admin-en/configure-parameters-en.md#wallarm_application) veya `Host` istek başlıkları kullanın.
* [Regex tabanlı saldırı göstergesi oluşturma](../user-guides/rules/regex-rule.md#creating-and-applying-rule) kuralı, belirli bir uygulama ID'si ile ilişkilendirilebilme yeteneğinin yanı sıra, Wallarm düğümü bloklama modundayken bile (Deneysel onay kutusu) izleme modunda etkinleştirilebilir.
* [Filtreleme modunu ayarlama](../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console) kuralı, Wallarm Console üzerinden Wallarm düğümü işletim modunu (`monitoring`, `safe_blocking` veya `block`) kontrol etmenize olanak tanır; bu, NGINX yapılandırmasındaki [`wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode) ayarına benzer (ilgili [`wallarm_mode_allow_override`](../admin-en/configure-parameters-en.md#wallarm_mode_allow_override) ayarına bağlı olarak).

## Sistemdeki bildirimleri almak için mevcut entegrasyonları yapılandırın

Wallarm, Slack, Telegram, PagerDuty, Opsgenie ve diğer sistemlerle entegre [yerel entegrasyonlar](../user-guides/settings/integrations/integrations-intro.md) sunarak, platform tarafından üretilen çeşitli güvenlik bildirimlerini hızlıca size gönderir. Örneğin:

* Yeni keşfedilen güvenlik açıkları
* Şirket ağ çevresindeki değişiklikler
* Wallarm Console üzerinden şirkete yeni eklenen kullanıcılar vb.

Sistem üzerinde meydana gelen çeşitli olaylar hakkında özel uyarılar ayarlamak için [Triggers](../user-guides/triggers/triggers.md) işlevselliğini de kullanabilirsiniz.

## Triggers işlevselliğinin gücünü öğrenin

Spesifik ortamınıza bağlı olarak, aşağıdaki [triggers](../user-guides/triggers/triggers.md) yapılandırmalarını öneririz:

* Wallarm düğümleri tarafından tespit edilen kötü niyetli istek seviyesindeki artışı izleyin. Bu tetikleyici aşağıdaki potansiyel sorunlardan birine işaret edebilir:

    * Saldırı altındasınız ve Wallarm düğümü kötü niyetli istekleri başarıyla engelliyor. Tespit edilen saldırıları gözden geçirip, saldırgan IP adreslerini elle denylist'e (engelleme) eklemeyi düşünebilirsiniz.
    * Wallarm düğümleri tarafından tespit edilen yanlış pozitif saldırıların artmış bir seviyesi var. Bunu [Wallarm teknik destek ekibine](mailto:support@wallarm.com) bildirmeniz veya isteği elle [yanlış pozitif olarak işaretlemeniz](../user-guides/events/check-attack.md#false-positives) düşünülebilir.
    * Eğer [denylisting tetikleyicisi](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) aktifse fakat yine de saldırılarda artış uyarıları alıyorsanız, tetikleyicinin beklendiği gibi çalışmadığının bir işareti olabilir.

    [Yapılandırılmış tetikleyici örneğine bakın →](../user-guides/triggers/trigger-examples.md#slack-notification-if-2-or-more-sqli-hits-are-detected-in-one-minute)
* Wallarm Console’da, şirkete yeni bir kullanıcı eklendiğini bildiren bir tetikleyici ayarlayın.

    [Yapılandırılmış tetikleyici örneğine bakın →](../user-guides/triggers/trigger-examples.md#slack-and-email-notification-if-new-user-is-added-to-the-account)
* İstekleri brute-force ya da zorunlu tarama saldırısı olarak işaretleyin ve isteğin kaynaklandığı IP adreslerini engelleyin.

    [Brute force koruması yapılandırma talimatları →](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* Yeni IP adreslerinin engellendiğini bildiren bir tetikleyici ayarlayın.

    [Yapılandırılmış tetikleyici örneğine bakın →](../user-guides/triggers/trigger-examples.md#notification-to-webhook-url-if-ip-address-is-added-to-the-denylist)
* [Safe blocking](../admin-en/configure-wallarm-mode.md) modunda kullanılan [graylist](../user-guides/ip-lists/overview.md)’e IP adreslerini otomatik olarak ekleyin.

Trafik işleme ve saldırı yüklemesini optimize etmek için, Wallarm bazı tetikleyicileri [önceden yapılandırır](../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers).

## Wallarm Console hesabınız için SAML SSO'yu etkinleştirin

G Suite, Okta veya OneLogin gibi bir SAML SSO sağlayıcısını kullanarak Wallarm Console hesabınızdaki kullanıcıların kimlik doğrulamasını merkezileştirebilirsiniz.

Hesabınız için SAML SSO'yu etkinleştirmek adına Wallarm hesap yöneticiniz veya teknik destek ekibiyle iletişime geçin ve ardından SAML SSO yapılandırmasını gerçekleştirmek için [bu talimatları](../admin-en/configuration-guides/sso/intro.md) izleyin.

## Wallarm Cloud yapılandırma yönetimi için Wallarm Terraform sağlayıcısını kullanın

[Wallarm'ın resmi Terraform sağlayıcısı](../admin-en/managing/terraform-provider.md) ile kullanıcılar, uygulamalar, kurallar, entegrasyonlar vb. gibi Wallarm Cloud yapılandırmanızı modern Altyapı Kod (IaC) yaklaşımını kullanarak yönetebilir.

## Yeni yayımlanan Wallarm düğüm sürümlerine hızlıca güncelleme planınızı oluşturun

Wallarm, filtreleme düğümü yazılımını geliştirmek için sürekli olarak çalışmakta olup, yeni sürümler yaklaşık çeyrek dönemlerde yayınlanmaktadır. Yükseltme için önerilen yaklaşım, ilgili riskler ve yükseltme prosedürleri hakkında bilgi almak için lütfen [bu belgeyi](../updating-migrating/general-recommendations.md) okuyun.

## Bilinen sakıncaları öğrenin

* Aynı Wallarm hesabına bağlı tüm Wallarm düğümleri, trafik filtreleme için aynı varsayılan ve özel kuralları alır. Yine de, farklı uygulama ID'leri veya HTTP istek başlıkları, sorgu parametreleri gibi benzersiz unsurlarla farklı kurallar uygulanabilir.
* Eğer otomatik IP engelleme tetikleyicisi ([tetikleyici örneğine bakın](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)) yapılandırılmışsa, sistem Wallarm hesabındaki tüm uygulamalar için ilgili IP’yi engelleyecektir.

## Threat Replay Testing için en iyi uygulamaları takip edin <a href="../subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

Wallarm'un [güvenlik açıklarını tespit etme](../about-wallarm/detecting-vulnerabilities.md) yöntemlerinden biri **Threat Replay Testing**'dir.

**Threat Replay Testing**, saldırganları sızma testçilerine dönüştürerek, uygulamalarınız/APİ'lerinizdeki olası güvenlik açıklarını, saldırı trafiği üzerinden tespit etmenizi sağlar. Bu modül, gerçek saldırı verilerini kullanarak uygulama uç noktalarını test eder ve olası güvenlik açıklarını bulur. Varsayılan olarak bu yöntem devre dışı bırakılmıştır.

[**Threat Replay Testing** modülü yapılandırması için en iyi uygulamaları öğrenin →](../vulnerability-detection/threat-replay-testing/setup.md)