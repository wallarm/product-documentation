[cdn-node-operation-scheme]:        ../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../user-guides/rules/sensitive-data-rule.md
[operation-modes-docs]:             ../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console
[wallarm-cloud-docs]:               ../about-wallarm/overview.md#cloud
[cdn-node-creation-modal]:          ../images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             ../images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    ../images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  ../user-guides/settings/users.md
[update-origin-ip-docs]:            ../user-guides/nodes/cdn-node.md#updating-the-origin-address-of-the-protected-resourse
[rules-docs]:                       ../user-guides/rules/rules.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[integration-docs]:                 ../user-guides/settings/integrations/integrations-intro.md
[trigger-docs]:                     ../user-guides/triggers/triggers.md
[application-docs]:                 ../user-guides/settings/applications.md
[nodes-ui-docs]:                    ../user-guides/nodes/cdn-node.md
[events-docs]:                      ../user-guides/events/check-attack.md
[graylist-populating-docs]:         ../user-guides/ip-lists/overview.md
[graylist-docs]:                    ../user-guides/ip-lists/overview.md
[link-app-conf]:                    ../user-guides/settings/applications.md
[varnish-cache]:                    #why-is-there-a-delay-in-the-update-of-the-content-protected-by-the-cdn-node
[using-varnish-cache]:              ../user-guides/nodes/cdn-node.md#using-varnish-cache

# Section.io ile Wallarm Node'unu Dağıtma

[Section](https://www.section.io/) Cloud-Native Hosting sistemi, bir Wallarm node'unun kolayca dağıtılmasını sağlar. Trafiği ters proxy olarak yönlendirerek, uygulamanızın altyapısına üçüncü parti bileşenler eklemeden kötü niyetli trafiği etkili şekilde engelleyebilirsiniz.

## Kullanım Durumları

Desteklenen tüm [Wallarm deployment options](supported-deployment-options.md) arasında, bu çözüm aşağıdaki **kullanım durumları** için önerilmektedir:

* Hafif hizmetleri korumak için hızlı ve kolayca dağıtılan bir güvenlik çözümü arıyorsanız.
* Hosting altyapınız içerisinde Wallarm node'ları dağıtma imkanınız yoksa.
* Wallarm filtreleme node'larının yönetim ve bakımını üstlenmek istemiyorsanız.

## Sınırlamalar

Çözümün bazı sınırlamaları bulunmaktadır:

* Yüksek trafik analizi ve filtrasyonu için CDN node'larının kullanılması önerilmemektedir.
* CDN node türünün dağıtımı, [Free tier plan](../about-wallarm/subscription-plans.md#free-tier) kapsamında desteklenmemektedir.
* CDN node ile yalnızca üçüncü seviye (veya daha alt, örneğin 4., 5. vb.) domain'leri koruyabilirsiniz. Örneğin, `ple.example.com` için CDN node oluşturabilirsiniz, ancak `example.com` için oluşturamazsınız.
* Standart prosedürlerle doğrudan [application setup](../user-guides/settings/applications.md) yapılamamaktadır. Yapılandırma yardımı için lütfen [Wallarm support team](mailto:support@wallarm.com) ile iletişime geçin.
* [Custom blocking pages and error codes](../admin-en/configuration-guides/configure-block-page-and-code.md) yapılandırılamamaktadır. Varsayılan olarak, CDN node engellenen istekler için 403 durum kodu döndürür.

## Gereksinimler

--8<-- "../include/waf/installation/cdn-node/cdn-node-deployment-requirements.md"

## CDN Node Nasıl Çalışır

--8<-- "../include/waf/installation/cdn-node/how-cdn-node-works.md"

## CDN Node Dağıtımı

1. Wallarm Console'u açın → **Nodes** → **CDN** → **Create node**.
2. Korunacak domain adresini girin, örneğin `ple.example.com`.

    Belirtilen adres, üçüncü seviye (veya daha alt) domain olmalı ve şema ile eğik çizgi içermemelidir.
3. Wallarm'un, belirtilen domain ile ilişkili origin adresini doğru şekilde tanımladığından emin olun. Aksi halde, otomatik keşfedilen origin adresini değiştirmeniz gerekmektedir.

    ![CDN node creation modal][cdn-node-creation-modal]

    !!! warning "Origin Adresinin Dinamik Güncellenmesi"
        Eğer hosting sağlayıcınız, korunan kaynağa ait origin IP adresini veya domain'i dinamik olarak güncelliyorsa, lütfen CDN node yapılandırmasında belirtilen origin adresini güncel tutun. Wallarm Console, istediğiniz zaman [origin adresini değiştirmenize][update-origin-ip-docs] olanak tanır.

        Aksi takdirde, istekler yanlış origin adresine gönderileceği için korunan kaynağa ulaşamaz.
4. CDN node kaydının tamamlanmasını bekleyin.

    CDN node kaydı tamamlandığında, CDN node durumu **Requires CNAME** olarak değişecektir.
5. Wallarm tarafından oluşturulan CNAME kaydını, korunan domainin DNS kayıtlarına ekleyin.

    Eğer domain için zaten bir CNAME kaydı yapılandırılmışsa, lütfen mevcut değeri Wallarm tarafından oluşturulan değeri ile değiştirin.

    ![CDN node creation modal][cname-required-modal]

    DNS sağlayıcınıza bağlı olarak, DNS kayıtlarındaki değişikliklerin yayılması ve İnternet'te etkili olması 24 saate kadar sürebilir. Yeni CNAME kaydı yayıldığında, Wallarm CDN node gelen tüm istekleri korunan kaynağa yönlendirecek ve kötü niyetli olanları engelleyecektir.
6. Gerekirse, özel SSL/TLS sertifikasını yükleyin.

    Varsayılan olarak, Wallarm CDN node domaini için Let's Encrypt sertifikası oluşturacaktır.
7. DNS kayıtlarındaki değişiklikler yayıldıktan sonra, korunan domain'e test saldırısı gönderin:

    ```bash
    curl http://<PROTECTED_DOMAIN>/etc/passwd
    ```

    * Eğer kaynağı gönderen IP [graylisted][graylist-docs] ise, node saldırıyı hem engelleyecek (HTTP durum kodu 403) hem de kaydedecektir.
    * Eğer kaynağı gönderen IP [graylisted][graylist-docs] değilse, node yalnızca tespit edilen saldırıları kaydedecektir. Tespit edilen saldırıları Wallarm Console → **Attacks** bölümünden kontrol edebilirsiniz:
    
        ![Attacks in the interface][attacks-in-ui]

## Sonraki Adımlar

Wallarm CDN node başarıyla dağıtıldı!

Wallarm yapılandırma seçeneklerini öğrenin:

--8<-- "../include/waf/installation/cdn-node/cdn-node-configuration-options.md"

## CDN Node Sorun Giderme

--8<-- "../include/waf/installation/cdn-node/cdn-node-troubleshooting.md"