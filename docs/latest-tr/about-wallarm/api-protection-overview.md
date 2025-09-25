# Wallarm API Protection <a href="../subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm'ın API Protection'ı, API ve yapay zekayı korumaya yönelik gelişmiş yetenekler setidir. Temel [bulut-yerel WAAP](../about-wallarm/waap-overview.md) koruması zaten tüm API protokollerini ve bunların saldırılara karşı incelenmesini, L7 DDoS'a karşı korumayı vb. içerirken, modern API'ler otomatik tehditler, API kötüye kullanımı ve yapay zekanın suistimali gibi ek risklere maruz kalır. Advanced API Security paketi, riskleri daha kapsamlı azaltmak için gelişmiş özellikler sunar.

API Protection şunları içerir:

* [API Specification Enforcement](#api-specification-enforcement), yüklediğiniz spesifikasyonlara dayanarak API'lerinize güvenlik politikaları uygulamak için tasarlanmıştır. Spesifikasyonunuzdaki uç nokta tanımları ile REST API'lerinize yapılan gerçek istekler arasındaki tutarsızlıkları tespit eder ve tutarsızlık bulunduğunda önceden tanımlanmış eylemleri gerçekleştirir.
* [Automatic BOLA Protection](#automatic-bola-protection), OWASP API Top 10'da 1 numaralı tehdit olarak işaretlenen BOLA saldırılarına karşı otomatik koruma sağlar. Wallarm zafiyetli uç noktaları otomatik olarak keşfeder ve bunları numaralandırmaya karşı korur.
* [API Abuse Prevention](#api-abuse-prevention), uygulamalarınızı ve API'lerinizi farklı türdeki otomatik tehditlere karşı korur. Davranışsal analize dayanarak Wallarm, içerik kazıyıcıları, güvenlik tarayıcıları vb. gibi kötü amaçlı botları kolayca tanımlayıp engelleyebilir.  
* [Credential Stuffing Detection](#credential-stuffing-detection), Hesap Ele Geçirme saldırılarına karşı bir katman daha koruma sağlar. Wallarm, düşük hızda ve düşük hacimdeki Credential Stuffing saldırılarını tespit etmek için önemli olan, ele geçirilmiş kimlik bilgilerinin tek bir kullanımını bile tanımanıza olanak tanır.
* [GraphQL API Protection](#graphql-api-protection), batching, iç içe sorgular, introspection vb. gibi protokole özgü özellikleri istismar eden uzmanlaşmış saldırılara karşı GraphQL API'lerinizi korur. Kaynak Tüketimi, Hizmetin Engellenmesi (DoS), Aşırı Bilgi Açığa Çıkması ve diğer saldırıları önleyebilir.

<!--Diagram for API Protection bundle of Wallarm products, being prepared by Iskandar-->

WAAP, temel Cloud Native WAAP aboneliği kapsamında sunulurken, API Protection paketinin araçları [Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliğinin bir parçasıdır.

## API Specification Enforcement

**API Specification Enforcement**, yüklediğiniz spesifikasyonlara dayanarak API'lerinize güvenlik politikaları uygulamak için tasarlanmıştır. Birincil işlevi, spesifikasyonunuzdaki uç nokta tanımları ile REST API'lerinize yapılan gerçek istekler arasındaki tutarsızlıkları tespit etmektir. Bu tür tutarsızlıklar belirlendiğinde, sistem bunları ele almak için önceden tanımlanmış eylemler gerçekleştirebilir.

![Spesifikasyon - güvenlik politikalarını uygulamak için kullanım](../images/api-specification-enforcement/specification-use-for-api-policies-enforcement.png)

[Ayrıntılı açıklama ve yapılandırmaya geçin →](../api-specification-enforcement/overview.md)

## Automatic BOLA Protection

Wallarm'ın API Discovery modülünü, kırık nesne düzeyi yetkilendirme (BOLA) tehdidine karşı savunmasız uç noktaları keşfetmek ve bu zafiyeti istismar etmeye çalışan saldırılara karşı otomatik olarak koruma sağlamak için kullanın.

![BOLA tetikleyicisi](../images/user-guides/bola-protection/trigger-enabled-state.png)

Otomatik BOLA koruması, [elle oluşturulan](../admin-en/configuration-guides/protecting-against-bola-trigger.md) BOLA koruma kurallarına harika bir eklenti veya onların yerine geçecek bir alternatiftir. Wallarm'ın davranışını kuruluşunuzun güvenlik profiliyle uyumlu hale getirmek için otomatik BOLA korumasını yapılandırabilirsiniz.

[Ayrıntılı açıklama ve yapılandırmaya geçin →](../admin-en/configuration-guides/protecting-against-bola.md)

## API Abuse Prevention

**API Abuse Prevention**, credential stuffing, sahte hesap oluşturma, içerik kazıma ve API'lerinizi hedef alan diğer kötü niyetli eylemleri gerçekleştiren botların tespitini ve etkisizleştirilmesini sağlar.

![API kötüye kullanımını önleme istatistikleri](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

**API Abuse Prevention**, ML tabanlı yöntemlerin yanı sıra istatistiksel ve matematiksel anomali arama yöntemlerini ve doğrudan kötüye kullanım vakalarını içeren karmaşık bir bot tespit modelini kullanır. Modül, normal trafik profilini kendi kendine öğrenir ve belirgin biçimde farklı davranışları anomali olarak tanımlar.

[Ayrıntılı açıklama ve yapılandırmaya geçin →](../api-abuse-prevention/overview.md)

## Credential Stuffing Detection

Wallarm'ın **Credential Stuffing Detection** özelliği, uygulamalarınıza erişmek için ele geçirilmiş veya zayıf kimlik bilgilerini kullanma girişimleri hakkında gerçek zamanlı bilgi toplar ve görüntüler ve bu tür girişimler hakkında anında bildirimler sağlar. Ayrıca, uygulamalarınıza erişim sağlayan tüm ele geçirilmiş veya zayıf kimlik bilgilerinin indirilebilir bir listesini oluşturur.

![Wallarm Console - Credential Stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing.png)

Ele geçirilmiş ve zayıf parolaları belirlemek için Wallarm, herkese açık [HIBP](https://haveibeenpwned.com/) ele geçirilmiş kimlik bilgileri veritabanından derlenen **850 milyondan fazla kayıttan** oluşan kapsamlı bir veritabanı kullanır.

[Ayrıntılı açıklama ve yapılandırmaya geçin →](credential-stuffing.md)

## GraphQL API Protection

Wallarm, temel [WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans) abonelik planı kapsamında dahi GraphQL içindeki düzenli saldırıları (SQLi, RCE, [vb.](../attacks-vulns-list.md)) varsayılan olarak tespit eder. Ancak protokolün bazı yönleri, aşırı bilgi ifşası ve DoS ile ilgili [GraphQL'e özgü](../attacks-vulns-list.md#graphql-attacks) saldırıların uygulanmasına olanak tanır.

Wallarm, **GraphQL politikası** ayarlayarak — GraphQL istekleri için bir dizi sınır — API'lerinizi bu saldırılardan korumanıza olanak tanır.

![GraphQL eşikleri](../images/user-guides/rules/graphql-rule.png)

[Ayrıntılı açıklama ve yapılandırmaya geçin →](../api-protection/graphql-rule.md)