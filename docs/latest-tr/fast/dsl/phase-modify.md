[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-ext-logic]:       logic.md

[img-modify]:           ../../images/fast/dsl/common/phases/modify.png

# Değişiklik Aşaması

!!! info "Aşamanın Kapsamı"
    Bu aşama, bir değişiklik yapan uzantıda kullanılır ve çalışması için isteğe bağlıdır (YAML dosyasında `modify` bölümü bulunabilir veya bulunmayabilir).

    Bu aşama, değişiklik yapmayan uzantının YAML dosyasında yer almamalıdır.
    
    Uzantı türleri hakkında detaylı bilgi için [burayı][link-ext-logic] okuyun.

!!! info "HTTP isteği öğeleri açıklama sözdizimi"
    Bir FAST uzantısı oluştururken, uygulamaya gönderilen HTTP isteğinin yapısını ve uygulamadan alınan HTTP yanıtının yapısını anlamanız gerekir; böylece, noktaları kullanarak üzerinde çalışmanız gereken istek öğelerinin doğru tanımını yapabilirsiniz.

    Detaylı bilgi için, bu [linke][link-points] gidin.
 
Bu aşama, gerekliyse temel (baseline) isteğin parametrelerinin değerlerinde değişiklik yapar. Temel istekte bulunmayan yeni bir öğe, Değişiklik aşamasıyla eklenemez. Örneğin, temel istek `Cookie` HTTP başlığını içermiyorsa, bu başlığı ekleyemezsiniz.

Uzantının YAML dosyasındaki `modify` bölümü, `<anahtar: değer>` çiftlerinden oluşan bir dizi içerir. Her çift, belirli bir istek öğesini (anahtar) ve bu öğeye eklenmesi gereken verileri (değer) tanımlar. Anahtar, [Ruby regular expressions formatında][link-ruby-regexp] düzenli ifadeler içerebilir. Ancak, anahtarın değeri üzerinde düzenli ifadeler uygulanamaz.

Değişiklik aşamasında, öğeye yeni değerler atayabilir veya öğenin verilerini silebilirsiniz.

* Eğer anahtarın değeri belirlenmişse, bu değer ilgili temel istek öğesine atanır. Temel istekte anahtar ile eşleşen bir öğe yoksa, yeni öğe eklemesi yapılmaz.
    
    ??? info "Örnek 1"
        `'HEADER_COOKIE_value': 'C=qwerty123'`

        ![Modify phase](../../images/fast/dsl/en/phases/modify.png)

* Eğer anahtarın değeri belirlenmemişse, ilgili temel istek öğesinin değeri temizlenecektir.
    
    ??? info "Örnek"
        `'HEADER_COOKIE_value': ""`

??? info "Örnek"
    Aşağıdaki örnekte, temel istek aşağıdaki şekilde değiştirilecektir:

    1.  `Content-Type` başlığının değeri `application/xml` ile değiştirilecektir.
    2.  `uid` GET parametresinin değeri temizlenecektir (parametrenin kendisi kaldırılmayacaktır).

    ```
    modify:
    - "HEADER_CONTENT-TYPE_value": "application/xml"
    - "GET_uid_value": ""
    ```