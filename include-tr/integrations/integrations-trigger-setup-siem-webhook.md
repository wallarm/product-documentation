### Adım 1: Koşul seçimi

Bildirim için aşağıdaki koşullar mevcuttur:

* Belirli bir zaman aralığı (gün, saat vb.) başına [saldırıların](../../../glossary-en.md#attack), [hits](../../../glossary-en.md#hit) veya incidents sayısı belirlenen sayıyı aşıyor

    !!! info "Sayılmayanlar"
        * Saldırılar için: 
            * [Özel düzenli ifadelere](../../../user-guides/rules/regex-rule.md) dayanan deneysel saldırılar.
        * hits için:
            * [Özel düzenli ifadelere](../../../user-guides/rules/regex-rule.md) dayanan deneysel hits.
            * [Örneklemde](../../events/grouping-sampling.md#sampling-of-hits) kaydedilmeyen Hits.

* Yasaklı IP
* [API'deki değişiklikler](../../about-wallarm/api-discovery.md#tracking-changes-in-api)
* Kullanıcı eklendi

### Adım 2: Filtre ekleme

Filtreler, koşulu ayrıntılandırmak için kullanılır. Şu filtreler mevcuttur:

* **Type**, istekte tespit edilen saldırının [türü](../../attacks-vulns-list.md) veya isteğin yöneltildiği güvenlik açığı türüdür.
* **Application**, isteği alan ya da bir incident tespit edilen [uygulamadır](../settings/applications.md).
* **IP**, isteğin gönderildiği IP adresidir.

    Bu filtre yalnızca tekil IP'leri bekler; alt ağlara, konumlara ve kaynak türlerine izin vermez.
* **Domain**, isteği alan veya bir incident tespit edilen alan adıdır.
* **Response status**, istek için döndürülen yanıt kodudur.
* **Target**, saldırının yöneltildiği veya incident'in tespit edildiği uygulama mimarisi parçasıdır. Aşağıdaki değerleri alabilir: `Server`, `Client`, `Database`.

Wallarm Console arayüzünde bir veya daha fazla filtre seçin ve bunlar için değerleri ayarlayın.

### Adım 3: Entegrasyonu seçme

Bu adımda, seçilen uyarının gönderileceği entegrasyonu seçersiniz. Aynı anda birden fazla entegrasyon seçebilirsiniz.

![Bir entegrasyon seçme](../../images/user-guides/triggers/select-integration.png)

### Adım 4: Tetikleyiciyi kaydetme

1. Tetikleyici oluşturma modal iletişim kutusunda **Create** düğmesine tıklayın.
2. İsteğe bağlı olarak tetikleyicinin adını ve açıklamasını belirtin ve **Done** düğmesine tıklayın.

Tetikleyici adı ve açıklaması belirtilmezse, tetikleyici `New trigger by <username>, <creation_date>` adıyla ve boş bir açıklamayla oluşturulur.