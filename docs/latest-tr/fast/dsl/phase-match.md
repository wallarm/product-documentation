[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-ext-logic]:       logic.md

# Match Aşaması

!!! info "Aşamanın kapsamı"  
    Bu aşama, değiştirici bir eklentide kullanılır ve çalışması için isteğe bağlıdır (YAML dosyasında `match` bölümü ya bulunmayabilir ya da bulunabilir).

    Bu aşama, değiştirmeyen eklentinin YAML dosyasında bulunmamalıdır.
    
    Eklenti türleri hakkında ayrıntılı bilgiyi [burada][link-ext-logic] okuyun.

!!! info "İstek öğesi tanımlama sözdizimi"
     Bir FAST eklentisi oluştururken, çalışmanız gereken istek öğelerini noktaları kullanarak doğru biçimde tanımlayabilmek için uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamanız gerekir. 
    
    Ayrıntılı bilgi için bu [bağlantı][link-points]ya gidin.
 
 Bu aşama, gelen temel isteğin belirtilen ölçütlerle eşleşip eşleşmediğini kontrol eder.

Eklenti YAML dosyasındaki `match` bölümü, `<key: value>` çiftlerinden oluşan bir dizi içerir. Her çift, isteğin belirli bir öğesini (anahtar) ve bu öğenin verilerini (değer) açıklar. Anahtar ve değer, [Ruby düzenli ifade biçiminde][link-ruby-regexp] düzenli ifadeler içerebilir.

Match Aşaması, temel istek içinde verilen tüm `<key: value>` çiftleri için eşleşmeler arar.
* İstek, gerekli verilerle birlikte gerekli öğelerin varlığına göre (örneğin, URL’deki yol değeri, GET parametresi veya HTTP başlığı) kontrol edilir. 
    
    ??? info "Örnek 1"
        `'GET_a_value': '^\d+$'` — `a` adlı GET parametresinin, yalnızca rakamlardan oluşan bir değerle istekte bulunması gerekir.
    
    ??? info "Örnek 2"
        `'GET_b*_value': '.*'` — adı `b` ile başlayan GET parametresinin, herhangi bir değerle (boş değer dahil) istekte bulunması gerekir.
    
* Belirli bir anahtar için değer `null` olarak ayarlanmışsa, istekte ilgili öğenin yokluğu kontrol edilir.
    
    ??? info "Örnek"
        `'GET_a': null` — `a` adlı GET parametresi istekte bulunmamalıdır.

Temel isteğin Match Aşamasından geçebilmesi için, isteğin `match` bölümündeki tüm `<key: value>` çiftlerini sağlaması gerekir. `match` bölümünde tanımlanan `<key: value>` çiftlerinden herhangi biri için temel istekte eşleşme bulunamazsa, istek atılır.

??? info "Örnek"
    Aşağıda gösterilen `match` bölümü, `<key: values>` çiftlerinin listesini içerir. Temel isteğin Match Aşamasından geçebilmesi için bu çiftlerin tümünü sağlaması gerekir.

    ```
    match:
    - 'HEADER_HOST_value': 'example.com'
    - 'GET_password_value': '^\d+$'
    - 'HEADER_CONTENT-TYPE_value': null
    ```

    1. Temel istek, değeri `example.com` alt dizesini içeren `Header` adlı HTTP başlığını içermelidir.
    2. `password` GET parametresinin değeri yalnızca rakamlardan oluşmalıdır.
    3. `Content-Type` başlığı bulunmamalıdır.