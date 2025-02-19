# API Envanterini Keşfetmek <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

API Discovery modülü uç noktalarınızın kataloğunu (API envanterinizi) oluşturur oluşturmaz, Wallarm Console'ın **API Discovery** bölümünde onu keşfedebilirsiniz. Bu makalede, keşfedilen veriler arasında nasıl gezineceğinizi öğrenin.

## Uç Noktalar

[US](https://us1.my.wallarm.com/api-discovery) veya [EU](https://my.wallarm.com/api-discovery) Cloud'daki **API Discovery** bölümünü kullanarak keşfedilen API envanterinizi inceleyin.

![API Discovery tarafından keşfedilen uç noktalar](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

Her **API Discovery** bölümünü açtığınızda, geçen haftanın tüm keşfedilen uç noktalarını ve bu uç noktalara ilişkin [değişiklikleri](track-changes.md) görürsünüz. **Changes since** filtresi ile `Last week` yerine başka bir periyodu seçebilirsiniz.

Varsayılan olarak, uç noktalar ana bilgisayar/uç nokta isimlerine göre sıralanır (ve ana bilgisayarlara göre gruplandırılır). **Hits** veya **Risk** ile sıralama yaptığınızda gruplama kaldırılır – varsayılan görünüme geri dönmek için ana bilgisayar/uç nokta sütununa tekrar tıklayın.

### Harici vs. Dahili

Harici ağdan erişilebilen uç noktalar ana saldırı yönleridir. Bu nedenle, dışarıdan nelerin erişilebilir olduğunu görmek ve öncelikle bu uç noktalara dikkat etmek önemlidir.

Wallarm, keşfedilen API'leri otomatik olarak harici ve dahili olarak ayırır. Tüm uç noktalarıyla birlikte olan bir ana bilgisayar eğer aşağıdakilerden birinde yer alıyorsa dahili sayılır:

* Özel IP veya yerel IP adresi
* Genel üst seviye alan adı (örneğin: localhost, dashboard, vb.)

Kalan durumlarda ana bilgisayarlar harici olarak kabul edilir.

Varsayılan olarak, tüm API ana bilgisayarlarının (harici ve dahili) listesi görüntülenir. Oluşturulan API envanterinde, dahili ve harici API'lerinizi ayrı ayrı görüntüleyebilirsiniz. Bunu yapmak için **External** veya **Internal** seçeneğine tıklayın.

### Filtreleme

Geniş bir API uç noktası filtresi yelpazesi arasında, analiz amacınıza karşılık gelenleri seçebilirsiniz, örneğin:

* Saldırıya uğramış uç noktaları, bunları hit sayısına göre sıralayabilirsiniz.
* Yüksek [risk seviyesi](risk-score.md) ile karakterize edilmiş hassas verileri işleyen ve aktif güvenlik açıklarına sahip en savunmasız uç noktaları bulun. Yüksek risk seviyesindeki güvenlik açıklarının istismarı, saldırganların uç noktanın işlediği/depoladığı hassas verileri çalmaları dahil birçok kötü niyetli eylem gerçekleştirmesine olanak tanır.
* [Rogue uç noktaları](rogue-api.md) bulun: gölge, yetim ve zombi.
* Geçen haftada değiştirilen veya yeni keşfedilen ve PII verilerini işleyen uç noktaları tespit edin. Bu tür istek, API'lerinizdeki kritik [değişikliklerden](track-changes.md) haberdar olmanıza yardımcı olabilir.
* PUT veya POST çağrılarıyla verileri sunucunuza yüklemek için kullanılan uç noktaları bulun. Bu tür uç noktalar sık sık saldırı hedefi olduklarından iyi korunmalıdır. Bu tür isteği kullanarak, uç noktaların ekip tarafından bilindiğini ve saldırılara karşı iyi güvence altına alındığını kontrol edebilirsiniz.
* Müşterilerin banka kartı verilerini işleyen uç noktaları bulun. Bu istekle, hassas verilerin yalnızca güvenli uç noktalar tarafından işlendiğini kontrol edebilirsiniz.
* Kullanım dışı bir API sürümüne ait uç noktaları bulun (örneğin `/v1` ile arayarak) ve bunların müşteriler tarafından kullanılmadığından emin olun.

Tüm filtrelenmiş veriler, ek analiz için OpenAPI v3 formatında dışa aktarılabilir.

## Uç Nokta Detayları

<a name="params"></a>Uç noktaya tıklayarak, ilgili veri tipleri ile istek istatistikleri, istek ve yanıt başlıkları ile parametreler de dahil olmak üzere uç nokta detaylarını görebilirsiniz:

![API Discovery tarafından keşfedilen istek parametreleri](../images/about-wallarm-waf/api-discovery/discovered-request-params-4.10.png)

Her istek/yanıt parametresi bilgisi şunları içerir:

* Parametre adı ve bu parametrenin ait olduğu istek/yanıt bölümü
* Parametre değişiklikleri hakkında bilgi (yeni, kullanılmayan)
* Bu parametre aracılığıyla iletilen hassas verilerin varlığı ve tipi, şunlar dahil:

    * IP ve MAC adresleri gibi teknik veriler
    * Gizli anahtarlar ve şifreler gibi giriş bilgileri
    * Banka kartı numaraları gibi finansal veriler
    * Tıbbi lisans numarası gibi tıbbi veriler
    * Tam isim, pasaport numarası veya SSN gibi kişisel olarak tanımlanabilir bilgiler (PII)

* Bu parametre ile gönderilen verinin [Type/format](#format-and-data-type)
* Parametre bilgisinin en son güncellendiği tarih ve saat

!!! info "Yanıt parametrelerinin kullanılabilirliği"
    Yanıt parametreleri yalnızca node 4.10.1 veya daha üstü kullanıldığında mevcuttur.

### Format ve Veri Tipi

**Type** sütununda, Wallarm trafik analizinden tespit edilen veri formatını veya belirli değilse genel veri tipini belirtir.

Wallarm, `Int32`, `Int64`, `Float`, `Double`, `Datetime`, `IPv4`/`IPv6` gibi çeşitli veri formatlarını tespit etmeye çalışır. Bir değer, tanınan herhangi bir veri formatına uymuyorsa, Wallarm bunu genel bir veri tipi altında sınıflandırır; örneğin `Integer`, `Number`, `String` veya `Boolean`.

Bu veriler, her parametrede beklenen formatta değerlerin geçirildiğini kontrol etmenizi sağlar. Tutarsızlıklar, bir saldırı veya API'nizin taranmasının sonucu olabilir, örneğin:

* `IP` olması gereken alana `String` değerlerinin geçirilmesi
* `Int32`'den büyük olamayacak bir alana `Double` değerlerinin geçirilmesi

### Değişkenlik

URL'ler, kullanıcı kimliği gibi çeşitli unsurları içerebilir, örneğin:

* `/api/articles/author/author-a-0001`
* `/api/articles/author/author-a-1401`
* `/api/articles/author/author-b-1401`

**API Discovery** modülü, bu tür unsurları uç nokta yollarında `{parameter_X}` formatına dönüştürür; bu nedenle yukarıdaki örnekte 3 uç nokta yerine yalnızca bir tane görünür:

* `/api/articles/author/{parameter_1}`

Uç noktanın parametrelerini genişletmek ve çeşitli parametre için otomatik olarak tespit edilen tipi görüntülemek için uç noktaya tıklayın.

![API Discovery - Yoldaki değişkenlik](../images/about-wallarm-waf/api-discovery/api-discovery-variability-in-path-4.10.png)

Algoritmanın yeni trafiği analiz ettiğini unutmayın. Bazı durumlarda birleştirilmesi gereken adresleri görürseniz, henüz birleştirme gerçekleşmemiş olabilir; zaman tanıyın. Daha fazla veri geldikçe, sistem, bulunan yeni örüntü ile eşleşen uç noktaları uygun şekilde birleştirecektir.

## Uç Nokta Etkinlikleri

### Saldırılar

Son 7 gündeki API uç noktalarına yapılan saldırı sayısı **Hits** sütununda görüntülenir. Filtrelerden **Others** → **Attacked endpoints** seçilerek sadece saldırıya uğramış uç noktaları görüntüleyebilirsiniz.

Bir uç noktaya yapılan saldırıları görmek için, **Hits** sütunundaki sayıya tıklayın:

![API uç noktası - açık etkinlikler](../images/about-wallarm-waf/api-discovery/endpoint-open-events.png)

**Attacks** bölümü, [uygulanmış filtre ile](../user-guides/search-and-filters/use-search.md) görüntülenecektir:

```
attacks last 7 days endpoint_id:<YOUR_ENDPOINT_ID>
```

Ayrıca, uç nokta URL'sini panoya kopyalayıp olayları aramak için kullanabilirsiniz. Bunu yapmak için ilgili uç nokta menüsünden **Copy URL** seçeneğini seçin.

### Tüm Etkinlikler

Uç noktayla ilgili tüm isteklerin sayısı **Requests** sütununda görüntülenir. Bu sayıya tıklayarak, son haftadaki kullanıcı oturumlarının listesinin yer aldığı [**API Sessions**](../api-sessions/overview.md) bölümünü açabilirsiniz.

Her bulunan oturum içinde, başlangıçta yalnızca o uç noktaya yapılan istekler görüntülenir – oturum içinde, kapsamlı bir görünüm için uç nokta filtresini kaldırın.

Oturum etkinliklerinin yapılandırılmış görünümü, uç noktanızın kötü niyetli ve meşru etkinlikler içindeki yerini, hassas iş akışlarıyla ilişkisini ve gerekli koruma önlemlerini anlamaya yardımcı olur.

## API Uç Noktaları İçin Kural Oluşturma

Herhangi bir API envanteri uç noktasından hızlıca yeni bir [custom rule](../user-guides/rules/rules.md) oluşturabilirsiniz:

1. Bu uç nokta menüsünde **Create rule** seçeneğine tıklayın. Kural oluşturma penceresi görüntülenecektir. Uç nokta adresi pencereye otomatik olarak aktarılır.
1. Kural oluşturma penceresinde kural bilgilerini belirtin ve ardından **Create**'e tıklayın.

![Uç noktadan kural oluşturma](../images/about-wallarm-waf/api-discovery/endpoint-create-rule.png)

## API Envanteri Verilerini Dışa Aktarma

API Discovery kullanıcı arayüzü, mevcut filtrelenmiş uç nokta listesini [OpenAPI v3](https://spec.openapis.org/oas/v3.0.0) spesifikasyonu veya CSV dosyası olarak dışa aktarma seçeneği sunar.

Dışa aktarmak için, Wallarm Console → **API Discovery** bölümünde **OAS/CSV** seçeneğini kullanın. Aşağıdakileri göz önünde bulundurun:

* **OAS** için, Wallarm, filtrelenmiş uç noktalar ile birlikte `swagger.json` dosyasını döner. Ayrıca, bireysel uç nokta menüsünde **Download OAS** düğmesini de kullanabilirsiniz.

    İndirilen spesifikasyon, Postman gibi diğer uygulamalar ile birlikte kullanılarak uç noktaların güvenlik açığı ve diğer testleri gerçekleştirilebilir. Ek olarak, bu uç noktaların hassas verileri işleyip işlemediğini ve belgelenmemiş parametrelerin varlığını ortaya çıkarmak için daha yakından incelenmelerine olanak tanır.

* **CSV** için, Wallarm, filtrelenmiş uç nokta verilerini, diğer programlara kolayca aktarılabilen basit bir virgülle ayrılmış metin formatında döner.

!!! warning "İndirilen Swagger dosyasında API ana bilgisayar bilgileri"
    Keşfedilen API envanteri birden fazla API ana bilgisayarı içeriyorsa, indirilen dosyada tüm ana bilgisayarların uç noktaları yer alacaktır. Şu anda API ana bilgisayarı bilgileri dosyaya dahil edilmemektedir.