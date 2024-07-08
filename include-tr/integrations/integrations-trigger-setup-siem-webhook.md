### Adım 1: Koşul Seçimi

Bildirim için aşağıdaki koşullar mevcuttur:

* [Saldırıların](../../glossary-en.md#attack) sayısı ([özel düzenli ifadeler](../rules/regex-rule.md) üzerine kurulan deneyimsel saldırılar sayılmaz)
* [Hitlerin](../../glossary-en.md#hit) sayısı bunlar dışında:

    * [Özel düzenli ifadeye](../rules/regex-rule.md) dayalı olarak tespit edilen deneyimsel hitler. Deneyimsel olmayan hitler sayılır.
    * [Örnekte](../events/analyze-attack.md#sampling-of-hits) kaydedilmeyen hitler.
* Olayların sayısı
* Kara listeye alınan IP
* [API'deki değişiklikler](../../api-discovery/overview.md#tracking-changes-in-api)
* Kullanıcı eklendi

### Adım 2: Filtreler Eklemek

Filtreler, koşul detaylandırması için kullanılır. Aşağıdaki filtreler mevcuttur:

* **Tür**, isteğin içinde tespit edilen saldırının [türü](../../attacks-vulns-list.md) veya isteğin yönlendirildiği açıklığın türüdür.
* **Uygulama**, isteği alan veya olayın tespit edildiği [uygulama](../settings/applications.md)dır.
* **IP**, isteğin gönderildiği IP adresidir.

    Filtre sadece tek IP'leri bekler, alt ağlara, konumlarına ve kaynak türlerine izin vermez.
* **Alan adı**, isteği alan veya olayın tespit edildiği alan adıdır.
* **Yanıt durumu**, isteğe döndürülen yanıt kodudur.
* **Hedef**, saldırının hedeflendiği veya olayın tespit edildiği bir uygulama mimarisi parçasıdır. Aşağıdaki değerleri alabilir: `Server`, `Client`, `Database`.

Wallarm Console arayüzünde bir veya daha fazla filtre seçin ve onlara değerler atayın.

### Adım 3: Entegrasyon Seçimi

Bu aşamada, seçilen uyarının gönderilmesi gereken entegrasyonu seçersiniz. Birkaç entegrasyonu aynı anda seçebilirsiniz.

![Entegrasyon seçme](../../images/user-guides/triggers/select-integration.png)

### Adım 4: Tetiği Kaydetmek

1. Tetik oluşturma modal dialogunda **Oluştur** düğmesine tıklayın.
2. İsteğe bağlı olarak, tetiğin adını ve açıklamasını belirtin ve **Tamam** düğmesine tıklayın.

Eğer tetik adı ve açıklaması belirtilmezse, tetik `Yeni tetikleyici <kullanıcı_adı>, <oluşturma_tarihi>` adıyla ve boş bir açıklamayla oluşturulur.