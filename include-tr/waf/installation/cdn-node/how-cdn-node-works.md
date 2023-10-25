Wallarm CDN düğümü, korunan sunucuya ters proxy olarak çalışır. Gelen trafiği analiz eder, kötü amaçlı istekleri hafifletir ve meşru istekleri korunan sunucuya yönlendirir.

![CDN düğümü işlem şeması][cdn-node-operation-scheme]

!!! uyarı "CDN düğümü ile ne korunabilir"
    CDN düğümü ile üçüncü seviye (veya daha düşük, 4., 5. vb. gibi) alan adlarını koruyabilirsiniz. Örneğin, `ple.example.com` için CDN düğümü oluşturabilirsiniz, ancak `example.com` için değil.

Wallarm CDN düğümünün diğer özellikleri şunlardır:

* Üçüncü taraf bulut sağlayıcı (Section.io) tarafından barındırılır, bu yüzden CDN düğümünü dağıtmak için altyapınızdan kaynak gerekmez.

    !!! bilgi "İsteğin verilerini üçüncü taraf bulut sağlayıcısına yükleme"
        İşlenmiş isteklere ilişkin bazı veriler Lumen servisine yüklenir.
* Bir kısım istek verilerini Wallarm Bulutuna yükler. [Yüklenen veriler ve hassas verilerin kesilmesi hakkında daha fazla bilgi edinin][data-to-wallarm-cloud-docs]
* **Güvenli engelleme** modunda kurulan [IP gri listesi içeriğine][graylist-populating-docs] dayanarak şüpheli trafiği belirler ve engeller.

   Modu değiştirmek için karşılık gelen [kuralı][operation-mode-rule-docs] kullanın.
* CDN düğümü tamamen Wallarm Konsolu UI üzerinden yapılandırılır. Başka bir şekilde değiştirilmesi gereken tek ayar,  Wallarm CNAME kaydının korunan kaynağın DNS kayıtlarına eklenmesidir.
* Düğümünüz için [uygulama yapılandırması][link-app-conf] yapması  için [Wallarm destek ekibini](mailto:support@wallarm.com) talep edebilirsiniz.