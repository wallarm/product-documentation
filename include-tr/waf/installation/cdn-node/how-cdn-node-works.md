Wallarm CDN node, korunan sunucuya ters proxy olarak çalışır. Gelen trafiği analiz eder, kötü niyetli istekleri engeller ve geçerli istekleri korunan sunucuya iletir.

![CDN node operation scheme][cdn-node-operation-scheme]

!!! warning "CDN node ile ne korunabilir"
    CDN node ile üçüncü seviye (veya alt seviye, örneğin 4., 5. vb.) alan adlarını koruyabilirsiniz. Örneğin, `ple.example.com` için CDN node oluşturabilirsiniz, ancak `example.com` için oluşturamazsınız.

Wallarm CDN node'un diğer özelliklerine gelince:

* Üçüncü taraf bulut sağlayıcısı (Section.io) tarafından barındırılır, dolayısıyla CDN node'u dağıtmak için altyapınızdan herhangi bir kaynak gerektirmez.

    !!! info "İstek verilerinin üçüncü taraf bulut sağlayıcısına yüklenmesi"
        İşlenen isteklerle ilgili bazı veriler Lumen servisine yüklenir.
* Bazı istek verilerini Wallarm Cloud'a yükler. [Yüklenen veriler ve hassas verilerin kesilmesi hakkında daha fazla bilgi edinin][data-to-wallarm-cloud-docs]
* Şüpheli trafiği belirlemek ve engellemek için [IP graylist içeriğine][graylist-populating-docs] dayanarak **güvenli engelleme** modunda [çalışır][operation-modes-docs].

    Modu değiştirmek için ilgili [kuralı][operation-mode-rule-docs] kullanın.
* CDN node, tamamen Wallarm Console UI üzerinden yapılandırılır. Başka bir şekilde değiştirilebilecek tek ayar, korunan kaynağın DNS kayıtlarına Wallarm CNAME kaydının eklenmesidir.
* Node'unuz için [uygulama yapılandırması][link-app-conf] yapılması amacıyla [Wallarm destek ekibine](mailto:support@wallarm.com) başvurabilirsiniz.