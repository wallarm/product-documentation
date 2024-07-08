[operation-mode-rule-docs]:         ../user-guides/rules/wallarm-mode-rule.md
[filtration-modes-docs]:            ../admin-en/configure-wallarm-mode.md
[graylist-docs]:                    ../user-guides/ip-lists/graylist.md
[wallarm-cloud-docs]:               ../about-wallarm/overview.md#cloud
[user-roles-docs]:                  ../user-guides/settings/users.md
[rules-docs]:                       ../user-guides/rules/rules.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[integration-docs]:                 ../user-guides/settings/integrations/integrations-intro.md
[trigger-docs]:                     ../user-guides/triggers/triggers.md
[application-docs]:                 ../user-guides/settings/applications.md
[events-docs]:                      ../user-guides/events/check-attack.md
[sqli-attack-desc]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../attacks-vulns-list.md#crosssite-scripting-xss

# Wallarm platform ile hızlı başlangıç

Wallarm platformu, ultra-düşük yanlış pozitiflerle web uygulamalarını, API'leri ve mikroservisleri OWASP ve OWASP Top 10 saldırılara, botlara ve uygulama kötüye kullanımına karşı korur. Bu kılavuzu takip ederek platformu tamamen ücretsiz olarak ve aylık 500K API talebinde sınırlama ile kullanmaya başlayabilirsiniz.

Hızlı bir başlangıç kapsamında, Wallarm hesabınızı kaydedecek ve birkaç dakika içinde ilk Wallarm filtreleme düğümünü çalıştıracaksınız. Ücretsiz bir kotanız olduğunda, gerçek trafik üzerinde ürünün gücünü deneyebilirsiniz.

## Playground'da Wallarm'ı Öğrenin

Wallarm'ı, herhangi bir bileşeni ortamınıza dağıtmadan ve hatta kaydolmadan önce keşfetmek için [Wallarm Playground](https://my.us1.wallarm.com/playground?utm_source=wallarm_docs_quickstarttr) kullanın.

Playground'da, Wallarm Console görünümüne gerçek verilerle dolmuş gibi erişebilirsiniz. Wallarm Console, işlenen trafikle ilgili verileri görüntüleyen ve platformun ince ayarını sağlayan önemli bir Wallarm platform bileşenidir. Bu nedenle, Playground ile ürünün nasıl çalıştığını öğrenebilir ve öğrenebilir, sadece okuma modunda kullanışlı kullanım örnekleri alabilirsiniz.

![Hesap oluşturmak için UI](../images/playground.png)

