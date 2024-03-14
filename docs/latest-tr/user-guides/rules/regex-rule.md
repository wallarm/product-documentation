[link-regex]:       https://github.com/yandex/pire

[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[img-regex-example2]:       ../../images/user-guides/rules/regex-rule-2.png
[img-regex-id]:             ../../images/user-guides/rules/regex-id.png

# Kullanıcı Tanımlı Algılama Kuralları

Bazı durumlarda, saldırıları manuel olarak algılamak için bir imza eklemek veya *sanal bir yama* yaratmak faydalı olabilir. Dolayısıyla, Wallarm saldırıları algılamak için düzenli ifadeler kullanmaz, fakat kullanıcıların düzenli ifadelere dayalı ek imzalar eklemesine izin verir.

## Yeni Bir Algılama Kuralı Ekleme

Bunu yapmak için, *Regexp ile saldırı belirteci oluştur* kuralını oluşturmanız ve alanları doldurmanız gerekiyor:

* *Düzenli İfade*: Düzenli ifade (imza). İfadenin takibenki parametrenin değeriyle eşleşirse, bu talep bir saldırı olarak algılanır. Düzenli ifadelerin sözdizimi ve özellikleri, [kuralların eklenmesi talimatlarında](add-rule.md#condition-type-regex) ayrıntılı olarak açıklanmıştır.

    !!! warning "Kuraldaki belirtilen düzenli ifadenin değiştirilmesi"
        **Regexp ile saldırı belirteci oluştur** tipindeki mevcut bir kuralın düzenli ifadesini değiştirmek, önceki ifadeyi kullanan [**Regexp tabanlı saldırı tespitini devre dışı bırak**](#partial-disabling-of-a-new-detection-rule) kurallarının otomatik olarak silinmesine neden olur.

        Yeni bir düzenli ifadeyle saldırı tespitini devre dışı bırakmak için, lütfen yeni düzenli ifade belirtilen yeni bir **Regexp tabanlı saldırı tespitini devre dışı bırak** kuralı oluşturun.

* *Deneysel*: Bu bayrak, düzenli bir ifadenin tetiklenmesini bloklamadan güvenli bir şekilde kontrol etmenizi sağlar. İstekler, filtre düğümü engelleme moduna ayarlandığında bile engellenmez. Bu istekler, deneysel yöntemle algılanan saldırılar olarak kabul edilir ve varsayılan olarak olay listesinden gizlenir. Bunlara `deneysel saldırılar` arama sorgusu kullanılarak erişilebilir.

* *Saldırı*: İsteğin parametre değeri düzenli ifadeyle eşleştiğinde algılanacak olan saldırı türü.

* *bu isteğin bu bölümünde*: Sistemin ilgili saldırıları algılaması gereken isteğin neresini belirler.

    --8<-- "../include-tr/waf/features/rules/request-part-reference.md"

### Örnek: Yanlış X-Authentication Başlığına Sahip Tüm İstekleri Engelleme

**Eğer** aşağıdaki şartlar yerine getirilirse:

* uygulama *example.com* domaininde erişilebilir
* uygulama kullanıcı kimlik doğrulaması için *X-Authentication* başlığını kullanır
* başlık formatı, 32 hex semboldür

**O zaman**, yanlış format belirteçleri reddetmek için bir kural oluşturmak:

1. *Kurallar* sekmesine gidin
2. `example.com/**/*.*` için dalını bulun ve *Kural ekle* tıklayın
3. *Düzenli bir ifade temelinde bir saldırı olarak tanımla* seçin
4. *Regex* değerini `^(.{0,31}|.{33,}|[^0-9a-fA-F]+)$` olarak ayarlayın
5. *Saldırı* türü olarak `Sanal yama` seçin
6. Noktayı `Header X-AUTHENTICATION` olarak ayarlayın
7. *Oluştur* tıklayın

![Regex rule first example][img-regex-example1]

### Örnek: `class.module.classLoader.*` gövde parametrelerine sahip tüm istekleri engelle

[Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html) (Spring4Shell) 'deki 0-day zafiyeti, aşağıdaki gövde parametrelerine belirli zararlı yüklerin enjekte edildiği POST isteğini gönderme yoluyla sömürülebilir:

* `class.module.classLoader.resources.context.parent.pipeline.first.pattern`
* `class.module.classLoader.resources.context.parent.pipeline.first.suffix`
* `class.module.classLoader.resources.context.parent.pipeline.first.directory`
* `class.module.classLoader.resources.context.parent.pipeline.first.prefix`
* `class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat`

Zafiyetli Spring Core Framework'ü kullanıyorsanız ve Wallarm düğüm [modu](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) engelleme modundan farklıysa, zafiyetin sömürülmesini sanal bir yama kullanarak önleyebilirsiniz. Aşağıdaki kural, listelenen gövde parametreleri olan tüm istekleri, izleme ve güvenli engelleme modlarında bile engelleyecektir:

![Spesifik post parametreleri için sanal yama](../../images/user-guides/rules/regexp-rule-post-params-spring.png)

Düzenli ifade alanı değeri:

```bash
(class[.]module[.]classLoader[.]resources[.]context[.]parent[.]pipeline[.]first[.])(pattern|suffix|directory|prefix|fileDateFormat)
```

Engelleme [modunda](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) çalışan Wallarm düğümü, bu tür zafiyet sömürme girişimlerini varsayılan olarak engeller.

Spring Cloud Function bileşeni de aktif bir zafiyete (CVE-2022-22963) sahip. Bu bileşeni kullanıyorsanız ve Wallarm düğüm modu engelleme modundan farklıysa, aşağıda tarif edildiği gibi sanal bir yama oluşturun.

### Örnek: `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` başlığı olan tüm istekleri engelle

Spring Cloud Function bileşeninde aktif bir zafiyet (CVE-2022-22963) bulunuyor ve `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` veya `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION` başlığına zararlı yükler enjekte edilerek sömürülebiliyor.

Bu bileşeni kullanıyorsanız ve Wallarm düğüm [modu](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) engelleme modundan farklıysa, zafiyetin sömürülmesini sanal bir yama kullanarak önleyebilirsiniz. Aşağıdaki kural, `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` başlığı içeren tüm istekleri engelleyecektir:

![Belirli bir başlık için sanal yama](../../images/user-guides/rules/regexp-rule-header-spring.png)

!!! info "`CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION` başlığı olan istekleri engelleme"
    Bu kural, `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION` başlığı olan istekleri engellemez, ancak NGINX varsayılan olarak bu başlık olan istekleri geçersiz olanlar olarak atar.

Engelleme [modunda](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) çalışan Wallarm düğümü, bu tür zafiyet sömürme girişimlerini varsayılan olarak engeller.

[Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html) (Spring4Shell) içinde de bir 0-day zafiyet mevcuttur. Sömürülme girişimlerini nasıl engelleyeceğinizi [düzenli ifadelere dayalı sanal yama](#example-block-all-requests-with-the-classmoduleclassloader-body-parameters) ile öğrenin.

## Yeni Bir Algılama Kuralını Kısmen Devre Dışı Bırakma

Oluşturulan kural, belirli bir dal için kısmen devre dışı bırakılmalıysa, bunu *Regexp tabanlı saldırı tespitini devre dışı bırak* kuralını oluşturarak kolayca yapabiliriz:

- *Düzenli ifade*: Daha önce oluşturulan ve görmezden gelinmesi gereken düzenli ifadeler.

    !!! info "Regular expression değiştirildiğinde kuralın davranışı"
        **Regexp tabanlı saldırı belirteci oluştur** tipindeki mevcut bir kuralın düzenli ifadesini değiştirmek, önceki ifadeyi kullanan **Regexp tabanlı saldırı tespitini devre dışı bırak** kurallarının otomatik olarak silinmesine neden olur.

        Yeni bir düzenli ifadeyle saldırı tespitini devre dışı bırakmak için, lütfen yeni düzenli ifade belirtilen yeni bir **Regexp tabanlı saldırı tespitini devre dışı bırak** kuralı oluşturun.

- *bu isteğin bu bölümünde*: Bir istisna ayarı gerektiren parametreyi gösterir.

**Örnek: Belirli URL için Yanlış X-Authentication Başlığınına İzin Ver**

Diyelim ki, `example.com/test.php` adresinde bir scriptiniz var ve onun için belirteçlerin biçimini değiştirmek istiyorsunuz.

İlgili kuralı oluşturmak için:

1. *Kurallar* sekmesine gidin
1. `example.com/test.php` için dalını bulun veya oluşturun ve *Kural ekle* tıklayın
1. *Regexp tabanlı saldırı tespitini devre dışı bırak* seçin
1. Devre dışı bırakmak istediğiniz düzenli ifadeyi seçin
1. Noktayı `Header X-AUTHENTICATION` olarak ayarlayın
1. *Oluştur* tıklayın

![Regex rule second example][img-regex-example2]

## Kuralı Oluşturmak için API Çağrısı

Regexp tabanlı bir saldırı belirteci oluşturmak için, Wallarm Konsol UI'sını kullanmanın yanı sıra, Wallarm API'sini doğrudan [çağırabilirsiniz](../../api/overview.md). Aşağıda ilgili API çağrısının örneklerini bulabilirsiniz.

Aşağıdaki istek, `^(~(44[.]33[.]22[.]11))$` regexp'ine dayalı özel saldırı belirteci oluşturacak.

Eğer `MY.DOMAIN.COM` alanından gelen isteklere `X-FORWARDED-FOR: 44.33.22.11` HTTP başlığı varsa, Wallarm düğümü bunları tarayıcı saldırıları olarak kabul edecek ve eğer ilgili [filtreleme modu](../../admin-en/configure-wallarm-mode.md) ayarlanmışsa, saldırıları engelleyecektir.

--8<-- "../include-tr/api-request-examples/create-rule-scanner.md"