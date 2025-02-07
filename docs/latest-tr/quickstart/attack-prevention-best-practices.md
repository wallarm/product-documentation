# Wallarm ile Saldırı Önleme için En İyi Uygulamalar

Bu makale, saldırı önleme için iki korumacının bir arada görev yapması gibi benzersiz bir platform olan Wallarm'ı nasıl kullanacağınızı gösterecek. Wallarm, diğer araçların (WAAP olarak bilinir) web sitelerini korumasının ötesinde, sisteminizin API'lerini de özel olarak korur, böylece çevrimiçi alanınızdaki tüm teknik bileşenlerin güvende olmasını sağlar.

Çevrimiçi ortamda karşılaştığımız pek çok tehdit nedeniyle, güçlü bir savunma kalkanına sahip olmak hayati önem taşır. Wallarm, SQL enjeksiyonu, cross-site scripting, uzaktan kod yürütme ve Path Traversal gibi yaygın tehditleri tek başına durdurabilir. Ancak, DoS saldırısı, hesap ele geçirme veya API istismarı gibi bazı sinsi tehlikeler ve özel durumlar için birkaç ayarlama gerekebilir. Bu adımlarda size rehberlik edeceğiz ve en iyi korumayı sağlamanız için destek olacağız. İster deneyimli bir güvenlik uzmanı olun, ister siber güvenlik yolculuğunuza yeni başlamış olun, bu makale, güvenlik stratejinizi güçlendirmek için değerli bilgiler sunacaktır.

## Birden Fazla Uygulama ve Tenant Yönetimi

Kuruluşunuz birden fazla uygulama veya ayrı tenant (kullanıcı grubu) kullanıyorsa, Wallarm platformunu kolay yönetim için oldukça faydalı bulacaksınız. Her uygulama için [uygulamaya özel](../user-guides/settings/applications.md) olayları ve istatistikleri ayrı ayrı görüntülemenize ve her uygulama için belirli tetikleyiciler veya kurallar yapılandırmanıza olanak tanır. İhtiyaç duyarsanız, ayrı erişim kontrolleri ile [her tenant için izole bir ortam](../installation/multi-tenant/overview.md) oluşturabilirsiniz.

## Güven Bölgesi Oluşturun

Yeni güvenlik önlemleri getirirken, kritik iş uygulamalarının kesintisiz çalışması en yüksek öncelik olmalıdır. Güvenilir kaynakların Wallarm platformu tarafından gereksiz yere işlenmemesini sağlamak için, onları [IP allowlist](../user-guides/ip-lists/overview.md) listesine dahil etme seçeneğine sahipsiniz.

Allowlist'e dahil edilen kaynaklardan gelen trafik varsayılan olarak analiz edilmez veya kaydedilmez. Bu, atlanan isteklerden gelen verilerin incelenmeye uygun olmayacağı anlamına gelir. Bu nedenle, kullanımı dikkatli bir şekilde uygulanmalıdır.

Kısıtlamasız trafiğin gerekli olduğu veya manuel denetim gerçekleştirmek istediğiniz URL'ler için, [Wallarm node'unu izleme moduna ayarlamayı](../admin-en/configure-wallarm-mode.md) düşünebilirsiniz. Bu, bu URL'lere yönelik kötü niyetli etkinlikleri yakalar ve kaydeder. Daha sonra, Wallarm Console UI aracılığıyla bu olayları gözden geçirebilir, anormallikleri izleyebilir ve gerekirse belirli IP'leri engelleme gibi manuel işlemler gerçekleştirebilirsiniz.

## Trafik Filtreleme Modları ve İşleme İstisnalarını Kontrol Edin

[Filtreleme modlarını](../admin-en/configure-wallarm-mode.md) yönetmek ve uygulamalarınıza uygun işleme özelleştirmeleri yapmak için esnek seçeneklerimizi kullanarak güvenlik önlemlerini kademeli olarak uygulayın. Örneğin, belirli node'lar, uygulamalar veya bir uygulamanın belirli bölümleri için izleme modu etkinleştirilebilir.

Gerekirse, belirli istek öğelerine yönelik [istisna dedektörleri](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types) uygulanabilir.

## Denylist Oluşturun

VPN'ler, proxy sunucuları veya Tor ağları gibi şüpheli bölgelerden veya kaynaklardan gelen trafiği engelleyerek, uygulamalarınızı güvenilmeyen kaynaklardan korumak için bir [denylist](../user-guides/ip-lists/overview.md) oluşturabilirsiniz.

## Çoklu Saldırı Yapan Saldırganları Engelleyin

