[link-regex]:                   https://github.com/yandex/pire
[link-request-processing]:      request-processing.md
[img-add-rule]:                 ../../images/user-guides/rules/section-rules-add-rule.png
[link-attack-detection-tools]:  ../../about-wallarm/protecting-against-attacks.md#tools-for-attack-detection
[link-sub-plans]:               ../../about-wallarm/subscription-plans.md#core-subscription-plans
[link-filtration-mode]:         ../../admin-en/configure-wallarm-mode.md
[link-nodes]:                   ../../about-wallarm/overview.md#how-wallarm-works
[link-sessions]:                ../../api-sessions/overview.md
[link-brute-force-protection]:  ../../admin-en/configuration-guides/protecting-against-bruteforce.md
[link-cloud-node-synchronization]: ../../admin-en/configure-cloud-node-synchronization-en.md
[img-rules-create-backup]:      ../../images/user-guides/rules/rules-create-backup.png

# Rules

Kurallar, isteklerin analiz edilmesi ve sonrasında işlenmesi sırasında Wallarm’ın [varsayılan](../../about-wallarm/protecting-against-attacks.md#tools-for-attack-detection) davranışını ince ayar yapmak için kullanılır. Böylece kuralları kullanarak sistemin kötü amaçlı istekleri nasıl tespit ettiğini ve bu tür kötü amaçlı istekler tespit edildiğinde nasıl davrandığını değiştirebilirsiniz.

Kurallar, [US](https://us1.my.wallarm.com/rules) veya [EU](https://my.wallarm.com/rules) Cloud içindeki **Rules** bölümünde yapılandırılır.

![Rules section](../../images/user-guides/rules/section-rules.png)

!!! warning "Kuralın uygulanmasında gecikme"
    Kurallarda değişiklik yaptığınızda, bu değişiklikler hemen etkili olmaz; kuralların [derlenmesi](#ruleset-lifecycle) ve filtreleme düğümlerine yüklenmesi zaman alır.

## Kurallarla neler yapabilirsiniz

Kuralları kullanarak Wallarm’ın uygulamalarınıza ve API’lerinize yönelik saldırıları nasıl azalttığını kontrol edebilir, saldırı tespitini ince ayar yapabilir ve istek/yanıtları değiştirebilirsiniz:

* Azaltma kontrolleri:

    * [Gelişmiş hız sınırlama](../../user-guides/rules/rate-limiting.md)
    * [Sanal yamalar](../../user-guides/rules/vpatch-rule.md)
    * [Özel saldırı algılayıcıları](../../user-guides/rules/regex-rule.md)
    * [Dosya yükleme kısıtlamaları](../../api-protection/file-upload-restriction.md#rule-based-protection)

* Saldırı tespitinin ince ayarı:

    * Belirli alan adları/uç noktalar için [filtreleme modunu geçersiz kılın](../../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)
    * [Belirli saldırıları yok sayın](../../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types)
    * Belirli alan adları/uç noktalar veya istek bölümleri için [özel saldırı algılayıcılarını devre dışı bırakın](../../user-guides/rules/regex-rule.md#partial-disabling)
    * [İkili veri işleme](../../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-signs-in-the-binary-data) yapılandırın
    * [Ayrıştırıcıları yapılandırarak](../../user-guides/rules/request-processing.md#managing-parsers) istek işlemeyi ince ayar yapın
    * Belirli alan adları/uç noktalar ve istekler için [API Abuse Prevention’ı devre dışı bırakın](../../api-abuse-prevention/exceptions.md#exceptions-for-target-urls-and-specific-requests)
    * [İstek işleme süresini sınırlandırarak](../../user-guides/rules/configure-overlimit-res-detection.md) düğüm işleyişini ince ayar yapın


* İstek/yanıtları değiştirin:

    * [Hassas verileri maskeleyin](../../user-guides/rules/sensitive-data-rule.md)
    * [Yanıt başlıklarını değiştirerek](../../user-guides/rules/add-replace-response-header.md) uygulama güvenliğinin ek bir katmanını yapılandırın

<a id="rule-branches"></a>
## Rule branches

Kurallar, uç nokta URI’leri ve diğer koşullara göre otomatik olarak iç içe geçmiş dallar halinde gruplanır. Bu, kuralların aşağıya doğru devralındığı ağaç benzeri bir yapı oluşturur. İlkeler:

* Tüm dallar [varsayılan](#default-rules) kuralları devralır.
* Bir dalda, alt uç noktalar üstten kuralları devralır.
* Ayrık olan, devralınan üzerinde önceliklidir.
* Doğrudan belirtilen, [regex](rules.md#condition-type-regex) üzerinde önceliklidir.
* [Büyük/küçük harf duyarlı](rules.md#condition-type-equal), [duyarsız](rules.md#condition-type-iequal-aa) üzerinde önceliklidir.

![Kurallar sekmesine genel bakış](../../images/user-guides/rules/rules-overview.png)

<a id="default-rules"></a>
### Default rules

Belirli bir uç noktayla bağlantılı olmayan, ancak eylemi belirtilmiş kurallar oluşturabilirsiniz - bunlara **default rules** denir. Bu tür kurallar tüm uç noktalara uygulanır.

* Varsayılan kural oluşturmak için, [standart prosedürü](#configuring) izleyin ancak URI’yi boş bırakın. Herhangi bir uç noktaya bağlı olmayan yeni kural oluşturulacaktır.
* Oluşturulan varsayılan kuralların listesini görüntülemek için **Default rules** düğmesine tıklayın.
* Varsayılan kurallar tüm dallar tarafından devralınır.

!!! info "Trafik filtreleme modu varsayılan kuralı"
    Wallarm, tüm müşteriler için `Set filtration mode` varsayılan kuralını otomatik olarak oluşturur ve değerini [genel filtreleme modu](../../admin-en/configure-wallarm-mode.md#general-filtration-mode) ayarına göre belirler.

### Dal kurallarını görüntüleme

Kural dallarıyla çalışmaya ilişkin bazı detaylar:

* Uç noktayı genişletmek için mavi daireye tıklayın.
* Ayrık kuralları olmayan uç noktalar gri renklidir ve tıklanamaz.
    
    ![Uç noktaların dalı](../../images/user-guides/rules/rules-branch.png)

* Uç noktanın kurallarını görüntülemek için üzerine tıklayın. İlk olarak, bu uç nokta için ayrık kurallar görüntülenecektir.
* Belirli bir uç noktanın kural listesini görüntülerken, devralınanları görüntülemek için **Distinct and inherited rules** üzerine tıklayın. Devralınan kurallar, ayrık olanlarla birlikte görüntülenir; ayrıklara kıyasla gri renkte olurlar.

    ![Uç nokta için ayrık ve devralınan kurallar](../../images/user-guides/rules/rules-distinct-and-inherited.png)

<a id="configuring"></a>
## Configuring

Yeni bir kural eklemek için [US](https://us1.my.wallarm.com/rules) veya [EU](https://my.wallarm.com/rules) Cloud içindeki **Rules** bölümüne gidin. Kurallar, mevcut [dallara](#rule-branches) eklenebileceği gibi sıfırdan da eklenebilir; bu durumda henüz yoksa yeni bir dal oluşturulur.

![Yeni kural ekleme][img-add-rule]

Bir kuralın bir isteğe yalnızca bazı koşullar karşılandığında (hedef uç nokta, yöntem, bazı parametrelerin veya değerlerin varlığı vb.) uygulandığını unutmayın. Ayrıca, genellikle yalnızca bazı istek bölümlerine uygulanır. İstek yapısının kurallarla etkileşimini daha iyi anlamak için filtreleme düğümünün [istekleri nasıl analiz ettiğini][link-request-processing] öğrenmeniz önerilir.

Kural koşulları şu yollarla tanımlanabilir:

* [URI constructor](#uri-constructor) - kural koşullarının yalnızca tek bir satırda istek yöntemi ve uç nokta belirlenerek yapılandırılmasına olanak tanır.
* [Advanced edit form](#advanced-edit-form) - URI constructor’ı genişleterek yalnızca yöntem/uç noktayı değil, uygulama, başlıklar, sorgu dizesi parametreleri ve diğerleri gibi ek kural koşullarını yapılandırmaya olanak tanır.

<a id="uri-constructor"></a>
### URI constructor

URI constructor, kural koşullarının yalnızca tek bir satırda istek yöntemi ve uç nokta belirlenerek yapılandırılmasını sağlar.

#### Genel kullanım

URI constructor aşağıdakileri sunar:

* İstek yöntemi için seçici. Yöntem seçilmezse, kural herhangi bir yöntemle yapılan isteklere uygulanır.
* Aşağıdaki değer biçimlerini kabul eden istek uç noktası alanı:

    | Biçim | Örnek |
    | ------ | ------ |
    | Aşağıdaki bileşenleri içeren tam URI:<ul><li>Şema (değer yok sayılır, şemayı açıkça advanced form kullanarak belirtebilirsiniz)</li><li>Alan adı veya IP adresi</li><li>Port</li><li>Yol</li><li>Sorgu dizesi parametreleri</ul> | `https://example.com:3000/api/user.php?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com:3000`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `php`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul>|
    | Bazı bileşenleri atlanmış URI | `example.com/api/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul><br>`http://example.com/api/clients/user/?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `clients`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul><br>`/api/user`<br><ul><li>``[header, 'HOST']` - herhangi bir değer</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul>|
    | Bileşenin herhangi bir boş‑olmayan değerini ifade eden `*` içeren URI | `example.com/*/create/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - herhangi bir boş‑olmayan değer (advanced edit form’da gizlenir)</li><li>`[path, 1]` - `create`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - herhangi bir boş‑olmayan değer (advanced edit form’da gizlenir)</li><li>`[action_ext]` - herhangi bir boş‑olmayan değer (advanced edit form’da gizlenir)</li>Değer, `example.com/api/create/user.php` ile eşleşir<br>ve `example.com/create/user.php` ile `example.com/api/create` ile eşleşmez.</ul>|
    | Bileşen sayısının yokluğu dahil herhangi bir sayıda bileşeni ifade eden `**` içeren URI | `example.com/**/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li>Değer, `example.com/api/create/user` ve `example.com/api/user` ile eşleşir.<br>Değer, `example.com/user`, `example.com/api/user/index.php` ve `example.com/api/user/?w=delete` ile eşleşmez.</ul><br>`example.com/api/**/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[action_name]` - herhangi bir boş‑olmayan değer (advanced edit form’da gizlenir)</li><li>`[action_ext]` - herhangi bir boş‑olmayan değer (advanced edit form’da gizlenir)</li>Değer, `example.com/api/create/user.php` ve `example.com/api/user/create/index.php` ile eşleşir<br>ve `example.com/api`, `example.com/api/user` ve `example.com/api/create/user.php?w=delete` ile eşleşmez.</ul> |
    | Belirli bileşen değerlerini eşleştirmek için [düzenli ifade](#condition-type-regex) içeren URI (regexp `{{}}` içine alınmalıdır) | `example.com/user/{{[0-9]}}`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `user`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `[0-9]`</li><li>`[action_ext]` - `∅`</li>Değer, `example.com/user/3445` ile eşleşir<br>ve `example.com/user/3445/888` ve `example.com/user/3445/index.php` ile eşleşmez.</ul> |

URI constructor’da belirtilen dize, otomatik olarak bir [koşullar](#conditions) kümesine ayrıştırılır:

* `method`
* `header`. URI constructor yalnızca `HOST` başlığının belirtilmesine izin verir.
* `path`, `action_name`, `action_ext`. Kural oluşturmayı onaylamadan önce, bu istek bölümlerinin değerlerinin aşağıdaki yollardan biriyle ayrıştırıldığından emin olun:
    * Belirli bir `path` numarasının açık değeri + `action_name` + `action_ext` (isteğe bağlı)
    * `action_name` + `action_ext`’in (isteğe bağlı) açık değeri
    * `action_name` ve `action_ext` olmadan belirli bir `path` numarasının açık değeri
* `query`

URI constructor’da belirtilen değer, yalnızca [advanced edit form](#advanced-edit-form) içinde mevcut olan diğer koşullarla tamamlanabilir.

#### Joker karakterleri kullanma

Wallarm’da URI constructor ile çalışırken joker karakterleri kullanabilir misiniz? Hem hayır hem evet. “Hayır”, onları [klasik](https://en.wikipedia.org/wiki/Wildcard_character) şekilde kullanamayacağınız anlamına gelir; “evet” ise şu şekilde davranarak aynı sonuca ulaşabileceğiniz anlamına gelir:

* URI’nizin ayrıştırılmış bileşenleri içinde joker karakterler yerine düzenli ifadeler kullanın.
* Bir veya herhangi bir sayıda bileşenin yerine geçmesi için URI alanının kendisine `*` veya `**` sembolünü yerleştirin (örnekler için [yukarıdaki](#uri-constructor) bölüme bakın).

**Bazı detaylar**

Düzenli ifadenin sözdizimi klasik joker karakterlerden farklıdır, ancak aynı sonuçlara ulaşılabilir. Örneğin, şu maskeye karşılık gelmesini istiyorsunuz:

* `something-1.example.com/user/create.com` ve
* `anything.something-2.example.com/user/create.com`

...ki klasik jokerlerde şöyle bir şey yazarak elde etmeye çalışırsınız:

* `*.example.com/user/create.com`

Ancak Wallarm’da `something-1.example.com/user/create.com` ifadeniz şu şekilde bileşenlere ayrıştırılacaktır:

![URI’nin bileşenlere ayrıştırılması örneği](../../images/user-guides/rules/something-parsed.png)

...burada `something-1.example.com` bir `header`-`HOST` koşuludur. Joker karakterin koşul içinde kullanılamayacağını belirtmiştik, bu yüzden bunun yerine düzenli ifade kullanmamız gerekiyor: koşul türünü REGEX olarak ayarlayın ve ardından Wallarm’a [özgü sözdizimini](#condition-type-regex) kullanın:

1. “Herhangi bir sayıda sembol” anlamında `*` kullanmayın.
1. “Gerçek nokta” olarak yorumlanmasını istediğimiz tüm `.` karakterlerini köşeli parantez içine alın:

    `something-1[.]example[.]com`

1. “Herhangi bir sembol” yerine `.`’yı parantezsiz kullanın ve ardından “öncekilerin 0 veya daha fazla tekrarı” anlamına gelen nicelik belirteci olarak `*` koyun; yani `.*` ve:

    `.*[.]example[.]com`

1. Oluşturduğumuz ifadenin bileşenimizin sonunda olması gerektiğini belirtmek için sona `$` ekleyin:
    
    `.*[.]example[.]com$`

    !!! info "Daha basit yol"
        `.*` ifadesini atlayabilir ve yalnızca `[.]example[.]com$` bırakabilirsiniz. Her iki durumda da Wallarm, `[.]example[.]com$` ifadesinden önce herhangi bir karakterin herhangi bir sayıda görünebileceğini varsayacaktır.

    ![Header bileşeninde düzenli ifade kullanımı](../../images/user-guides/rules/wildcard-regex.png)

<a id="advanced-edit-form"></a>
### Advanced edit form

Advanced edit form, (yöntem ve URI) [URI constructor](#uri-constructor) olasılıklarını genişleterek hem bunları hem de uygulama, başlıklar, sorgu dizesi parametreleri ve diğerleri gibi ek kural koşullarını yapılandırmayı sağlar.

<a id="conditions"></a>
#### Koşullar

Koşullar, hangi istek parçalarında hangi değerlerin sunulması gerektiğini belirtir. Kural, tüm koşulları karşılandığında uygulanır. Koşullar, kuralın **If request is** bölümünde listelenir.

Şu koşullar şu anda desteklenmektedir:

* **application**: uygulama kimliği.
* **proto**: HTTP protokol sürümü (1.0, 1.1, 2.0, ...).
* **scheme**: http veya https.
* **uri**: alan adı olmadan istek URL’sinin bir parçası (örneğin, `http://example.com/blogs/123/index.php?q=aaa` isteği için `/blogs/123/index.php?q=aaa`).
* **path**, **action_name**, **action_ext**, hiyerarşik URI bileşeni dizisidir; burada: 

    * **path**: `/` sembolüyle ayrılmış URI parçalarını içeren bir dizi (URI’nin son parçası diziye dahil edilmez). URI’de yalnızca bir parça varsa, dizi boş olacaktır.
    * **action_name**: `/` sembolünden sonra ve ilk nokta (`.`) öncesindeki URI’nin son parçası. Bu URI parçası, değeri boş bir dize olsa bile isteklerde her zaman bulunur.
    * **action_ext**: Son noktadan (`.`) sonraki URI kısmı. İsteklerde bulunmayabilir.
* **query**: sorgu dizesi parametreleri.
* **header**: istek başlıkları. Bir başlık adı girdiğinizde, en yaygın değerler açılır listede görüntülenir. Örneğin: `HOST`, `USER-AGENT`, `COOKIE`, `X-FORWARDED-FOR`, `AUTHORIZATION`, `REFERER`, `CONTENT-TYPE`.

    !!! info "`HOST` başlığı için FQDN ve IP adreslerine yönelik kuralları yönetme"
        `HOST` başlığı bir FQDN’e ayarlanmışsa, ilişkili IP adresini hedefleyen istekler kuraldan etkilenmez. Kuralın bu tür isteklere uygulanması için, kural koşullarında `HOST` başlığı değerini ilgili IP olarak ayarlayın veya hem FQDN hem de IP için ayrı kurallar oluşturun.

        `HOST` başlığını değiştiren bir yük dengeleyicisinin arkasında konumlandığında, Wallarm düğümü kuralları orijinal değere değil, güncellenmiş değere göre uygular. Örneğin, dengeleyici `HOST`’u bir IP’den bir alan adına çevirirse, düğüm o alan adına ait kuralları uygular.

* **method**: istek yöntemleri. Değer açıkça belirtilmemişse, kural herhangi bir yöntemle yapılan isteklere uygulanır.

#### Koşul türü: EQUAL (`=`)

Değer, karşılaştırma bağımsız değişkeniyle tam olarak eşleşmelidir. Örneğin, yalnızca `example` değeri `example` ile eşleşir.

!!! info "HOST başlık değeri için EQUAL koşul türü"
    Daha fazla isteği kurallarla kapsamak için HOST başlığı için EQUAL koşul türünü kısıtladık. EQUAL türü yerine, parametre değerlerini herhangi bir büyük/küçük harf düzeninde kabul eden IEQUAL türünü kullanmanızı öneririz.
    
    EQUAL türünü daha önce kullandıysanız, otomatik olarak IEQUAL türü ile değiştirilecektir.

#### Koşul türü: IEQUAL (`Aa`)

Değer, karşılaştırma bağımsız değişkeniyle herhangi bir büyük/küçük harf düzeninde eşleşmelidir. Örneğin: `example`, `ExAmple`, `exampLe` değerleri `example` ile eşleşir.

<a id="condition-type-regex"></a>
#### Koşul türü: REGEX (`.*`)

Değer, düzenli ifadeyle eşleşmelidir. 

**Düzenli ifade sözdizimi**

Düzenli ifadelerle istekleri eşleştirmek için PIRE kütüphanesi kullanılır. Çoğunlukla ifadelerin sözdizimi standarttır ancak aşağıda ve [PIRE deposunun][link-regex] README dosyasında açıklandığı gibi bazı özellikler vardır.

??? info "Düzenli ifade sözdizimini göster"
    Olduğu gibi kullanılabilecek karakterler:

    * Küçük Latin harfleri: `a b c d e f g h i j k l m n o p q r s t u v w x y z`
    * Büyük Latin harfleri: `A B C D E F G H I J K L M N O P Q R S T U V W X Y Z`
    * Rakamlar: `0 1 3 4 5 6 7 8 9`
    * Özel karakterler: <code>! " # % ' , - / : ; < = > @ ] _ ` }</code>
    * Boşluk karakterleri

    `\` ile kaçırmak yerine köşeli parantez `[]` içine alınması gereken karakterler:

    * `. $ ^ { [ ( | ) * + ? \ & ~`

    ISO‑8859’a göre ASCII’ye dönüştürülmesi gereken karakterler:

    * UTF‑8 karakterleri (örneğin, `ʃ` karakterinin ASCII karşılığı `Ê`’dür)

    Karakter grupları:

    * Yeni satır dışında herhangi bir karakter için `.`
    * Düzenli ifadeleri gruplamak, `()` içindeki sembolleri aramak veya öncelik sırası belirlemek için `()`
    * `[]` içindeki bir tek karakter (büyük/küçük harfe duyarlı); grup, belirli durumlar için kullanılabilir:
        * büyük/küçük harfi yok saymak için (örneğin, `[cC]`)
        * küçük Latin harflerinden birini eşleştirmek için `[a-z]`
        * büyük Latin harflerinden birini eşleştirmek için `[A-Z]`
        * rakamlardan birini eşleştirmek için `[0-9]`
        * küçük veya büyük Latin harflerinden, veya rakamlardan, veya noktadan birini eşleştirmek için `[a-zA-Z09[.]]`

    Mantık karakterleri:

    * `~`, NOT’a eşittir. Ters çevrilmiş ifade ve karakter `()` içine alınmalıdır,<br>örneğin: `(~(a))`
    * `|`, OR’a eşittir
    * `&`, AND’e eşittir

    Dize sınırlarını belirtmek için karakterler:

    * Dizinin başlangıcı için `^`
    * Dizinin sonu için `$`

    Nicelik belirteçleri:

    * Önceki düzenli ifadenin 0 veya daha fazla tekrarı için `*`
    * Önceki düzenli ifadenin 1 veya daha fazla tekrarı için `+`
    * Önceki düzenli ifadenin 0 veya 1 tekrarı için `?`
    * Önceki düzenli ifadenin `m` tekrarına karşılık `{m}`
    * Önceki düzenli ifadenin `m` ile `n` arası tekrarına karşılık `{m,n}`; `n`’in atlanması, üst sınırın sonsuz olduğunu belirtir

    Özgül davranışla çalışan karakter kombinasyonları:

    * `^.*$`, `^.+$`’a eşittir (boş değerler `^.*$` ile eşleşmez)
    * `^.?$`, `^.{0,}$`, `^.{0,n}$`, `^.+$`’a eşittir

    Geçici olarak desteklenmeyenler:

    * Alfabetik olmayanlar için `\W`, alfabetikler için `\w`, rakam olmayanlar için `\D`, ondalıklar için `\d`, boşluk olmayanlar için `\S`, boşluklar için `\s` gibi karakter sınıfları

    Desteklenmeyen sözdizimi:

    * Üç basamaklı sekizlik kodlar `\NNN`, `\oNNN`, `\ONNN`
    * `\c` ile denetim karakterleri geçirme `\cN` (örneğin, CTRL+C için `\cC`)
    * Dizinin başlangıcı için `\A`
    * Dizinin sonu için `\z`
    * Dizinin sonunda boşluk karakterinden önce veya sonra `\b`
    * Tembel nicelik belirteçleri `??`, `*?`, `+?`
    * Koşullular

**Düzenli ifadeleri test etme**

Bir düzenli ifadeyi test etmek için Wallarm **cpire** yardımcı programını kullanın. Linux tabanlı işletim sisteminize [Wallarm hepsi-bir-arada yükleyici](../../installation/nginx/all-in-one.md) ile kurun veya [Wallarm NGINX tabanlı Docker imajından](../../admin-en/installation-docker-en.md) aşağıdaki gibi çalıştırın:

=== "Hepsi-bir-arada yükleyici"
    1. Wallarm hepsi-bir-arada yükleyicisini henüz indirmediyseniz indirin:

        ```
        curl -O https://meganode.wallarm.com/6.5/wallarm-6.5.1.x86_64-glibc.sh
        ```
    1. Wallarm modüllerini henüz kurmadıysanız kurun:
        
        ```
        sudo sh wallarm-6.5.1.x86_64-glibc.sh -- --batch --token <API_TOKEN>
        ```
    1. **cpire** yardımcı programını çalıştırın:
        
        ```bash
        /opt/wallarm/usr/bin/cpire-runner -r '<YOUR_REGULAR_EXPRESSION>'
        ```
    1. Düzenli ifadeyle eşleşip eşleşmediğini kontrol etmek istediğiniz değeri girin.
=== "NGINX tabanlı Docker imajı"
    1. **cpire** yardımcı programını Wallarm Docker imajından çalıştırın:
    
        ```
        docker run --rm -it wallarm/node:6.5.1 /opt/wallarm/usr/bin/cpire-runner -r '<YOUR_REGULAR_EXPRESSION>'
        ```
    1. Düzenli ifadeyle eşleşip eşleşmediğini kontrol etmek istediğiniz değeri girin.

Yardımcı program şu sonucu döndürür:

* Değer düzenli ifadeyle eşleşirse `0`
* Değer düzenli ifadeyle eşleşmezse `FAIL`
* Düzenli ifade geçersizse hata mesajı

!!! warning "`\` karakterinin ele alınmasına ilişkin özellikler"
    İfade `\` içeriyorsa, lütfen `[]` ve `\` ile kaçırın (örneğin, `[\\]`).

**Wallarm Console üzerinden eklenen düzenli ifade örnekleri**

* <code>/.git</code> içeren herhangi bir dizeyle eşleşmek için

    ```
    /[.]git
    ```
* <code>.example.com</code> içeren herhangi bir dizeyle eşleşmek için

    ```
    [.]example[.]com
    ```
* `*`’in herhangi bir sembolün herhangi bir sayıda tekrarı olabildiği <code>/.example.*.com</code> ile biten herhangi bir dizeyle eşleşmek için

    ```
    /[.]example[.].*[.]com$
    ```
* 1.2.3.4 ve 5.6.7.8 hariç tüm IP adresleriyle eşleşmek için

    ```
    ^(~((1[.]2[.]3[.]4)|(5[.]6[.]7[.]8)))$
    ```
* <code>/.example.com.php</code> ile biten herhangi bir dizeyle eşleşmek için

    ```
    /[.]example[.]com[.]php$
    ```
* Küçük ve büyük harflerle <code>sqLmAp</code>, <code>SqLMap</code> vb. varyasyonlarıyla <code>sqlmap</code> içeren herhangi bir dizeyle eşleşmek için

    ```
    [sS][qQ][lL][mM][aA][pP]
    ```
* <code>admin\\.exe</code>, <code>admin\\.bat</code>, <code>admin\\.sh</code>, <code>cmd\\.exe</code>, <code>cmd\\.bat</code>, <code>cmd\\.sh</code> değerlerinden bir veya birkaçını içeren herhangi bir dizeyle eşleşmek için

    ```
    (admin|cmd)[\\].(exe|bat|sh)
    ```
* Küçük/büyük harf varyasyonlarıyla <code>onmouse</code>, küçük/büyük harf varyasyonlarıyla <code>onload</code>, <code>win\\.ini</code>, <code>prompt</code> değerlerinden bir veya birkaçını içeren herhangi bir dizeyle eşleşmek için

    ```
    [oO][nN][mM][oO][uU][sS][eE]|[oO][nN][lL][oO][aA][dD]|win[\\].ini|prompt
    ```
* `Mozilla` ile başlayan ancak `1aa875F49III` dizesini içermeyen herhangi bir dizeyle eşleşmek için
    
    ```
    ^(Mozilla(~(.*1aa875F49III.*)))$
    ```
* Şu değerlerden biriyle başlayan herhangi bir dizeyle eşleşmek için: `python-requests/`, `PostmanRuntime/`, `okhttp/3.14.0`, `node-fetch/1.0`

    ```
    ^(python-requests/|PostmanRuntime/|okhttp/3.14.0|node-fetch/1.0)
    ```

#### Koşul türü: ABSENT (`∅`)

İstek, belirtilen parçayı içermemelidir. Bu durumda karşılaştırma bağımsız değişkeni kullanılmaz.

<a id="ruleset-lifecycle"></a>
## Kurallar kümesi yaşam döngüsü

Oluşturulan tüm kurallar ve [azaltma kontrolleri](../../about-wallarm/mitigation-controls-overview.md) özel bir kural kümesi oluşturur. Wallarm düğümü, gelen istekleri analiz ederken özel kural kümesine dayanır.

Kurallardaki ve azaltma kontrollerindeki değişiklikler anında etkili OLMAZ. Değişiklikler, özel kural kümesinin **oluşturulması** ve **filtreleme düğümüne yüklenmesi** tamamlandıktan sonra istek analizi sürecine uygulanır.

--8<-- "../include/custom-ruleset.md"

## Kuralları almak için API çağrıları

Özel kuralları almak için [Wallarm API’sini doğrudan çağırabilirsiniz](../../api/request-examples.md#get-all-configured-rules).