Wallarm çözümünün yeteneklerini trafiğinizde denemek için [ücretsiz bir hesap oluşturun](#create-wallarm-account-and-get-free-tier).

## Wallarm hesabı oluşturun ve Ücretsiz katmanı alın

Bir Wallarm hesabı oluşturmak için:

1. Kişisel verilerinizi gireceğiniz Wallarm Bulutu'ndaki [ABD](https://us1.my.wallarm.com/signup) veya [AB](https://my.wallarm.com/signup) kayıt bağlantısını takip edin.

    [Wallarm Bulutları hakkında daha fazla bilgi →](../about-wallarm/overview.md#cloud)
1. Hesabınızı, e-postanıza gönderilen onay mesajındaki bağlantıyı takip ederek onaylayın.

Bir hesap kaydedildikten ve onaylandıktan sonra, otomatik olarak **Ücretsiz katman** veya **Ücretsiz deneme** alır, bu da kullanılan Wallarm Cloud'a bağlıdır:

* ABD Cloud'da, Ücretsiz katman, Wallarm çözümünün gücünü aylık 500 bin talepte ücretsiz olarak keşfetmenize olanak sağlar.
* AB Cloud'da, 14 gün boyunca Wallarm çözümünü ücretsiz olarak keşfetmenizi sağlayan bir deneme süresi bulunmaktadır.

[İlk Wallarm filtreleme düğümünü](#deploy-the-wallarm-filtering-node) dağıtarak devam edin.

## Wallarm filtreleme düğümünü dağıtın

Wallarm, filtreleme düğümü dağıtımında [birçok seçenek sunar](../installation/supported-deployment-options.md). Bu seçenekleri öğrenip en uygun olanını seçebilir veya aşağıda anlatıldığı gibi Wallarm ile hızlı başlamak için en hızlı yolu takip edebilirsiniz.

Düğümü altyapınızın bir bileşeni olarak hızlı bir şekilde dağıtmak için önce şunlara sahip olduğunuzdan emin olun:

* [Docker yüklü](https://docs.docker.com/engine/install/)
* **Yönetici** [rolü][user-roles-docs] Wallarm hesabında

Docker görüntüsünden Wallarm filtreleme düğümünü dağıtın:

1. [ABD Bulutu'nda](https://us1.my.wallarm.com/nodes) veya [AB Bulutu'nda](https://my.wallarm.com/nodes) Wallarm Console → **Düğümler**'i açın ve **Wallarm düğümü** tipinde bir düğüm oluşturun.

    ![Düğüm oluşturulan Wallarm](../images/create-wallarm-node-empty-list.png)

    **Çok kiracılı düğüm** kutucuğu için, işaretlemeyin. Bu kutu, hızlı başlangıcın bir parçası olmayan ilgili özellik kurulumuyla ilişkilidir.
1. Oluşturulan jetonu kopyalayın.
1. Düğümle birlikte konteyneri çalıştırın:

=== "ABD Bulutu"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.8.1-1
    ```
=== "AB Bulutu"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:4.8.1-1
    ```

Ortam değişkeni | Açıklama| Gerekli
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm Console kullanıcı arayüzünden kopyalanan Wallarm düğüm jetonu. | Evet
`NGINX_BACKEND` | Wallarm çözümü ile korunacak olan kaynakların alan adı veya IP adresi. | Evet
`WALLARM_API_HOST` | Wallarm API sunucusu:<ul><li>`us1.api.wallarm.com` ABD Bulutu için</li><li>`api.wallarm.com` AB Bulutu için</li></ul>Varsayılan: `api.wallarm.com`. | Hayır
`WALLARM_MODE` | Düğüm modu:<ul><li>`block` kötü niyetli talepleri engellemek için</li><li>`safe_blocking` yalnızca [gri listeye alınmış IP adreslerinden][graylist-docs] gelen kötü niyetli talepleri engellemek için</li><li>`monitoring` talepleri analiz etmek ama engellememek için</li><li>`off` trafik analizini ve işlemeyi devre dışı bırakmak için</li></ul>Varsayılan: `monitoring`.<br>[Filtrasyon modları hakkında ayrıntılı açıklama →][filtration-modes-docs] | Hayır

Dağıtımı test etmek için, [Path Traversal](../attacks-vulns-list.md#path-traversal) kötü niyetli yükü ile ilk saldırıyı çalıştırın:

```
curl http://localhost/etc/passwd
```

`NGINX_BACKEND` `example.com` ise, curl komutunda ek olarak `-H 'Host: example.com'` seçeneğini geçin.

Düğüm varsayılan olarak **gözetim** [filtrasyon modunda](../admin-en/configure-wallarm-mode.md#available-filtration-modes) çalışırken, Wallarm düğümü saldırıyı engellemeyecek ancak onu kaydedecektir. Saldırının kaydedildiğini kontrol etmek için Wallarm Console → **Etkinlikler**'e gidin:

![Arayüzdeki saldırılar](../images/admin-guides/test-attacks-quickstart.png)

## Sonraki adımlar

Wallarm düğümünün hızlı dağıtımı başarıyla tamamlandı!

Dağıtım aşamasından daha fazlasını almak için:

* [Docker ile NGINX tabanlı Wallarm düğümünün tam dağıtım rehberini öğrenin](../admin-en/installation-docker-en.md)
* [Wallarm tarafından desteklenen tüm dağıtım seçeneklerini öğrenin](../installation/supported-deployment-options.md)

Dağıtılmış düğümü daha fazla ince ayarlamak için özellikleri öğrenin:

--8<-- "../include-tr/waf/installation/quick-start-configuration-options-4.4.md"
