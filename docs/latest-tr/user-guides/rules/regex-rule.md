[link-regex]:               https://github.com/yandex/pire
[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[img-regex-example2]:       ../../images/user-guides/rules/regex-rule-2.png
[img-regex-id]:             ../../images/user-guides/rules/regex-id.png
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# Özel Saldırı Belirleyicileri

Wallarm, düzenli ifadelerle tanımlanan kendi saldırı göstergelerinizi tanımlamanız için **Create regexp-based attack indicator** [kuralını](../../user-guides/rules/rules.md) sağlar.

## Kuralı oluşturma ve uygulama

Kendi saldırı belirleyicinizi ayarlamak ve uygulamak için:

--8<-- "../include/rule-creation-initial-step.md"
1. Mitigation controls → Custom attack detector öğesini seçin.
1. If request is içinde, kuralın uygulanacağı kapsamı [açıklayın](rules.md#configuring).
1. Saldırı göstergesi parametrelerinizi ayarlayın:

    * **Regular expression** - düzenli ifade (imza). Aşağıdaki parametrenin değeri bu ifadeyle eşleşirse, söz konusu istek bir saldırı olarak tespit edilir. Düzenli ifadelerin sözdizimi ve özellikleri [kuralların eklenmesine ilişkin yönergelerde](rules.md#condition-type-regex) açıklanmıştır.

        !!! warning "Kuralda belirtilen düzenli ifadeyi değiştirme"
            **Create regexp-based attack indicator** türündeki mevcut kuralda belirtilen düzenli ifadeyi değiştirmek, önceki ifadeyi kullanan [**Disable regexp-based attack detection**](#partial-disabling) kurallarının otomatik olarak silinmesine yol açar.

            Yeni düzenli ifadeye göre saldırı tespitini devre dışı bırakmak için, yeni düzenli ifadeyi belirterek yeni bir **Disable regexp-based attack detection** kuralı oluşturun.

    * **Experimental** - bu bayrak, istekleri engellemeden bir düzenli ifadenin tetiklenmesini güvenle kontrol etmenizi sağlar. Filtre düğümü blocking mode olarak ayarlansa bile istekler engellenmez. Bu istekler deneysel yöntemle tespit edilen saldırılar olarak kabul edilir ve varsayılan olarak olay listesinden gizlenir. `experimental attacks` arama sorgusunu kullanarak erişebilirsiniz.

    * **Attack** - istekteki parametre değeri düzenli ifadeyle eşleştiğinde tespit edilecek saldırı türü.

1. **In this part of request** bölümünde, saldırı işaretlerini aramak istediğiniz [istek bölümlerini](request-processing.md) belirtin.
1. [kuralın derlenmesinin ve filtreleme düğümüne yüklenmesinin tamamlanmasını](rules.md#ruleset-lifecycle) bekleyin.

## Kural örnekleri

### Yanlış `X-AUTHENTICATION` başlığına sahip tüm istekleri engelleme

--8<-- "../include/waf/features/rules/rule-vpatch-regex.md"

### `class.module.classLoader.*` gövde parametrelerine sahip tüm istekleri engelleme

[Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html) (Spring4Shell) içindeki 0-gün güvenlik açığından yararlanmanın yollarından biri, aşağıdaki gövde parametrelerine belirli kötü amaçlı yükleri enjekte ederek POST isteği göndermektir:

* `class.module.classLoader.resources.context.parent.pipeline.first.pattern`
* `class.module.classLoader.resources.context.parent.pipeline.first.suffix`
* `class.module.classLoader.resources.context.parent.pipeline.first.directory`
* `class.module.classLoader.resources.context.parent.pipeline.first.prefix`
* `class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat`

Savunmasız Spring Core Framework kullanıyorsanız ve Wallarm düğüm [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) değeri blocking dışında ise, sanal yama kullanarak güvenlik açığından yararlanmayı önleyebilirsiniz. Aşağıdaki kural, monitoring ve safe blocking modes durumlarında bile listelenen gövde parametrelerine sahip tüm istekleri engeller:

![Belirli POST parametreleri için sanal yama](../../images/user-guides/rules/regexp-rule-post-params-spring.png)

Regular expression alanının değeri:

```bash
(class[.]module[.]classLoader[.]resources[.]context[.]parent[.]pipeline[.]first[.])(pattern|suffix|directory|prefix|fileDateFormat)
```

Blocking [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) ile çalışan Wallarm düğümü bu tür güvenlik açığından yararlanma girişimlerini varsayılan olarak engeller.

Spring Cloud Function bileşeninde de etkin bir güvenlik açığı (CVE-2022-22963) bulunmaktadır. Bu bileşeni kullanıyorsanız ve Wallarm düğüm mode değeri blocking dışında ise, [aşağıda](#block-all-requests-with-class-cloud-function-routing-expression-header) açıklandığı gibi bir sanal yama oluşturun.

### `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` başlığına sahip tüm istekleri engelleme

Spring Cloud Function bileşeninde, `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` veya `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION` başlığına kötü amaçlı yük enjekte edilerek istismar edilebilen etkin bir güvenlik açığı (CVE-2022-22963) vardır.

Bu bileşeni kullanıyorsanız ve Wallarm düğüm [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) değeri blocking dışında ise, sanal yama kullanarak istismarı önleyebilirsiniz. Aşağıdaki kural, `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` başlığını içeren tüm istekleri engeller:

![Belirli başlık için sanal yama](../../images/user-guides/rules/regexp-rule-header-spring.png)

!!! info "`CLASS.CLOUD.FUNCTION-ROUTING-EXPRESSION` başlıklı istekleri engelleme"
    Bu kural, `CLASS.CLOUD.FUNCTION-ROUTING-EXPRESSION` başlığına sahip istekleri engellemez ancak NGINX bu başlığa sahip istekleri varsayılan olarak geçersiz sayarak düşürür.

Blocking [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) ile çalışan Wallarm düğümü bu tür güvenlik açığından yararlanma girişimlerini varsayılan olarak engeller.

[Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html) (Spring4Shell) içinde ayrıca 0-gün bir güvenlik açığı daha vardır. İstismar girişimlerini [reqexp tabanlı sanal yamayla](#block-all-requests-with-classmoduleclassloader-body-parameters) nasıl engelleyeceğinizi öğrenin.

## Kısmen devre dışı bırakma

Oluşturulan kural belirli bir dal (branch) için kısmen devre dışı bırakılacaksa, aşağıdaki alanlarla **Disable regexp-based attack detection** kuralını oluşturarak kolayca yapılabilir:

- **Regular expression**: yok sayılması gereken daha önce oluşturulmuş düzenli ifadeler.

    !!! warning "Düzenli ifade değiştirildiyse kuralın davranışı"
        [**Create regexp-based attack indicator**](#creating-and-applying-rule) türündeki mevcut kuralda belirtilen düzenli ifadeyi değiştirmek, önceki ifadeyi kullanan **Disable regexp-based attack detection** kurallarının otomatik olarak silinmesine yol açar.

        Yeni düzenli ifadeye göre saldırı tespitini devre dışı bırakmak için, yeni düzenli ifadeyi belirterek yeni bir **Disable regexp-based attack detection** kuralı oluşturun.

- **in this part of request**: istisna tanımlanması gereken parametreyi belirtir.

**Örnek: Belirli bir URL için hatalı X-Authentication başlığına izin verme**

`example.com/test.php` adresinde bir betiğiniz olduğunu ve bunun için belirteçlerin (token) biçimini değiştirmek istediğinizi varsayalım.

İlgili kuralı oluşturmak için:

1. **Rules** sekmesine gidin
1. `example.com/test.php` için dalı (branch) bulun veya oluşturun ve **Add rule**’a tıklayın.
1. **Fine-tuning attack detection** → **Disable custom attack detector** öğesini seçin.
1. Devre dışı bırakmak istediğiniz düzenli ifadeyi seçin.
1. Seçeneği `Header X-AUTHENTICATION` olarak ayarlayın.
1. **Create**’e tıklayın.

![Regex kuralı ikinci örnek][img-regex-example2]

## Kuralı oluşturmak için API çağrısı

Regexp tabanlı saldırı göstergesini oluşturmak için [Wallarm API’sini doğrudan çağırabilirsiniz](../../api/request-examples.md#create-a-rule-to-consider-the-requests-with-specific-value-of-the-x-forwarded-for-header-as-attacks).