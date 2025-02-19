### CDN düğüm durumları ne anlama geliyor?

Wallarm Console → **Nodes** üzerinde CDN düğümleri için aşağıdaki durumlar görünebilir:

* **Registering**: Wallarm, CDN düğümünü bulut sağlayıcısında kaydediyor.

    Gerekli işlem: Wallarm CNAME kaydını korunan domainin DNS kayıtlarına eklemek için **Requires CNAME** durumunun gelmesini bekleyin.
* **Requires CNAME**: Wallarm CNAME kaydı korunan domainin DNS kayıtlarına eklenmemiş ya da eklenmiş ancak henüz yayılmamış.

    Gerekli işlem: Wallarm tarafından sağlanan CNAME kaydını korunan domainin DNS kayıtlarına ekleyin veya değişikliklerin İnternet üzerinde etkili olması için bekleyin.
    
    Eğer değişiklikler 24 saatten fazla bir süre etkili olmazsa, domain sağlayıcınızın DNS kayıtlarını başarıyla güncellediğini kontrol edin. Eğer öyleyse fakat Wallarm Console üzerinde hala **Not propagated yet** durumu görünüyor ise, lütfen [Wallarm technical support](mailto:support@wallarm.com) ile iletişime geçin.

    Beklenen bir sonraki durum **Active**'dir.
* **Configuring**: Wallarm, değiştirilmiş origin adresi veya SSL/TLS sertifikasını işliyor.

    Gerekli işlem: **Active** durumunun gelmesini bekleyin.
* **Active**: Wallarm CDN düğümü, kötü niyetli trafiği engelliyor.

    Gerekli işlem: herhangi bir işlem yapmanıza gerek yok. CDN düğümünün algıladığı [events][events-docs] olayları izleyebilirsiniz.
* **Deleting**: Wallarm, CDN düğümünü siliyor.

    Gerekli işlem: herhangi bir işlem yapmanıza gerek yok, silmenin tamamlanmasını bekleyin.

### Yaygınlaşan CNAME kaydı nasıl tespit edilir?

Wallarm Console'un **Nodes** bölümü, Wallarm CNAME kaydının İnternet üzerinde etkili olup olmadığının gerçek durumunu gösterir. Eğer CNAME kaydı yayılmışsa, CDN düğüm durumu **Active** olur.

Ayrıca, aşağıdaki istek ile HTTP yanıt başlıklarını kontrol edebilirsiniz:

```bash
curl -v <PROTECTED_DOMAIN>
```

Eğer Wallarm CNAME kaydı yayılmışsa, yanıt `section-io-*` başlıklarını içerecektir.

CNAME kaydı 24 saatten fazla süre yayılmamışsa, domain sağlayıcınızın DNS kayıtlarını başarıyla güncellediğini kontrol edin. Eğer öyleyse fakat Wallarm Console üzerinde hala **Not propagated yet** durumu görünüyor ise, lütfen [Wallarm technical support](mailto:support@wallarm.com) ile iletişime geçin.

### CDN düğümü **Nodes** bölümünde kırmızıyla vurgulanıyor. Bu ne anlama geliyor?

Eğer CDN düğümü **Nodes** bölümünde kırmızıyla vurgulanıyorsa, aşağıdaki olası nedenlerden dolayı kayıt veya yapılandırma sırasında bir hata meydana gelmiştir:

* Üçüncü taraf bulut sağlayıcısında düğüm kaydı yapılırken bilinmeyen bir hata oluştu

    Gerekli işlem: [Wallarm technical support](mailto:support@wallarm.com) ile iletişime geçin.
* Geçersiz özel SSL/TLS sertifikası

    Gerekli işlem: Yüklediğiniz sertifikanın geçerli olduğundan emin olun. Geçerli değilse, geçerli olanı yükleyin.

Kırmızıyla vurgulanan CDN düğümü istekleri proxylemez ve sonuç olarak kötü niyetli trafiği engellemez.

### Wallarm Console'da node listesinden CDN düğümü neden kaybolabilir?

Wallarm, node oluşturulduğu andan itibaren 10 veya daha fazla gün boyunca değiştirilmemiş CNAME kayıtlarına sahip CDN düğümlerini siler.

CDN düğümünün kaybolduğunu fark ederseniz, yeni bir düğüm oluşturun.

### CDN düğümü tarafından korunan içeriğin güncellenmesinde neden gecikme oluyor?

Eğer siteniz CDN düğümü ile korunuyorsa ve verilerinizi değiştirdiğinizde sitenin makul bir gecikmeyle güncellendiğini fark ediyorsanız, muhtemel neden içeriğinizin teslim hızını artıran ancak CDN üzerindeki önbelleğin gecikmeli güncellendiği [Varnish Cache][using-varnish-cache] olabilir.

Örnek:

1. CDN düğümünüz için Varnish Cache etkinleştirilmiş.
1. Sitenizde fiyatları güncellediniz.
1. Tüm istekler CDN üzerinden proxyleniyor ve önbellek hemen güncellenmiyor.
1. Sitenin kullanıcıları bir süre eski fiyatları görmeye devam ediyor.

Sorunu çözmek için Varnish Cache'i devre dışı bırakabilirsiniz. Bunu yapmak için **Nodes** → CDN düğüm menüsü → **Disable Varnish Cache** yolunu izleyin.