# Wallarm ile Saldırı Önleme için En İyi Uygulamalar

Bu makale, iki bekçiyi bir arada sunan benzersiz bir platform olan Wallarm’ı saldırı önleme amacıyla nasıl kullanacağınızı gösterecektir. Wallarm, diğer araçlar gibi web sitelerini korumakla (WAAP) kalmaz, aynı zamanda sisteminizin API’lerini de özel olarak güvenceye alarak çevrimiçi alanınızın tüm teknik bileşenlerini korur.

Çevrimiçi ortamda bu kadar çok tehdit varken güçlü bir kalkan şarttır. Wallarm, SQL injection, cross-site scripting, remote code execution ve Path Traversal gibi yaygın tehditleri kendi başına durdurabilir. Ancak, DoS saldırısı, hesap ele geçirme, API kötüye kullanımı gibi bazı kurnaz tehlikeler ve özel kullanım senaryoları için birkaç ayar gerekebilir. Bu adımlarda size rehberlik ederek en iyi korumayı almanızı sağlayacağız. İster deneyimli bir güvenlik uzmanı olun ister siber güvenlik yolculuğunuza yeni çıkıyor olun, bu makale güvenlik stratejinizi güçlendirmek için değerli içgörüler sunacaktır.

## Birden çok uygulamayı ve kiracıyı yönetin

Kuruluşunuz birden fazla uygulama veya ayrı kiracılar (tenant) kullanıyorsa, kolay yönetim için Wallarm platformunu faydalı bulacaksınız. Platform, [her bir uygulama için](../user-guides/settings/applications.md) olayları ve istatistikleri ayrı ayrı görmenizi ve uygulama başına özel trigger veya kural yapılandırmanızı sağlar. Gerekirse, ayrı erişim kontrolleriyle [her bir kiracı için](../installation/multi-tenant/overview.md) izole bir ortam oluşturabilirsiniz. 

## Güven bölgesi oluşturun

Yeni güvenlik önlemleri uygularken kritik iş uygulamalarının kesintisiz çalışması öncelikli olmalıdır. Güvenilen kaynakların Wallarm platformu tarafından gereksiz yere işlenmemesini sağlamak için bu kaynakları [IP allowlist](../user-guides/ip-lists/overview.md)’e atayabilirsiniz.

Allowlist’te yer alan kaynaklardan gelen trafik varsayılan olarak analiz edilmez veya günlüğe kaydedilmez. Bu, bypass edilen isteklere ilişkin verilerin incelemeye açık olmayacağı anlamına gelir. Bu nedenle dikkatli kullanılmalıdır.

Sınırsız trafiğe ihtiyaç duyan veya manuel gözetim yapmak istediğiniz URL’ler için [Wallarm node’unu monitoring mode’a](../admin-en/configure-wallarm-mode.md) almayı düşünün. Bu, bu URL’leri hedef alan kötü amaçlı etkinlikleri yakalar ve kaydeder. Sonrasında bu olayları Wallarm Console UI üzerinden inceleyebilir, anormallikleri izleyebilir ve gerekirse belirli IP’leri engellemek gibi manuel işlemler uygulayabilirsiniz.

## Trafik filtreleme modlarını ve işleme istisnalarını kontrol edin

[Filtration modes](../admin-en/configure-wallarm-mode.md) yönetimi ve uygulamalarınıza uyacak şekilde özelleştirilebilir işlem seçeneklerimizi kullanarak güvenlik önlemlerini kademeli olarak uygulayın. Örneğin, belirli node’lar, uygulamalar veya bir uygulamanın belirli bölümleri için monitoring mode’u etkinleştirin.

Gerektiğinde, belirli istek öğelerine uyarlanmış [tespit mekanizmalarını hariç tutun](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types).

## Denylist’i ayarlayın

Uygulamalarınızı güvensiz kaynaklardan korumak için bunları [denylist](../user-guides/ip-lists/overview.md)’e ekleyerek VPN’ler, Proxy sunucuları veya Tor ağları gibi şüpheli bölgelerden ya da kaynaklardan gelen trafiği engelleyebilirsiniz.

## Çoklu saldırı faillerini engelleyin

Wallarm blocking mode’dayken, kötü amaçlı payload içeren tüm istekleri otomatik olarak engeller ve yalnızca meşru isteklerin geçmesine izin verir. Kısa bir süre içinde tek bir IP adresinden birden fazla kötü niyetli etkinlik (genellikle çoklu saldırı failleri) tespit edilirse, [saldırganı tamamen engellemeyi](../admin-en/configuration-guides/protecting-with-thresholds.md) düşünün.

