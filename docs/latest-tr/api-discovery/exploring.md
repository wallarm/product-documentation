# API Envanterini Keşfetme <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Discovery](overview.md) modülü uç noktalarınızın kataloğunu (API envanterinizi) oluşturur oluşturmaz, Wallarm Console içindeki **API Discovery** bölümünde onu keşfedebilirsiniz. Bu makaleden, keşfedilen verileri nasıl inceleyeceğinizi öğrenin.

## Uç noktalar

Keşfedilmiş API envanterinizi [US](https://us1.my.wallarm.com/api-discovery) veya [EU](https://my.wallarm.com/api-discovery) Cloud içindeki **API Discovery** bölümünü kullanarak keşfedin.

![API Discovery tarafından keşfedilen uç noktalar](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

**API Discovery** bölümünü her açtığınızda, son bir haftaya ait tüm keşfedilen uç noktaları ve bunların [değişikliklerini](track-changes.md) görürsünüz. **Changes since** filtresiyle `Last week` seçimini başka bir dönemle değiştirebilirsiniz.

Varsayılan olarak, uç noktalar host/endpoint adına göre sıralanır (ve hostlara göre gruplanır). **Hits** veya **Risk** ile sıralarsanız gruplama kalkar - varsayılana dönmek için hosts/endpoint sütununa tekrar tıklayın.

### Harici ve dahili

Dış ağdan erişilebilen uç noktalar, başlıca saldırı yönleridir. Bu nedenle dışarıdan nelerin erişilebilir olduğunu görmek ve öncelikle bu uç noktalara dikkat etmek önemlidir.

Wallarm, keşfedilen API’leri otomatik olarak harici ve dahili olarak ayırır. Bir host ve tüm uç noktaları aşağıdaki konumlarda ise dahili kabul edilir:

* Özel IP veya yerel IP adresi
* Genel seviyede üst alan adı (örneğin: localhost, dashboard, vb.)

Diğer durumlarda hostlar harici kabul edilir.

Varsayılan olarak, tüm API hostlarının (harici ve dahili) bulunduğu bir liste görüntülenir. Oluşturulan API envanterinde, dahili ve harici API’lerinizi ayrı ayrı görüntüleyebilirsiniz. Bunu yapmak için **External** veya **Internal** seçeneğine tıklayın.

### Filtreleme

Geniş API uç nokta filtreleri arasından, analiz amacınıza uygun olanları seçebilirsiniz, örneğin:

* Yalnızca saldırıya uğramış uç noktalar; bunları isabet (hit) sayısına göre sıralayabilirsiniz.
* Hassas veri işleyen ve yüksek [risk düzeyi](risk-score.md) olan aktif zafiyetlerle karakterize edilen en zayıf uç noktaları bulun. Yüksek risk düzeyindeki zafiyetlerin istismarı, saldırganların uç noktanın işlediği/sakladığı hassas verileri çalmak da dahil olmak üzere sistem üzerinde birçok kötü niyetli eylem gerçekleştirmesine olanak tanır.
* [Rogue uç noktaları](rogue-api.md) bulun: shadow, orphan ve zombie.
* Son bir haftada değişmiş veya yeni keşfedilmiş ve PII verileri işleyen uç noktaları bulun. Bu tür bir istek, kritik [API değişikliklerinden](track-changes.md) haberdar kalmanıza yardımcı olabilir.
* Sunucunuza veri yüklemek için PUT veya POST çağrılarıyla kullanılan uç noktaları bulun. Bu tür uç noktalar sık saldırı hedefi olduğundan iyi korunmalıdır. Bu tür bir sorgu ile uç noktaların ekip tarafından bilindiğini ve saldırılara karşı iyi korunduğunu kontrol edebilirsiniz.
* Müşterilerin banka kartı verilerini işleyen uç noktaları bulun. Bu istek ile hassas verilerin yalnızca güvenli uç noktalar tarafından işlendiğini kontrol edebilirsiniz.
* Kullanımdan kaldırılmış bir API sürümüne ait uç noktaları (ör. `/v1` aramasıyla) bulun ve istemciler tarafından kullanılmadıklarından emin olun.

Tüm filtrelenmiş veriler, ek analiz için OpenAPI v3 biçiminde dışa aktarılabilir.

## Uç nokta ayrıntıları

<a name="params"></a>Uç noktaya tıklayarak, istek istatistikleri, istek ve yanıtların başlıkları ve parametreleri ile ilgili veri türleri dahil olmak üzere uç nokta ayrıntılarını da bulabilirsiniz:

![API Discovery tarafından keşfedilen istek parametreleri](../images/about-wallarm-waf/api-discovery/discovered-request-params-4.10.png)

Her bir istek/yanıt parametresi bilgisi şunları içerir:

* Parametre adı ve bu parametrenin ait olduğu istek/yanıt bölümü
* Parametre değişiklikleri hakkında bilgi (yeni, kullanılmayan)
* Bu parametre ile iletilen hassas verilerin varlığı ve türü; buna şunlar dahildir:

    * IP ve MAC adresleri gibi teknik veriler
    * Gizli anahtarlar ve parolalar gibi oturum açma kimlik bilgileri
    * Banka kartı numaraları gibi finansal veriler
    * Tıbbi lisans numarası gibi tıbbi veriler
    * Tam ad, pasaport numarası veya SSN gibi kişisel olarak tanımlanabilir bilgiler (PII)

* Bu parametrede iletilen verinin [Tür/biçimi](#format-and-data-type)
* Parametre bilgisinin en son güncellendiği tarih ve saat

!!! info "Yanıt parametrelerinin kullanılabilirliği"
    Yanıt parametreleri yalnızca 4.10.1 veya üzeri node kullanıldığında mevcuttur.

<a name="format-and-data-type"></a>
### Biçim ve veri türü

**Type** sütununda, Wallarm trafik analizi yoluyla tanımlanan veri biçimini veya belirgin değilse genel bir veri türünü belirtir.

Wallarm `Int32`, `Int64`, `Float`, `Double`, `Datetime`, `IPv4`/`IPv6` gibi çeşitli veri biçimlerini tespit etmeye çalışır. Bir değer tanınan hiçbir veri biçimiyle uyumlu değilse, Wallarm onu `Integer`, `Number`, `String` veya `Boolean` gibi genel bir veri türü altında sınıflandırır.

Bu veriler, her parametrede beklenen biçimde değerlerin iletildiğini kontrol etmeye olanak tanır. Tutarsızlıklar, örneğin bir saldırı veya API’nizin taranmasının sonucu olabilir:

* `String` değerleri `IP` olan alana iletilir
* Değeri `Int32`’den büyük olmaması gereken bir alana `Double` değerleri iletilir

### Değişkenlik

URL’ler, kullanıcı kimliği gibi çeşitli öğeler içerebilir, örneğin:

* `/api/articles/author/author-a-0001`
* `/api/articles/author/author-a-1401`
* `/api/articles/author/author-b-1401`

**API Discovery** modülü, böyle öğeleri uç nokta yollarında `{parameter_X}` biçiminde birleştirir; bu nedenle yukarıdaki örnek için 3 ayrı uç nokta yerine tek bir uç nokta olur:

* `/api/articles/author/{parameter_1}`

Uç noktaya tıklayarak parametrelerini genişletin ve değişken parametre için hangi türün otomatik olarak tespit edildiğini görüntüleyin.

![API Discovery - Yolda değişkenlik](../images/about-wallarm-waf/api-discovery/api-discovery-variability-in-path-4.10.png)

Algoritmanın yeni trafiği analiz ettiğini unutmayın. Bir noktada birleştirilmesi gereken adresler görür de bunun henüz gerçekleşmediğini fark ederseniz, biraz zaman tanıyın. Daha fazla veri geldikçe, sistem yeni bulunan desenle eşleşen yeterli sayıda adres olduğunda uç noktaları birleştirecektir.

## Uç nokta aktiviteleri

### Saldırılar

Son 7 gündeki API uç noktalarına yapılan saldırıların sayısı **Hits** sütununda görüntülenir. Yalnızca saldırıya uğramış uç noktaları göstermek için filtrelerde: **Others** → **Attacked endpoints** seçimini yapabilirsiniz.

Bir uç noktaya yönelik saldırıları görmek için **Hits** sütunundaki sayıya tıklayın:

![API uç noktası - olayları aç](../images/about-wallarm-waf/api-discovery/endpoint-open-events.png)

[filtre uygulanmış şekilde](../user-guides/search-and-filters/use-search.md) **Attacks** bölümü görüntülenecektir:

```
attacks last 7 days endpoint_id:<YOUR_ENDPOINT_ID>
```

Ayrıca, bir uç noktanın URL’sini panoya kopyalayıp olayları aramak için kullanabilirsiniz. Bunu yapmak için, ilgili uç nokta menüsünden **Copy URL** seçin.

### Tüm aktiviteler

Uç noktayla ilgili tüm isteklerin sayısı **Requests** sütununda görüntülenir. Bu sayıya tıklayarak, son bir haftadaki bu istekleri içeren kullanıcı oturumlarının listesiyle [**API Sessions**](../api-sessions/overview.md) bölümünü açın.

Bulunan her oturum içinde, başlangıçta yalnızca uç noktanıza yönelik istekler görüntülenecektir - bağlamı görmek için oturumda uç nokta filtrelemesini kaldırın.

Oturum aktivitesinin yapılandırılmış görünümü, uç noktanızın kötü niyetli ve meşru aktivitelerdeki yerini, hassas iş akışlarıyla ilişkisini ve gerekli koruma önlemlerini anlamaya yardımcı olur.

## API uç noktaları için kural oluşturma

API envanterindeki herhangi bir uç noktadan hızlıca yeni bir [özel kural](../user-guides/rules/rules.md) oluşturabilirsiniz: 

1. İlgili uç nokta menüsünden **Create rule** seçin. Kural oluşturma penceresi görüntülenir. Uç nokta adresi otomatik olarak pencereye ayrıştırılır.
1. Kural oluşturma penceresinde kural bilgilerini belirtin ve ardından **Create**’e tıklayın.

![Uç noktadan kural oluşturma](../images/about-wallarm-waf/api-discovery/endpoint-create-rule.png)

## API envanteri verilerini dışa aktarma

API Discovery arayüzü, geçerli filtrelenmiş uç nokta listesini [OpenAPI v3](https://spec.openapis.org/oas/v3.0.0) spesifikasyonu veya CSV dosyası olarak dışa aktarma seçeneği sunar.

Dışa aktarmak için, Wallarm Console → **API Discovery** içinde **OAS/CSV** seçeneğini kullanın. Şunları göz önünde bulundurun:

* **OAS** için, Wallarm filtrelenmiş uç noktalarla `swagger.json` döndürür. Ayrıca, tekil bir uç nokta menüsünde **Download OAS** düğmesini kullanabilirsiniz.

    İndirilen spesifikasyonu Postman gibi diğer uygulamalarla kullanarak uç noktaların zafiyet ve diğer testlerini gerçekleştirebilirsiniz. Ayrıca, uç noktaların yeteneklerini daha yakından inceleyerek hassas veri işleme ve belgelenmemiş parametrelerin varlığını ortaya çıkarmaya olanak tanır.

* **CSV** için, Wallarm filtrelenmiş uç nokta verilerini, diğer programlara kolayca aktarmayı sağlayan basit metin virgülle ayrılmış biçimde döndürür.

!!! warning "İndirilen Swagger dosyasında API host bilgisi"
    Keşfedilen bir API envanteri birden fazla API hostu içeriyorsa, tüm API hostlarından uç noktalar indirilen dosyaya dahil edilir. Şu anda, API host bilgisi dosyaya dahil edilmemektedir.