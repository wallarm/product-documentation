```markdown
[link-regex]:                   https://github.com/yandex/pire
[link-request-processing]:      request-processing.md
[img-add-rule]:                 ../../images/user-guides/rules/section-rules-add-rule.png

# Kurallar

Kurallar, isteklerin analiz edilmesi ve daha sonraki işlenmesi sırasında Wallarm'un [varsayılan](../../about-wallarm/protecting-against-attacks.md#tools-for-attack-detection) davranışını ince ayar yapmak için kullanılır. Böylece, kuralları kullanarak sistemin kötü amaçlı istekleri nasıl tespit ettiğini ve bu tür kötü amaçlı istekler tespit edildiğinde nasıl davrandığını değiştirebilirsiniz.

Kurallar, [US](https://us1.my.wallarm.com/rules) veya [EU](https://my.wallarm.com/rules) Cloud'daki **Kurallar** bölümünde yapılandırılır.

![Rules section](../../images/user-guides/rules/section-rules.png)

!!! warning "Kural uygulama gecikmesi"
    Kurallarda yaptığınız değişikliklerin etkili olması hemen gerçekleşmez, çünkü kuralların [derlenmesi](#ruleset-lifecycle) ve filtreleme düğümlerine yüklenmesi biraz zaman alır.

## Kurallarla Ne Yapabilirsiniz

Kuralları kullanarak, Wallarm'un uygulama ve API'ler üzerindeki saldırıları hafifletme şeklini kontrol edebilir, saldırı tespitini ince ayar yapabilir ve istek/yanıtları değiştirebilirsiniz:

* Hafifletme kontrolleri:

    * [Gelişmiş oran sınırlama](../../user-guides/rules/rate-limiting.md)
    * [GraphQL API koruması](../../api-protection/graphql-rule.md)
    * [Sanal yamalar](../../user-guides/rules/vpatch-rule.md)
    * [Özel saldırı dedektörleri](../../user-guides/rules/regex-rule.md)

* Saldırı tespitini ince ayar yapmak:

    * Belirli alan adları/uc noktalar için [filtreleme modunu geçersiz kılma](../../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)
    * [Belirli saldırıları görmezden gelme](../../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types)
    * Belirli alan adları/uc noktalar veya istek bölümleri için [özel saldırı dedektörlerini devre dışı bırakma](../../user-guides/rules/regex-rule.md#partial-disabling)
    * [İkili veri işleme yapılandırması](../../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-signs-in-the-binary-data)
    * [Ayrıştırıcıları yapılandırarak](../../user-guides/rules/request-processing.md#managing-parsers) istek işlemesini ince ayar yapma
    * Belirli alan adları/uc noktalar ve istekler için [API Kötüye Kullanım Önlemini devre dışı bırakma](../../api-abuse-prevention/exceptions.md#exceptions-for-target-urls-and-specific-requests)
    * [İstek işleme süresini sınırlayarak](../../user-guides/rules/configure-overlimit-res-detection.md) düğüm işleyişini ince ayar yapma

* İstek/yanıtları değiştirme:

    * [Hassas verileri maskeleme](../../user-guides/rules/sensitive-data-rule.md)
    * Uygulama güvenliğinin ek katmanını, [yanıt başlıklarını değiştirerek](../../user-guides/rules/add-replace-response-header.md) yapılandırma

## Kural Dalları

Kurallar, uç noktaların URI'ları ve diğer koşullar tarafından otomatik olarak iç içe dallara gruplanır. Bu, kuralların kalıtım yoluyla aktarıldığı ağaç benzeri bir yapı oluşturur. İlkeler:

* Tüm dallar [varsayılan](#default-rules) kuralları devralır.
* Bir dal içinde, alt uç noktalar ana uç noktadan kuralları devralır.
* Özel belirtilmiş olanlar, devralınanların önceliğine sahiptir.
* Doğrudan belirtilenler, [regex](rules.md#condition-type-regex) üzerinde önceliklidir.
* Büyük/küçük harf duyarlı [eşitlik](rules.md#condition-type-equal), [büyük/küçük harfe duyarsız](rules.md#condition-type-iequal-aa) olandan önceliklidir.

![Rules tab overview](../../images/user-guides/rules/rules-overview.png)

### Varsayılan kurallar

Belirli bir eyleme sahip ancak herhangi bir uç noktayla bağlantılı olmayan kurallar oluşturabilirsiniz – bunlar **varsayılan kurallar** olarak adlandırılır. Bu tür kurallar, tüm uç noktalar için uygulanır.

* Varsayılan kural oluşturmak için, [yapılandırma](#configuring) bölümündeki standart prosedürü izleyin ancak URI alanını boş bırakın. Uç noktayla bağlantısı olmayan yeni kural oluşturulacaktır.
* Oluşturulan varsayılan kuralları görüntülemek için **Default rules** düğmesine tıklayın.
* Varsayılan kurallar tüm dallar tarafından devralınır.

!!! info "Trafik filtreleme modu varsayılan kuralı"
    Wallarm, tüm istemciler için otomatik olarak `Set filtration mode` varsayılan kuralını oluşturur ve bu kuralın değerini [genel filtreleme modu](../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console) ayarına göre belirler.

### Dal Kurallarını Görüntüleme

Kural dallarıyla nasıl çalışılacağına dair bazı detaylar:

* Uç noktayı genişletmek için mavi daireye tıklayın.
* Özel kurallara sahip olmayan uç noktalar gri renkle gösterilir ve tıklanamazlar.
    
    ![Branch of endpoints](../../images/user-guides/rules/rules-branch.png)

* Uç nokta için kuralları görüntülemek amacıyla üzerine tıklayın. İlk olarak, bu uç nokta için belirtilen özel kurallar görüntülenecektir.
* Belirli bir uç noktanın kural listesini görüntülerken, devralınan kuralları görüntülemek için **Distinct and inherited rules** düğmesine tıklayın. Devralınan kurallar, özel kurallarla birlikte gösterilir; ancak özel olanlara kıyasla gri renkle gösterilir.

    ![Distinct and inherited rules for endpoint](../../images/user-guides/rules/rules-distinct-and-inherited.png)

## Yapılandırma

Yeni bir kural eklemek için, [US](https://us1.my.wallarm.com/rules) veya [EU](https://my.wallarm.com/rules) Cloud'daki **Kurallar** bölümüne gidin. Kurallar, mevcut [dallara](#rule-branches) eklenebileceği gibi, hiç bir dal yoksa sıfırdan oluşturulup yeni dal oluşturulabilir.

![Adding a new rule][img-add-rule]

Bir kuralın yalnızca belirli koşullar sağlandığında (örneğin hedef uç nokta, yöntem, bazı parametrelerin veya değerlerin varlığı vb.) isteğe uygulandığına dikkat edin. Ayrıca, genellikle yalnızca bazı istek bölümlerine uygulanır. İstek yapısının kurallarla nasıl etkileşimde bulunduğunu daha iyi anlamak için, filtreleme düğümünün nasıl [istekleri analiz ettiğini][link-request-processing] öğrenmeniz tavsiye edilir.

Kural koşulları şu yollarla tanımlanabilir:

* [URI constructor](#uri-constructor) – istek yöntemini ve uç noktasını tek bir dizede belirterek kural koşullarını yapılandırmanıza olanak tanır.
* [Advanced edit form](#advanced-edit-form) – URI constructor'ı genişleterek, hem yöntem/uç noktayı hem de uygulama, başlıklar, sorgu dizisi parametreleri ve diğer ek kural koşullarını yapılandırmanıza olanak tanır.

### URI constructor

URI constructor, istek yöntemini ve uç noktasını tek bir dizede belirterek kural koşullarını yapılandırmanıza olanak tanır.

#### Genel Kullanım

URI constructor şunları sağlar:

* İstek yöntemi seçici. Yöntem seçilmediğinde, kural herhangi bir yöntemle gelen isteklere uygulanır.
* Şu değer formatlarını kabul eden, istek uç noktası için alan:

    | Format | Örnek |
    | ------ | ------ |
    | Aşağıdaki bileşenleri içeren tam URI:<ul><li>Şema (değer göz ardı edilir, gelişmiş formu kullanarak şemayı açıkça belirtebilirsiniz)</li><li>Alan adı veya bir IP adresi</li><li>Port</li><li>Yol</li><li>Sorgu dizisi parametreleri</ul> | `https://example.com:3000/api/user.php?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com:3000`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `php`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul> |
    | Bazı bileşenlerin çıkarıldığı URI | `example.com/api/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul><br>`http://example.com/api/clients/user/?q=action&w=delete`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `clients`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[query, 'q']` - `action`</li><li>`[query, 'w']` - `delete`</li></ul><br>`/api/user`<br><ul><li>`[header, 'HOST']` - herhangi bir değer</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li></ul> |
    | Bileşenin herhangi boş olmayan değeri anlamına gelen `*` ile URI | `example.com/*/create/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - herhangi boş olmayan bir değer (gelişmiş düzenleme formunda gizli)</li><li>`[path, 1]` - `create`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - herhangi boş olmayan bir değer (gelişmiş düzenleme formunda gizli)</li><li>`[action_ext]` - herhangi boş olmayan bir değer (gelişmiş düzenleme formunda gizli)</li>`example.com/api/create/user.php` ile eşleşir<br>ve `example.com/create/user.php` ile `example.com/api/create` ile eşleşmez.</ul> |
    | Bileşenin yokluğunu da içerecek şekilde herhangi sayıda bileşen anlamına gelen `**` ile URI | `example.com/**/user`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[action_name]` - `user`</li><li>`[action_ext]` - `∅`</li>Değer, `example.com/api/create/user` ve `example.com/api/user` ile eşleşir.<br>Değer, `example.com/user`, `example.com/api/user/index.php` ve `example.com/api/user/?w=delete` ile eşleşmez.</ul><br>`example.com/api/**/*.*`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `api`</li><li>`[action_name]` - herhangi boş olmayan bir değer (gelişmiş düzenleme formunda gizli)</li><li>`[action_ext]` - herhangi boş olmayan bir değer (gelişmiş düzenleme formunda gizli)</li>Değer, `example.com/api/create/user.php` ve `example.com/api/user/create/index.php` ile eşleşir<br>ve `example.com/api`, `example.com/api/user` ile `example.com/api/create/user.php?w=delete` ile eşleşmez.</ul> |
    | Belirli bileşen değerleriyle eşleşmek için [düzenli ifade](#condition-type-regex) içeren URI (regexp `{{}}` ile sarılmalıdır) | `example.com/user/{{[0-9]}}`<br><ul><li>`[header, 'HOST']` - `example.com`</li><li>`[path, 0]` - `user`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `[0-9]`</li><li>`[action_ext]` - `∅`</li>Değer, `example.com/user/3445` ile eşleşir<br>ve `example.com/user/3445/888` ile `example.com/user/3445/index.php` ile eşleşmez.</ul> |

URI constructor'a belirtilen dize, otomatik olarak [koşullar](#conditions) dizisine ayrılır:

* `method`
* `header`. URI constructor yalnızca `HOST` başlığını belirtmeye izin verir.
* `path`, `action_name`, `action_ext`. Kural oluşturmayı onaylamadan önce, bu istek bölümlerinin değerlerinin aşağıdaki yollardan biriyle ayrıştırıldığından emin olun:
    * Belirli bir `path` numarasının açıkça belirtilmiş değeri + `action_name` + `action_ext` (isteğe bağlı)
    * `action_name` + `action_ext` açıkça belirtilmiş değeri (isteğe bağlı)
    * `action_name` ve `action_ext` olmadan belirli bir `path` numarasının açıkça belirtilmiş değeri
* `query`

URI constructor'da belirtilen değeri, yalnızca [gelişmiş düzenleme formunda](#advanced-edit-form) bulunan diğer koşullarla tamamlayabilirsiniz.

#### Joker Karakterlerin Kullanımı

Wallarm'da URI constructor ile çalışırken joker karakterleri kullanabilir misiniz? Cevap hem evet hem hayırdır. “Hayır”, joker karakterleri [klasik anlamda](https://en.wikipedia.org/wiki/Wildcard_character) kullanamayacağınız anlamına gelir; “evet” ise aynı sonuca şu şekilde ulaşabileceğiniz anlamına gelir:

* URI'nizin ayrıştırılmış bileşenleri içerisinde, joker karakterler yerine düzenli ifadeler kullanın.
* Bir veya birden fazla bileşeni yer değiştirmek için URI alanına `*` veya `**` sembolünü yerleştirin (örneklere [yukarıdaki](#uri-constructor) bölümden bakın).

**Bazı ayrıntılar**

Düzenli ifadenin sözdizimi klasik joker karakterlerden farklıdır, ancak aynı sonuçlar elde edilebilir. Örneğin, şu maskeyi elde etmek istiyorsunuz:

* `something-1.example.com/user/create.com` ve
* `anything.something-2.example.com/user/create.com`

...ki klasik joker karakterlerde bunu şu şekilde yazmaya çalışırdınız:

* `*.example.com/user/create.com`

Ama Wallarm'da, `something-1.example.com/user/create.com` şu şekilde ayrıştırılacaktır:

![Example of parsing URI into components](../../images/user-guides/rules/something-parsed.png)

...burada `something-1.example.com`, `header`-`HOST` koşuludur. Joker karakterlerin koşul içerisinde kullanılamayacağını belirttik, bu yüzden yerine düzenli ifade kullanmamız gerekir: koşul tipini REGEX olarak ayarlayın ve ardından Wallarm'a [özel sözdizimini](#condition-type-regex) kullanın:

1. `*` karakterini "sıfır veya daha fazla sembol" anlamında kullanmayın.
2. Gerçek nokta olarak yorumlanmasını istediğimiz tüm `.` karakterlerini köşeli paranteze alın:

    `something-1[.]example[.]com`

3. Köşeli parantez kullanılmadan `.` karakterini "herhangi bir sembol" yerine ve ardından `*` karakterini, önceki ifadenin "0 veya daha fazla tekrarı" olarak kullanın; böylece `.*` elde edin:

    `.*[.]example[.]com`

4. Oluşturduğunuz ifadenin, bileşenimizin burada sona ermesi gerektiğini belirtmek için ifadenin sonuna `$` ekleyin:

    `.*[.]example[.]com$`

    !!! info "Daha Basit Yöntem"
        `.*` kısmını atlayabilir ve sadece `[.]example[.]com$` bırakabilirsiniz. Her iki durumda da Wallarm, `[.]example[.]com$` öncesinde herhangi bir karakterin herhangi bir sayıda görünebileceğini varsayar.

    ![Using regular expression in header component](../../images/user-guides/rules/wildcard-regex.png)

### Gelişmiş Düzenleme Formu

Gelişmiş düzenleme formu, [URI constructor](#uri-constructor) (yöntem ve URI) olanaklarını genişleterek, bunların yanı sıra uygulama, başlıklar, sorgu dizisi parametreleri ve diğer ek kural koşullarını yapılandırmanıza izin verir.

#### Koşullar

Koşullar, hangi değerlerin hangi istek bölümlerinde bulunması gerektiğini belirtir. Tüm koşullar sağlandığında kural uygulanır. Koşullar, kuralın **If request is** bölümünde listelenir.

Şu anda desteklenen koşullar şunlardır:

* **application**: uygulama kimliği.
* **proto**: HTTP protokol sürümü (1.0, 1.1, 2.0, ...).
* **scheme**: http veya https.
* **uri**: alan adı olmadan istek URL'sinin bir bölümü (örneğin, `/blogs/123/index.php?q=aaa` isteği için `http://example.com/blogs/123/index.php?q=aaa`).
* **path**, **action_name**, **action_ext**; hiyerarşik URI bileşen dizisi olarak:
    * **path**: `/` sembolü ile ayrılmış URI bölümlerinden oluşan bir dizi (son URI bölümü diziye dahil edilmez). Eğer URI'de sadece bir bölüm varsa, dizi boş olacaktır.
    * **action_name**: URI'de `/` sembolünden sonraki ve ilk nokta (`.`) öncesindeki son bölüm. Bu URI bölümü, değeri boş olsa bile her zaman istekte bulunur.
    * **action_ext**: URI'de son nokta (`.`) sonrasındaki bölüm. İstekte bulunmayabilir.
* **query**: sorgu dizisi parametreleri.
* **header**: istek başlıkları. Bir başlık adı girdiğinizde, en yaygın değerler açılır listede görüntülenir. Örneğin: `HOST`, `USER-AGENT`, `COOKIE`, `X-FORWARDED-FOR`, `AUTHORIZATION`, `REFERER`, `CONTENT-TYPE`.

    !!! info "FQDN'ler ve IP adresleri için `HOST` başlık kurallarını yönetme"
        Eğer `HOST` başlığı bir FQDN olarak ayarlanmışsa, ilişkili IP adresine yönelik istekler kuraldan etkilenmez. Bu tür isteklere kuralı uygulamak için, kural koşullarında `HOST` başlık değerini belirli IP olarak ayarlayın veya hem FQDN hem de IP için ayrı bir kural oluşturun.

        `HOST` başlığı değiştiren bir yük dengeleyicinin ardından konumlandırıldığında, Wallarm düğümü kuralları orijinal değer yerine güncellenmiş değere göre uygular. Örneğin, dengeleyici `HOST`'u bir IP'den alana çevirirse, düğüm o alan için kurallara uyar.

* **method**: istek yöntemleri. Değer açıkça belirtilmediyse, kural herhangi bir yöntemle gelen isteklere uygulanır.

#### Koşul Türü: EQUAL (`=`)

Değer, karşılaştırma argümanıyla tam olarak eşleşmelidir. Örneğin, yalnızca `example`, değeri `example` ile eşleşir.

!!! info "HOST başlık değeri için EQUAL koşul türü"
    Kurallarla daha fazla isteği kapsamak için, HOST başlığı için EQUAL koşul türünü kısıtladık. EQUAL türü yerine, parametre değerlerine herhangi bir biçimde izin veren IEQUAL türünü kullanmanızı öneririz.
    
    Daha önce EQUAL türünü kullandıysanız, otomatik olarak IEQUAL türüyle değiştirilecektir.

#### Koşul Türü: IEQUAL (`Aa`)

Değer, karşılaştırma argümanıyla herhangi bir biçimde eşleşmelidir. Örneğin: `example`, `ExAmple`, `exampLe` değerleri, `example` ile eşleşir.

#### Koşul Türü: REGEX (`.*`)

Değer, düzenli ifadeyle eşleşmelidir.

**Düzenli İfade Sözdizimi**

İstekleri düzenli ifadelerle eşleştirmek için PIRE kütüphanesi kullanılır. İfadelerin sözdizimi büyük ölçüde standarttır ancak aşağıda ve [PIRE repository][link-regex]'nin README dosyasında açıklandığı gibi bazı özelliklere sahiptir.

??? info "Düzenli ifade sözdizimini göster"
    Olduğu gibi kullanılabilecek karakterler:

    * Küçük Latin harfleri: `a b c d e f g h i j k l m n o p q r s t u v w x y z`
    * Büyük Latin harfleri: `A B C D E F G H I J K L M N O P Q R S T U V W X Y Z`
    * Rakamlar: `0 1 3 4 5 6 7 8 9`
    * Özel karakterler: <code>! " # % ' , - / : ; < = > @ ] _ ` }</code>
    * Boşluklar

    Kaçış karakteri `\` yerine köşeli paranteze alınması gereken karakterler:

    * `. $ ^ { [ ( | ) * + ? \ & ~`

    ISO‑8859'a göre ASCII'ye dönüştürülmesi gereken karakterler:

    * UTF‑8 karakterleri (örneğin, `ʃ` karakteri ASCII'ye dönüştürüldüğünde `Ê` olur)

    Karakter grupları:

    * `.`; yeni satır dışındaki herhangi bir karakter için
    * `()`; düzenli ifadeleri gruplamak, `()` içerisindeki sembolleri aramak veya öncelik sırası belirlemek için
    * `[]`; `[]` içinde bulunan tek bir karakter için (büyük/küçük harf duyarlı); grup şu durumlar için kullanılabilir:
        * büyük/küçük harf duyarlılığını göz ardı etmek (örneğin, `[cC]`)
        * `[a-z]`; küçük Latin harflerinden birini eşleştirmek için
        * `[A-Z]`; büyük Latin harflerinden birini eşleştirmek için
        * `[0-9]`; rakamlardan birini eşleştirmek için
        * `[a-zA-Z0-9[.]]`; küçük veya büyük Latin harflerinden, rakamlardan veya noktadan birini eşleştirmek için

    Mantıksal karakterler:

    * `~`; NOT anlamına gelir. Tersine çevrilmiş ifade ve karakter `()` içine alınmalıdır, örneğin: `(~(a))`
    * `|`; OR anlamına gelir
    * `&`; AND anlamına gelir

    Dize sınırlarını belirtmek için karakterler:

    * `^`; dizenin başlangıcı için
    * `$`; dizenin sonu için

    Kuantifikatörler:

    * `*`; önceki düzenli ifadenin 0 veya daha fazla tekrarı için
    * `+`; önceki düzenli ifadenin 1 veya daha fazla tekrarı için
    * `?`; önceki düzenli ifadenin 0 veya 1 tekrarı için
    * `{m}`; önceki düzenli ifadenin `m` tekrarı için
    * `{m,n}`; önceki düzenli ifadenin `m`'den `n`'ye kadar tekrarı için; `n` atlandığında üst sınır sonsuz olarak belirlenir

    Özel durumlarla çalışan karakter kombinasyonları:

    * `^.*$`; boş değerlerin eşleşmediği `^.+$` ile aynıdır.
    * `^.?$`, `^.{0,}$`, `^.{0,n}$`; ifadeleri `^.+$` ile eşdeğerdir.

    Şu anda desteklenmeyen:

    * `\W` (alfabetik olmayanlar), `\w` (alfabetik), `\D` (rakam olmayanlar), `\d` (rakamlar), `\S` (boşluk olmayanlar), `\s` (boşluklar) gibi karakter sınıfları

    Desteklenmeyen sözdizimleri:

    * Üç basamaklı sekizlik kodlar: `\NNN`, `\oNNN`, `\ONNN`
    * `\cN`; kontrol karakterlerini `\c` ile geçirmek (örneğin, `\cC` CTRL+C için)
    * `\A`; dizenin başlangıcı için
    * `\z`; dizenin sonu için
    * `\b`; dizenin sonundaki boşluk karakterinden önce veya sonra
    * `??`, `*?`, `+?`; tembel kuantifikatörler
    * Koşullu ifadeler

**Düzenli İfadeleri Test Etme**

Düzenli ifadeyi test etmek için Wallarm **cpire** aracını kullanın. Linux tabanlı işletim sisteminizde [Wallarm all-in-one installer](../../installation/nginx/all-in-one.md) aracılığıyla kurun veya [Wallarm NGINX tabanlı Docker imajı](../../admin-en/installation-docker-en.md) üzerinden şu şekilde çalıştırın:

=== "All-in-one installer"
    1. Wallarm all-in-one installer henüz indirilmediyse indirin:

        ```
        curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.0.x86_64-glibc.sh
        ```
    2. Wallarm modülleri henüz kurulmamışsa kurulum yapın:
        
        ```
        sudo sh wallarm-5.3.0.x86_64-glibc.sh -- --batch --token <API_TOKEN>
        ```
    3. **cpire** aracını çalıştırın:
        
        ```bash
        /opt/wallarm/usr/bin/cpire-runner -r '<YOUR_REGULAR_EXPRESSION>'
        ```
    4. Düzenli ifadeyle eşleşip eşleşmediğini kontrol etmek için değeri girin.
=== "NGINX-based Docker image"
    1. Wallarm Docker imajından **cpire** aracını çalıştırın:
    
        ```
        docker run --rm -it wallarm/node:5.3.0 /opt/wallarm/usr/bin/cpire-runner -r '<YOUR_REGULAR_EXPRESSION>'
        ```
    2. Düzenli ifadeyle eşleşip eşleşmediğini kontrol etmek için değeri girin.

Araç sonuç döndürecektir:

* `0`; değerin düzenli ifadeyle eşleşmesi durumunda
* `FAIL`; değerin düzenli ifadeyle eşleşmemesi durumunda
* Düzenli ifade geçersizse hata mesajı

!!! warning " `\` karakterinin işlenmesine ilişkin özel durumlar"
    Eğer ifade `\` içeriyorsa, lütfen bunu `[]` ve `\` ile kaçırın (örneğin, `[\\]`).

**Wallarm Console üzerinden eklenen düzenli ifade örnekleri**

* `<code>/.git</code>` içeren herhangi bir dizeyle eşleşmek için

    ```
    /[.]git
    ```
* `<code>.example.com</code>` içeren herhangi bir dizeyle eşleşmek için

    ```
    [.]example[.]com
    ```
* `*` herhangi bir sembolün herhangi bir sayıda tekrarı olabileceği varsayımıyla, `<code>/.example.*.com</code>` ile biten herhangi bir dizeyle eşleşmek için

    ```
    /[.]example[.].*[.]com$
    ```
* 1.2.3.4 ve 5.6.7.8 dışındaki tüm IP adresleriyle eşleşmek için

    ```
    ^(~((1[.]2[.]3[.]4)|(5[.]6[.]7[.]8)))$
    ```
* `<code>.example.com.php</code>` ile biten herhangi bir dizeyle eşleşmek için

    ```
    /[.]example[.]com[.]php$
    ```
* Küçük ve büyük harflerle, örneğin: `<code>sqLmAp</code>`, `<code>SqLMap</code>` gibi, `<code>sqlmap</code>` içeren herhangi bir dizeyle eşleşmek için

    ```
    [sS][qQ][lL][mM][aA][pP]
    ```
* Bir veya birden fazla değeri içeren herhangi bir dizeyle eşleşmek için: `<code>admin\.exe</code>`, `<code>admin\.bat</code>`, `<code>admin\.sh</code>`, `<code>cmd\.exe</code>`, `<code>cmd\.bat</code>`, `<code>cmd\.sh</code>`

    ```
    (admin|cmd)[\\].(exe|bat|sh)
    ```
* Bir veya birden fazla değeri içeren herhangi bir dizeyle eşleşmek için: `<code>onmouse</code>` (küçük ve büyük harflerle), `<code>onload</code>` (küçük ve büyük harflerle), `<code>win\.ini</code>`, `<code>prompt</code>`

    ```
    [oO][nN][mM][oO][uU][sS][eE]|[oO][nN][lL][oO][aA][dD]|win[\\].ini|prompt
    ```
* `Mozilla` ile başlayan ancak `1aa875F49III` dizesini içermeyen herhangi bir dizeyle eşleşmek için
    
    ```
    ^(Mozilla(~(.*1aa875F49III.*)))$
    ```
* Aşağıdaki değerlerden biriyle eşleşen herhangi bir dizeyle: `python-requests/`, `PostmanRuntime/`, `okhttp/3.14.0`, `node-fetch/1.0`

    ```
    ^(python-requests/|PostmanRuntime/|okhttp/3.14.0|node-fetch/1.0)
    ```

#### Koşul Türü: ABSENT (`∅`)

İstek, belirtilen bölümü içermemelidir. Bu durumda, karşılaştırma argümanı kullanılmaz.

## Kurallar Seti Yaşam Döngüsü

Oluşturulan tüm kurallar, özel bir kurallar seti oluşturur. Wallarm düğümü, gelen isteklerin analizinde bu özel kurallar setine güvenir.

Özel kurallardaki değişiklikler anında geçerli olmaz. Değişiklikler, özel kurallar seti **derlenip** filtreleme düğümüne **yüklenmesi** tamamlandıktan sonra istek analiz sürecine uygulanır.

### Özel Kurallar Seti Oluşturma

Wallarm Console → **Kurallar** bölümünde yeni bir kural eklemek, mevcut kuralları silmek veya değiştirmek, özel kurallar seti oluşturma sürecini başlatır. Oluşturma sürecinde, kurallar optimize edilir ve filtreleme düğümü için uygun formata derlenir. Özel kurallar seti oluşturma süreci, kural sayısının az olduğu durumlarda birkaç saniyeden, karmaşık kural ağaçlarında ise bir saate kadar sürebilir.

### Filtreleme Düğümüne Yükleme

Özel kurallar seti oluşturması, filtreleme düğümü ile Wallarm Cloud senkronizasyonu sırasında filtreleme düğümüne yüklenir. Varsayılan olarak, filtreleme düğümü ile Wallarm Cloud senkronizasyonu her 2‑4 dakikada bir başlatılır. [Filtreleme düğümü ve Wallarm Cloud senkronizasyon yapılandırması hakkında daha fazla detay →](../../admin-en/configure-cloud-node-synchronization-en.md)

Özel kurallar setinin filtreleme düğümüne yüklenme durumu, `/opt/wallarm/var/log/wallarm/wcli-out.log` dosyasına kaydedilir.

Aynı Wallarm hesabına bağlı tüm Wallarm düğümleri, trafik filtrelemesi için aynı varsayılan ve özel kural setini alır. Uygun uygulama kimlikleri veya başlıklar, sorgu dizisi parametreleri gibi benzersiz HTTP istek parametrelerini kullanarak farklı uygulamalar için farklı kurallar uygulayabilirsiniz.

### Yedekleme ve Geri Yükleme

Yanlış yapılandırılmış veya silinmiş kurallardan yanlışlıkla zarar görmenizi önlemek için mevcut özel kurallar setinizi yedekleyebilirsiniz.

Aşağıdaki kural yedekleme seçenekleri mevcuttur: 

* Her [özel kurallar seti oluşturmasından](#custom-ruleset-building) sonra otomatik yedek oluşturma. Otomatik yedek sayısı 7 ile sınırlıdır: kuralları birden fazla kez değiştirdiğiniz her gün için yalnızca son yedek saklanır.
* Herhangi bir zamanda manuel yedek oluşturma. Manuel yedek sayısı varsayılan olarak 5 ile sınırlıdır. Daha fazlasına ihtiyacınız varsa, [Wallarm technical support](mailto:support@wallarm.com) ekibiyle iletişime geçin.

Yapabilecekleriniz:

* Mevcut yedeklere erişim: **Kurallar** bölümünde **Backups** düğmesine tıklayın.
* Manuel olarak yeni yedek oluşturma: **Backups** penceresinde **Create backup** düğmesine tıklayın.
* Manuel yedek için isim ve açıklama belirleyin; istediğiniz zaman düzenleyin.

    !!! info "Otomatik yedekler için isimlendirme"
        Otomatik yedekler sistem tarafından adlandırılır ve yeniden adlandırılamaz.

* Mevcut yedekten yükleme: Gerekli yedek için **Load** düğmesine tıklayın. Yedekten yükleme yapıldığında, mevcut kural yapılandırmanız silinir ve yedekteki yapılandırma ile değiştirilir.
* Yedeği silin.

    ![Rules - Creating backup](../../images/user-guides/rules/rules-create-backup.png)

!!! warning "Kural değişiklik sınırlamaları"
    Yedek oluşturma veya yedekten yükleme tamamlanana kadar kurallar oluşturamaz veya değiştiremezsiniz.

## Kuralları Almak için API Çağrıları

Özel kuralları almak için, [Wallarm API'sine doğrudan çağrı yapabilirsiniz](../../api/request-examples.md#get-all-configured-rules).
```