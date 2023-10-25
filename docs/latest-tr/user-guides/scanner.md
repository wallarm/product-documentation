# Şirketin Açık Varlıklarının Yönetimi <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm Konsolu'nun **Scanner** bölümü, Wallarm Scanner tarafından otomatik olarak keşfedilen tüm halka açık varlıklarınızı, örneğin alan adlarını, IP adreslerini ve portları gözlemlemenizi sağlar.

Proje büyüdükçe, kaynaklar artar ve kontrol azalır. Kaynaklar şirketin veri merkezlerinin dışında yer alabilir, bu da güvenliği tehlikeye atabilir. Wallarm, sonuçlar üzerinde görünürlük sağlayarak etik hackerlar gibi yöntemler kullanarak güvenliği değerlendirmeye yardımcı olur.

![Scanner section](../images/user-guides/scanner/check-scope.png)

## Varlıkları eklemek

Wallarm'ın şirketinizin açık varlıklarını keşfetmesini tetiklemek için, ilk halka açık varlığı manuel olarak ekleyin. **Alan adı veya IP ekleyin**'i tıklayın ve alan adlarınızdan veya IP'lerinizden birini girin:

![Scanner section](../images/user-guides/scanner/add-asset-manually.png)

Yeni alan adı veya IP adresi eklendikten sonra, Wallarm Scanner varlıkları aramak için tarama işlemine başlar ve bunları listeye ekler. Wallarm önce portları tarar ve daha sonra bu portlardaki ağ kaynaklarını tespit eder.

Açık varlıkların toplanması ve güncellenmesi sürecinde çeşitli yöntemler kullanılır:

