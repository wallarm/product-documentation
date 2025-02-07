[link-regex]:               https://github.com/yandex/pire
[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[img-regex-example2]:       ../../images/user-guides/rules/regex-rule-2.png
[img-regex-id]:             ../../images/user-guides/rules/regex-id.png
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# Özel Saldırı Tespit Cihazları

Wallarm, normal ifadelerle tanımlanan kendi saldırı işaretlerinizi belirlemeniz için **Create regexp-based attack indicator** [kuralını](../../user-guides/rules/rules.md) sağlar.

## Kural Oluşturma ve Uygulama

Kendi saldırı tespit cihazınızı ayarlamak ve uygulamak için:

--8<-- "../include/rule-creation-initial-step.md"
1. **Mitigation controls** → **Custom attack detector** seçin.
1. **If request is** bölümünde, kuralın uygulanacağı kapsamı [tanımlayın](rules.md#configuring).
1. Saldırı göstergesi parametrelerinizi ayarlayın:

    * **Regular expression** - düzenli ifade (imza). Aşağıdaki parametrenin değeri ifadeyle eşleşiyorsa, o istek saldırı olarak tespit edilir. Düzenli ifadelerin sözdizimi ve özellikleri [rules ekleme talimatlarında](rules.md#condition-type-regex) açıklanmıştır.

        !!! warning "Kurala belirtilen düzenli ifadeyi değiştirme"
            Mevcut **Create regexp-based attack indicator** tipindeki kuralda belirtilen düzenli ifadeyi değiştirmek, önceki ifadeyi kullanan [**Disable regexp-based attack detection**](#partial-disabling) kurallarının otomatik olarak silinmesine neden olur.

            Yeni düzenli ifade ile saldırı tespitini devre dışı bırakmak için, belirtilen yeni düzenli ifadeye sahip yeni bir **Disable regexp-based attack detection** kuralı oluşturun.

    * **Experimental** - bu bayrak, istekleri engellemeden düzenli ifadenin tetiklenmesini güvenli bir şekilde kontrol etmenizi sağlar. Filtre düğümü blocking modunda olsa dahi istekler engellenmeyecektir. Bu istekler, deneysel yöntemle tespit edilmiş saldırılar olarak kabul edilir ve varsayılan olarak olay listesinden gizlenir. 'experimental attacks' arama sorgusuyla erişilebilirler.
    
    * **Attack** - istekteki parametre değeri düzenli ifadeyle eşleştiğinde tespit edilecek saldırı tipi.

1. **In this part of request** bölümünde, saldırı işaretlerini aramak istediğiniz [istek bölümlerini](request-processing.md) belirtin.
1. [Kuralın derlenip filtreleme düğümüne yüklenmesinin tamamlanmasını](rules.md#ruleset-lifecycle) bekleyin.

## Kural Örnekleri

### Yanlış `X-AUTHENTICATION` Başlığına Sahip Tüm İstekleri Engelleme

--8<-- "../include/waf/features/rules/rule-vpatch-regex.md"

### `class.module.classLoader.*` Gövde Parametrelerine Sahip Tüm İstekleri Engelleme

[Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html) (Spring4Shell) içindeki 0-day açığından yararlanmanın yollarından biri, aşağıdaki gövde parametrelerine belirli kötü amaçlı yükler enjekte edilmiş POST isteği göndermektir:

* `class.module.classLoader.resources.context.parent.pipeline.first.pattern`
* `class.module.classLoader.resources.context.parent.pipeline.first.suffix`
* `class.module.classLoader.resources.context.parent.pipeline.first.directory`
* `class.module.classLoader.resources.context.parent.pipeline.first.prefix`
* `class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat`

Savunmasız Spring Core Framework kullanıyorsanız ve Wallarm düğümünün [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) blocking dışında ise, sanal yama kullanarak açığın istismarını önleyebilirsiniz. Aşağıdaki kural, izleme ve güvenli blocking modlarında bile listelenen gövde parametrelerine sahip tüm istekleri engelleyecektir:

![Belirli post parametreleri için sanal yama](../../images/user-guides/rules/regexp-rule-post-params-spring.png)

Düzenli ifade alan değeri şudur:

```bash
(class[.]module[.]classLoader[.]resources[.]context[.]parent[.]pipeline[.]first[.])(pattern|suffix|directory|prefix|fileDateFormat)
```

Blocking [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) de çalışan Wallarm düğümü, bu tür açığın istismar girişimlerini varsayılan olarak engeller.

Spring Cloud Function bileşeninde de (CVE-2022-22963) aktif bir açık bulunmaktadır. Bu bileşeni kullanıyorsanız ve Wallarm düğümünün [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) blocking dışında ise, aşağıda [açıklanan](#block-all-requests-with-class-cloud-function-routing-expression-header) gibi sanal yama oluşturun.

### `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` Başlığına Sahip Tüm İstekleri Engelleme

Spring Cloud Function bileşeninde, `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` veya `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION` başlığına kötü amaçlı yükler enjekte edilerek istismar edilebilen aktif bir açık (CVE-2022-22963) bulunmaktadır.

Bu bileşeni kullanıyorsanız ve Wallarm düğümünün [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) blocking dışında ise, sanal yama kullanarak açığın istismarını önleyebilirsiniz. Aşağıdaki kural, `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` başlığını içeren tüm istekleri engelleyecektir:

![Belirli başlık için sanal yama](../../images/user-guides/rules/regexp-rule-header-spring.png)

!!! info "Blocking requests with the `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION` header"
    Bu kural, `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION` başlığına sahip istekleri engellemez; bunun yerine NGINX, bu başlığa sahip istekleri varsayılan olarak geçersiz sayarak düşürür.

Blocking [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) de çalışan Wallarm düğümü, bu tür açığın istismar girişimlerini varsayılan olarak engeller.

Ayrıca, [Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html) (Spring4Shell) içinde 0-day açığı da mevcuttur. Açığın istismar girişimlerini [reqexp tabanlı sanal yama](#block-all-requests-with-classmoduleclassloader-body-parameters) ile nasıl engelleyeceğinizi öğrenin.

## Kısmi Devre Dışı Bırakma

Oluşturulan kural, belirli bir dal için kısmen devre dışı bırakılacaksa, aşağıdaki alanlarla **Disable regexp-based attack detection** kuralı oluşturarak bu kolayca yapılabilir:

- **Regular expression**: göz ardı edilmesi gereken, daha önce oluşturulmuş düzenli ifadeler.

    !!! warning "Düzenli ifade değiştirildiğinde kuralın davranışı"
        Mevcut [**Create regexp-based attack indicator**](#creating-and-applying-rule) tipindeki kuralda belirtilen düzenli ifadeyi değiştirmek, önceki ifadeyi kullanan **Disable regexp-based attack detection** kurallarının otomatik olarak silinmesine neden olur.

        Yeni düzenli ifade ile saldırı tespitini devre dışı bırakmak için, belirtilen yeni düzenli ifadeye sahip yeni bir **Disable regexp-based attack detection** kuralı oluşturun.

- **in this part of request**: bir istisna ayarlanması gereken parametreyi belirtir.

**Örnek: Belirli bir URL için Yanlış X-Authentication Başlığına İzin Verme**

Diyelim ki `example.com/test.php` adresinde bir betiğiniz var ve token formatını değiştirmek istiyorsunuz.

İlgili kuralı oluşturmak için:

1. **Rules** sekmesine gidin
1. `example.com/test.php` için ilgili dalı bulun veya oluşturun ve **Add rule**'e tıklayın.
1. **Fine-tuning attack detection** → **Disable custom attack detector** seçin.
1. Devre dışı bırakmak istediğiniz düzenli ifadeyi seçin.
1. `Header X-AUTHENTICATION` noktasını ayarlayın.
1. **Create**'e tıklayın.

![Regex rule second example][img-regex-example2]

## Kuralı Oluşturmak İçin API Çağrısı

Regexp tabanlı saldırı göstergesini oluşturmak için, [Wallarm API'sine doğrudan çağrı yapabilirsiniz](../../api/request-examples.md#create-a-rule-to-consider-the-requests-with-specific-value-of-the-x-forwarded-for-header-as-attacks).