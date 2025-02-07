# Açığa Çıkan Varlıklar <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm Console'un **Scanner** bölümü, Wallarm Scanner tarafından otomatik olarak keşfedilen alan adları, IP adresleri ve portlar gibi tüm halka açık varlıklarınızı görmenizi sağlar.

Proje büyüdükçe, kaynaklar artar ve kontrol azalır. Kaynaklar şirketin veri merkezleri dışında yer alabilir; bu da güvenliği tehlikeye atabilir. Wallarm, etik hackerlara benzer yöntemler kullanarak güvenliği değerlendirmeye yardımcı olur ve sonuçlara dair görünürlük sağlar.

![Scanner section](../images/user-guides/scanner/check-scope.png)

## Varlık Ekleme

Wallarm'ın şirketinizin açık varlıklarını keşfetmesini tetiklemek için, ilk halka açık varlığı manuel olarak ekleyin. **Add domain or IP**'ye tıklayın ve alan adlarınızdan ya da IP adreslerinizden birini girin:

![Scanner section](../images/user-guides/scanner/add-asset-manually.png)

Yeni alan adı veya IP adresi eklendikten sonra, Wallarm Scanner, kaynakla bağlantılı varlıkları aramak için tarama işlemini başlatır ve bunları listeye ekler. Wallarm önce portları tarar ve ardından bu portlardaki ağ kaynaklarını tespit eder.

Açığa çıkan varlıkları toplama ve güncelleme sürecinde çeşitli yöntemler kullanılır:

