[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-yaml]:        https://yaml.org/spec/1.2/spec.html

# Nokta Oluşturma İlkeleri

!!! warning "Ayrılmış kelimeler"
    Çakışmaları önlemek için baz referans talep ögeleri için aşağıdaki isim ve anahtarları kullanmayın:

    * Ayrıştırıcıların isimleriyle eşleşen isimler ve anahtarlar
    * Filtrelerin isimleriyle eşleşen isimler ve anahtarlar
    * `name` ve `value` hizmet kelimeleriyle eşleşen isimler ve anahtarlar

Özelleştirilmiş bir eklenti geliştirirken dikkate alınması gereken birkaç genel nokta oluşturma ilkesi vardır.

* Tüm Noktalar düzenli ifadeler olarak işleme alınır.
    
    **Örnek:**

    * `HEADER_A.*_value` noktası, böyle bir başlık talepte mevcutsa `A` ile başlayan isme sahip başlığı ifade eder.
    * `PATH_\d_value` noktası, talebin URI yolunun ilk 10 parçasını ifade eder.

* Noktanın parçaları `_` sembolü kullanılarak bölünmelidir.
    
    **Örnek:** 
    
    `URI_value`.

* Ayrıştırıcıların ve filtrelerin isimleri, noktaya büyük harf olarak eklenmelidir.
    
    **Örnek:** 
    
    `ACTION_EXT_value`.

* Talep ögelerinin isimleri, baz referans taleplerinde göründüğü gibi tam aynı şekilde noktaya eklenmelidir.
    
    **Örnek:** 
    
    `GET http://example.com/login/?Uid=01234` isteği için, `GET_Uid_value` noktası `Uid` sorgu dizesi parametresini ifade eder.
    
    !!! info "Özellikli simgeleri kaçış işlemi yaparak kullanma"
        Noktalarda kullanılan bazı hizmet simgeleri kaçış işlemi gerektirebilir. Ayrıntılı bilgi için, [Ruby programlama dilinde düzenli ifadeler][link-ruby] hakkındaki belgelere bakın.

* Bir nokta eklentiye aşağıdaki yollarla yerleştirilebilir:
    * `"` sembolleri ile çevrili 
        
        **Örnek:** 
        
        `"PATH_.*_value"`.
    
    * `'` sembolleri ile çevrili 
        
        **Örnek:** 
        
        `'GET_.*_value'`.
    
    * Herhangi bir sembol olmadan 
        
        **Örnek:** 
        
        `HEADER_.*_value`.
    
    !!! info "Noktaları semboller ile çevreleme"
        YAML sözdizimi, noktaları çevrelemek için çeşitli sembollerin kullanılmasındaki farkı tanımlar. Ayrıntılı bilgi için, bu [bağlantıya][link-yaml] gidin.

* `[` ve `]` sembolleri ile çevrili ve `,` simgesi ile ayrılan Noktalar, nokta dizisi olarak işleme alınır. 
    
    **Örnek:** 
    
    `[GET_uid_value, GET_passwd_value]`.

* Hizmet kelimesi, eklentinin talep ögesinin adıyla mı yoksa değeriyle mi çalışacağını belirtmek için noktanın sonunda her zaman bulunmalıdır. 
    * Talep ögesinin adıyla çalışmak için `name` hizmet kelimesi belirtilmelidir. 
        
        `name` hizmet kelimesi, aşağıdaki filtreler ile birlikte kullanılabilir:
        
        * Xml_pi;
        * Xml_dtd_entity.
        
        **Örnek:** 
        
        `POST_XML_XML_DTD_ENTITY_0_name` noktası, istek gövdesindeki XML verilerinde belirtilen ilk DTD şema yönergesinin adını ifade eder.
    
    * Talep ögesinin değeriyle çalışmak için `value` hizmet kelimesi belirtilmelidir.
        
        `value` hizmet kelimesi, mevcut tüm hızlı DSL filtreleri ve ayrıştırıcılarla birlikte kullanılabilir.
        
        **Örnek:** 
        
        `PATH_0_value` noktası, ilk talep URI yol parçasının değerini ifade eder.