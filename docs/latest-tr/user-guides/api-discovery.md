# API Keşfi <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm Konsolunun **API Keşfi** bölümü, [API envanterinizi](../api-discovery/overview.md) yönetmenize ve onun keşfini ince ayar yapmanıza olanak tanır. Bu kılavuz bu bölümün nasıl kullanılacağına dair size yönerge sağlar.

Bu bölüm, sadece aşağıdaki [rollerdeki](../user-guides/settings/users.md#user-roles) kullanıcılar tarafından kullanılabilir:

* **Yönetici** ve **Analizci**, API Keşfi modülü tarafından keşfedilen verileri görüntüleyebilir ve yönetebilir ve API Keşfi yapılandırma bölümüne erişebilir.

    **Global Yönetici** ve **Global Analizci**, çoklu kiracılık özelliğine sahip hesaplarda aynı haklara sahiptir.
* **API Geliştirici**, API Keşfi modülü tarafından keşfedilen verileri görüntüleyebilir ve indirebilir. Bu rol, şirket API'leri hakkında güncel veri elde etmek için sadece Wallarm kullanmayı gerektiren kullanıcıları belirlemeyi sağlar. Bu kullanıcıların **API Keşfi** ve **Ayarlar → Profil** dışında hiçbir Wallarm Konsol bölümüne erişimi yoktur. 

![API Keşfi tarafından keşfedilen uç noktalar](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

!!! info "Varsayılan görünüm: zaman periyodu, sıralama ve gruplama"

    **Zaman periyodu**

    **API Keşfi** bölümünü her açtığınızda:
    
    * API'lerinizin güncel envanterini görürsünüz (tüm keşfedilen uç noktalar)
    * **Değişikliklerden bu yana** filtresi `Son hafta` durumuna geçer, bu da demektir:

        * Sunulan uç noktalar arasından, bu dönem boyunca `Yeni` ve `Değiştirildi` durumlarına sahip olanlar ilgili işaretleri alır
        * Ayrıca, bu süre zarfında `Silindi` durumuna giren uç noktalar gösterilir

    API Keşfinin varsayılan olarak ne gösterdiğini anlamak için [bu örneğe](#example) bakın.

    Diğer zaman aralıklarını manuel olarak seçebilirsiniz.

    **Sıralama ve gruplama**

    Varsayılan olarak, uç noktalar host/uç nokta adlarına göre sıralanır (ve hostlara göre gruplanır). **Vuruşlar** veya **Risk** durumuna göre sıralarsanız, gruplama gider - varsayılana geri dönmek için host/uç nokta sütununu tekrar tıklamanız gerekir.

## Uç noktaları filtreleme

Bir dizi API uç noktası filtresi arasından, analiz amacınıza uygun olanları seçebilirsiniz, örneğin:

* Yalnızca saldırıya uğramış uç noktaları, vuruş sayısına göre sıralayabilirsiniz.
* Son hafta içinde değiştirilmiş veya yeni keşfedilmiş ve PII verisi işleyen uç noktaları bulun. Bu tür bir istek, API'lerinizdeki kritik değişikliklerle güncel kalmanıza yardımcı olabilir.
* PUT veya POST çağrıları ile sunucunuza veri yüklemek için kullanılan uç noktaları bulun. Bu tür uç noktalar sıklıkla saldırı hedefi olduğundan, iyi bir şekilde korunmaları gerekir. Bu tür bir istemi kullanarak, uç noktaların ekibinize bilinir olduğunu ve saldırılara karşı iyi bir şekilde korunduğunu kontrol edebilirsiniz.
* Müşterilerin banka kartı verisini işleyen uç noktaları bulun. Bu talep ile, hassas verilerin yalnızca güvenceye alınmış uç noktalar tarafından işlendiğini kontrol edebilirsiniz.
* Eski bir API sürümünün uç noktalarını bulun (örneğin, `/v1` araması yaparak) ve bunların müşteriler tarafından kullanılmadığından emin olun.
* Hassas veri işleme ve yüksek risk seviyesinde aktif zafiyetlere sahip en savunmasız uç noktaları bulun. Yüksek risk seviyesindeki zafiyetlerin istismarı, saldırganların sistem ile birçok kötü niyetli işlem yapmasını sağlar, bu da uç noktanın işlediği/sakladığı hassas verilerin çalınmasını içerir.

Tüm filtrelenmiş veriler, ek analiz için OpenAPI v3'e aktarılabilir.

## Uç noktası parametrelerinin görüntülenmesi

<a name="params"></a>Uç noktasını tıklayarak, uç nokta ayrıntılarını, istek istatistiklerini, gerekli ve isteğe bağlı parametreleri ve ilgili veri türlerini de bulabilirsiniz:

![API Keşfi tarafından keşfedilen istek parametreleri](../images/about-wallarm-waf/api-discovery/discovered-request-params.png)

Her parametre bilgisi şunları içerir:

* Parametre adı ve bu parametrenin ait olduğu istek bölümü
* Parametre değişiklikleri hakkında bilgi (yeni, kullanılmayan)
* Bu parametre ile iletilen hassas veri (PII) varlığı ve türü, dahil olmak üzere:

    * IP ve MAC adresleri gibi teknik veriler
    * Gizli anahtarlar ve parolalar gibi giriş kimlik bilgileri
    * Banka kartı numaraları gibi finansal veriler
    * Tıbbi lisans numarası gibi tıbbi veriler
    * Tam ad, pasaport numarası veya SSN gibi kişisel olarak tanımlanabilir bilgiler (PII) 

* Bu parametrede gönderilen verinin [Türü / formatı](../api-discovery/overview.md#parameter-types-and-formats) 
* Parametre bilgisinin en son ne zaman güncellendiği

## API'deki değişiklikleri takip etme

Belirli bir süre zarfında API'deki ne tür [değişikliklerin gerçekleştiğini](../api-discovery/overview.md#tracking-changes-in-api) kontrol edebilirsiniz. Bunu yapmak için, **Değişikliklerden bu yana** filtresinden, uygun dönemi veya tarihi seçin. Uç nokta listesinde aşağıdaki işaretler görüntülenecektir:

* **Yeni**, dönem içinde listeye eklenen uç noktalar için.
* Dönem içinde yeni keşfedilmiş parametrelere sahip olan veya `Kullanılmıyor` durumunu elde eden uç noktalar için **Değiştirildi**. Uç nokta ayrıntılarında, bu tür parametreler ilgili bir işaretle belirtilecektir.

    * Bir parametre, dönem içinde keşfedildiği durumda `Yeni` durumunu alır.
    * Bir parametre, 7 gün boyunca herhangi bir veri iletmemesi durumunda `Kullanılmıyor` durumunu alır. 
    * Daha sonra `Kullanılmıyor` durumundaki bir parametre tekrar veri ilettiyse, `Kullanılmıyor` durumunu kaybeder.

* Dönem içinde `Kullanılmıyor` durumunu elde eden uç noktalar için **Kullanılmıyor**.

    * Bir uç nokta, 7 gün boyunca talep edilmediği durumda (yanıtta 200 koduyla) `Kullanılmıyor` durumunu alır.
    * Daha sonra ‘Kullanılmıyor’ durumundaki bir uç nokta tekrar talep edildiyse (yanıtta 200 koduyla), `Kullanılmıyor` durumunu kaybeder.

Hangi dönemin seçildiğine bakılmaksızın, eğer **Yeni**, **Değiştirildi** veya **Kullanılmıyor** işaretiyle hiçbir şey vurgulanmazsa, bu API'deki o döneme ait hiçbir değişiklik olmadığı anlamına gelir.

![API Keşfi - değişiklikleri takip et](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

!!! info "Varsayılan dönem"
    **API Keşfi** bölümünü her açtığınızda, **Değişikliklerden bu yana** filtresi `Son hafta` durumuna gelir, bu da yalnızca son haftada gerçekleşen değişikliklerin vurgulandığı anlamına gelir.

**Değişikliklerden bu yana** filtresini kullanmak, yalnızca seçilen dönemde değişiklik gösteren uç noktaları vurgular, ancak değişiklik göstermeyen uç noktaları filtrelemez.

**API'deki Değişiklikler** filtresi farklı çalışır ve seçilen dönemde değişiklik gösteren **yalnızca** uç noktaları gösterir ve geri kalanları filtreler.

<a name="example"></a>Örneği dikkate alın: Diyelim ki bugünün API'nizde 10 uç nokta var (12 idi, ancak 3'ü 10 gün önce kullanılmayan olarak işaretlendi). 10 uç noktanın 1'i dün eklendi, 2'sinde parametrelerinde 5 gün önce birinde ve 10 gün önce diğerinde değişiklikler oldu:

* Bugün **API Keşfi** bölümünü her açtığınızda, **Değişikliklerden bu yana** filtresi `Son hafta` durumuna geçer; sayfa 10 uç nokta gösterir, **Değişiklikler** sütununda 1'i için **Yeni** işareti, 1'i için **Değiştirildi** işareti olur.
* **Değişikliklerden bu yana** 'yı `Son 2 hafta` ya çevirin - 13 uç nokta görüntülenir, **Değişiklikler** sütununda 1'i için **Yeni** işareti, 2'si için **Değiştirildi** işareti, ve 3'ü için **Kullanılmıyor** işareti olur.
* **API'deki Değişiklikler** 'i `Kullanılmayan uç noktalar` olarak ayarlayın - 3 uç nokta görüntülenir, hepsinde **Kullanılmıyor** işareti bulunur.
* **API'deki Değişiklikler** 'i `Yeni uç noktalar + Kullanılmayan uç noktalar` olarak değiştirin - 4 uç nokta görüntülenir, 3'ünde **Kullanılmıyor** işareti, ve 1'inde **Yeni** işareti bulunur.
* **Değişikliklerden bu yana** 'yı `Son hafta` ya geri döndürün - 1 uç nokta görüntülenir, bunun üzerinde **Yeni** işareti olur.

## Risk skoru ile çalışma

[Risk skoru](../api-discovery/overview.md#endpoint-risk-score), hangi uç noktaların muhtemelen bir saldırı hedefi olacağını ve dolayısıyla güvenlik çabalarınızın odak noktası olması gerektiğini anlamanıza yardımcı olur.

Risk skoru `1` (en düşük) ila `10` (en yüksek) arasında olabilir:

| Değer | Risk Seviyesi | Renk |
| --------- | ----------- | --------- |
| 1'den 3'e | Düşük | Gri |
| 4'ten 7'ye | Orta | Turuncu |
| 8'den 10'a | Yüksek | Kırmızı |

* `1`, bu uç nokta için risk faktörü olmadığı anlamına gelir.
* `Kullanılmıyor` durumundaki uç noktalar için risk skoru görüntülenmez (`Yok`).
* **Risk** sütununda risk skoruna göre sıralayın.
* **Risk Skoru** filtresini kullanarak `Yüksek`, `Orta` veya `Düşük` 'ü filtreleyin.

!!! info "Risk skoru hesaplama ayarları"
    Varsayılan olarak, API Keşfi modülü, her uç nokta için risk skorunu, iyi kanıtlanmış risk faktörü ağırlıkları üzerinden otomatik olarak hesaplar. Risk skoru tahminini faktörlerin önemine dair anlayışınıza uyacak şekilde uyarlamak için, her faktörün ağırlığını ve bir risk skoru hesaplama yöntemini [ayarlayabilirsiniz](#customizing-risk-score-calculation).

Risk skoru için neyin neden olduğunu ve riski nasıl azaltabileceğinizi anlamak için uç noktanın detaylarına gidin:

![API Keşfi - Risk skoru](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

## API uç noktalarındaki saldırıları izleme

API uç noktalarındaki saldırıların sayısı, son 7 gün için **Vuruşlar** sütununda gösterilir.

Yapabilecekleriniz:

* Saldırıya uğramış uç noktaların sadece talep edilmesi için filtrelerde: **Diğerleri → Saldırıya Uğrayan Uç Noktalar** 'ı seçin.
* **Vuruşlar** sütununa göre sıralayın.

Belirli bir uç noktaya yapılan saldırıları görmek için, **Vuruşlar** sütunundaki sayıyı tıklayın:

![API uç noktası - olayları aç](../images/about-wallarm-waf/api-discovery/endpoint-open-events.png)

[Uygulanan filtre](../user-guides/search-and-filters/use-search.md) ile **Olaylar** bölümü görüntülenir:

```
last 7 gün attacks endpoint_id:<SİZİN_UÇ_NOKTA_ID'NİZ>
```

Ayrıca, uç noktanın URL'sini panoya kopyalayabilir ve olayları aramak için kullanabilirsiniz. Bunu yapmak için, bu uç noktanın menüsünden **URL'yi Kopyala** 'yı seçin.

## API envanteri ve kuralları

API envanterinden herhangi bir uç noktadan yeni bir [özel kural](../user-guides/rules/rules.md) hızlıca oluşturabilirsiniz:

1. Bu uç nokta menüsünden **Kural Oluştur** 'u seçin. Kural oluşturma penceresi görüntülenir. Uç noktası adresi otomatik olarak pencereye ayrıştırılır.
1. Kural oluşturma penceresinde, kural bilgilerini belirtin ve ardından **Oluştur** 'u tıklayın.

![Uç noktadan kural oluştur](../images/about-wallarm-waf/api-discovery/endpoint-create-rule.png)

## Gölge, öksüz ve zombi API'yi gösterme

**API Keşfi** modülü, mactual kayıtlı trafik ile [müşterilerin tarafından verilen özelliklerin](../api-discovery/rogue-api.md) karşılaştırılması sonucunda korsan (gölge, öksüz ve zombi) API'leri otomatik olarak açığa çıkarır. Wallarm tarafından keşfedilen uç noktalar arasında [korsan API'leri](../api-discovery/overview.md#shadow-orphan-and-zombie-apis) göstermek için:

* **Karşılaştırılanları...** filtresini kullanarak özellik karşılaştırmalarını seçin - yalnızca onlar için korsan API'ler, **Sorunlar** sütununda özel işaretler ile vurgulanır.

    ![API Keşfi - korsan API'yi vurgulama ve filtreleme](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

* **Korsan API'lar** filtresini kullanarak, yalnızca seçilen karşılaştırmalar ile ilişkili olan gölge, öksüz ve/veya zombi API'leri görmek ve geri kalan uç noktaları filtrelemek.

Uç nokta, sonuçta belirli bir uç noktanın öksüz veya gölge API olarak tanımlanır. Gerçek trafik ile bazı özelliklerin karşılaştırılması sonucunda (birkaç tanesi olabilir), onlar uç nokta ayrıntılarından, **Özellik çatışmaları** bölümünde listelenecektir. Uç nokta, önceki ve mevcut özellik sürümleri ile gerçek trafik karşılaştırmasının sonucu olarak zombi olarak tanımlanır. 

Gölge API'ler de riskli uç noktalar arasında [API Keşfi Gösterge Panosu](../user-guides/dashboards/api-discovery.md)'nda görüntülenir.

## API envanterinizin OpenAPI özelliklerinin indirilmesi (OAS)

API Keşfi kullanıcı arayüzü, bir API uç noktasını veya Wallarm tarafından keşfedilen tüm bir API'nin [OpenAPI v3](https://spec.openapis.org/oas/v3.0.0) özelliklerini indirme seçeneği sunar.

* API envanteri sayfasındaki **OAS indir** butonu, tüm envanter için ya da indirme öncesinde herhangi bir filtre uygulanmışsa yalnızca filtrelenen veri için `swagger.json` döndürür.

    İndirilen veri ile, Wallarm'ın keşiflerine kıyasla özelliklerinizle uyuşmayan (Gölge API) ve kullanılmayan uç noktaları (Zombi API) belirleyebilirsiniz.

    !!! warning "İndirilen Swagger dosyasındaki API host bilgisi"
        Keşfedilen bir API envanteri birkaç API sunucusu içeriyorsa, tüm API sunuculardan uç noktalar indirilen Swagger dosyasına dahil edilir. Şu anda, API sunucusu bilgisi dosyada bulunmamaktadır.

* Bir bireysel uç nokta menüsündeki **OAS indir** butonu, seçilen uç nokta için `swagger.json` döndürür.

    İndirilen özelliği Postman gibi diğer uygulamalarla birlikte kullanarak, uç nokta zafiyetleri ve diğer testleri gerçekleştirebilirsiniz. Ayrıca, hassas verilerin işlenmesini ve belgelenmemiş parametrelerin varlığını ortaya çıkarmak için uç noktanın yeteneklerini daha yakından incelemenize olanak sağlar.

## Otomatik BOLA koruması 

Wallarm, **API Keşfi** modülü tarafından keşfedilenler arasında, BOLA saldırılarına karşı savunmasız olan uç noktaları [otomatik olarak keşfedebilir ve koruyabilir](../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery). Bu seçenek etkinleştirilirse, korunan uç noktalar API envanterinde ilgili simgeyle vurgulanır, örn.:

![BOLA tetiği](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

API uç noktalarını BOLA otomatik koruma durumuna göre filtreleyebilirsiniz. İlgili parametre **Diğerleri** filtresi altında mevcuttur.

## API Keşfini yapılandırma

**API Keşfi** bölümünde **API Keşfi Yapılandır** düğmesini tıklayarak, API keşfini ince ayarlama seçeneklerine, örneğin API keşfi için uygulamaları seçme ve risk skoru hesaplamasını özelleştirme gibi, geçersiniz.

### API Keşfi için uygulamaların seçilmesi

Eğer [API Keşfi](../api-discovery/overview.md) aboneliği şirket hesabınız için satın alınmışsa, Wallarm Konsolu → **API Keşfi** → **API Keşfi Yapılandır** ile API Keşfi ile trafik analizini etkinleştirebilir/devredışı bırakabilirsiniz.

API Keşfi'ni tüm uygulamalar veya yalnızca seçilenler için etkinleştir/devre dışı bırakabilirsiniz.

![API Keşfi – Ayarlar](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

**Ayarlar** → **[Uygulamalar](settings/applications.md)** 'da yeni bir uygulama eklediğinizde, **API Keşfi** için uygulama listesine otomatik olarak **devre dışı** durumda eklenir.

### Risk skoru hesaplamasını özelleştirme

[Risk skoru](../api-discovery/overview.md#endpoint-risk-score) hesaplamasında, her faktörün ağırlığını ve hesaplama yöntemini yapılandırabilirsiniz.

Varsayılanlar: 

* Hesaplama yöntemi: `Tüm kriterlerden en yüksek ağırlığı endpoint risk skoru olarak kullanın`.
* Varsayılan faktör ağırlıkları:

    | Faktör | Ağırlık |
    | --- | --- |
    | Aktif zafiyetler | 9 |
    | Potansiyel olarak BOLA'ya savunmasız | 6 |
    | Hassas veri içeren parametreler | 8 |
    | Sorgu ve gövde parametrelerinin sayısı | 6 |
    | XML / JSON nesneleri kabul eden | 6 |
    | Sunucuya dosya yükleme yeteneği olan | 6 |

Risk skorunun nasıl hesaplanacağını değiştirmek için:

1. **API Keşfi** bölümünde **API Keşfi Yapılandır** düğmesini tıklayın.
1. Hesaplama yöntemini seçin: en yüksek veya ortalama ağırlık.
1. Gerekirse, bir risk skoru üzerinde etkili olmasını istemediğiniz faktörleri devre dışı bırakın.
1. Kalanları için ağırlığı ayarlayın.

    ![API Keşfi - Risk skoru ayarı](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score-setup.png)
1. Değişiklikleri kaydedin. Wallarm, yeni ayarlara uygun olarak uç noktalarınız için risk skorunu birkaç dakika içinde yeniden hesaplar.