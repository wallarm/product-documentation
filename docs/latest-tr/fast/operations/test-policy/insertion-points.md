[img-remove-point]: ../../../images/fast/operations/common/test-policy/policy-editor/remove-point.png         
[img-point-help]: ../../../images/fast/operations/common/test-policy/policy-editor/point-help.png                

[link-get-point]: ../../dsl/points/parsers/http.md#get-filter
[link-post-point]: ../../dsl/points/parsers/http.md#post-filter
[link-path-point]: ../../dsl/points/parsers/http.md#path-filter
[link-action-name-point]: ../../dsl/points/parsers/http.md#action_name-filter
[link-action-ext-point]: ../../dsl/points/parsers/http.md#action_ext-filter
[link-uri-point]: ../../dsl/points/parsers/http.md#uri-filter

[doc-point-list]: ../../dsl/points/parsers.md

# Nokta İşlem Kurallarının Konfigürasyonu

Noktalar, Wallarm hesabınızdaki politika düzenleyicinin **Ekleme Noktaları** bölümünde yapılandırılır. Bu bölüm iki bloka ayrılmıştır:

* **İsteğe dahil edilecek yer** işlem için izin verilen noktalar için
* **İsteğe dahil edilmeyecek yer** işlem için izin verilmeyen noktalar için

Biçimlendirilmiş nokta listesini eklemek için, gerekli blokta **Ekleme noktası ekle** düğmesini kullanın.

Noktayı silmek için, yanında bulunan «—» simgesini kullanın:

![Nokta silme][img-remove-point]

!!! bilgi "Temel noktalar"
    Politika oluştururken, tipik noktalar otomatik olarak **İsteğe dahil edilecek yer** bölümüne eklenir:

    * `URI_value`: [URI][link-uri-point]
    * `PATH_.*`: URI'nin herhangi bir [yolu][link-path-point]
    * `ACTION_NAME`: [aksiyon][link-action-name-point]
    * `ACTION_EXT`: [uzantı][link-action-ext-point]
    * `GET_.*`: herhangi bir [GET parametresi][link-get-point]
    * `POST_.*`: herhangi bir [POST parametresi][link-post-point]
    
    **İsteğe dahil edilmeyecek yer** bölümündeki nokta listesi varsayılan olarak boştur.

    Aynı nokta listesi varsayılan politika için yapılandırılmıştır. Bu politika değiştirilemez.

 
!!! bilgi "Nokta referansı"
    Nokta oluştururken veya düzenlerken, noktalar hakkında ek detaylar almak için **Nasıl kullanılır** bağlantısını tıklayabilirsiniz.

    ![Nokta referansı][img-point-help]

    FAST'ın işleyebileceği noktaların tam listesi [bağlantıda][doc-point-list] bulunabilir.