### Adım 1: Bir koşul seçme

Bildirim için aşağıdaki koşullar mevcuttur:

* Zaman aralığı (gün, saat, vb.) başına [attacks](../../../glossary-en.md#attack), [hits](../../../glossary-en.md#hit) veya olay sayısının belirlenen değeri aşması

    !!! info "Sayılmayanlar"
        * Saldırılar için: 
            * [Custom regular expressions](../../../user-guides/rules/regex-rule.md) tabanlı deneysel saldırılar.
        * Hits için:
            * [Custom regular expressions](../../../user-guides/rules/regex-rule.md) tabanlı deneysel hitler.
            * [Sample](../../events/grouping-sampling.md#sampling-of-hits) içinde saklanmayan hitler.

* Kara listeye alınmış IP
* [API'deki Değişiklikler](../../about-wallarm/api-discovery.md#tracking-changes-in-api)
* Kullanıcı ekledi

### Adım 2: Filtre ekleme

Filtreler, koşulun detayı için kullanılır. Aşağıdaki filtreler mevcuttur:

* **Tür**; istekte tespit edilen saldırı türü veya isteğin yöneltildiği güvenlik açığı türü ([attacks](../../attacks-vulns-list.md)).
* **Application**; isteği alan veya olayın tespit edildiği [uygulama](../settings/applications.md).
* **IP**; isteğin gönderildiği IP adresidir.

    Bu filtre yalnızca tek IP adresi bekler; alt ağlara, konumlara ve kaynak türlerine izin vermez.
* **Domain**; isteği alan veya olayın tespit edildiği alan adıdır.
* **Response status**; isteğe yanıt olarak döndürülen yanıt kodudur.
* **Target**; saldırının yöneltildiği veya olayın tespit edildiği uygulama mimarisi kısmıdır. Alabilecek değerler: `Server`, `Client`, `Database`.

Wallarm Console arayüzünde bir veya daha fazla filtre seçin ve bu filtreler için değerler belirleyin.

### Adım 3: Entegrasyon seçimi

Bu adımda, seçilen uyarının gönderileceği entegrasyonu belirlersiniz. Aynı anda birden fazla entegrasyon seçebilirsiniz.

![Entegrasyon seçimi](../../images/user-guides/triggers/select-integration.png)

### Adım 4: Tetikleyiciyi kaydetme

1. Tetikleyici oluşturma açılır penceresinde **Create** düğmesine tıklayın.
2. İsteğe bağlı olarak, tetikleyicinin adını ve açıklamasını belirleyin ve **Done** düğmesine tıklayın.

Eğer tetikleyicinin adı ve açıklaması belirtilmemişse, tetikleyici `New trigger by <username>, <creation_date>` adıyla ve boş açıklamayla oluşturulur.