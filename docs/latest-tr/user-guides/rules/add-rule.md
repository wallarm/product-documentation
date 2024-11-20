[link-request-processing]:      request-processing.md
[link-regex]:                   https://github.com/yandex/pire
[link-filter-mode-rule]:        wallarm-mode-rule.md
[link-sensitive-data-rule]:     sensitive-data-rule.md
[link-virtual-patch]:           vpatch-rule.md
[link-regex-rule]:              regex-rule.md

[img-add-rule]:     ../../images/user-guides/rules/add-rule.png

# Uygulama Profili'ne Kurallar Ekleme

Yeni bir kural eklemek için, *Kurallar* sekmesine gidin.

Olan ve yeni dallara, sıfırdan oluşturulmuş ya da mevcut dallardan birine dayanarak kurallar eklenebilir.

Varolan bir dala kural eklemek için, *Kural ekle*'i tıklayın (dalların açıklama satırının üstüne fare imleci getirildiğinde, düğme açılır menünün sağ kısmında çıkar). Bu işlemi bu dalın kural sayfasında da gerçekleştirebilirsiniz.

Gerektiğinde, kuralın ekleneceği dalı değiştirmek mümkündür. Bunun için, kural eklerken formdaki *Eğer istek* maddesini tıklayın ve dalı tanımlayan koşullarda değişiklik yapın. Yeni bir dal oluşturulduğunda, bu ekranda görünür ve uygulama yapısı görünümü güncellenir.

![Yeni bir kural ekleme][img-add-rule]


## Dal Tanımı

Dal tanımı, bir HTTP isteğinin karşılaması gereken çeşitli parametreler için bir koşul kümesinin oluşturulmasına dayanmaktadır; aksi halde, bu dal ile ilişkilendirilmiş kurallar uygulanmayacaktır. Kural eklenirken formdaki *Eğer istek* bölümündeki her satır, üç alandan oluşan ayrı bir koşulu ifade eder: nokta, tür ve karşılaştırma argümanı. Dalda belirtilen kurallar, yalnızca tüm koşullar karşılandığında isteğe uygulanır.

Koşulların kümesini yapılandırmak için hem **URI yapıcı** hem de **ileri düzey düzenleme formu** kullanılabilir.

### URI Yapıcı

#### URI Yapıcı ile Çalışma

URI Yapıcı, talep yöntemini ve bit noktasını tek bir stringde belirterek kural koşullarını yapılandırmayı sağlar:

