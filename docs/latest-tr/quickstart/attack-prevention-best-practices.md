# Wallarm ile Saldırı Önleme için En İyi Uygulamalar

Bu makale, size iki gardiyanın bir arada olduğu benzersiz bir platform olan Wallarm'ın nasıl kullanılacağını gösterecektir. Bu platform, yalnızca diğer araçlar gibi (WAAP olarak bilinen) web sitelerini korumakla kalmaz, aynı zamanda sistemlerinizin API'lerini özel olarak koruyarak online alanınızın tüm teknik bölümlerinin güvende olmasını sağlar.

Çevrimiçi olarak karşılaştığımız pek çok tehdit nedeniyle, güçlü bir kalkana sahip olmak son derece önemlidir. Wallarm, SQL enjeksiyonu, siteler arası betik çalıştırma, uzaktan kod çalıştırma ve Yol Gezinmesi gibi yaygın tehditleri tek başına durdurabilir. Ancak, bazı zorlu tehlikeler ve özelleştirilmiş kullanım durumları, örneğin DoS saldırısına karşı koruma, hesap ele geçirme, API istismarı gibi durumlar için birkaç düzenlemeye ihtiyaç duyulabilir. Bu adımları sizinle paylaşacağız, mümkün olan en iyi korumayı elde etmenizi sağlayacağız. İster deneyimli bir güvenlik uzmanı olun, ister siber güvenlik yolculuğunuza yeni başlamış olun, bu makale güvenlik stratejinizi güçlendirmek için değerli bilgiler sunacaktır.

## Çoklu uygulama ve kiracıları yönetin

Organizasyonunuz birden fazla uygulama veya ayrı kiracılar kullanıyorsa, Wallarm platformunu kolay yönetim için faydalı bulmanız muhtemeldir. Size, olayları ve istatistikleri [her bir uygulama](../user-guides/settings/applications.md) için ayrı ayrı görüntüleme ve uygulama başına spesifik tetikleyiciler veya kurallar yapılandırma olanağı sağlar. İhtiyacınız olursa, ayrı erişim kontrolleri ile [her bir kiracı] için izole bir ortam(../installation/multi-tenant/overview.md) oluşturabilirsiniz. 

## Güvenlik bölgesi oluşturun

Yeni güvenlik önlemleri uygulanırken, hayati iş uygulamalarının kesintisiz çalışmasını sağlamak öncelikli hedef olmalıdır. Güvendiğiniz kaynakların gereksiz yere Wallarm platformu tarafından işlenmediğinden emin olmak için, onları [IP izin listesine](../user-guides/ip-lists/allowlist.md) almak için bir seçeneğiniz vardır.

İzin listesinde bulunan kaynakların trafiği, varsayılan olarak analiz edilmez veya kayıt altına alınmaz. Bu, atlanan isteklerden gelen verilerin inceleme için mevcut olmayacağı anlamına gelir. Bu nedenle kullanımı dikkatli bir şekilde uygulanmalıdır.

Sınırsız trafiğe ihtiyaç duyan URL'ler veya manuel denetim yapmak istediğiniz URL'ler için, Wallarm düğümünü [izleme moduna](../admin-en/configure-wallarm-mode.md) ayarlamayı düşünün. Bu, bu URL'lere yönelik her türlü kötü niyetli etkinliği yakalar ve günlüğe kaydeder. Bu olayları daha sonra Wallarm Console UI üzerinden inceleyebilir, anormallikleri izleyebilir ve gerekirse belirli IP'leri engellemek gibi manuel eylemler alabilirsiniz.

## Trafik süzme modlarını ve işlem istisnalarını kontrol edin

