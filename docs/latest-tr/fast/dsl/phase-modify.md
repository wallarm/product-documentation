[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-ext-logic]:       logic.md

[img-modify]:           ../../images/fast/dsl/common/phases/modify.png

# Değiştirme Aşaması

!!! info "Fazın kapsamı"
    Bu aşama, bir değiştirme genişlemesinde kullanılır ve işlemi için isteğe bağlıdır (`modify` bölümü, YAML dosyasında ya bulunabilir ya da bulunmayabilir).

    Bu aşama, değiştirme içermeyen genişletmenin YAML dosyasında bulunmamalıdır.
    
    Genişletme türlerini ayrıntılı olarak [burada][link-ext-logic] okuyun.

!!! info "İstek elemanları açıklama sözdizimi"
    Bir FAST genişlemesi oluştururken, uygulamaya gönderilen HTTP isteğin ve uygulamadan alınan HTTP yanıtın yapısını anlamanız ve üzerinde çalışmanız gereken istek elemanlarını doğru bir şekilde tanımlamanız gerekir. 

    Detaylı bilgi için bu [bağlantıya][link-points] gidin.
 
Bu aşama, gerektiğinde bir temel isteğin parametrelerinin değerlerini değiştirir. Temel istekte bulunmayan yeni bir elemanı Değiştirme aşamasını kullanarak ekleyemezsiniz. Örneğin, temel istekte `Cookie` HTTP başlığı bulunmuyorsa bunu ekleyemezsiniz.

Genişletme YAML dosyasındaki `modify` bölümü, bir dizi `<anahtar: değer>` çifti içerir. Her çift, belirli bir istek elemanını (anahtar) ve bu elemana eklenecek veriyi (değer) tanımlar. Anahtar, [Ruby düzenli ifadeler formatı][link-ruby-regexp]nda düzenli ifadeler içerebilir. Anahtarın değerine düzenli ifadeler uygulanamaz.

Değiştirme aşamasında, bir elemana yeni değerler atayabilir veya elemanın verilerini silebilirsiniz.

* Eğer anahtarın değeri belirlenmişse, bu değer uygun temel istek elemanına atanacaktır. Eğer temel istekte anahtara karşılık gelen bir eleman yoksa, yeni eleman eklemesi yapılmayacaktır.
    
    ??? info "Örnek 1"
        `'HEADER_COOKIE_value': 'C=qwerty123'`

        ![Değiştirme aşaması](../../images/fast/dsl/en/phases/modify.png)

* Eğer anahtarın değeri belirlenmemişse, uygun temel istek elemanının değeri temizlenecektir.
    
    ??? info "Örnek"
        `'HEADER_COOKIE_value': ""`

??? info "Örnek"
    Aşağıdaki örnekte, temel istek aşağıdaki şekilde değiştirilecektir:

    1.  `Content-Type` başlığının değeri `application/xml` ile değiştirilecektir.
    2.  `uid` GET parametresinin değeri temizlenecektir (parametre kendisi kaldırılmayacaktır).

    ```
    modify:
    - "HEADER_CONTENT-TYPE_value": "application/xml"
    - "GET_uid_value": ""
    ```