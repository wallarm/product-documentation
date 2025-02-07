Entegrasyon testi, yapılandırmanın doğruluğunu, Wallarm Cloud'un erişilebilirliğini ve bildirim formatını kontrol etmeye olanak tanır. Entegrasyonu test etmek için, entegrasyon oluştururken veya düzenlerken **Test integration** düğmesini kullanabilirsiniz.

Entegrasyon testi aşağıdaki şekilde gerçekleştirilir:

* Seçilen sisteme, `[Test message]` ön eki ile test bildirimleri gönderilir.
* Test bildirimleri aşağıdaki olayları kapsar (her biri ayrı bir kayıt olarak):

    * Şirket hesabında yeni kullanıcı
    * Şirket kapsamındaki yeni keşfedilen IP
    * Şirket hesabında yeni tetikleyici
    * Yeni keşfedilen güvenlik açığı
* Test bildirimleri test verilerini içerir.