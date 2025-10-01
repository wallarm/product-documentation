# Credential Stuffing Detection <a href="../subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[Credential stuffing](../attacks-vulns-list.md#credential-stuffing), bilgisayar korsanlarının ele geçirilmiş kullanıcı kimlik bilgileri listelerini kullanarak birden fazla web sitesindeki kullanıcı hesaplarına yetkisiz erişim sağlamaya çalıştığı bir siber saldırıdır. Bu makale, Wallarm'ın **Credential Stuffing Detection** özelliğini kullanarak bu tür tehditlerin nasıl tespit edileceğini açıklar.

<div>
        <script src="https://js.storylane.io/js/v1/storylane.js"></script>
        <div class="sl-embed" style="position:relative;padding-bottom:calc(51.72% + 27px);width:100%;height:0;transform:scale(1)">
          <iframe class="sl-demo" src="https://wallarm.storylane.io/demo/sz9nukwy2hx4" name="sl-embed" allow="fullscreen" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
        </div>
      </div>

Kimlik bilgisi doldurma saldırıları, farklı hizmetlerde aynı kullanıcı adı ve parolaların yeniden kullanılmasının yaygın olması ve kolay tahmin edilebilir (zayıf) parolaların seçilme eğilimi nedeniyle tehlikelidir. Başarılı bir credential stuffing saldırısı daha az deneme gerektirdiğinden, saldırganlar istekleri çok daha seyrek gönderebilir ve bu da kaba kuvvet koruması gibi standart önlemleri etkisiz hale getirir.

## Wallarm, kimlik bilgisi doldurmayı nasıl ele alır

Wallarm'ın **Credential Stuffing Detection** özelliği, uygulamalarınıza erişmek için ele geçirilmiş veya zayıf kimlik bilgilerinin kullanılmasına yönelik girişimler hakkında gerçek zamanlı bilgi toplar ve görüntüler. Ayrıca bu tür girişimler hakkında anlık bildirimleri etkinleştirir ve uygulamalarınıza erişim sağlayan tüm ele geçirilmiş veya zayıf kimlik bilgilerinin indirilebilir bir listesini oluşturur.

