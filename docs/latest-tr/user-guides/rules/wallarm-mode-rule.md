[link-wallarm-mode-override]:       ../../admin-en/configure-parameters-en.md#wallarm_mode_allow_override

[img-mode-rule]:        ../../images/user-guides/rules/wallarm-mode-rule-with-safe-blocking.png

# Filtreleme modu kuralı

Filtreleme modu, bir web uygulamasının çeşitli bölümlerine yapılan isteklerin engellenmesini etkinleştirmenize ve devre dışı bırakmanıza olanak sağlar.

Bir filtreleme modu ayarlamak için, bir *Filtreleme modunu ayarla* kuralı oluşturun ve uygun modu seçin.

Filtreleme modu aşağıdakilerden birini [değerleri](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) alabilir:

* **Varsayılan**: sistem, NGINX yapılandırma dosyalarında belirtilen parametrelere uygun şekilde çalışır.
* **Devre dışı**: IP'lerin [yasaklı listesi](../ip-lists/denylist.md)ndeki IP'lerden kaynaklanan istekler hariç, isteklerin analizi ve filtrelemesi kapalıdır. Yasaklı listedeki IP'lerden gelen istekler engellenir (ama arayüzde gösterilmez).
* **İzleme**: İstekler analiz edilir ve arayüzde gösterilir ancak yasaklı listesindeki IP'lerden kaynaklanmadıkça engellenmezler. Yasaklı listesindeki IP'lerden gelen istekler engellenir (ama arayüzde gösterilmez).
* **Güvenli engelleme**: Kötü niyetli istekler yalnızca [gri listeye eklenmiş IP'ler](../ip-lists/graylist.md) tarafından başlatıldığında engellenir.
* **Engelleme**: Kötü niyetli istekler engellenir ve arayüzde gösterilir.

Bu kuralı uygulamak için NGINX yapılandırma dosyaları, işletim modunun [merkezi yönetimine](../../admin-en/configure-wallarm-mode.md#allow-overriding-wallarm_mode) izin vermelidir.

## Kuralı oluşturma ve uygulama

--8<-- "../include-tr/waf/features/rules/rule-creation-options.md"

## Kuralın varsayılan örneği

Wallarm, `Filtreleme modunu ayarla` kuralının örneğini [varsayılan](../../user-guides/rules/rules.md#default-rules) seviyede otomatik olarak oluşturur. Sistem, değerini [genel filtreleme modu](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console) ayarına dayalı olarak belirler.

Bu kural örneği silinemez. Değerini değiştirmek için sistem [genel filtreleme modu](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console) ayarını değiştirin.

Tüm diğer varsayılan kurallar gibi, `Filtreleme modunu ayarla` varsayılan kuralı tüm dallar tarafından [miras alınır](../../user-guides/rules/rules.md)

## Örnek: Kullanıcı Kaydı Sırasında İstek Engellemeyi Devre Dışı Bırakma

**Eğer** aşağıdaki koşullar gerçekleşirse:

* yeni kullanıcı kaydı *example.com/signup* adresinde mevcuttur
* bir saldırıyı görmezden gelmek bir müşteriyi kaybetmekten daha iyidir

**O zaman**, kullanıcı kaydı sırasında engellemeyi devre dışı bırakan bir kural yaratma

1. *Kurallar* sekmesine gidin
1. `example.com/signup` için dalı bulun ve *Kural ekle*'ye tıklayın
1. *Filtreleme modunu ayarla* seçin
1. İşletim modu olarak *İzleme* seçin
1. *Oluştur*’a tıklayın

![Trafik filtreleme modunu ayarlama][img-mode-rule]

## Kuralı oluşturmak için API çağrıları

Filtreleme modu kuralını oluşturmak için Wallarm Console UI'ı kullanmanın yanı sıra, Wallarm API'sini doğrudan [çağırabilir](../../api/overview.md)siniz. Aşağıda, ilgili API çağrısının bir örneği bulunmaktadır.

Aşağıdaki istek, ID'si `3` olan [uygulama](../settings/applications.md)ya giden trafiği filtrelemek için düğümü ayarlayan kuralı oluşturacak. 

--8<-- "../include-tr/api-request-examples/create-filtration-mode-rule-for-app.md"