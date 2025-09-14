Entegrasyon testleri, yapılandırmanın doğruluğunu, Wallarm Cloud'un kullanılabilirliğini ve bildirim formatını kontrol etmeyi sağlar. Entegrasyonu test etmek için, entegrasyonu oluştururken veya düzenlerken **Test integration** düğmesini kullanabilirsiniz.

Entegrasyon şu şekilde test edilir:

* `[Test message]` önekine sahip test bildirimleri seçilen sisteme gönderilir.
* Test bildirimleri aşağıdaki olayları kapsar (her biri tek bir kayıtta):

    * Şirket hesabında yeni kullanıcı
    * Yeni tespit edilen hit
    * Şirket kapsamında yeni keşfedilen IP
    * Şirket hesabında yeni trigger
    * Yeni keşfedilen güvenlik açığı
* Test bildirimleri test verisi içerir.