Entegrasyon testi, yapılandırmanın doğruluğunu, Wallarm Cloud'un erişilebilirliğini ve bildirim biçimini kontrol etmeye olanak tanır. Entegrasyonu test etmek için, entegrasyonu oluştururken veya düzenlerken **Test integration** düğmesini kullanabilirsiniz.

Entegrasyon şu şekilde test edilir:

* Ön eki `[Test message]` olan test bildirimleri seçilen sisteme gönderilir.
* Test bildirimleri aşağıdaki olayları kapsar (her biri tek bir kayıtta):

    * Şirket hesabında yeni kullanıcı
    * Şirket kapsamında yeni keşfedilen IP
    * Şirket hesabında yeni tetikleyici
    * Yeni keşfedilen güvenlik açığı
* Test bildirimleri test verilerini içerir.