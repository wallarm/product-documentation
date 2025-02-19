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

Noktalar, Wallarm hesabınızdaki politika düzenleyicideki **Insertion Points** bölümünde yapılandırılır. Bu bölüm iki parçaya ayrılmıştır:

* **Where in the request to include**: İşlemeye izin verilen noktaların ekleneceği yer
* **Where in the request to exclude**: İşleme izin verilmeyen noktaların hariç tutulacağı yer

Oluşturulan nokta listesini eklemek için, ilgili blokta bulunan **Add insertion point** düğmesini kullanın.

Noktayı silmek için, yanındaki «—» simgesini kullanın:

![Bir noktayı silme][img-remove-point]

!!! info "Basic points"
    Bir politika oluşturulurken, tipik noktalar otomatik olarak **Where in the request to include** bölümüne eklenir:

    * `URI_value`: [URI][link-uri-point]
    * `PATH_.*`: URI'nin herhangi bir bölümü [path][link-path-point]
    * `ACTION_NAME`: [action][link-action-name-point]
    * `ACTION_EXT`: [extension][link-action-ext-point]
    * `GET_.*`: Herhangi bir [GET parameter][link-get-point]
    * `POST_.*`: Herhangi bir [POST parameter][link-post-point]
    
    Varsayılan olarak, **Where in the request to exclude** bölümündeki nokta listesi boştur.

    Varsayılan politika için de aynı nokta listesi yapılandırılmıştır. Bu politika değiştirilemez.

 
!!! info "Point reference"
    Noktaları oluştururken veya düzenlerken, noktalara ilişkin ek bilgileri almak için **How to use** bağlantısına tıklayabilirsiniz.

    ![Nokta referansı][img-point-help]

    FAST'in işleyebileceği tüm noktaların tam listesine [link][doc-point-list] üzerinden ulaşabilirsiniz.