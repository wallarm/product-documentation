### CDN düğüm durumları ne anlama gelir?

Aşağıdaki durumlar Wallarm Konsolu → **Düğümler** altında CDN düğümleri için görünebilir:

* **Kayıt Oluyor**: Wallarm, CDN düğümünü bulut sağlayıcısında kaydeder.

    Gereken Aksiyon: Korunan alan adının DNS kayıtlarına Wallarm CNAME kaydını eklemek için **CNAME Gerekiyor** durumunu bekleyin.
* **CNAME Gerekiyor**: Wallarm CNAME kaydı, korunan alan adının DNS kayıtlarına eklenmemiş veya eklenmiş ancak henüz yayılmamış.

    Gerekli Aksiyon: Wallarm tarafından sağlanan CNAME kaydını korunan alan adının DNS kayıtlarına ekleyin veya değişikliklerin İnternet'te etkili olmasını bekleyin.

    Eğer değişiklikler 24 saatten fazla süre içinde etkili olmazsa, alan adı sağlayıcınızın DNS kayıtlarını başarıyla güncellediğinden emin olun. Eğer öyleyse, ancak **Henüz Yayılmadı** durumu hala Wallarm Konsolunda görüntüleniyorsa, lütfen [Wallarm teknik desteği](mailto:support@wallarm.com) ile iletişime geçin.

    Bir sonraki beklenen durum **Aktif**.
* **Yapılandırılıyor**: Wallarm, değiştirilmiş köken adresi veya SSL / TLS sertifikasını işler.

    Gerekli Aksiyon: **Aktif** durumunu bekleyin.
* **Aktif**: Wallarm CDN düğümü kötü niyetli trafiği hafifletir.

    Gerekli Aksiyon: Hiçbiri. CDN düğümünün tespit ettiği [olayları][events-docs] izleyebilirsiniz.
* **Silineyor**: Wallarm, CDN düğümünü siliyor.

    Gereken Aksiyon: Hiçbiri, lütfen silmenin tamamlanmasını bekleyin.

### CNAME kaydının yayıldığını nasıl anlarsınız?

Wallarm Konsolu'nun **Düğümler** bölümü, Wallarm CNAME kaydının İnternet'teki gerçek durumunu gösterir. Eğer CNAME kaydı yayıldıysa, CDN düğüm durumu **Aktif** olur.

Ek olarak, aşağıdaki isteği kullanarak HTTP yanıt başlıklarını kontrol edebilirsiniz:

```bash
curl -v <KORUNAN_ALAN_AD>
```

Eğer Wallarm CNAME kaydı yayıldıysa, yanıt `section-io-*` başlıklarını içerecektir.

Eğer CNAME kaydı 24 saatten fazla bir süre boyunca yayılmadıysa, lütfen alan adı sağlayıcınızın DNS kayıtlarını başarıyla güncellediğinden emin olun. Eğer öyleyse, ancak **Henüz Yayılmadı** durumu hala Wallarm Konsolunda görüntüleniyorsa, lütfen [Wallarm teknik desteği](mailto:support@wallarm.com) ile iletişime geçin.

### CDN düğümü **Düğümler** bölümünde kırmızıyla vurgulanmış. Bu ne anlama gelir?

Eğer CDN düğümü **Düğümler** bölümünde kırmızıyla vurgulanmışsa, kayıt sırasında veya yapılandırma sırasında aşağıdaki olası nedenlerden dolayı bir hata oluşmuştur:

* Üçüncü taraf bulut sağlayıcısında düğümün kaydı sırasında bilinmeyen bir hata

    Gerekli Aksiyon: [Wallarm teknik desteği](mailto:support@wallarm.com) ile iletişime geçin.
* Geçersiz özel SSL / TLS sertifikası

    Gerekli Aksiyon: Yüklenen sertifikanın geçerli olduğundan emin olun. Eğer değilse, geçerli olanı yükleyin.

Kırmızıyla vurgulanan CDN düğümü istekleri proxy olarak kullanmaz ve sonuç olarak kötü niyetli trafiği hafifletmez.

### CDN düğümü Wallarm Konsolu'ndaki düğüm listesinden neden kaybolabilir?

Wallarm, CNAME kayıtları 10 veya daha fazla gün boyunca değiştirilmemiş CDN düğümlerini siler. 

CDN düğümünü kaybolmuş bulursanız, yeni bir düğüm oluşturun.

### CDN düğümü tarafından korunan içeriğin güncellenmesinde neden bir gecikme var?

Eğer siteniz bir CDN düğümü tarafından korunuyorsa ve verilerinizi değiştirdiğinizde sitenin makul bir gecikmeyle güncellendiğini fark ederseniz, muhtemel neden [Varnish Cache][using-varnish-cache] olabilir. Varnish Cache içeriğinizin teslimatını hızlandırır, ancak CDN'deki önbelleğin kopyası gecikmeyle güncellenebilir.

Örnek:

1. CDN düğümünüz için Varnish Cache'i etkinleştirdiniz.
1. Sitenizdeki fiyatları güncellediniz.
1. Tüm istekler CDN aracılığıyla yönlendirilir ve önbellek hemen güncellenmez.
1. Site kullanıcıları bir süreliğine eski fiyatları görür.

Problem çözmek için, Varnish Cache'i devre dışı bırakabilirsiniz. Bunu yapmak için, **Düğümler** → CDN düğüm menüsü → **Varnish Cache'i devre dışı bırak** seçeneğinden ilerleyin.