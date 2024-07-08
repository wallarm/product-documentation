[cdn-node-operation-scheme]:        ../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../user-guides/rules/sensitive-data-rule.md
[operation-modes-docs]:             ../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../user-guides/rules/wallarm-mode-rule.md
[wallarm-cloud-docs]:               ../about-wallarm/overview.md#cloud
[cdn-node-creation-modal]:          ../images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             ../images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    ../images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  ../user-guides/settings/users.md
[update-origin-ip-docs]:            ../user-guides/nodes/cdn-node.md#updating-the-origin-address-of-the-protected-resource
[rules-docs]:                       ../user-guides/rules/rules.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[integration-docs]:                 ../user-guides/settings/integrations/integrations-intro.md
[trigger-docs]:                     ../user-guides/triggers/triggers.md
[application-docs]:                 ../user-guides/settings/applications.md
[nodes-ui-docs]:                    ../user-guides/nodes/cdn-node.md
[events-docs]:                      ../user-guides/events/check-attack.md
[graylist-populating-docs]:         ../user-guides/ip-lists/graylist.md#managing-graylist
[graylist-docs]:                    ../user-guides/ip-lists/graylist.md
[link-app-conf]:                    ../user-guides/settings/applications.md
[varnish-cache]:                    #why-is-there-a-delay-in-the-update-of-the-content-protected-by-the-cdn-node
[using-varnish-cache]:              ../user-guides/nodes/cdn-node.md#using-varnish-cache

# Section.io ile Birlikte Wallarm Node'unu Dağıtmak

[Bölüm](https://www.section.io/) bir Bulut Doğal Hosting sistemidir ve bir Wallarm düğümünün kolay dağıtımını sağlar. Trafik akışını bir ters vekil (reverse proxy) olarak yönlendirerek uygulamanızın altyapısına üçüncü taraf bileşenler eklemeksizin kötü amaçlı trafiği etkili bir şekilde hafifletir.

## Kullanım Durumları

Tüm desteklenen [Wallarm dağıtım seçenekleri](supported-deployment-options.md) arasında, bu çözüm aşağıdaki **kullanım durumları** için önerilen biridir:

* Hafif hizmetleri korumak için hızlı ve kolay dağıtılabilir bir güvenlik çözümü arıyorsunuz.
* Wallarm düğümlerini kendi hosting altyapınızda dağıtma yeteneğiniz yok.
* Dağıtımda elle olmayan bir yaklaşımı tercih edersiniz, Wallarm filtreleme düğümlerinin yönetimini ve bakımını önler.

## Kısıtlamalar

Çözümün belirli kısıtlamaları vardır:

* Yüksek trafik analizi ve filtrasyonu için CDN düğümlerinin kullanılması önerilmez.
* CDN düğümü türünün dağıtımı, [Ücretsiz katman planı](../about-wallarm/subscription-plans.md#free-tier-subscription-plan-us-cloud) altında desteklenmiyor.
* CDN düğümü ile üçüncü seviye (veya daha düşük, 4. , 5. vb.) domainleri koruyabilirsiniz. Örneğin, `ple.example.com` için CDN düğümü oluşturabilirsiniz, ancak `example.com` için oluşturamazsınız.
* [`collectd` hizmeti](../admin-en/monitoring/intro.md) desteklenmiyor.
* Standart prosedürler aracılığıyla doğrudan [uygulama kurulumu](../user-guides/settings/applications.md) mümkün değil. Yapılandırma yardımı için [Wallarm destek ekibiyle](mailto:support@wallarm.com) iletişime geçin.
* [İlke engelleme sayfaları ve hata kodları](../admin-en/configuration-guides/configure-block-page-and-code.md) yapılandırılabilir değildir. Varsayılan olarak, CDN düğümü engellenen istekler için bir 403 yanıt kodu döndürür.

## Gereksinimler

--8<-- "../include-tr/waf/installation/cdn-node/cdn-node-deployment-requirements.md"

## CDN düğümü nasıl çalışır

--8<-- "../include-tr/waf/installation/cdn-node/how-cdn-node-works.md"

## CDN düğümünün dağıtımı

1. Wallarm Konsolu'nu açın → **Düğümler** → **CDN** → **Düğüm oluştur**.
1. Korunacak alan adını girin, örn. `ple.example.com`.

    Belirtilen adresin üçüncü seviye (veya daha düşük) bir alan olması ve şema ve çizgileri içermemesi gerekir.
1. Wallarm'ın belirtilen alanla ilişkili orijinal adresi doğru bir şekilde tanımladığından emin olun. Aksi takdirde, lütfen otomatik olarak bulunan orijinal adresi değiştirin.

    ![CDN düğümü oluşturma modalı][cdn-node-creation-modal]

    !!! warning "Orijinal adresin dinamik güncellenmesi"
        Hosting sağlayıcınız korunan kaynakla ilişkili orijinal IP adresini veya alan adını dinamik olarak güncelliyorsa, lütfen CDN düğümü yapılandırmasında belirtilen orijinal adresi güncel tutun. Wallarm Konsolu, orijinal adresi [değiştirmenizi][update-origin-ip-docs] her zaman sağlar.
        
        Aksi takdirde, istekler korunan kaynağa ulaşmayacaktır çünkü CDN düğümü yanlış bir orijinal adrese onları proxy etmeye çalışacaktır.
1. CDN düğümü kaydının tamamlanmasını bekleyin.

    CDN düğümü kaydı tamamlandığında, CDN düğümü durumu **CNAME Gerekiyor** olarak değiştirilecektir.
1. Wallarm tarafından oluşturulan CNAME kaydını korunan alanın DNS kayıtlarına ekleyin.

    Eğer alan için CNAME kaydı zaten yapılandırılmışsa, lütfen değerini Wallarm'ın oluşturduğu olanla değiştirin.

    ![CDN düğümü oluşturma modalı][cname-required-modal]

    DNS sağlayıcınıza bağlı olarak, DNS kayıtlarındaki değişikliklerin yayılması ve İnternet'te etkili olması 24 saate kadar sürebilir. Yeni CNAME kaydı yayıldığında, Wallarm'ın CDN düğümü tüm gelen istekleri korunan kaynağa yönlendirecek ve kötü amaçlı olanları engelleyecektir.
1. Gerekirse, özel bir SSL/TLS sertifikası yükleyin.

    Wallarm, CDN düğümü alanı için varsayılan olarak Let's Encrypt sertifikası oluşturur.
1. DNS kayıt değişiklikleri yayıldıktan sonra, korunan alana test saldırısı gönderin:

    ```bash
    curl http://<KORUNAN_ALAN>/etc/passwd
    ```
    
    * Eğer başlangıç IP adresi [grislisted’edir] [graylist-docs] , düğüm hem saldırıyı engeller (HTTP yanıt kodu 403) hem de kaydeder.
    * Eğer başlangıç IP adresi [grislisted’edilmezse] [graylist-docs], düğüm sadece tespit edilen saldırıları kaydeder. Saldırıların kaydedildiğini kontrol edebilirsiniz Wallarm Konsolu'nda → **Olaylar**:
    
        ![Arabirimdeki saldırılar][attacks-in-ui]

## Sonraki adımlar

Wallarm CDN düğümü başarıyla dağıtıldı!

Wallarm yapılandırma seçeneklerini öğrenin:

--8<-- "../include-tr/waf/installation/cdn-node/cdn-node-configuration-options.md"

## CDN düğümü sorun giderme

--8<-- "../include-tr/waf/installation/cdn-node/cdn-node-troubleshooting.md"
