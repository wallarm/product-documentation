Integration testi, yapılandırmanın doğruluğunu, Wallarm Cloud'un erişilebilirliğini ve bildirim formatını kontrol etmenizi sağlar. Entegrasyonu test etmek için, entegrasyonu oluştururken veya düzenlerken **Test integration** düğmesini kullanabilirsiniz.

Entegrasyon aşağıdaki şekilde test edilir:

* `[Test message]` ön ekiyle test bildirimleri, seçilen sisteme gönderilir.
* Test bildirimleri aşağıdaki olayları kapsar (her biri tek bir kayıt halinde):

    * Şirket hesabında yeni kullanıcı
    * Yeni tespit edilen hit
    * Şirket kapsamındaki yeni keşfedilen IP
    * Şirket hesabında yeni tetikleyici
    * Yeni keşfedilen güvenlik açığı
* Test bildirimleri, test verilerini içerir.