[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-ext-logic]:       logic.md

[img-modify]:           ../../images/fast/dsl/common/phases/modify.png

# Modify Aşaması

!!! info "Aşamanın kapsamı"
    Bu aşama, değiştirici bir uzantıda kullanılır ve çalışması için isteğe bağlıdır (YAML dosyasında `modify` bölümü ya bulunmayabilir ya da bulunabilir).

    Bu aşama, değiştirici olmayan bir uzantının YAML dosyasında yer almamalıdır.
    
    Uzantı türleri hakkında ayrıntılı bilgiyi [burada][link-ext-logic] okuyun.

!!! info "İstek öğeleri açıklama sözdizimi"
    Bir FAST uzantısı oluştururken, üzerinde points kullanarak çalışmanız gereken istek öğelerini doğru şekilde tanımlayabilmek için uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamanız gerekir. 

    Ayrıntılı bilgi için bu [bağlantı][link-points] üzerinden ilerleyin.
 
 Bu aşama, gerekirse temel isteğin parametrelerinin değerlerini değiştirir. Modify aşaması kullanılarak, temel istekte bulunmayan yeni bir öğe eklenemez. Örneğin, temel istek `Cookie` HTTP başlığını içermiyorsa bu başlığı ekleyemezsiniz. 

Uzantı YAML dosyasındaki `modify` bölümü, `<key: value>` çiftlerinden oluşan bir dizi içerir. Her çift, belirli bir istek öğesini (anahtar) ve bu öğeye yerleştirilmesi gereken veriyi (değer) açıklar. Anahtar, [Ruby düzenli ifade biçimi][link-ruby-regexp]nde düzenli ifadeler içerebilir. Düzenli ifadeler anahtarın değerine uygulanamaz.

Modify aşamasında, öğeye yeni değerler atayabilir veya öğenin verilerini silebilirsiniz.

* Anahtarın değeri belirtilmişse, bu değer karşılık gelen temel istek öğesine atanır. Temel istekte anahtara karşılık gelen bir öğe yoksa, yeni bir öğe eklenmez.
    
    ??? info "Örnek 1"
        `'HEADER_COOKIE_value': 'C=qwerty123'`

        ![Modify aşaması](../../images/fast/dsl/en/phases/modify.png)

* Anahtarın değeri belirtilmemişse, karşılık gelen temel istek öğesinin değeri temizlenir.
    
    ??? info "Örnek"
        `'HEADER_COOKIE_value': ""`

??? info "Örnek"
    Aşağıdaki örnekte temel istek şu şekilde değiştirilecektir:

    1.  `Content-Type` başlığının değeri `application/xml` ile değiştirilecektir.
    2.  `uid` GET parametresinin değeri temizlenecektir (parametrenin kendisi kaldırılmayacaktır).

    ```
    modify:
    - "HEADER_CONTENT-TYPE_value": "application/xml"
    - "GET_uid_value": ""
    ```