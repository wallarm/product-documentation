[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-yaml]:        https://yaml.org/spec/1.2/spec.html

# Nokta Oluşturma İlkeleri

!!! warning "Rezerve kelimeler"
    Çakışmaları önlemek için temel istek öğeleri için aşağıdaki adları ve anahtarları kullanmayın:
        
    * Ayrıştırıcıların adlarıyla eşleşen adlar ve anahtarlar
    * Filtrelerin adlarıyla eşleşen adlar ve anahtarlar
    * `name` ve `value` servis sözcükleriyle eşleşen adlar ve anahtarlar 

Özel bir uzantı geliştirirken dikkate alınması gereken birkaç evrensel nokta oluşturma ilkesi vardır.

* Tüm Noktalar düzenli ifadeler olarak değerlendirilir.
    
    **Örnek:**

    * `HEADER_A.*_value` noktası, istek içinde böyle bir başlık varsa adı `A` ile başlayan başlığa karşılık gelir.
    * `PATH_\d_value` noktası, isteğin URI yolunun ilk 10 parçasına karşılık gelir.

* Noktanın parçaları `_` sembolü kullanılarak bölünmelidir.
    
    **Örnek:** 
    
    `URI_value`.

* Ayrıştırıcıların ve filtrelerin adları noktaya BÜYÜK HARF ile eklenmelidir.
    
    **Örnek:** 
    
    `ACTION_EXT_value`.

* İstek öğelerinin adları, temel istekte göründükleriyle tamamen aynı şekilde noktaya eklenmelidir.
    
    **Örnek:** 
    
    `GET http://example.com/login/?Uid=01234` isteği için, `GET_Uid_value` noktası `Uid` sorgu dizesi parametresine karşılık gelir.
    
    !!! info "Özel sembollerin kaçışlanması"
        Bazı servis sembolleri, noktalarda kullanıldığında kaçış gerektirebilir. Ayrıntılı bilgi için [Ruby programlama dilinin düzenli ifadeleri][link-ruby] belgelerine bakın.

* Bir nokta uzantıya şu şekillerde yerleştirilebilir:
    * `"` sembolleri ile çevrelenmiş. 
        
        **Örnek:** 
        
        `"PATH_.*_value"`.
    
    * `'` sembolleri ile çevrelenmiş. 
        
        **Örnek:** 
        
        `'GET_.*_value'`.
    
    * Herhangi bir sembolle çevrelenmeden. 
        
        **Örnek:** 
        
        `HEADER_.*_value`.
    
    !!! info "Noktaları sembollerle çevreleme"
        YAML sözdizimi, noktaları çevrelemek için çeşitli sembollerin kullanımındaki farkı tanımlar. Ayrıntılı bilgi için şu [bağlantıya][link-yaml] bakın.

* `,` sembolü ile bölünmüş ve `[` ile `]` sembolleriyle çevrelenmiş noktalar bir nokta dizisi olarak değerlendirilir. 
    
    **Örnek:** 
    
    `[GET_uid_value, GET_passwd_value]`.

* Uzantının istek öğesinin adıyla mı yoksa değeriyle mi çalışması gerektiğini belirtmek için noktanın sonunda her zaman bir servis sözcüğü bulunmalıdır. 
    * İstek öğesinin adıyla çalışmak için `name` servis sözcüğü belirtilmelidir. 
        
        `name` servis sözcüğü aşağıdaki filtrelerle birlikte kullanılabilir:
        
        * Xml_pi;
        * Xml_dtd_entity.
        
        **Örnek:** 
        
        `POST_XML_XML_DTD_ENTITY_0_name` noktası, isteğin gövdesindeki XML verilerinde belirtilen ilk DTD şeması yönergesinin adına karşılık gelir.
    
    * İstek öğesinin değeriyle çalışmak için `value` servis sözcüğü belirtilmelidir.
        
        `value` servis sözcüğü mevcut tüm FAST DSL filtreleri ve ayrıştırıcılarıyla birlikte kullanılabilir.
        
        **Örnek:** 
        
        `PATH_0_value` noktası, isteğin URI yolunun ilk parçasının değerine karşılık gelir.