## Brute-force azaltımını etkinleştirin

Tek bir IP adresinden yetkilendirme sayfalarına veya parola sıfırlama formlarına yönelik erişim denemelerinin sayısını sınırlayarak brute-force saldırılarını azaltın. Bunu, [belirli bir trigger](../admin-en/configuration-guides/protecting-against-bruteforce.md) yapılandırarak yapabilirsiniz.

## Forced browsing azaltımını etkinleştirin

Forced browsing, bir saldırganın dizinler ve uygulama hakkında bilgi içeren dosyalar gibi gizli kaynakları bulmaya ve kullanmaya çalıştığı bir saldırıdır. Bu gizli dosyalar, saldırganların diğer saldırı türlerini gerçekleştirmekte kullanabilecekleri bilgiler sağlayabilir. Bu tür kötü niyetli etkinlikleri, belirli kaynaklara başarısız erişim denemeleri için sınırlar tanımlayarak [belirli bir trigger](../admin-en/configuration-guides/protecting-against-bruteforce.md) ile önleyebilirsiniz.

## Oran limitleri (rate limit) belirleyin

API’lerin ne sıklıkla kullanılabileceğine ilişkin uygun bir sınır olmadan, DoS ve brute-force saldırıları veya API aşırı kullanımı gibi sistemi aşırı yükleyen saldırılara maruz kalabilirler. [**Advanced rate limiting** kuralını](../user-guides/rules/rate-limiting.md) kullanarak belirli bir kapsama yapılabilecek maksimum bağlantı sayısını belirleyebilir ve gelen isteklerin eşit dağılımını sağlayabilirsiniz.

## BOLA korumasını etkinleştirin

Broken Object Level Authorization (BOLA) güvenlik açığı, bir saldırganın bir nesneye API isteğiyle tanımlayıcısı üzerinden erişmesine ve yetkilendirme mekanizmasını atlayarak verilerini okumasına veya değiştirmesine olanak tanır. BOLA saldırılarını önlemek için, savunmasız uç noktaları manuel olarak belirtip bunlara bağlantı sınırları koyabilir veya Wallarm’ın savunmasız uç noktaları otomatik olarak tanımlayıp korumasını etkinleştirebilirsiniz. [Daha fazlasını öğrenin](../admin-en/configuration-guides/protecting-against-bola.md)

## API Abuse Prevention kullanın

[API abuse profillerini ayarlayın](../api-abuse-prevention/setup.md) ve hesap ele geçirme, scraping, security crawlers ve API’lerinizi hedef alan diğer otomatik kötü amaçlı eylemler gibi API kötüye kullanımlarını gerçekleştiren botları durdurup engelleyin.

## Credential stuffing tespitini etkinleştirin

[Credential stuffing tespitini](../about-wallarm/credential-stuffing.md) etkinleştirerek, uygulamalarınıza erişmek için ele geçirilmiş veya zayıf kimlik bilgilerinin kullanılmasına yönelik girişimler hakkında gerçek zamanlı bilgiye ve uygulamalarınıza erişim sağlayan tüm ele geçirilmiş veya zayıf kimlik bilgilerinin indirilebilir bir listesine sahip olun.

Çalınmış veya zayıf parolalara sahip hesaplara ilişkin bilgi, hesap sahipleriyle iletişime geçmek, hesaplara erişimi geçici olarak askıya almak vb. gibi bu hesapların verilerini güvenceye alma önlemlerini başlatmanızı sağlar.

## Özel saldırı tespit kuralları oluşturun

Bazı senaryolarda, manuel olarak bir [saldırı tespit imzası eklemek veya sanal yama oluşturmak](../user-guides/rules/regex-rule.md) faydalı olabilir. Wallarm, saldırı tespiti için normal ifadelere dayanmasa da, kullanıcıların normal ifadelere dayalı ek imzalar eklemesine izin verir.

## Hassas verileri maskeleyin

Wallarm node’u saldırı bilgilerini Wallarm Cloud’a gönderir. Yetkilendirme (çerezler, belirteçler, parolalar), kişisel veriler ve ödeme bilgileri gibi bazı veriler, işlendiği sunucuda kalmalıdır. Bu özel istek noktalarının orijinal değerini Wallarm Cloud’a gönderilmeden önce kesmek için [bir veri maskeleme kuralı oluşturun](../user-guides/rules/sensitive-data-rule.md); böylece hassas veriler güvenilir ortamınızda kalır.