* Otomatik modlar
    * DNS bölge transferi ([AXFR](https://tools.ietf.org/html/rfc5936))
    * NS ve MX kayıtları alma
    * SPF kayıtları bilgileri alma
    * Alt alan adı sözlüğü araması
    * SSL sertifika ayrıştırma
* Wallarm Konsolu UI veya [Wallarm API](../api/overview.md) üzerinden manuel veri girişi.

[Varlık keşif yöntemleri üzerinde kontrol](#fine-tuning-asset-scanning) sağlayabilirsiniz **Yapılandır** bölümünde.

## Bir alan adını rezerve etme

Wallarm'dan, yalnızca şirketinizin açık varlık listesine eklenmesi gereken alan adlarını rezerve etmesini isteyebilirsiniz. Bu alan adlarının başka hesaplar tarafından eklenmesini önlemek için, bir rezervasyon talebini [support@wallarm.com](mailto:support@wallarm.com) adresine gönderin.

## Varlıkları yönetme

Wallarm, açık varlıkları alan adları, IP'ler ve hizmetler gruplarına kategorize eder. Bir IP adresi belirli bir veri merkezine aitse, AWS gibi Amazon için veya GCP gibi Google için ilgili etiket, varlığın yanında görüntülenir.

Henüz herhangi bir kullanıcı tarafından görüntülenmeyen yeni keşfedilen varlıklar **Yeni** sekmesinde, güvenlik açığı taraması [devre dışı bırakılan](#disabling-vulnerability-scanning-for-certain-assets) varlıklar ise **Devre Dışı** sekmesinde gösterilir.

Kaynağın alan adı, IP adresi ve portu birbirine bağımlıdır. Bir varlığı seçerek, seçilen IP adresi ile ilişkili bir alan adı gibi ilişkilerini gözlemleyebilirsiniz:

![Birliktelikleri olan kapsam elementi](../images/user-guides/scanner/asset-with-associations.png)

### Varlıkların bağlantılarını kontrol etme

Varsayılan olarak, daha yüksek önceliği olan varlıklar, daha düşük önceliği olanlar devre dışı bırakıldığında aktif kalır. Bir alan adını [devre dışı bırakmak](#disabling-vulnerability-scanning-for-certain-assets), ilişkili IP adreslerini ve portları devre dışı bırakır. Bir IP adresini [silme](#deleting-assets), ilişkili portları siler ancak alan adını aktif tutar. Varlıkların bağlantılarını silerek, bunları tek tek devre dışı bırakabilir veya silebilirsiniz.

Her varlığın tarama ayarlarını bağımsız olarak yönetmek için:

1. Birbirinden ayrılmasını istediğiniz varlık çiftinden bir varlığı seçin.
1. Şu anki olanla eşleştirilmiş varlık yanındaki anahtara tıklayın.

    Mevcut kaynağın adı kalın olarak gösterilir. Kullanıcı arayüzü ayrıca keşif tarihini de görüntüler.

![Kaynak bağlantısını devre dışı bırak](../images/user-guides/scanner/disable-association.png)

Varlıkların karşılıklı bağlantısını etkinleştirmek için, bağlantıyı devre dışı bırakırken yaptığınızın aynısını yapın.

### Varlıkları silme

Varlıkları **silerek**, Wallarm tarafından yanlışlıkla listeye eklenen varlıkları bildirebilirsiniz. Silinen varlıklar gelecekteki taramalar sırasında keşfedilmez.

Yanlışlıkla silinen varlıkları geri almak için [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçin.

### Açık varlık listesindeki değişiklikler hakkında bildirimler

Wallarm, açık varlık listesindeki değişiklikler hakkında bildirimler gönderebilir: yeni keşfedilen açık varlıklar, devre dışı bırakılan ve silinenler.

Bildirimleri almak için, Messenger'lar veya SOAR sistemleri (ör. PagerDuty, Opsgenie, Slack, Telegram) ile uygun [yerleşik entegrasyonları](settings/integrations/integrations-intro.md) yapılandırın.

Slack mesajı örneği:

```
[Test mesajı] [Test partner] Ağ perimetresi değişti

Bildirim tipi: yeni_kapsam_nesnesi_ips

Ağ perimetresinde yeni IP adresleri keşfedildi:
8.8.8.8

Müşteri: TestCompany
Bulut: EU
```

## Varlık taramasının ince ayarını yapma

Wallarm'da varlık taramasının ince ayarını yapmak için **Yapılandır** düğmesini tıklayın. Oradan, Wallarm Scanner'ın şirketinizin açık varlıklarını bulmak için hangi yöntemleri kullandığını kontrol edebilirsiniz. Varsayılan olarak, tüm olası yöntemler kullanılır.

![Scanner config](../images/user-guides/vulnerabilities/scanner-configuration-options.png)

Wallarm Scanner için **Temel Scanner işlevselliği** adında global bir anahtar da vardır. Bu anahtar, hem varlık tarama hem de güvenlik açığı bulma süreçlerini kontrol ederek, tüm şirket hesabınız için Scanner'ı etkinleştirir veya devre dışı bırakır. **Güvenlik Açıkları** bölümünde de aynı anahtarı bulabilirsiniz. Bir bölümdeki anahtarı değiştirmek, diğer bölümdeki ayarı otomatik olarak günceller.

## Açık varlıkları güvenlik açıkları için tarama

Wallarm, altyapınızdaki güvenlik sorunlarını keşfetmek için birden çok yöntem kullanır, bunlara açık varlıklarınızı tipik güvenlik açıkları için tarama da dahildir. Scanner, açık varlıklar toplandıktan sonra otomatik olarak tüm IP adreslerini ve alan adlarını güvenlik açıkları için kontrol eder.

Wallarm Konsolu'nun [**Güvenlik Açıkları** bölümü](vulnerabilities.md), keşfedilen güvenlik açıklarını görüntüler ve hangi güvenlik açıklarının keşfedilmesi gerektiğini kontrol etmenizi sağlar.

### Belli varlıklar için güvenlik açığı taramasını devre dışı bırakma

**Scanner** bölümünde, her varlığın, belirli bir varlık için güvenlik açığı taramasını açıp kapatmanızı sağlayan bir anahtarı vardır. Anahtar, şu anda seçili ve kalın metinle yazılmış olan varlığın solunda bulunur. Anahtarı bulmak için elementin üzerine gelmenize gerek yok.

### Güvenlik açığı taramasını sınırlama

Wallarm Scanner, kaynak yanıtına dayalı olarak keşfedilen kaynaklardaki güvenlik açıklarını tespit etmek için test kötü amaçlı istekler kullanır. Kaynaklarınızı zor durumda bırakmamak için, Wallarm Scanner isteklerinin Saniyedeki İstekler (RPS) ve Dakikadaki İstekler (RPM)'ini yönetebilirsiniz. Aktif Tehdit Doğrulama modülü ayrıca, isteklerin açık varlıklardan kaynaklarına yönlendirildiği durumlarda kullanıcı tarafından tanımlanan değerlere dayalı olarak istekleri sınırlar.

Tüm alan adları ve IP adresleri için aynı sınırlamaları belirlemek isterseniz, **Yapılandır**'ı tıklayın ve ilgili bölümde değerleri belirtin.

Belirli IP adresleri veya alan adları için sınırlamaları geçersiz kılmak için:

1. **Alan Adı** veya **IP** tipindeki bir varlığı açın.
1. **RPS sınırlarını belirleyin** düğmesini tıklayın ve sınırlamayı belirtin.

    Eğer bir alan adı için RPS belirliyorsanız, alan adının bağımlı olduğu her IP adresi için bunu **IP başına RPS** alanında istenen değeri girerek yapabilirsiniz.
1. **Kaydet**'i tıklayın.

Varsayılan ayarlara dönmek için, boş bir değer kullanın veya `0` girin.

![Alan adı RPS ayarları](../images/user-guides/scanner/set-rps-for-domain.png)

Birden fazla alan adı aynı IP adresi ile ilişkilendirilmişse, bu IP adresine giden isteklerin hızı, IP adresi için belirlenen sınırlamaları geçmeyecektir. Bir alan adı ile ilişkili birden fazla IP adresi var ise, bu IP adreslerine giden toplam istek hızı, bu alan adı için belirlenen sınırlamaları geçmeyecektir.