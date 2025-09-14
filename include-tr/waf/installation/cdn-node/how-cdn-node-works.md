Wallarm CDN düğümü korunan sunucuya ters proxy olarak çalışır. Gelen trafiği analiz eder, kötü amaçlı istekleri engeller ve meşru istekleri korunan sunucuya iletir.

![CDN düğümünün çalışma şeması][cdn-node-operation-scheme]

!!! warning "CDN düğümü ile neler korunabilir"
    CDN düğümü ile üçüncü seviye (ya da daha alt, ör. 4., 5. vb.) alan adlarını koruyabilirsiniz. Örneğin, `ple.example.com` için CDN düğümü oluşturabilirsiniz ancak `example.com` için oluşturamazsınız.

Wallarm CDN düğümünün diğer özellikleri:

* Üçüncü taraf bulut sağlayıcı (Section.io) tarafından barındırılır, bu nedenle CDN düğümünü dağıtmak için altyapınızdan hiçbir kaynağa gerek yoktur.

    !!! info "İstek verilerinin üçüncü taraf bulut sağlayıcıya yüklenmesi"
        İşlenen isteklere ilişkin bazı veriler Lumen hizmetine yüklenir.
* Bazı istek verilerini Wallarm Cloud'a yükler. [Yüklenen veriler ve hassas verilerin kırpılması hakkında daha fazla bilgi edinin][data-to-wallarm-cloud-docs]
* Şüpheli trafiği tanımlayıp engellemek için [IP graylist içeriklerine][graylist-populating-docs] dayanarak **safe blocking** modunda [çalışır][operation-modes-docs].

    Modu değiştirmek için ilgili [kuralı][operation-mode-rule-docs] kullanın.
* CDN düğümü tamamen Wallarm Console UI üzerinden yapılandırılır. UI dışında değiştirilecek tek ayar, Wallarm CNAME kaydının korunan kaynağın DNS kayıtlarına eklenmesidir.
* Düğümünüz için [uygulama yapılandırması][link-app-conf] yapılması talebini [Wallarm destek ekibine](mailto:support@wallarm.com) iletebilirsiniz.