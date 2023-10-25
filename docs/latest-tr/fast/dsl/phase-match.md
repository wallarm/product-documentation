[bağlantı-noktalar]:          points/intro.md
[bağlantı-ruby-regex]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[bağlantı-ext-mantık]:       logic.md

# Eşleşme Aşaması

!!! bilgi "Aşamanın kapsamı"  
    Bu aşama, düzenleme uzantısında kullanılır ve işleyişi için isteğe bağlıdır (`match` bölümü YAML dosyasında ya bulunmayabilir ya da bulunabilir).

    Bu aşama, düzenleme yapmayan uzantının YAML dosyasında bulunmamalıdır.
    
    Uzantı türleri hakkında ayrıntılı bilgi [burada][bağlantı-ext-mantık] bulabilirsiniz.

!!! bilgi "İstek öğesi açıklama sözdizimi"
     Bir FAST uzantısı oluştururken, uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamanız ve çalışmak istediğiniz istek öğelerini doğru bir şekilde tanımlamak için noktaları kullanmanız gerekir.
    
    Detaylı bilgiyi görmek için bu [bağlantıya][bağlantı-noktalar] gidin.

Bu aşama, gelen temel çizgili isteğin belirli bir kritere uyup uymadığını kontrol eder.

Uzantı YAML dosyasındaki `match` bölümü, bir dizi `<anahtar: değer>` çifti içerir. Her çift, isteğin belirli bir öğesini (anahtarı) ve bu öğenin verilerini (değeri) tanımlar. Anahtar ve değer, [Ruby düzenli ifade formatı][bağlantı-ruby-regex] içinde düzenli ifadeler içerebilir.

Eşleşme aşaması, temel çizgili istekte verilen tüm `<anahtar: değer>` çiftlerini arar.
* İsteğin, gerekli verilerle (örneğin, URL'deki yol değeri, GET parametresi veya HTTP başlığı) gerekli öğelerin varlığına karşı kontrol edilir.
    
    ??? bilgi "Örnek 1"
        `'GET_a_değeri': '^\d+$'` — İsteğin, yalnızca rakam içeren bir `a` adındaki GET parametresini içermesi gerekir.
    
    ??? bilgi "Örnek 2"
        `'GET_b*_değeri': '.*'` — İsteğin, adı `b` ile başlayan ve herhangi bir değer içeren (boş değer dahil) bir GET parametresini içermesi gerekir.
    
* Eğer bir anahtar için değer `null` olarak ayarlanmışsa, istekte karşılık gelen öğenin yokluğu kontrol edilir.
    
    ??? bilgi "Örnek"
        `'GET_a': null` — GET `a` adındaki parametrenin istekte bulunmaması gerekir.

Temel isteğin Eşleşme aşamasından geçebilmesi için, isteğin `match` bölümündeki tüm `<anahtar: değer>` çiftlerini karşılaması gereklidir. Eğer `match` bölümünde tanımlanan `<anahtar: değer>` çiftlerinden herhangi birine temel çizgili istekte uyan bulunamazsa, istek atılacaktır.

??? bilgi "Örnek"
    Aşağıda gösterilen `match` bölümü, `<anahtar: değerler>` çiftlerinin listesini içerir. Temel isteğin Eşleşme aşamasından geçebilmesi için, bu çiftlerin tümünü karşılaması gereklidir.

    ```
    match:
    - 'HEADER_HOST_değeri': 'example.com'
    - 'GET_password_değeri': '^\d+$'
    - 'HEADER_CONTENT-TYPE_değeri': null
    ```

    1. Temel istek, değerinde `example.com` içeren `Header` adında bir HTTP başlığı içermelidir.
    2. `password` GET parametresinin değeri yalnızca rakam içermelidir.
    3. `Content-Type` başlığı bulunmamalıdır.