* İstek yöntemi için URI yapıcı belirli bir seçici sağlar. Eğer yöntem seçilmezse, kural herhangi bir yöntemi olan isteklere uygulanır.
* Bit noktası için URI yapıcı, aşağıdaki değer formatlarını kabul eden belirli bir alan sağlar:

    | Biçim | Örnekler ve İstek nokta değerleri |
    | ------ | ------ |
    | Şu bileşenleri içeren tam URI:<ul><li>Şema (değer göz ardı edilir, gelişmiş formu kullanarak şemayı açıkça belirleyebilirsiniz)</li><li>Alan adı veya bir IP adresi</li><li>Port</li><li>Yol</li><li>Sorgu dizesi parametreleri</ul> | `https://örnek.com:3000/api/kullanıcı.php?q=eylem&w=silme`<br><ul><li>`[header, 'HOST']` - `örnek.com:3000`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `kullanıcı`</li><li>`[action_ext]` - `php`</li><li>`[query, 'q']` - `eylem`</li><li>`[query, 'w']` - `silme`</li></ul>|
    | Bazı bileşenleri eksik olan URI | `örnek.com/api/kullanıcı`<br><ul><li>`[header, 'HOST']` - `örnek.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `kullanıcı`</li><li>`[action_ext]` - `∅`</li></ul><br>`http://örnek.com/api/clients/kullanıcı/?q=eylem&w=silme`<br><ul><li>`[header, 'HOST']` - `örnek.com`</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `clients`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - `kullanıcı`</li><li>`[query, 'q']` - `eylem`</li><li>`[query, 'w']` - `silme`</li></ul><br>`/api/kullanıcı`<br><ul><li>``[header, 'HOST']` - herhangi bir değer</li><li>`[path, 0]` - `api`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `kullanıcı`</li><li>`[action_ext]` - `∅`</li></ul>|
    | URI içinde `*` gibi bileşenin herhangi bir dolu değerine anlam verme | `örnek.com/*/oluştur/*.*`<br><ul><li>`[header, 'HOST']` - `örnek.com`</li><li>`[path, 0]` - herhangi bir dolu değer (ileri düzey düzenleme formunda gizli)</li><li>`[path, 1]` - `oluştur`</li><li>`[path, 2]` - `∅`</li><li>`[action_name]` - herhangi bir dolu değer (ileri düzey düzenleme formunda gizli)</li><li>`[action_ext]` - herhangi bir dolu değer (ileri düzey düzenleme formunda gizli)</li>Değer, `örnek.com/api/oluştur/kullanıcı.php` ile uyuşur<br>ve `örnek.com/oluştur/kullanıcı.php` ve `örnek.com/api/oluştur` ile uyuşmaz.</ul>|
    | URI'da `**` gibi herhangi bir sayıda bileşen anlamına gelen, varlığını da düşünmeyi | `örnek.com/**/kullanıcı`<br><ul><li>`[header, 'HOST']` - `örnek.com`</li><li>`[action_name]` - `kullanıcı`</li><li>`[action_ext]` - `∅`</li>Değer, `örnek.com/api/oluştur/kullanıcı` ve `örnek.com/api/kullanıcı` ile uyuşuyor.<br>Değer, `örnek.com/kullanıcı`, `örnek.com/api/kullanıcı/index.php` ve `örnek.com/api/kullanıcı/?w=silme` ile uyuşmuyor.</ul><br>`örnek.com/api/**/*.*`<br><ul><li>`[header, 'HOST']` - `örnek.com`</li><li>`[path, 0]` - `api`</li><li>`[action_name]` - herhangi bir dolu değer (ileri düzey düzenleme formunda gizli)</li><li>`[action_ext]` - herhangi bir dolu değer (ileri düzey düzenleme formunda gizli)</li>Değer, `örnek.com/api/oluştur/kullanıcı.php` ve `örnek.com/api/kullanıcı/oluştur/index.php` ile uyuşur<br>ve `örnek.com/api`, `örnek.com/api/kullanıcı` ve `örnek.com/api/oluştur/kullanıcı.php?w=silme` ile uyuşmaz.</ul> |
    | Belli bileşen değerleriyle eşleşmesi için URI ile [düzenli ifade](#condition-type-regex) (regexp `{{}}` ile sarmalanmalı) | `örnek.com/kullanıcı/{{[0-9]}}`<br><ul><li>`[header, 'HOST']` - `örnek.com`</li><li>`[path, 0]` - `kullanıcı`</li><li>`[path, 1]` - `∅`</li><li>`[action_name]` - `[0-9]`</li><li>`[action_ext]` - `∅`</li>Değer, `örnek.com/kullanıcı/3445` ile uyuşuyor<br>ve `örnek.com/kullanıcı/3445/888` ve `örnek.com/kullanıcı/3445/index.php` ile uyuşmuyor.</ul> |

URI yapıcısında belirtilen string, aşağıdaki [istek noktaları](#points) için koşullar kümesine otomatik olarak ayrıştırılır:

* `method`
* `header`. URI yapıcısı, yalnızca 'HOST' başlığını belirtmeye izin verir.
* `path`, `action_name`, `action_ext`. Kural oluşturmayı onaylamadan önce, bu istek noktalarının değerlerinin aşağıdakilerden biri gibi ayrıştırıldığından emin olun:
    * Belirli bir `path` numarasının açık değeri + `action_name` + `action_ext` (isteğe bağlı)
    * `action_name`'nin açık değeri + `action_ext` (isteğe bağlı)
    * Belirli bir `path` numarasının açık değeri, `action_name` ve `action_ext`'siz
* `query`

URI Yapıcısında belirtilen değer, yalnızca [ileri düzey düzenleme formunda](#advanced-edit-form) kullanılabilen diğer istek noktaları ile tamamlanabilir.

#### Jinnsinin Kullanımı

Wallarm'da URI yapıcısıyla çalışırken jinni kullanabilir misiniz? Hayır ve evet. "Hayır" demek, onları [klasik bir şekilde](https://en.wikipedia.org/wiki/Wildcard_character) kullanamayacağınız anlamına gelir, "evet" demek, şöyle hareket ederek aynı sonuca ulaşabileceğiniz anlamına gelir:

* URI'nizde ayrıştırılan bileşenlerin içinde, jinni yerine düzenli ifadeleri kullanın.
* URI alanına kendisini bir veya herhangi bir sayıda bileşenin yerine geçirmek için `*` veya `**` sembolünü yerleştirin (yukarıdaki [bölümde](#working-with-uri-constructor) örnekleri göz atın).

**Bazı detaylar**

Düzenli ifadenin sözdizimi klasik jinniden farklıdır, ancak aynı sonuçları elde edebilirsiniz. Örneğin, şuna karşılık gelen bir maske elde etmek istersiniz:

* `something-1.örnek.com/kullanıcı/oluştur.com` ve
* `hiçbirşey.something-2.örnek.com/kullanıcı/oluştur.com`

... hangi klasik jinini şunun gibi yazarak elde edilir:

* `*.örnek.com/kullanıcı/oluştur.com`

Ama Wallarm'da, `something-1.örnek.com/kullanıcı/oluştur.com`'unuz şuna ayrıştırılır:

![URI'nin bileşenlere çözümlemesi adlı örnek](../../images/user-guides/rules/something-parsed.png)

... burada `something-1.örnek.com` bir `header-`HOST' noktasıdır. Jininin nokta içinde kullanılamayacağını belirtmiştik, bu yüzden düzenli ifadeyi kullanmamız gerekiyor: durum türünü REGEX olarak belirleyin ve ardından Wallarm'a özgü düzenli ifadenin [özel sözdizimini](#condition-type-regex) kullanın:

1. "Herhangi bir sayıda sembol" anlamında `*` kullanmayın.
1. "Gerçek nokta" olarak yorumlanmasını istediğimiz tüm `.`'ları köşeli parantezlerin içine koyun:

    `something-1[.]örnek[.]com`

1. "Herhangi bir sembol" yerine parantez içlerindeki `.` kullanın ve "önceki olanın 0 ya da daha fazla tekrarı" olarak belirtmek için `*` ardından gönderin, böylece `.*` elde edin ve:
    
    `.*[.]örnek[.]com`

1. Bileşenimizi bitirecek olan ifadeyi oluşturduğumuz şey etiketlemek için sonuna `$` ekleyin:
    
    `.*[.]örnek[.]com$`

    !!! info "Daha basit bir yol"
        `.*`'ı atlayabilir ve yalnızca `[.]örnek[.]com$` bırakabilirsiniz. Her iki durumda da, Wallarm herhangi bir karakterin `[.]örnek[.]com$`'dan önce herhangi bir sayıda kez görünebileceğini varsayar.

    ![Başlık bileşeninde düzenli ifade kullanımı](../../images/user-guides/rules/wildcard-regex.png)

### İleri Düzey Düzenleme Formu

#### Noktalar

*Nokta* alanı, karşılaştırma için hangi parametre değerinin istekten çıkarılması gerektiğini gösterir. Şimdilik, filtre düğümünün analiz edebileceği tüm noktalar desteklenmiyor.

Şu anda şu noktalar desteklenmektedir:

* **uygulama**: uygulama ID'si.
* **proto**: HTTP protokol sürümü (1.0, 1.1, 2.0, ...)
* **çerçeve**: http ya da https.
* **uri**: alan adı olmaksızın istek URL'sinin parçası (örneğin, `http://örnek.com/blogs/123/index.php?q=aaa` için `/blogs/123/index.php?q=aaa`)
* **path**, **action_name**, **action_ext** birbiriyle hiyerarşik URI bileşeni sırasıdır: 

    * **path**: URI parçalarını `/` sembolü ile ayıran bir dizi (son URI parçası bu diziye dahil edilmez). Eğer URI'da yalnızca bir parça varsa, dizi boş olacaktır.
    * **action_name**: `/` sembolünden sonraki ve ilk noktadan (`.`) önceki URI parçası. Bu URI parçası her zaman istekte bulunur, hatta değeri boş dizi bile olsa.
    * **action_ext**: son noktadan (`.`) sonraki URI parçası. Bu, istekte olmayabilir.
* **query**: sorgu dizesi parametreleri.
* **header**: istek başlıkları. Bir başlık adı girerken, en yaygın değerler bir açılır listede görüntülenir. Örneğin: `HOST`, `USER-AGENT`, `COOKIE`, `X-FORWARDED-FOR`, `AUTHORIZATION`, `REFERER`, `CONTENT-TYPE`.

    !!! info "`HOST` başlık kurallarını FQDN'ler ve IP adresleri için yönetme"
        `HOST` başlık FQDN olarak ayarlandıysa, onunla ilişkili IP adresini hedefleyen istekler kural tarafından etkilenmez. Bu tür isteklere kuralı uygulamak için, kural koşullarında `HOST` başlık değerini belirli bir IP olarak ayarlayın veya hem FQDN hem de IP için ayrı bir kural oluşturun.

        `HOST` başlığını değiştiren bir yük dengeleyicisinin ardına konumlandırılan Wallarm düğümü, kuralları güncellenen değerin üzerinde, orijinal değil bağlantılı olarak uygular. Örneğin, eğer dengeleyici `HOST`'u bir IP'den bir domaine çevirirse, düğüm o domaine ilişkin kuralları izler.

* **method**: istek yöntemleri. Eğer değer açıkça belirtilmezse, kural herhangi yöntemi olan isteklere uygulanır.

#### Durum Türü: EŞİT (`=`)

Nokta değeri, karşılaştırma argümanı ile tam olarak uyuşmalıdır. Örneğin, yalnızca `örnek` nokta değeri `örnek` ile uyuşur.

!!! info "`HOST` başlık değeri için EŞİT durum türü"
    Daha fazla isteği kurallarla karşılamak için, `HOST` başlık için EŞİT durum türünü sınırladık. EŞİT tip yerine, herhangi bir düzende parametre değerlerine izin veren IEQUAL tipini kullanmanızı öneririz.
    
    Eğer önceden EŞİT tipi kullanmışsanız, otomatik olarak IEQUAL tipi ile değiştirilecektir.

#### Durum Türü: IEQUAL (`Aa`)

Nokta değeri, karşılaştırma argümanı ile herhangi bir durumda uyuşmalıdır. Örneğin: `örnek`, `ÖrNek`, `örneK` nokta değeri `örnek` ile uyuşur.

#### Durum Türü: REGEX (`.*`)

Nokta değeri düzenli ifade ile uyuşmalıdır. 

**Düzenli ifade sözdizimi**

İstekleri düzenli ifadelerle uyuşacak şekilde ayarlamak için PIRE kütüphanesi kullanılır. İfadelerin sözdizimi çoğunlukla standarttır ancak aşağıda ve [PIRE reposunun](link-regex) README dosyasında açıklanan bazı özelliklere sahiptir.

??? info "Düzenli ifade sözdizimini göster"
    Olduğu gibi kullanılabilen karakterler:

    * Küçük harfli Latin harfleri: `a b c d e f g h i j k l m n o p q r s t u v w x y z`
    * Büyük harfli Latin harfleri: `A B C D E F G H I J K L M N O P Q R S T U V W X Y Z`
    * Rakamlar: `0 1 3 4 5 6 7 8 9`
    * Özel karakterler: <code>! " # % ' , - / : ; < = > @ ] _ ` }</code>
    * Boşluklar

    `\` ile kaçırılması yerine köşeli parantezler `[]` içine yerleştirilmesi gereken karakterler:

    * `. $ ^ { [ ( | ) * + ? \ & ~`

    ISO-8859'a göre ASCII'ye dönüştürülmesi gereken karakterler:

    * UTF-8 karakterler (örneğin, `ʃ` karakteri ASCII'ye dönüştürüldüğünde `Ê` olur)

    Karakter grupları:

    * Yeni satır dışında herhangi bir karakter için `.`
    * Düzenli ifadeleri gruplandırmak, `()` içinde bulunan sembolleri aramak ya da önceliği belirlemek için `()`
    * `[]` içinde bulunan tek bir karaktere uymak için `[]` (büyük-küçük harf duyarlı); grup belirli durumlar için kullanılabilir:
        * büyük-küçük harfi görmezden gelmek için (örneğin, `[cC]`)
        * küçük harfli Latin harflerinden birine uymak için `[a-z]`
        * büyük harfli Latin harflerinden birine uymak için `[A-Z]`
        * bir rakama uymak için `[0-9]`
        * küçük, veya büyük Latin harflerine, ya da rakamlara, ya da noktaya uymak için `[a-zA-Z0-9[.]]`

    Mantıksal karakterler:

    * `~` NOT'a eşittir. Tersine çevrilen ifade ve karakter `()` içine yerleştirilmeli,<br>örneğin: `(~(a))`
    * `|` OR'a eşittir
    * `&` AND'e eşittir

    String sınırlarını belirtmek için karakterler:

    * `^` stringin başlangıcı için
    * `$` stringin sonu için

    Kuantifierler:

    * `*` önceki düzenli ifadenin 0 ya da daha fazla tekrarı için
    * `+` önceki düzenli ifadenin 1 ya da daha fazla tekrarı için
    * `?` önceki düzenli ifadenin 0 ya da 1 tekrarı için
    * `{m}` önceki düzenli ifadenin `m` tekrarı için
    * `{m,n}` önceki düzenli ifadenin `m` den `n` ye tekrarı için; `n`nin atlanması sonsuz bir üst sınıra belirtir

    Detaylarıyla çalışma:

    * `^.*$` `^.+$`'a eşittir (boş değerler `^.*$`'e uymaz)
    * `^.?$`, `^.{0,}$`, `^.{0,n}$` `^.+$`'a eşittir

    Geçici olarak desteklenmeyenler:

    * `\W` alfabedik olmayanlar gibi karakter sınıfları, `\w` alfabedikler, `\D` herhangi bir tane olmayan rakamlar, `\d` herhangi onluk, `\S` boşluk olmayanlar, `\s` boşluklar

    Desteklenmeyen sözdizimi:

    * `\NNN`, `\oNNN`, `\ONNN` olarak Üç basamaklı oktal kodlar
    * `\c` üzerinden kontrol karakterlerini geçme `\cN` (örneğin, `\cC` CTRL+C için)
    * `\A` stringin başlangıcı için
    * `\z` stringin sonu için
    * `\b` stringin sonundaki boşluk karakterinden önce veya sonra
    * `??`, `*?`, `+?` tembel kuantifierler
    * Koşullar

**Düzenli ifadelerin testi**

Düzenli ifadenizi test etmek için, desteklenen Debian ya da Ubuntu üzerinde **cpire** yardımcı programını kullanabilirsiniz:

1. Wallarm deposunu ekleyin:

    === "Debian 10.x (buster)"
        ```bash
        sudo apt güncelle
        sudo apt -y dirmngr yükle
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node buster/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt güncelle
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        sudo apt güncelle
        sudo apt -y dirmngr yükle
        curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
        sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
        sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt güncelle
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        sudo apt güncelle
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt güncelle
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        sudo apt güncelle
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt güncelle
        ```
    === "Ubuntu 22.04 LTS (jammy)"
        ```bash
        sudo apt güncelle
        curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
        sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node jammy/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
        sudo apt güncelle
        ```
2. **cpire** yardımcı programını yükleyin:

    ```bash
    sudo apt -y libcpire-utils yükle
    ```
3. **cpire** yardımcı programını çalıştırın:
    ```bash
    cpire-runner -R '<DÜZENLİ İFADE>'
    ```
4. Düzenli ifade ile uyuşup uyuşmadığını kontrol etmek için bir değer girin. Yardımcı program sonucu döndürecektir:
    * Düzeli ifade ile uyuşan değer için `0`
    * Düzeli ifade ile uyuşmayan değer için `FAIL`
    * Düzeli ifade geçersizse hata mesajı

    !!! uyarı "`\` karakterini işlemenin özellikleri"
        Eğer ifade `\` içeriyorsa, lütfen onu `[]` ve `\` ile kaçırın (örneğin, `[\\]`).

**Wallarm Konsolu üzerinden eklenmiş düzenli ifade örnekleri**

* <code>/.git</code> içeren herhangi bir dizeyi eşlemek için

    ```
    /[.]git
    ```
* <code>.örnek.com</code> içeren herhangi bir dizeyi eşlemek için

    ```
    [.]örnek[.]com
    ```
* <code>/.örnek.*.com</code> ile biten bir dizeyi eşlemek için, burada `*`, herhangi sembol olabilir ve defalarca tekrarlanabilir

    ```
    /[.]örnek[.].*[.]com$
    ```
* 1.2.3.4 ve 5.6.7.8 dışındaki tüm IP adresleriyle eşleşecek ifade

    ```
    ^(~((1[.]2[.]3[.]4)|(5[.]6[.]7[.]8)))$
    ```
* <code>/.örnek.com.php</code> ile biten herhangi bir dizeyi eşlemek için

    ```
    /[.]örnek[.]com[.]php$
    ```
* Büyük veya küçük harfli <code>sqlmap</code> içeren, örneğin <code>sqLmAp</code> veya <code>SqLMap</code> gibi, herhangi bir dizeyi eşlemek için

    ```
    [sS][qQ][lL][mM][aA][pP]
    ```
* <code>admin\\.exe</code>, <code>admin\\.bat</code>, <code>admin\\.sh</code>, <code>cmd\\.exe</code>, <code>cmd\\.bat</code>, <code>cmd\\.sh</code> gibi bir veya birden fazla değeri içeren herhangi bir dizeyi eşlemek için

    ```
    (admin|cmd)[\\].(exe|bat|sh)
    ```
* Büyük veya küçük harfli <code>onmouse</code>, büyük veya küçük harfli <code>onload</code>, <code>win\\.ini</code>, <code>prompt</code> olan biri veya birkaç değeri içeren herhangi bir dizeyi eşlemek için

    ```
    [oO][nN][mM][oO][uU][sS][eE]|[oO][nN][lL][oO][aA][dD]|win[\\].ini|prompt
    ```
* `Mozilla` ile başlayan ancak `1aa875F49III` stringini içermeyen herhangi bir dizeyi eşlemek için
    
    ```
    ^(Mozilla(~(.*1aa875F49III.*)))$
    ```
* `python-requests/`, `PostmanRuntime/`, `okhttp/3.14.0`, `node-fetch/1.0` gibi bir değeri içeren herhangi bir dizeyi eşlemek için

    ```
    ^(python-requests/|PostmanRuntime/|okhttp/3.14.0|node-fetch/1.0)
    ```

#### Durum Türü: MEVCUT DEĞİL (`∅`)

İsteğin belirli noktayı içermemesi gerekiyor. Bu durumda, karşılaştırma argümanı kullanılmaz.

## Kural

Eklenen istek işleme kuralı *Sonra* bölümünde tanımlanır.

Aşağıdaki kurallar desteklenmektedir:

* [Ayrıştırıcıları devre dışı bırak / etkinleştir](disable-request-parsers.md)
* [Sunucu yanıt başlıklarını değiştir](add-replace-response-header.md)
* [Filtrasyon modunu ayarla][link-filter-mode-rule]
* [Hassas verileri maskala][link-sensitive-data-rule]
* [Aktif tehdit doğrulama modunu ayarla](../../vulnerability-detection/active-threat-verification/enable-disable-active-threat-verification.md)
* [Aktif doğrulama öncesi saldırıları yeniden yaz](../../vulnerability-detection/active-threat-verification/modify-requests-before-replay.md)
* [Sanal bir yama uygula][link-virtual-patch]
* [Kullanıcı tarafından tanımlanmış tespit kuralları][link-regex-rule]
* [Belirli saldırı türlerini yoksay](ignore-attack-types.md)
* [İkili verideki belirli saldırı işaretlerini yoksay](ignore-attacks-in-binary-data.md)
* [Overlimit_res saldırı tespitini ince ayarla](configure-overlimit-res-detection.md)
* [API İstismar Önlemesi modunu belirli hedef URL'ler için ayarla](api-abuse-url.md)
