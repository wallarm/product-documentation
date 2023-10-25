Entegrasyon testi, yapılandırma doğruluğunu, Wallarm Bulut'un kullanılabilirliğini ve bildirim formatını kontrol etmeyi sağlar. Entegrasyonu test etmek için, entegrasyonu oluştururken veya düzenlerken **Entegrasyonu test et** düğmesini kullanabilirsiniz.

Entegrasyon şu şekilde test edilir:

* Ön eki `[Test mesajı]` olan test bildirimleri seçilen sisteme gönderilir.
* Test bildirimleri aşağıdaki olayları kapsar (her biri tek bir kayıtta):

    * Şirket hesabında yeni kullanıcı
    * Şirketin kapsamında yeni keşfedilen IP
    * Şirket hesabında yeni tetikleyici
    * Yeni keşfedilen güvenlik açığı
* Test bildirimleri test verilerini içerir.