Güvenlik önlemlerini, uygulamalarınıza uygun olarak süzme modlarını yönetmek ve işlem sürecini özelleştirmek için esnek seçeneklerimizi kullanarak aşamalı olarak uygulayın. Örneğin, [spesifik düğümler, uygulamalar](../admin-en/configure-wallarm-mode.md#specifying-the-filtration-mode-in-the-wallarm_mode-directive) veya [bir uygulamanın belirli bölümleri](../user-guides/rules/wallarm-mode-rule.md#example-disabling-request-blocking-during-user-registration) için izleme modunu etkinleştirin.

Gerekirse, [belirli istek öğeleri için tailor-made dedektörler hariç tutun](../user-guides/rules/ignore-attack-types.md).

## Red listesi oluşturun

Uygulamalarınızı, trafiği VPN'ler, Proxy sunucular veya Tor ağları gibi şüpheli bölgeler veya kaynaklardan engelleyerek, onları bir [red listesine](../user-guides/ip-lists/denylist.md) ekleyerek koruma altına alabilirsiniz.

## Çoklu saldırı failini engelleyin

Wallarm engelleme modundayken, kötü niyetli yükler içeren tüm istekleri otomatik olarak engeller ve yalnızca meşru isteklerin geçmesine izin verir. Bir IP adresinden kısa sürede birden fazla kötü niyetli etkinlik tespit edilirse (genellikle çoklu saldırı faili olarak adlandırılır), onları red listesine otomatik olarak koymak için [belirli bir tetikleyici kullanarak saldırganı tamamen engellemeyi](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) düşünün.

## Kaba kuvvet azaltmayı etkinleştirin

Tek bir IP adresinden gelen yetkilendirme sayfalarına veya şifre sıfırlama formlarına olan erişim girişimlerinin sayısını sınırlayarak kaba kuvvet saldırılarını hafifletebilirsiniz. Bunu, [spesifik bir tetikleyici](../admin-en/configuration-guides/protecting-against-bruteforce.md) yapılandırarak yapabilirsiniz.

## Zorla tarama hafifletmeyi etkinleştirin

Zorlanan tarama, bir saldırganın gizli kaynakları bulmaya ve kullanmaya çalıştığı bir saldırıdır, örneğin uygulama hakkında bilgi içeren dizinler ve dosyalar. Bu gizli dosyalar, saldırganın diğer türden saldırıları uygulamak için kullanabileceği bilgiler verebilir. [Spesifik bir tetikleyici](../admin-en/configuration-guides/protecting-against-bruteforce.md) ile belirli kaynaklara ulaşma girişimlerinde belirli limitler belirleyerek bu tür kötü niyetli etkinlikleri önleyebilirsiniz.

## Oran limitleri belirleyin

API'lerin ne sıklıkta kullanılabileceği konusunda uygun bir limit olmazsa, sistemleri aşırı yükleyen saldırılara maruz kalabilirler, örneğin DoS ve kaba kuvvet saldırıları veya API aşırı kullanma durumları. [**Oran sınırlaması belirle** kuralını](../user-guides/rules/rate-limiting.md) kullanarak, belirli bir kapsama yapılabilecek maksimum bağlantı sayısını belirleyebilir ve aynı zamanda gelen isteklerin eşit olarak dağıtılmasını sağlayabilirsiniz.

## BOLA korumasını etkinleştirin

Kırık Nesne Düzeyi Yetkilendirme (BOLA) açıklığı, bir saldırganın API bir istek üzerinden bir nesneye erişip yetkilendirme mekanizmasını atlayarak verilerini okumasına veya değiştirmesine olanak sağlar. BOLA saldırılarını önlemek için, ya kötüne kullanılabilir uç noktaları el ile belirtip onlara bağlantı limitleri belirleyebilir, ya da Wallarm'ı otomatik olarak kötüne kullanılabilir uç noktaları tanımlayıp korumayı sağlamak için aktif hale getirebilirsiniz. [Daha fazlasını öğrenin](../admin-en/configuration-guides/protecting-against-bola.md)

## API İstismarınu Önlemeyi Uygulayın

[API istismar profilleri oluşturun](../api-abuse-prevention/setup.md) API'lerinize yönelik hesap ele geçirme, kazıma, güvenlik crawler'ları ve diğer otomatik kötü niyetli hareketleri durdurup, engelleyin.

## Özel saldırı tespit kuralları oluşturun

Belirli senaryolarda, manuel olarak bir [saldırı tespit imzası eklemek veya bir sanal yama oluşturmak](../user-guides/rules/regex-rule.md) yararlı olabilir. Wallarm, saldırı tespiti için düzenli ifadelere dayanmamakla birlikte, kullanıcıların düzenli ifadelere dayalı ek imzaları dahil etmelerine izin verir.

## Hassas verileri maskeleyin

Wallarm düğümü, saldırı bilgilerini Wallarm Cloud'a gönderir. Yetkilendirme (çerezler, belirteçler, şifreler), kişisel veriler ve ödeme kimlik bilgileri gibi belirli veriler, işlendikleri sunucu içinde kalmalıdır. [Veri maskeleme kuralı oluşturun](../user-guides/rules/sensitive-data-rule.md) spesifik istek noktalarının orijinal değerlerini Wallarm Cloud'a göndermeden önce kesmesini sağlar, bu da hassas verilerin güvendiğiniz ortamınızda kalmasını garantiler.

## Sorunsuz SIEM/SOAR entegrasyonu & Kritik olaylara anında uyarılar

Wallarm, Sumo Logic, Splunk ve diğerleri gibi [çeşitli SIEM/SOAR sistemleriyle](../user-guides/settings/integrations/integrations-intro.md) sorunsuz entegrasyon sunar ve tüm saldırı bilgilerini SOC merkezinize merkezi yönetim için hızlıca aktarmanızı sağlar.

Wallarm entegrasyonları, [tetikleyiciler](../user-guides/triggers/triggers.md) işlevselliği ile birlikte, belirli saldırıları, red listesine eklenmiş IP'leri ve genel devam eden saldırı hacmini belirtmek üzere raporlar ve gerçek zamanlı bildirimler kurma konusunda size harika bir araç sunar.

## Katmanlı savunma stratejisi

Uygulamalarınız için sağlam ve güvenilir güvenlik önlemleri oluştururken, katmanlı bir savunma stratejisi benimsemek hayati öneme sahiptir. Bu, birlikte dayanıklı bir derinlik savunma güvenlik duruşunu oluşturan bir dizi tamamlayıcı koruyucu önlemi uygulamayı içerir. Wallarm güvenlik platformu tarafından sunulan tedbirlerin yanı sıra, aşağıdaki uygulamaları öneririz:

* Bulut servis sağlayıcınızdan L3 DDoS korumasını kullanın. L3 DDoS koruması ağ seviyesinde çalışır ve dağıtılmış servis reddi saldırılarının hafifletilmesine yardımcı olur. Çoğu bulut hizmet sağlayıcısı, servislerinin bir parçası olarak L3 korumasını sunar.
* Web sunucularınız veya API ağ geçitleriniz için güvenli yapılandırma önerilerine uyun. Örneğin, [NGINX](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html) veya [Kong](https://konghq.com/learning-center/api-gateway/secure-api-gateway) kullanıyorsanız, güvenli yapılandırma yönergelerine riayet ettiğinizden emin olun.

Bu ek uygulamalar ve [Wallarm L7 DDoS koruma önlemleri](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm) ile birlikte, uygulamalarınızın genel güvenliğini önemli ölçüde artırabilirsiniz.

## OWASP API en üst tehditlerin kapsamını kontrol edin ve artırın

OWASP API Güvenlik Top 10, API'lerdeki güvenlik risklerinin değerlendirilmesi için altın standarttır. API'nizin güvenlik duruşunu bu API tehditlerine karşı ölçmenize yardımcı olmak için, Wallarm, hem 2019 hem de 2023 versiyonlarının en üst tehditlerinin hafifletilmesine yönelik belirgin bir görünürlük ve metrikler sağlayan [gösterge tabloları](../user-guides/dashboards/owasp-api-top-ten.md) sunar.

Bu gösterge tabloları, genel güvenlik durumunu değerlendirmenizi ve uygun güvenlik kontrolleri kurarak bulunan güvenlik sorunlarına proaktif bir şekilde yanıt vermenizi sağlar.