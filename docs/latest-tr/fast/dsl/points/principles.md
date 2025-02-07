[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-yaml]:        https://yaml.org/spec/1.2/spec.html

# Noktalar Oluşturma İlkeleri

!!! warning "Rezerve Kelimeler"
    Çakışmaları önlemek için temel istek öğeleri için aşağıdaki isimlerin ve anahtarların kullanılmaması gerekmektedir:
        
    * Çözücü isimleri ile uyuşan isimler ve anahtarlar
    * Filtre isimleri ile uyuşan isimler ve anahtarlar
    * `name` ve `value` hizmet kelimeleri ile uyuşan isimler ve anahtarlar 

Özel bir eklenti geliştirirken göz önünde bulundurulması gereken birkaç evrensel nokta oluşturma ilkesi vardır.

* Tüm Noktalar düzenli ifadeler (regular expressions) olarak değerlendirilir.
    
    **Örnek:**

    * `HEADER_A.*_value` noktası, istek içinde varsa `A` ile başlayan isme sahip başlığı ifade eder.
    * `PATH_\d_value` noktası, isteğin URI yolunun ilk 10 bölümüne işaret eder.

* Nokta parçaları `_` sembolü kullanılarak bölünmelidir.
    
    **Örnek:** 
    
    `URI_value`.

* Çözücü ve filtre isimleri, noktanın içerisine büyük harflerle eklenmelidir.
    
    **Örnek:** 
    
    `ACTION_EXT_value`.

* İstek öğelerinin isimleri, temel istek içinde göründükleri şekilde tam olarak eklenmelidir.
    
    **Örnek:** 
    
    `GET http://example.com/login/?Uid=01234` isteği için, `GET_Uid_value` noktası `Uid` sorgu dizesi parametresine işaret eder.
    
    !!! info "Özel Sembollerin Kaçırılması"
        Bazı hizmet sembolleri, noktalar içinde kullanıldığında kaçırma gerektirebilir. Ayrıntılı bilgi almak için [Ruby programlama dili düzenli ifadeler][link-ruby] dokümantasyonuna göz atın.

* Bir nokta eklentiye aşağıdaki şekillerde eklenebilir:
    * `"` sembolleri ile çevrelenmiş.
        
        **Örnek:** 
        
        `"PATH_.*_value"`.
    
    * `'` sembolleri ile çevrelenmiş.
        
        **Örnek:** 
        
        `'GET_.*_value'`.
    
    * Hiçbir sembol ile çevrelenmemiş.
        
        **Örnek:** 
        
        `HEADER_.*_value`.
    
    !!! info "Noktaların Sembollerle Çevrelenmesi"
        YAML sözdizimi, noktaları çevrelemek için kullanılan çeşitli semboller arasındaki farkı tanımlar. Ayrıntılı bilgi almak için [bu link][link-yaml]e göz atın.

* `,` sembolü ile bölünmüş ve `[` ile `]` sembolleri arasında çevrelenmiş noktalar, noktaların bir dizisi olarak değerlendirilir. 
    
    **Örnek:** 
    
    `[GET_uid_value, GET_passwd_value]`.

* Hizmet kelimesi, istek öğesinin adı veya değeri ile çalışılması gerektiğini belirtmek için her zaman noktanın sonunda bulunmalıdır. 
    * İstek öğesinin adıyla çalışmak için `name` hizmet kelimesi belirtilmelidir. 
        
        `name` hizmet kelimesi aşağıdaki filtrelerle birlikte kullanılabilir:
        
        * Xml_pi;
        * Xml_dtd_entity.
        
        **Örnek:** 
        
        `POST_XML_XML_DTD_ENTITY_0_name` noktası, isteğin gövdesindeki XML verisinde belirtilen ilk DTD şema yönergesinin adına işaret eder.
    
    * İstek öğesinin değeriyle çalışmak için `value` hizmet kelimesi belirtilmelidir.
        
        `value` hizmet kelimesi, kullanılabilir FAST DSL filtreleri ve çözücülerden herhangi biriyle birlikte kullanılabilir.
        
        **Örnek:** 
        
        `PATH_0_value` noktası, isteğin URI yolunun ilk bölümünün değerine işaret eder.