Wallarm, engelleme modunda olduğunda kötü amaçlı yük içeren tüm istekleri otomatik olarak engeller ve yalnızca meşru isteklerin geçişine izin verir. Kısa sürede bir IP adresinden birden fazla kötü niyetli etkinlik tespit edilirse (çoğunlukla çoklu saldırı yapan saldırganlar olarak adlandırılır), [saldırganın tamamen engellenmesini](../admin-en/configuration-guides/protecting-with-thresholds.md) düşünebilirsiniz.

## Brute-Force Saldırılara Karşı Koruma Etkinleştirin

Tek bir IP adresinden yetkilendirme sayfalarına veya şifre sıfırlama formlarına yapılan erişim denemelerinin sayısını sınırlayarak brute-force saldırılarını azaltın. Bunu, [belirli bir tetikleyici](../admin-en/configuration-guides/protecting-against-bruteforce.md) yapılandırarak gerçekleştirebilirsiniz.

## Zorunlu Tarama (Forced Browsing) Saldırılarına Karşı Koruma Etkinleştirin

Zorunlu tarama, saldırganın uygulama hakkında bilgi içeren dizinler ve dosyalar gibi gizli kaynakları bulup kullanmaya çalıştığı bir saldırı türüdür. Bu gizli dosyalar, saldırganlara diğer saldırı türlerini gerçekleştirmede kullanabilecekleri bilgiler sağlayabilir. Bu tür kötü niyetli etkinlikleri, [belirli bir tetikleyici](../admin-en/configuration-guides/protecting-against-bruteforce.md) kullanarak belirli kaynaklara başarısız erişim denemeleri için limitler belirleyerek önleyebilirsiniz.

## Oran Sınırlamaları Belirleyin

API'ların ne kadar sıklıkla kullanılabileceğine dair uygun bir sınır belirlenmediğinde, DoS ve brute-force saldırıları veya API'nin aşırı kullanımı gibi sistemin aşırı yüklenmesine neden olabilecek saldırılarla karşı karşıya kalabilirsiniz. [**Set rate limit** kuralını](../user-guides/rules/rate-limiting.md) kullanarak, belirli bir kapsamda yapılabilecek maksimum bağlantı sayısını belirleyip, gelen isteklerin dengeli olarak dağıtılmasını sağlayabilirsiniz.

## BOLA Korumasını Aktifleştirin

Broken Object Level Authorization (BOLA) açığı, saldırganın bir API isteği üzerinden bir nesneyi tanımlayıcısı aracılığıyla erişip, yetkilendirme mekanizmasını atlayarak verilerini okumasına veya değiştirmesine olanak tanır. BOLA saldırılarını önlemek için, ya savunmasız uç noktaları manuel olarak belirleyip bu noktalara yapılacak bağlantılar için limitler tanımlayabilir ya da Wallarm'ı, savunmasız uç noktaları otomatik olarak tespit edip koruyacak şekilde devreye alabilirsiniz. [Daha fazla bilgi edinin](../admin-en/configuration-guides/protecting-against-bola.md)

## API İstismarı Önleme Uygulaması Kullanın

Hesap ele geçirme, veri kazıma, güvenlik tarayıcıları ve API'larınıza yönelik diğer otomatik kötü niyetli eylemleri gerçekleştiren botları durdurmak ve engellemek için [API abuse profilleri oluşturun](../api-abuse-prevention/setup.md).

## Credential Stuffing Algılamayı Etkinleştirin

Uygulamalarınıza erişim sağlamak için ele geçirilmiş veya zayıf kimlik bilgilerini kullanma girişimlerini gerçek zamanlı olarak görmek ve uygulamalarınıza erişim sağlayan tüm tehlikeli veya zayıf kimlik bilgilerini içeren indirilebilir bir listeye sahip olmak için [credential stuffing algılamayı](../about-wallarm/credential-stuffing.md) etkinleştirin.

Hırsızlık veya zayıf şifrelere sahip hesapların bilinmesi, bu hesapların verilerini güvence altına almak için hesap sahipleriyle iletişime geçmek, erişimi geçici olarak askıya almak gibi önlemleri başlatmanıza olanak tanır.

## Özel Saldırı Algılama Kuralları Oluşturun

Bazı senaryolarda, [bir saldırı algılama imzasını manuel olarak eklemek veya sanal bir yama oluşturmak](../user-guides/rules/regex-rule.md) faydalı olabilir. Wallarm, saldırı algılamada düzenli ifadelerden bağımsız olarak çalışsa da, kullanıcıların düzenli ifadelere dayalı ek imzalar eklemesine izin verir.

## Hassas Verileri Maskeleyin

Wallarm node'u, saldırı bilgilerini Wallarm Cloud'a gönderir. Yetkilendirme bilgileri (çerezler, tokenlar, şifreler), kişisel veriler ve ödeme kimlik bilgileri gibi belirli veriler, işlendiği sunucu ortamında kalmalıdır. Hassas verilerin, Wallarm Cloud'a gönderilmeden önce özgün değerlerinden kesilmesini sağlamak için [veri maskeleme kuralı oluşturun](../user-guides/rules/sensitive-data-rule.md) ve böylece hassas verilerin güvenilir ortamınızda kalmasını sağlayın.