## Kullanıcı oturumlarını analiz edin

Yalnızca **Attacks** veya **Incidents** bölümünde sunulan saldırılarla ilgilenirken, saldırının parçası olduğu isteklerin mantıksal sıralaması gibi tam bağlamlarını göremezsiniz. 

Wallarm’ın [**API Sessions**](../api-sessions/overview.md) özelliği, uygulamalarınızın nasıl saldırıya uğradığına dair daha genel kalıpları ortaya çıkarmak ve alınan güvenlik önlemlerinin hangi iş mantığını etkileyeceğini anlamak için bu bağlamı sağlar.

Kullanıcı oturumlarını analiz ederek tehdit aktörünün davranış mantığını belirleyin, saldırı ve kötü amaçlı bot tespit doğruluğunu doğrulayın, risk altındaki shadow, zombie ve diğer uç noktaları takip edin, performans sorunlarını belirleyin ve daha fazlasını yapın.

## Sorunsuz SIEM/SOAR entegrasyonu ve kritik olaylar için anlık uyarılar

Wallarm, Sumo Logic, Splunk ve diğerleri gibi [çeşitli SIEM/SOAR sistemleri](../user-guides/settings/integrations/integrations-intro.md) ile sorunsuz entegrasyon sunarak tüm saldırı bilgilerini merkezi yönetim için SOC merkezinize zahmetsizce aktarmanızı sağlar.

Wallarm entegrasyonları, [triggers](../user-guides/triggers/triggers.md) işlevselliği ile birlikte belirli saldırılar, denylisted IPs ve genel devam eden saldırı hacmi hakkında raporlar ve gerçek zamanlı bildirimler ayarlamanız için size harika bir araç sağlar.

## Katmanlı savunma stratejisi

Uygulamalarınız için sağlam ve güvenilir güvenlik önlemleri oluştururken katmanlı bir savunma stratejisi benimsemek çok önemlidir. Bu, birlikte dayanıklı bir derinlemesine savunma duruşu oluşturan tamamlayıcı koruyucu önlemler paketini uygulamayı içerir. Wallarm güvenlik platformunun sunduğu önlemlerin yanı sıra aşağıdaki uygulamaları öneririz:

* Bulut hizmet sağlayıcınızdan L3 DDoS koruması kullanın. L3 DDoS koruması, ağ seviyesinde çalışır ve dağıtık hizmet engelleme saldırılarını azaltmaya yardımcı olur. Çoğu bulut hizmet sağlayıcısı hizmetlerinin bir parçası olarak L3 koruması sunar.
* Web sunucularınız veya API ağ geçitleriniz için güvenli yapılandırma önerilerini izleyin. Örneğin, [NGINX](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html) veya [Kong](https://konghq.com/learning-center/api-gateway/secure-api-gateway) kullanıyorsanız güvenli yapılandırma yönergelerine uyduğunuzdan emin olun.

Bu ek uygulamaları [Wallarm L7 DDoS koruma önlemleri](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm) ile birlikte dahil ederek uygulamalarınızın genel güvenliğini önemli ölçüde artırabilirsiniz.

## OWASP API en önemli tehditlerinin kapsamını kontrol edin ve geliştirin

OWASP API Security Top 10, API’lerde güvenlik riskini değerlendirmek için altın standarttır. Wallarm, API’nizin bu API tehditlerine karşı güvenlik duruşunu ölçmenize yardımcı olmak için, 2023 sürümünün en önemli tehditlerinin azaltılmasına yönelik net görünürlük ve metrikler sağlayan bir [dashboard](../user-guides/dashboards/owasp-api-top-ten.md) sunar.

Bu dashboard’lar, genel güvenlik durumunu değerlendirmenize ve uygun güvenlik kontrollerini ayarlayarak keşfedilen güvenlik sorunlarını proaktif olarak ele almanıza yardımcı olur.

## JA3 fingerprinting’i etkinleştirin

Aşağıdaki işlevleri daha hassas hale getirmek için:

* [API Sessions](../api-sessions/overview.md)
* API Sessions mekanizmasını kullanan [API Abuse Prevention](../api-abuse-prevention/overview.md)

Kimliği doğrulanmamış trafiğin daha iyi tanımlanması için [JA3 fingerprinting](../admin-en/enabling-ja3.md#overview) etkinleştirmeniz önerilir.