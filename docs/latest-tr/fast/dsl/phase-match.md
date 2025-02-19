[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-ext-logic]:       logic.md

# Eşleşme Aşaması

!!! info "Aşamanın Kapsamı"  
    Bu aşama, değiştirilebilir eklentilerde kullanılır ve çalışması için isteğe bağlıdır (YAML dosyasında `match` bölümü bulunabilir ya da bulunmayabilir).

    Değiştirilemeyen eklentinin YAML dosyasında bu aşama yer almamalıdır.
    
    Eklenti türleri hakkında detaylı bilgi için [buraya][link-ext-logic] bakın.

!!! info "İstek öğesi açıklama sözdizimi"
    FAST eklentisi oluştururken, üzerinde çalışmanız gereken istek öğelerini doğru şekilde tanımlayabilmek için uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamanız gerekmektedir.
    
    Detaylı bilgi için, [buraya][link-points] gözatın.
 
Bu aşama, gelen temel isteğin belirtilen kriterlere uyup uymadığını kontrol eder.

Eklenti YAML dosyasındaki `match` bölümü, `<key: value>` çiftlerinden oluşan bir dizi içerir. Her çift, isteğin belirli bir öğesini (anahtar) ve bu öğeye ait veriyi (değer) tanımlar. Anahtar ve değer, [Ruby regular expression formatı][link-ruby-regexp] şeklinde düzenli ifadeler içerebilir.

Eşleşme aşaması, temel istekte belirtilen tüm `<key: value>` çiftleri için eşleşme arar.
* İstek, gerekli veriye sahip olması gereken öğelerin (örneğin, URL içindeki yol değeri, GET parametresi veya HTTP başlığı) varlığı açısından kontrol edilir.
    
    ??? info "Örnek 1"
        `'GET_a_value': '^\d+$'` — yalnızca rakamlardan oluşan değere sahip `a` adlı GET parametresi istekte bulunmalıdır.
    
    ??? info "Örnek 2"
        `'GET_b*_value': '.*'` — ismi `b` ile başlayan GET parametresi, herhangi bir değere (boş değer de dahil) sahip olarak istekte bulunmalıdır.
    
* Belirli bir anahtar için değer `null` olarak ayarlanırsa, istekte ilgili öğenin bulunmaması kontrol edilir.
    
    ??? info "Örnek"
        `'GET_a': null` — `a` adlı GET parametresi istekte bulunmamalıdır.

Temel isteğin Eşleşme aşamasından geçebilmesi için, isteğin `match` bölümündeki tüm `<key: value>` çiftlerini karşılaması gerekmektedir. Eğer temel istekte, `match` bölümünde tanımlanan herhangi bir `<key: value>` çiftiyle eşleşme bulunamazsa, istek reddedilecektir.

??? info "Örnek"
    Aşağıda gösterilen `match` bölümü, `<key: value>` çiftlerinin listesini içerir. Temel isteğin Eşleşme aşamasından geçebilmesi için, bu çiftlerin tamamını karşılaması gerekir.

    ```
    match:
    - 'HEADER_HOST_value': 'example.com'
    - 'GET_password_value': '^\d+$'
    - 'HEADER_CONTENT-TYPE_value': null
    ```

    1. Temel istek, değeri `example.com` alt dizisini içeren `Header` adlı HTTP başlığını içermelidir.
    2. `password` GET parametresinin değeri yalnızca rakamlardan oluşmalıdır.
    3. `Content-Type` başlığı istekte bulunmamalıdır.