## Kullanıcı Oturumlarını Analiz Edin

Sadece **Attacks** veya **Incidents** bölümünde sunulan saldırılarla ilgilenerek, saldırının parçası olduğu request mantıksal sırasını tam olarak görmeniz mümkün olmaz.

Wallarm'ın [**API Sessions**](../api-sessions/overview.md), uygulamalarınıza yönelik saldırıların genel desenlerini ortaya çıkarmanıza ve alınan güvenlik önlemlerinin hangi iş mantığını etkileyeceğini anlamanıza yardımcı olacak bağlamı sunar.

Kullanıcı oturumlarını analiz ederek, tehdit aktörlerinin davranış mantığını belirleyebilir, saldırı ve kötü niyetli bot algılaması doğruluğunu teyit edebilir, risk altındaki gölge, zombie ve diğer uç noktaları takip edebilir, performans sorunlarını belirleyebilir ve daha fazlasını yapabilirsiniz.

## Kesintisiz SIEM/SOAR Entegrasyonu & Kritik Olaylar için Anlık Uyarılar

Wallarm, Sumo Logic, Splunk gibi çeşitli SIEM/SOAR sistemleri ile kesintisiz entegrasyon sunar ([integrations](../user-guides/settings/integrations/integrations-intro.md)) ve tüm saldırı bilgilerini merkezi yönetim için SOC merkezinize zahmetsizce aktarmanıza olanak tanır.

Wallarm entegrasyonları, [triggers](../user-guides/triggers/triggers.md) işleviyle birlikte, belirli saldırılar, denylist'teki IP'ler ve genel saldırı hacmi üzerinde raporlar ve gerçek zamanlı bildirimler oluşturmanız için güçlü bir araç sunar.

## Katmanlı Savunma Stratejisi

Uygulamalarınız için sağlam ve güvenilir güvenlik önlemleri oluştururken, katmanlı bir savunma stratejisi benimsemek hayati önem taşır. Bu, tamamlayıcı koruyucu önlemlerden oluşan ve birlikte dayanıklı bir derinlemesine savunma güvenlik duruşu oluşturan önlemler bütününü uygulamayı içerir. Wallarm güvenlik platformunun sunduğu önlemlerin yanı sıra, aşağıdaki uygulamaları da öneririz:

* Bulut hizmet sağlayıcınızın sunduğu L3 DDoS korumasını kullanın. L3 DDoS koruması, ağ düzeyinde çalışır ve dağıtık hizmet reddi (DDoS) saldırılarını hafifletmeye yardımcı olur. Çoğu bulut hizmet sağlayıcısı, hizmetlerinin bir parçası olarak L3 koruması sunar.
* Web sunucularınız veya API geçitleriniz için güvenli yapılandırma tavsiyelerine uyun. Örneğin, [NGINX](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html) veya [Kong](https://konghq.com/learning-center/api-gateway/secure-api-gateway) kullanıyorsanız, güvenli yapılandırma yönergelerine uymanız önemlidir.

Bu ek uygulamaları, [Wallarm L7 DDoS koruma önlemleri](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm) ile birlikte uygulayarak, uygulamalarınızın genel güvenliğini önemli ölçüde artırabilirsiniz.

## OWASP API En Önemli Tehditlerinin Kapsamını Kontrol Edin ve Artırın

OWASP API Security Top 10, API'larda güvenlik risklerinin değerlendirilmesi için altın standarttır. API'nızın bu API tehditlerine karşı güvenlik duruşunu ölçmenize yardımcı olmak için, Wallarm, 2023 sürümündeki en önemli tehditlerin hafifletilmesine yönelik net görünürlük ve metrikler sağlayan [dashboard](../user-guides/dashboards/owasp-api-top-ten.md) sunmaktadır.

Bu panolar, genel güvenlik durumunu değerlendirmenize ve uygun güvenlik kontrolleri kurarak tespit edilen güvenlik problemlerine proaktif bir yaklaşım getirmenize yardımcı olur.

## JA3 Parmak İzi Algılamayı Etkinleştirin

Aşağıdaki işlevselliğin daha hassas olması için:

* [API Sessions](../api-sessions/overview.md)
* [API Abuse Prevention](../api-abuse-prevention/overview.md) API Sessions mekanizması kullanılarak

Doğrulanmamış trafiğin daha iyi tanımlanabilmesi adına [JA3 parmak izi algılamayı](../admin-en/enabling-ja3.md#overview) etkinleştirmeniz önerilir.