* Otomatik modlar
    * DNS bölge transferi ([AXFR](https://tools.ietf.org/html/rfc5936))
    * NS ve MX kayıtlarının alınması
    * SPF kayıt verilerinin alınması
    * Alt alan adı sözlük araması
    * SSL sertifikası ayrıştırma
* Wallarm Console UI veya [Wallarm API](../api/overview.md) üzerinden manuel veri girişi.

Açığa çıkan varlıkları toplama yöntemlerini **Configure** bölümünde [kontrol edebilirsiniz](#fine-tuning-asset-scanning).

## Bir Alan Adını Rezerve Etme

Sadece şirketinizin açık varlık listesine eklenebilecek alan adlarını Wallarm'dan rezerve etmesini isteyebilirsiniz. Diğer hesapların bu alan adlarını eklemesini önlemek için, [support@wallarm.com](mailto:support@wallarm.com) adresine bir rezervasyon talebi gönderin.

## Varlıkları Yönetme

Wallarm, açık varlıkları alan adları, IP adresleri ve servis grupları olarak kategorize eder. Bir IP adresi belirli bir veri merkezine aitse, örneğin Amazon için AWS ya da Google için GCP gibi ilgili etiket, varlığın yanında görüntülenir.

Hiçbir kullanıcı tarafından görüntülenmemiş yeni keşfedilen varlıklar **New** sekmesinde gösterilir, oysa **Disabled** sekmesi, zafiyet taramasının [devre dışı bırakıldığı](#disabling-vulnerability-scanning-for-certain-assets) varlıkları gösterir.

Kaynağın alan adı, IP adresi ve portu birbirine bağlıdır. Bir varlık seçerek, seçili IP adresiyle ilişkilendirilmiş bir alan adı gibi, onun bağlantılarını görebilirsiniz:

![Scope element with its associations](../images/user-guides/scanner/asset-with-associations.png)

### Varlıkların Bağlantılarını Kontrol Etme

Varsayılan olarak, daha düşük öncelikli varlıklar devre dışı bırakıldığında, daha yüksek öncelikli varlıklar aktif kalır. Bir alan adını [devre dışı bırakmak](#disabling-vulnerability-scanning-for-certain-assets), ilişkili IP adreslerini ve portları devre dışı bırakır. Bir IP adresini [silmek](#deleting-assets) ise, ilişkili portları siler ancak alan adı aktif kalır. Varlıkların bağlantılarını silerek, her birini ayrı ayrı devre dışı bırakabilir veya silebilirsiniz.

Her varlığın tarama ayarlarını bağımsız olarak yönetmek için:

1. Birbirinden ayırmak istediğiniz varlık çiftinden bir varlık seçin.
1. Şu an seçili olan varlıkla eşleşen varlığın yanındaki anahtara tıklayın.

    Mevcut kaynağın adı kalın harflerle gösterilir. UI ayrıca keşif tarihini de görüntüler.

![Disable the resource connection](../images/user-guides/scanner/disable-association.png)

Varlıklar arasındaki bağlantıyı etkinleştirmek için, bağlantıyı devre dışı bırakırken uyguladığınız adımları izleyin.

### Varlıkları Silme

Varlıkları **silerek**, Wallarm tarafından yanlışlıkla listeye eklenen varlıkları raporlayabilirsiniz. Silinen varlıklar, gelecekteki taramalarda keşfedilmeyecektir.

Yanlışlıkla silinen varlıkları geri almak için [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçin.

### Açığa Çıkan Varlık Listesindeki Değişiklik Bildirimleri

Wallarm, açığa çıkan varlık listesindeki değişiklikler hakkında size bildirimler gönderebilir: yeni keşfedilen açık varlıklar, devre dışı bırakılan ve silinenler.

Bildirimleri almak için, mesajlaşma uygulamaları veya SOAR sistemleri (ör. PagerDuty, Opsgenie, Slack, Telegram) ile uygun [native integrations](settings/integrations/integrations-intro.md) yapılandırmasını yapın.

Slack mesajına bir örnek:

```
[Test message] [Test partner] Network perimeter has changed

Notification type: new_scope_object_ips

New IP addresses were discovered in the network perimeter:
8.8.8.8

Client: TestCompany
Cloud: EU
```

## Varlık Taramasını İnce Ayar Yapma

Wallarm'da varlık taramasını ince ayar yapmak için, **Configure** düğmesine tıklayın. Buradan, Wallarm Scanner'ın şirketinizin açık varlıklarını bulmak için hangi yöntemleri kullandığını kontrol edebilirsiniz. Varsayılan olarak, tüm mevcut yöntemler kullanılır.

![Scanner config](../images/user-guides/vulnerabilities/scanner-configuration-options.png)

Wallarm Scanner için **Basic Scanner functionality** adında küresel bir anahtar da bulunmaktadır. Bu anahtar, varlık taraması ve zafiyet keşfi süreçlerini kontrol ederek, tüm şirket hesabınız için Scanner'ı etkinleştirir veya devre dışı bırakır. Aynı anahtarı **Vulnerabilities** bölümünde de bulabilirsiniz. Bir bölümdeki anahtarı değiştirmek, diğer bölümdeki ayarın otomatik olarak güncellenmesini sağlar.

## Açığa Çıkan Varlıkları Zafiyetler İçin Tarama

Wallarm, altyapınızdaki güvenlik açıklarını tespit etmek için, açık varlıklarınızı tipik zafiyetler açısından taramanın yanı sıra, birden fazla yöntem kullanır. Scanner, açık varlıklar toplandıktan sonra tüm IP adresleri ve alan adlarını zafiyetler açısından otomatik olarak kontrol eder.

Wallarm Console'un [**Vulnerabilities** bölümü](vulnerabilities.md), keşfedilen zafiyetleri görüntüler ve hangi zafiyetlerin tespit edileceğini kontrol etmenizi sağlar.

### Belirli Varlıklar İçin Zafiyet Taramasını Devre Dışı Bırakma

Scanner bölümünde, her varlığın, o belirli varlık için zafiyet taramasını açıp kapatmanızı sağlayan bir anahtarı vardır. Bu anahtar, şu anda seçili olan varlığın solunda bulunur ve kalın metinle görüntülenir. Anahtarı bulmak için öğe üzerine gelmenize gerek yoktur.

### Zafiyet Taramasını Sınırlama

Wallarm Scanner, kaynak yanıtlarına dayanarak keşfedilen kaynaklardaki zafiyetleri tespit etmek için test amaçlı kötü niyetli istekler kullanır. Kaynaklarınızı aşırı yüklememek için, Wallarm Scanner isteklerinin Saniye Başına İstek (RPS) ve Dakika Başına İstek (RPM) sayılarını yönetebilirsiniz. Threat Replay Testing modülü de, açık varlıklardan gelen kaynaklara yönlendirildiklerinde, kullanıcı tanımlı değerlere dayanarak istekleri sınırlar.

Tüm alan adları ve IP adresleri için aynı limitleri ayarlamak üzere, **Configure** düğmesine tıklayın ve ilgili bölümde değerleri belirleyin.

Belirli IP adresleri veya alan adları için limitleri geçersiz kılmak için:

1. **Domain** veya **IP** tipinde bir varlığı açın.
1. **Set RPS limits** düğmesine tıklayın ve limiti belirtin.

    Bir alan adı için RPS ayarlanıyorsa, **RPS per IP** alanına istenen değeri girerek alan adına bağlı her bir IP adresi için ayarlayabilirsiniz.
1. **Save** düğmesine tıklayın.

Varsayılan ayarlara dönmek için, boş bir değer kullanın veya `0` girin.

![Setting domain RPS](../images/user-guides/scanner/set-rps-for-domain.png)

Aynı IP adresine birden fazla alan adı bağlıysa, bu IP adresine gönderilen isteklerin hızı, IP adresi için belirlenen limitleri aşmaz. Bir alan adına birden fazla IP adresi bağlıysa, o alan içindeki bu IP adreslerine yapılan toplam istek hızı, alan için belirlenen limitleri aşmaz.

## Scanner'ın Engellenmesini Önleme

Wallarm dışında, trafiği otomatik olarak filtrelemek ve engellemek için ek araçlar (yazılım veya donanım) kullanıyorsanız, Wallarm Scanner için [IP adresleri](../admin-en/scanner-addresses.md) ile bir allowlist yapılandırmanız önerilir.

Bu, Wallarm bileşenlerinin kaynaklarınızı kesintisiz bir şekilde zafiyetler için taramasını sağlayacaktır.

## Kaynak Scanner'ı Durdurmak için Wallarm Destek ile İletişime Geçme

Wallarm scanner, keşif için ayarlamadığınız şirket kaynaklarınızı tarıyorsa, kaynağın taramadan hariç tutulması için [Wallarm Support](mailto:support@wallarm.com) ile iletişime geçin.