Ele geçirilmiş ve zayıf parolaları belirlemek için Wallarm, herkese açık [HIBP](https://haveibeenpwned.com/) ele geçirilmiş kimlik bilgileri veritabanından toplanan **850 milyondan fazla kayıt** içeren kapsamlı bir veritabanı kullanır.

![Credential Stuffing - Şema](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-schema.png)

Wallarm'ın Credential Stuffing Detection özelliği, aşağıdaki işlem sırasını uygulayarak kimlik bilgisi verilerini güvende tutar:

1. İstek düğüme ulaştığında, paroladan [SHA-1](https://en.wikipedia.org/wiki/SHA-1) üretir ve birkaç karakteri Wallarm Cloud'a gönderir.
1. Wallarm Cloud, bilinen ele geçirilmiş parolalar veritabanını alınan karakterlerle başlayan kayıtlar için kontrol eder. Bulunursa, bunlar SHA-1 ile şifreli formatta düğüme gönderilir ve düğüm bunları istekten gelen parolayla karşılaştırır.
1. Eşleşme varsa, düğüm bu saldırı bilgilerine istekten alınan girişi (login) de ekleyerek Wallarm Cloud'a bir credential stuffing saldırısı bildirir.
1. Düğüm isteği uygulamaya iletir.

Bu şekilde, Wallarm düğümlerine sahip makinelerden parolalar asla şifrelenmemiş olarak Wallarm Cloud'a gönderilmez. Kimlik bilgileri eşzamanlı olarak gönderilmez, bu da istemcilerin yetkilendirme verilerinin ağınız içinde güvende kalmasını sağlar.

**Kitlesel ve tekil denemeler**

Credential Stuffing Detection, botlar tarafından gerçekleştirilen ele geçirilmiş kimlik bilgilerinin kitlesel kullanım denemelerini ve diğer yöntemlerle tespit edilemeyen tekil denemeleri kaydedebilir.

**Azaltma önlemleri**

Çalınmış veya zayıf parolalara sahip hesapların bilinmesi, hesap sahipleriyle iletişime geçmek, hesaplara erişimi geçici olarak askıya almak vb. gibi bu hesapların verilerini güvence altına almak için önlemler başlatmanıza olanak tanır.

Wallarm, parolaları zayıf veya ele geçirilmiş olsa bile meşru kullanıcıların engellenmesini önlemek için ele geçirilmiş kimlik bilgilerine sahip istekleri engellemez. Ancak, aşağıdaki durumlarda credential stuffing girişimlerinin engellenebileceğini unutmayın:

* Tespit edilen kötü amaçlı bot etkinliğinin bir parçasıysa ve [API Abuse Prevention](../api-abuse-prevention/overview.md) modülünü etkinleştirdiyseniz.
* Diğer [saldırı işaretlerinin](../attacks-vulns-list.md) bir parçası olan isteklerse.

## Etkinleştirme

Wallarm'ın **Credential Stuffing Detection** özelliğini etkinleştirmek için:

1. [Abonelik planınızın](../about-wallarm/subscription-plans.md#core-subscription-plans) **Credential Stuffing Detection** içerdiğinden emin olun. Abonelik planını değiştirmek için lütfen [sales@wallarm.com](mailto:sales@wallarm.com?subject=Change%20Wallarm%20subscription%20plan%20to%20include%20Credential%20Stuffing%20Detection&body=Hello%20Wallarm%20Sales%20Team%2C%0AI%27m%20writing%20to%20request%20the%20change%20of%20Wallarm%20subscription%20plan%20to%20the%20one%20that%20includes%20the%20Credential%20Stuffing%20Detection.%0AThank%20you%20for%20your%20time%20and%20assistance.) adresine bir talep gönderin.
1. Wallarm düğümünüzün [sürüm 4.10](../updating-migrating/what-is-new.md) veya üzeri olduğundan ve aşağıdaki belirtilen yapıtlar kullanılarak dağıtıldığından emin olun:

    * [All-in-one installer](../installation/nginx/all-in-one.md)
    * [Helm chart for NGINX-based Ingress controller](../admin-en/installation-kubernetes-en.md)
    * [NGINX-based Docker image](../admin-en/installation-docker-en.md)
    * [Amazon Machine Image (AMI)](../installation/cloud-platforms/aws/ami.md)
    * [Google Cloud Machine Image](../installation/cloud-platforms/gcp/machine-image.md)
1. Kullanıcınızın [role](../user-guides/settings/users.md#user-roles) özelliğinin **Credential Stuffing Detection** yapılandırmasına izin verdiğini kontrol edin.
1. Wallarm Console → **Credential Stuffing** içinde, işlevi etkinleştirin (varsayılan olarak devre dışıdır).

**Credential Stuffing Detection** etkinleştirildiğinde, çalışmaya başlaması için bir [yapılandırma](#configuring) gereklidir.

## Yapılandırma

Ele geçirilmiş kimlik bilgileri kullanımına yönelik girişimlerin kontrol edileceği kimlik doğrulama uç noktalarının bir listesini oluşturmanız gerekir. Listeyi oluşturmak için Wallarm Console → **Credential Stuffing** bölümüne gidin.

![Wallarm Console - Credential Stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing.png)

Listeye uç nokta eklemenin iki yolu vardır:

* İki tür öğe içeren **Recommended endpoints** listesinden:

    * Parolaları ve giriş bilgilerini (login) tutan parametreleri ve yaygın olarak kullanılan kimlik doğrulama uç noktalarını belirtmek için düzenli ifadeler kullanan, Wallarm tarafından önceden tanımlanmış kurallar.
    <!--
        ![Credential Stuffing - Recommended Endpoints - Predefined rules](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-predefined-rules.png)
    -->
    * [API Discovery](../api-discovery/overview.md) modülü tarafından bulunan ve gerçekten trafik aldıkları şekilde kaydedilen, kimlik doğrulama için kullanılan uç noktalar.

* Manuel olarak - tam koruma sağlayarak kendi benzersiz kimlik doğrulama uç noktalarınızı da ekleyebilirsiniz. Manuel eklerken, [URI](../user-guides/rules/rules.md#uri-constructor) ve kimlik doğrulama parametrelerini arama yöntemini ayarlayın:

    * **Exact location of parameters** ile - parolanın ve giriş bilgisinin (login) bulunduğu uç noktanın tam [request points](../user-guides/rules/rules.md#configuring) konumlarını belirtmeniz gerekecektir.
    <!--
        ![Credential Stuffing - Add authentication endpoint - Exact location](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-add-endpoint-exact-location.png)
    -->
    * **Regular expression** ile - parola ve giriş içeren uç nokta parametreleri [regular expression](../user-guides/rules/rules.md#condition-type-regex) kullanılarak aranacaktır.
    
        ![Credential Stuffing - Add authentication endpoint - Regular expression](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-add-endpoint-regexp.png)

## Ele geçirilmiş kimlik bilgileri kullanım girişimlerini görüntüleme

Son 7 gündeki ele geçirilmiş kimlik bilgilerini kullanma girişimlerinin sayısı **Credential Stuffing** bölümünde görüntülenir. Sayaca tıklayın, son 7 gün için tüm [`credential_stuffing`](../user-guides/search-and-filters/use-search.md#search-by-attack-type) saldırılarını görüntüleyecek olan **Attacks** bölümüne yönlendirileceksiniz.

Parolaları ele geçirilmiş olan girişlerin (login) listesini görmek için saldırılardan herhangi birini genişletin.

![Attacks - credential stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-attacks.png)

## Ele geçirilmiş kimlik bilgilerinin CSV listesini alma

Ele geçirilmiş kimlik bilgilerinin toplam sayısı **Credential Stuffing** bölümünde görüntülenir. Sayaca tıklayın, tarayıcınız ele geçirilmiş kimlik bilgilerinin listesini içeren CSV dosyasını indirecektir.

## Bildirim alma

Ele geçirilmiş kimlik bilgilerinin kullanılmasına yönelik girişimler hakkında e-posta, mesajlaşma uygulaması veya [entegre sistemlerinizden](../user-guides/settings/integrations/integrations-intro.md) biri aracılığıyla anında bildirim alabilirsiniz. Bu tür bildirimleri etkinleştirmek için, Wallarm Console'un **Triggers** bölümünde, **Compromised user account** koşuluna sahip bir veya daha fazla tetikleyici yapılandırın.

Bildirimleri izlemek istediğiniz uygulama veya ana makineye ve yanıta göre daraltabilirsiniz.

**Trigger örneği: Slack içinde ele geçirilmiş kimlik bilgilerini kullanma girişimi hakkında bildirim**

Bu örnekte, ele geçirilmiş kimlik bilgilerinin kullanılmasına yönelik yeni bir girişim tespit edilirse, bununla ilgili bir bildirim yapılandırılmış Slack kanalınıza gönderilecektir.

![Credential stuffing trigger](../images/user-guides/triggers/trigger-example-credentials-stuffing.png)

**Trigger'ı test etmek için:**

1. Wallarm Console → **Integrations** bölümüne [US](https://us1.my.wallarm.com/integrations/) veya [EU](https://my.wallarm.com/integrations/) cloud içinde gidin ve [Slack ile entegrasyonu](../user-guides/settings/integrations/slack.md) yapılandırın.
1. **Credential Stuffing** bölümünde, Credential Stuffing'in etkin olduğundan ve aşağıdaki Wallarm'ın önceden tanımlanmış kuralının **Recommended endpoints** listesinden aktif **Authentication endpoints** listesine eklendiğinden emin olun:

    Request is:

    ```
    /**/{{login|auth}}.*
    ```

    Password is located here:

    ```
    ([^/](|((api|current|new|old|plain)(|\.|-|_)))(pass(|word|wd))|^pass(|wd|word))$
    ```

    Login is located here:

    ```
    ^((w+.)|_|.|)(login|user|auth)(|_|-.)(user|client|auth|id|name|)(|[\d])$
    ```

1. **Triggers** bölümünde, yukarıda gösterildiği gibi bir trigger oluşturun ve kendi Slack entegrasyonunuza eşleyin.
1. Ele geçirilmiş kimlik bilgileri içeren bir isteği düğümünüzün `localhost/login` uç noktasına gönderin:

    ```
    curl -X POST http://localhost/login -d '{"password": "123456", "user": "user-01@company.com"}'
    ```

1. **Attacks** bölümünde, isteğinizin `credential_stuffing` türünde bir olay olarak kaydedildiğini kontrol edin: ele geçirilmiş kimlik bilgilerini kullanma girişimi.
1. Saldırıyı genişleterek ele geçirilmiş giriş (login) bilgisini içerdiğinden emin olun.
1. Slack kanalınızdaki mesajları kontrol edin. Yeni mesaj şu şekilde görünmelidir:
    ```
    [wallarm] Stolen credentials detected
    
    Notification type: compromised_logins

    Stolen credentials have been detected in your incoming traffic:

    Compromised accounts: user-01@company.com
    Associated URL: localhost/login
    Link: https://my.wallarm.com/attacks/?q=attacks+d%3Alocalhost+u%3A%2Flogin+statuscode%3A404+application%3Adefault+credential_stuffing+2024%2F01%2F22

    Client: YourCompany
    Cloud: EU
    ```

## Sınırlamalar

Şu anda, Credential Stuffing Detection modülü, [Terraform module for AWS](../installation/cloud-platforms/aws/terraform-module/overview.md) aracılığıyla dağıtılan Wallarm düğümlerinde desteklenmemektedir.