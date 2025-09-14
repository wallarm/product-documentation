[img-remove-point]:         ../../../images/fast/operations/common/test-policy/policy-editor/remove-point.png         
[img-point-help]:           ../../../images/fast/operations/common/test-policy/policy-editor/point-help.png                

[link-get-point]:           ../../dsl/points/parsers/http.md#get-filter
[link-post-point]:          ../../dsl/points/parsers/http.md#post-filter
[link-path-point]:          ../../dsl/points/parsers/http.md#path-filter
[link-action-name-point]:   ../../dsl/points/parsers/http.md#action_name-filter
[link-action-ext-point]:    ../../dsl/points/parsers/http.md#action_ext-filter
[link-uri-point]:           ../../dsl/points/parsers/http.md#uri-filter

[doc-point-list]:           ../../dsl/points/parsers.md

# Nokta İşleme Kurallarının Yapılandırılması

Noktalar, Wallarm hesabınızdaki politika düzenleyicisindeki Insertion Points bölümünde yapılandırılır. Bu bölüm iki bloktan oluşur:

* **Where in the request to include** işlemeye izin verilen noktalar için
* **Where in the request to exclude** işlemeye izin verilmeyen noktalar için

Oluşturulan nokta listesini eklemek için, gerekli blokta **Add insertion point** düğmesini kullanın.

Bir noktayı silmek için, yanındaki «—» simgesini kullanın:

![Bir noktayı silme][img-remove-point]

!!! info "Temel noktalar"
    Bir politika oluştururken, tipik noktalar otomatik olarak **Where in the request to include** bölümüne eklenir:

    * `URI_value`: [URI][link-uri-point]
    * `PATH_.*`: URI'nin herhangi bir bölümü [yol][link-path-point]
    * `ACTION_NAME`: [eylem][link-action-name-point]
    * `ACTION_EXT`: [uzantı][link-action-ext-point]
    * `GET_.*`: herhangi bir [GET parametresi][link-get-point]
    * `POST_.*`: herhangi bir [POST parametresi][link-post-point]
    
    **Where in the request to exclude** bölümündeki noktalar listesi varsayılan olarak boştur.

    Aynı nokta listesi varsayılan politika için de yapılandırılmıştır. Bu politika değiştirilemez.

 
!!! info "Nokta referansı"
    Noktaları oluştururken veya düzenlerken, noktalarla ilgili ek ayrıntıları almak için **How to use** bağlantısına tıklayabilirsiniz.

    ![Nokta referansı][img-point-help]

    FAST'in işleyebileceği noktaların tam listesine bu [bağlantı][doc-point-list] üzerinden ulaşabilirsiniz.