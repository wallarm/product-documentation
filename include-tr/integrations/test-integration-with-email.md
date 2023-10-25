Entegrasyon testi, yapılandırma doğruluğunu, Wallarm Bulut'unun kullanılabilirliğini ve bildirim formatını kontrol etmeyi sağlar. Entegrasyonu test etmek için, entegrasyon oluştururken veya düzenlerken **Entegrasyonu Test et** düğmesini kullanabilirsiniz.

Entegrasyon aşağıdaki şekilde test edilir:

* Prefix'i `[Test mesajı]` olan test bildirimleri seçilen sisteme gönderilir.
* Test bildirimleri aşağıdaki olayları kapsar (her bir olay tek bir kayıtta bulunur):

    * Şirket hesabında yeni kullanıcı
    * Şirket kapsamında yeni keşfedilen IP
    * Yeni keşfedilen güvenlik açığı
* Test bildirimleri test verilerini içerir.