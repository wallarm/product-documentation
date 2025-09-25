### CDN düğümü durumları ne anlama gelir?

Wallarm Console → **Nodes** içinde CDN düğümleri için aşağıdaki durumlar görünebilir:

* **Registering**: Wallarm, CDN düğümünü bulut sağlayıcısında kaydediyor.

    Gerekli işlem: Korunan alan adının DNS kayıtlarına Wallarm CNAME kaydını eklemek için **Requires CNAME** durumunu bekleyin.
* **Requires CNAME**: Wallarm CNAME kaydı, korunan alan adının DNS kayıtlarına eklenmemiştir veya eklenmiştir ancak henüz yayılmamıştır.

    Gerekli işlem: Wallarm tarafından sağlanan CNAME kaydını korunan alan adının DNS kayıtlarına ekleyin ya da değişikliklerin İnternet üzerinde etkili olmasını bekleyin.
    
    Değişiklikler 24 saatten uzun süre boyunca etkili olmazsa, alan adı sağlayıcınızın DNS kayıtlarını başarıyla güncellediğini kontrol edin. Öyleyse, ancak Wallarm Console'da hâlâ **Not propagated yet** durumu görüntüleniyorsa, lütfen [Wallarm teknik destek](mailto:support@wallarm.com) ile iletişime geçin.

    Beklenen bir sonraki durum **Active**.
* **Configuring**: Wallarm, değiştirilen origin adresini veya SSL/TLS sertifikasını işliyor.

    Gerekli işlem: **Active** durumunu bekleyin.
* **Active**: Wallarm CDN düğümü kötü amaçlı trafiği engeller.

    Gerekli işlem: yok. CDN düğümünün tespit ettiği [olayları][events-docs] izleyebilirsiniz.
* **Deleting**: Wallarm, CDN düğümünü siliyor.

    Gerekli işlem: yok, lütfen silme işleminin tamamlanmasını bekleyin.

### CNAME kaydının yayıldığını nasıl anlarım?

Wallarm Console'ın **Nodes** bölümünde, Wallarm CNAME kaydının İnternet üzerinde etkili olup olmadığına ilişkin güncel durum görüntülenir. CNAME kaydı yayıldıysa, CDN düğümünün durumu **Active** olur.

Buna ek olarak, aşağıdaki istekle HTTP yanıt başlıklarını kontrol edebilirsiniz:

```bash
curl -v <PROTECTED_DOMAIN>
```

Wallarm CNAME kaydı yayıldıysa, yanıtta `section-io-*` başlıkları bulunur.

CNAME kaydı 24 saatten uzun süre boyunca yayılmazsa, alan adı sağlayıcınızın DNS kayıtlarını başarıyla güncellediğini kontrol edin. Öyleyse, ancak Wallarm Console'da hâlâ **Not propagated yet** durumu görüntüleniyorsa, lütfen [Wallarm teknik destek](mailto:support@wallarm.com) ile iletişime geçin.

### **Nodes** bölümünde CDN düğümü kırmızıyla vurgulanmış. Bu ne anlama gelir?

CDN düğümü **Nodes** bölümünde kırmızıyla vurgulanmışsa, kaydı veya yapılandırması sırasında aşağıdaki olası nedenlerden dolayı bir hata oluşmuştur:

* Üçüncü taraf bulut sağlayıcıda düğüm kaydedilirken bilinmeyen hata

    Gerekli işlem: [Wallarm teknik destek](mailto:support@wallarm.com) ile iletişime geçin.
* Geçersiz özel SSL/TLS sertifikası

    Gerekli işlem: Yüklediğiniz sertifikanın geçerli olduğundan emin olun. Değilse, geçerli olanı yükleyin.

Kırmızıyla vurgulanan CDN düğümü istekleri proxy'lemez ve sonuç olarak kötü amaçlı trafiği engellemez.

### CDN düğümü neden Wallarm Console'daki düğüm listesinden kaybolmuş olabilir?

Wallarm, oluşturulduğu andan itibaren 10 gün veya daha uzun süre CNAME kayıtları değiştirilmeden bırakılan CDN düğümlerini siler.

CDN düğümünün kaybolduğunu görürseniz yeni bir düğüm oluşturun.

### CDN düğümü tarafından korunan içeriğin güncellenmesinde neden gecikme var?

Siteniz bir CDN düğümü tarafından korunuyorsa ve verilerinizi değiştirdiğinizde sitenin belirgin bir gecikmeyle güncellendiğini fark ediyorsanız, olası neden içerik teslimini hızlandıran [Varnish Cache][using-varnish-cache] olabilir; ancak CDN üzerindeki önbelleğe alınmış kopya gecikmeli güncellenebilir.

Örnek:

1. CDN düğümünüz için Varnish Cache etkin.
1. Sitenizdeki fiyatları güncellediniz.
1. Tüm istekler CDN üzerinden proxy'lenir ve önbellek hemen güncellenmez.
1. Site kullanıcıları bir süre eski fiyatları görür.

Sorunu çözmek için Varnish Cache'i devre dışı bırakabilirsiniz. Bunu yapmak için **Nodes** → CDN node menu → **Disable Varnish Cache** yolunu izleyin.