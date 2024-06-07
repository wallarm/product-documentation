# API Hırsızlığını Önleme profili yönetimi <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm Konsolu'nun **API Hırsızlığını Önleme** bölümünde [**API Hırsızlığını Önleme**](../api-abuse-prevention/overview.md) modülünün yapılandırılması için gereken API hırsızlığı profillerini yönetebilirsiniz.

Bu bölüm, aşağıdaki [roller](../user-guides/settings/users.md#user-roles) için kullanıcılara açıktır:

* Normal hesaplar için **Yönetici** veya **Analizci**.
* Multitenant özelliği olan hesaplar için **Global Yönetici** veya **Global Analist**.

## API hırsızlık profili oluşturma

Bir API hırsızlık profili oluşturmak için:

1. Wallarm Konsolu → **API Hırsızlığını Önleme**, **Profil oluştur** seçeneğine tıklayın.
1. Koruma altına alınacak uygulamaları seçin.
1. [Tolerans](../api-abuse-prevention/overview.md#tolerance) seviyesini seçin.
1. Gerekliyse, **Korunacak tür** bölümünden, koruma altına alınacak [bot türlerini](../api-abuse-prevention/overview.md#automated-threats-blocked-by-api-abuse-prevention) sınırlayın.
1. Uygun [kötü amaçlı botlara tepkiyi](../api-abuse-prevention/overview.md#reaction-to-malicious-bots) seçin.
1. Tepki, red- veya gri-listeye ekleme ise, IP'nin listede kalacağı süreyi ayarlayın. Varsayılan değer `Bir gün için ekle`dır.
1. Bir ad ve gerekirse bir açıklama belirleyin.

    ![API Hırsızlık profili önleme](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

    API hırsızlık profili yapılandırıldığında, modül [trafik analizini ve desteklenen otomatik tehditleri engellemeyi](../api-abuse-prevention/overview.md#how-api-abuse-prevention-works) başlatır.

## API hırsızlık profilini devre dışı bırakma

Devre dışı olan profiller, **API Hırsızlığını Önleme** modülünün trafik analizi sırasında kullanmadığı ama yine de profil listesinde görünen profillerdir. Devre dışı bırakılan profilleri istediğiniz zaman yeniden etkinleştirebilirsiniz. Etkin profil yoksa, modül kötü amaçlı botları engellemez.

Profilinizi devre dışı bırakabilirsiniz, buna karşılık gelen **Devre Dışı** seçeneğini kullanın.

## API hırsızlık profilini silme

Silinen profiller, geri yüklenemeyen ve **API Hırsızlığını Önleme** modülünün trafik analizi sırasında kullanmadığı profillerdir..

Profilinizi silmek için, buna karşılık gelen **Sil** seçeneğini kullanın.

## Engellenen kötü amaçlı botları ve saldırılarını inceleme

**API Hırsızlığını Önleme** modülü, botları 1 saatliğine [redlisteye](../user-guides/ip-lists/denylist.md) veya [graylisteye](../user-guides/ip-lists/graylist.md) ekleyerek engeller.

Engellenen botların IP'lerini Wallarm Konsolu → **IP listeleri** → **Redlist** veya **Graylist**. Bölümünden inceleyebilirsiniz. `Bot` **Sebep** ile eklenen IP'leri inceleyin.

![Redlisted bot IP'ler](../images/about-wallarm-waf/abi-abuse-prevention/denylisted-bot-ips.png)

!!! info "Güven"
    [Detektörlerin çalışmasının](../api-abuse-prevention/overview.md#how-api-abuse-prevention-works) bir sonucu olarak, her tespit edilen bot **güven yüzdesi** elde eder: Bu bot olduğuna ne kadar eminiz. Her bot türünde, detektörlerin göreli olarak önemi / oy sayısı farklıdır. Bu nedenle, güven yüzdesi, bu bot türünde (çalışan dedektörler tarafından verilen) tüm olası oylardan elde edilen oylardır.

Bot koruma sürecine müdahale edebilirsiniz. Eğer red- veya gri-listedeki bir IP aslında kötü amaçlı bir bot tarafından kullanılmıyorsa, IP'yi listeden silebilir veya bunu [allowlist](../user-guides/ip-lists/allowlist.md) yapabilirsiniz. Wallarm, kötü amaçlı olanlar da dahil olmak üzere, allowlisted IP'lerden gelen tüm istekleri engellemez.

Ayrıca, botların gerçekleştirdiği API hırsızlık saldırılarını Wallarm Konsolu → **Etkinlikler** bölümünde inceleyebilirsiniz. `api_abuse` arama anahtarını kullanın veya **Tür** filtresinden `API Hırsızlığını Önleme`yi seçin.

![API Hırsızlık Etkinlikleri](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-events.png)

Bot bilgileri üç heatmap'ta görselleştirilir. Tüm heatmap'larda, baloncuk ne kadar büyük, kırmızı renge ve sağ üst köşeye ne kadar yakınsa, bu IP'nin bir bot olduğunu düşünmek için o kadar çok neden vardır.

Heatmap'lerde, güncel botunuzu (**bu bot**), son 24 saat içinde aynı uygulamaya saldıran diğer botlarla karşılaştırabilirsiniz. Eğer çok fazla bot saldırıyorsa, yalnızca 30 en şüpheli bot görüntülenir.

Heatmap'ler:

* **Performans** şu anda ve diğer tespit edilen botların performansını görselleştirir, bunun içinde isteklerin özgünlüğü, programlanmış istekler, RPS ve istek aralığı bulunur.
* **Davranış** şu anda ve diğer tespit edilen botların şüpheli davranış skorunu görselleştirir; bunun içinde şüpheli davranış derecesi, kritik veya hassas uç noktalara yapılan istek miktarı, RPS ve botların bot olarak tespit ettiği bot dedektörlerinin sayısı bulunur.
* **HTTP Hataları** bot etkinlikleri sonucunda oluşan API hatalarını görselleştirir; bunun içinde hedeflediği farklı uç noktaların sayısı, yaptığı güvenliksiz isteklerin sayısı, RPS ve aldığı hata yanıt kodlarının sayısı bulunur.

Her bir heatmap, baloncuk büyüklüğü, rengi ve konumunun detaylı açıklamasını içerir (**Daha fazlasını göster**'i kullanın). Gerekli alanın etrafında dikdörtgen çizerek heatmap’i yakınlaştırabilirsiniz.

**API Hırsızlığını Önleme** modülü, istemci trafiğini URL örüntülerine dönüştürür. URL örüntüsü aşağıdaki segmentlere sahip olabilir:

| Segment | İçerir | Örnek |
|---|---|---|
| DUYARLI | Uygulamanın kritik işlevlerine veya kaynaklarına erişim sağlayan URL parçalarını içerir, örneğin, yönetici paneli. Bunlar, potansiyel güvenlik ihlallerini önlemek için gizli tutulmalı ve yetkili personele kısıtlanmalıdır. | `wp-admin` |
| TANIMLAYICI | Çeşitli tanımlayıcıları içerir, örneğin sayısal tanımlayıcılar, UUID'ler, vb. | - |
| STATİK | Çeşitli statik dosyaları içeren klasörleri içerir. | `images`, `js`, `css` |
| DOSYA | Statik dosya adlarını içerir. | `image.png` |
| SORGU | Sorgu parametrelerini içerir. | - |
| AUTH | Kimlik doğrulama/yetkilendirme uç noktaları ile ilgili içeriği içerir. | - |
| DİL | Dil ile ilgili bölümleri içerir. | `en`, `fr` |
| SAGLIK KONTROLÜ | Sağlık kontrolü uç noktaları ile ilgili içeriği içerir. | - |
| DEĞİŞKEN | Segment, diğer kategorilere dahil edilemiyorsa DEĞİŞKEN olarak işaretlenir. URL yoluyla değişken bir bölüm. | - |

## İstisna listesi ile çalışma

Bazı IP'leri geçerli botlar ya da tarayıcılar olarak işaretlemek ve bunların API Hırsızlığını Önleme tarafından bloklandığını önlemek için [**İstisna listesi**](../api-abuse-prevention/overview.md#exception-list)ni kullanın.

IP adresini veya aralığı istisna listesine ekler ve hedef uygulamayı belirtirsiniz: bu, bu adreslerden gelen herhangi bir isteğin, bu adreslerin kötü amaçlı botlar olarak işaretlenmesine veya API Hırsızlığını Önleme tarafından [red-](../user-guides/ip-lists/denylist.md) ya da [gri-listeye](../user-guides/ip-lists/graylist.md) eklenmesine yol açmayacak.

İstisna listesine IP adresi eklemenin iki yolu vardır:

* **API Hırsızlığını Önleme** bölümü → **İstisna listesi** sekmesi via **İstisna Ekle**. Burada, IP'ler ve alt ağların yanı sıra, API Hırsızlığını Önleme tarafından göz ardı edilmesi gereken konumları ve kaynak türlerini ekleyebilirsiniz.

    ![API Hırsızlığını önleme - iç istisna listesinden eşya eklerken](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-inside.png)

* **Etkinlikler** bölümünden: `api_abuse` arama anahtarını kullanın veya **Tür** filtresinden `API Hırsızlığını Önleme`yi seçin, ardından gerekli etkinliği genişletin ve **İstisna listesine ekle**'ye tıklayın.

    ![API Hırsızlığını önleme - iç istisna listesinden eşya eklerken](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-event.png)

Bir IP adresi istisna listesine eklendiğinde, adres otomatik olarak [red-](../user-guides/ip-lists/denylist.md) veya [gri-listeden](../user-guides/ip-lists/graylist.md) kaldırılır, ama yalnızca API Hırsızlığını Önleme tarafından kendisinin eklenmiş olması durumunda (`Bot` sebebi var).

!!! info "IP'den diğer saldırı türlerini engelleme"
    Eğer istisna listesindeki bir IP, diğer [saldırı türlerini](../attacks-vulns-list.md) üretirse, brute force gibi ya da giriş doğrulama saldırıları gibi ve diğerleri, Wallarm bu tür istekleri engeller.

Varsayılan olarak, IP istisna listesine sonsuza dek eklenir. Bunu değiştirebilir ve adresin istisna listesinden ne zaman kaldırılması gerektiğini ayarlayabilirsiniz. İstisnalardan bir adresi hemen herhangi bir anda da kaldırabilirsiniz.

**İstisna listesi** sekmesi, tarihsel verileri sağlar - geçmişte seçili bir zaman dilimi içinde listelenmiş olan öğeleri görüntüleyebilirsiniz.

## Hedef URL'ler ve belirli istisna istekleri ile çalışma

İyi botların IP'lerini [istisna listesi](#istisna-listesi-ile-çalışma) üzerinden işaretlemenin yanı sıra, hem isteklerin hedefi olan URL'ler hem de belirli istek türleri için bot korumasını devre dışı bırakabilirsiniz, örneğin, belirli başlıkları içeren istekler için.

API Hırsızlığını Önleme yapılandırmasıyla karşılaştırıldığında, bu özellik API Hırsızlık profilinde **değil**, ayrı olarak yapılandırılır - [**API Hırsızlık Önleme modunu ayarla**](../user-guides/rules/api-abuse-url.md) kuralının yardımı ile.