# Credential Stuffing Detection <a href="../subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[Credential stuffing](../attacks-vulns-list.md#credential-stuffing), hackerların farklı web sitelerindeki kullanıcı hesaplarına yetkisiz erişim sağlamak için ele geçirilmiş kullanıcı kimlik bilgileri listelerini kullanmalarıyla gerçekleştirilen bir siber saldırıdır. Bu makale, Wallarm'ın **Credential Stuffing Detection** özelliğini kullanarak bu tür tehditlerin nasıl tespit edileceğini açıklamaktadır.

<div>
        <script src="https://js.storylane.io/js/v1/storylane.js"></script>
        <div class="sl-embed" style="position:relative;padding-bottom:calc(51.72% + 27px);width:100%;height:0;transform:scale(1)">
          <iframe class="sl-demo" src="https://wallarm.storylane.io/demo/sz9nukwy2hx4" name="sl-embed" allow="fullscreen" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
        </div>
      </div>

Credential stuffing saldırısı, aynı kullanıcı adı ve şifrenin farklı servislerde yeniden kullanılması uygulaması ve kolay tahmin edilebilir (zayıf) şifre seçiminden dolayı tehlikelidir. Başarılı bir credential stuffing saldırısı daha az deneme gerektirdiğinden saldırganlar istekleri çok daha seyrek gönderebilir, bu da kaba kuvvet koruması gibi standart önlemleri etkisiz hale getirir.

## Wallarm, Credential Stuffing ile Nasıl Mücadele Ediyor

Wallarm'ın **Credential Stuffing Detection** özelliği, ele geçirilmiş veya zayıf kimlik bilgilerini kullanarak uygulamalarınıza erişim sağlama girişimlerine ilişkin gerçek zamanlı bilgileri toplar ve görüntüler. Ayrıca bu tür girişimler hakkında anında bildirim almayı ve uygulamalarınıza erişim sağlayan tüm ele geçirilmiş veya zayıf kimlik bilgilerinin indirilebilir bir listesini oluşturmayı sağlar.

Ele geçirilmiş ve zayıf şifreleri belirlemek için Wallarm, kamuya açık [HIBP](https://haveibeenpwned.com/) ele geçirilmiş kimlik bilgileri veritabanından toplanan **850 milyondan fazla kayıt** içeren kapsamlı bir veritabanı kullanır.

![Credential Stuffing - Schema](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-schema.png)

Wallarm'ın Credential Stuffing Detection, aşağıdaki eylem sırasını uygulayarak kimlik bilgilerini güvende tutar:

1. İstek node'a ulaştığında, şifreden [SHA-1](https://en.wikipedia.org/wiki/SHA-1) oluşturur ve buluta birkaç karakter gönderir.
2. Bulut, aldığı karakterlerle başlayan ele geçirilmiş şifreleri aramak için bilinen şifreler veritabanını kontrol eder. Eğer bulunursa, şifreler node'a SHA-1 şifreleme formatında gönderilir ve node, istekteki şifre ile karşılaştırır.
3. Eşleşme olması durumunda, node bu saldırı bilgilerine istekten alınan giriş bilgisini ekleyerek credential stuffing saldırısını buluta bildirir.
4. Node, isteği uygulamaya iletir.

Bu sayede, Wallarm node'larının bulunduğu makinelerden şifreler hiçbir zaman şifrelenmemiş halde Wallarm Cloud'a gönderilmez. Kimlik bilgileri eşzamanlı gönderilmediğinden, istemci yetkilendirme verileri ağınız içinde güvende kalır.

**Toplu ve Tekil Denemeler**

Credential Stuffing Detection, botlar tarafından gerçekleştirilen ele geçirilmiş kimlik bilgileri toplu kullanım denemeleri ile diğer yöntemlerle tespit edilemeyen tekil denemeleri kaydetme kapasitesine sahiptir.

**Önlem Alınması Gerekenler**

Çalınmış veya zayıf şifreye sahip hesapların bilinmesi, hesap sahipleri ile iletişime geçme, geçici olarak hesap erişimini durdurma gibi önlemleri uygulamanıza olanak tanır.

Wallarm, şifreler zayıf veya ele geçirilmiş olsa bile meşru kullanıcıları engellememe amacıyla ele geçirilmiş kimlik bilgilerini içeren istekleri engellemez. Ancak, credential stuffing girişimleri aşağıdaki durumlarda engellenebilir:

* Tespit edilen kötü niyetli bot faaliyetlerinin bir parçasıysa ve [API Abuse Prevention](../api-abuse-prevention/overview.md) modülünü etkinleştirdiyseniz.
* Diğer [saldırı belirtileri](../attacks-vulns-list.md) içeren isteklerin parçasıysa.

## Etkinleştirme

Wallarm'ın **Credential Stuffing Detection** özelliğini etkinleştirmek için:

1. [Abonelik planınızın](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) **Credential Stuffing Detection** özelliğini içerdiğinden emin olun. Abonelik planını değiştirmek için [sales@wallarm.com](mailto:sales@wallarm.com?subject=Change%20Wallarm%20subscription%20plan%20to%20include%20Credential%20Stuffing%20Detection&body=Hello%20Wallarm%20Sales%20Team%2C%0AI%27m%20writing%20to%20request%20the%20change%20of%20Wallarm%20subscription%20plan%20to%20the%20one%20that%20includes%20the%20Credential%20Stuffing%20Detection.%0AThank%20you%20for%20your%20time%20and%20assistance.) adresine talep gönderin.
2. Wallarm node'unuzun, belirtilen artefaktlardan biri kullanılarak dağıtılmış [version 4.10](../updating-migrating/what-is-new.md) veya daha yüksek bir sürüm olduğundan emin olun:
    * [All-in-one installer](../installation/nginx/all-in-one.md)
    * [Helm chart for NGINX-based Ingress controller](../admin-en/installation-kubernetes-en.md)
    * [NGINX-based Docker image](../admin-en/installation-docker-en.md)
    * [Amazon Machine Image (AMI)](../installation/cloud-platforms/aws/ami.md)
    * [Google Cloud Machine Image](../installation/cloud-platforms/gcp/machine-image.md)
3. Kullanıcınızın [rolünün](../user-guides/settings/users.md#user-roles) **Credential Stuffing Detection** yapılandırmasına izin verdiğinden emin olun.
4. Wallarm Console → **Credential Stuffing** bölümünde, özelliği etkinleştirin (varsayılan olarak devre dışıdır).

**Credential Stuffing Detection** etkinleştirildikten sonra, çalışmaya başlaması için bir [yapılandırma](#configuring) yapılmalıdır.

## Yapılandırma

Ele geçirilmiş kimlik bilgileri kullanım girişimlerini kontrol etmek için kimlik doğrulama uç noktalarının listesini oluşturmanız gerekmektedir. Listeyi oluşturmak için Wallarm Console → **Credential Stuffing** bölümüne gidin.

![Wallarm Console - Credential Stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing.png)

Listeye uç nokta eklemenin iki yolu vardır:

* **Önerilen uç noktalar** listesinden, iki tür öğe içerir:
    * Wallarm'ın, düzenli ifadeler kullanarak yaygın şekilde kullanılan kimlik doğrulama uç noktalarını ve parametrelerini belirten önceden tanımlanmış kuralları.
    <!--
        ![Credential Stuffing - Recommended Endpoints - Predefined rules](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-predefined-rules.png)
    -->
    * [API Discovery](../api-discovery/overview.md) modülü tarafından bulunan ve gerçekten trafik alan kimlik doğrulama uç noktaları.
* Manuel - Kendi benzersiz kimlik doğrulama uç noktalarınızı ekleyebilirsiniz, böylece tam koruma sağlanır. Manuel eklemede, [URI](../user-guides/rules/rules.md#uri-constructor) ve kimlik doğrulama parametrelerinin aranma biçimini belirtmelisiniz:
    * **Parametrelerin Tam Konumu ile** - Şifre ve giriş bilgilerinin yer aldığı tam uç nokta [istek noktalarını](../user-guides/rules/rules.md#configuring) belirtmeniz gereklidir.
    <!--
        ![Credential Stuffing - Add authentication endpoint - Exact location](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-add-endpoint-exact-location.png)
    -->
    * **Düzenli İfade ile** - Şifre ve giriş bilgilerini içeren uç nokta parametreleri, [düzenli ifade](../user-guides/rules/rules.md#condition-type-regex) kullanılarak aranacaktır.
    
        ![Credential Stuffing - Add authentication endpoint - Regular expression](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-add-endpoint-regexp.png)

## Ele Geçirilmiş Kimlik Bilgisi Kullanım Girişimlerinin Görüntülenmesi

Son 7 gün içerisinde ele geçirilmiş kimlik bilgilerini kullanma girişimlerinin sayısı **Credential Stuffing** bölümünde görüntülenir. Sayaca tıkladığınızda, son 7 gün için tüm [`credential_stuffing`](../user-guides/search-and-filters/use-search.md#search-by-attack-type) saldırılarının listelendiği **Saldırılar** bölümüne yönlendirilirsiniz.

Herhangi bir saldırıyı genişleterek, ele geçirilmiş giriş bilgileri listesini görüntüleyebilirsiniz.

![Attacks - credential stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-attacks.png)

## Ele Geçirilmiş Kimlik Bilgilerini İçeren CSV Listesinin Alınması

Ele geçirilmiş kimlik bilgisi kullanım girişimlerinin toplam sayısı **Credential Stuffing** bölümünde görüntülenir. Sayaca tıklayınca tarayıcınız, ele geçirilmiş kimlik bilgilerini içeren CSV dosyasını indirecektir.

## Bildirim Alma

Ele geçirilmiş kimlik bilgilerini kullanma girişimleri ile ilgili anlık bildirimleri e-posta, mesajlaşma aracı veya [entegrasyon sistemlerinizden](../user-guides/settings/integrations/integrations-intro.md) alabilirsiniz. Bu tür bildirimleri etkinleştirmek için, Wallarm Console'un **Triggers** bölümünde **Compromised user account** koşuluyla bir veya daha fazla tetikleyici yapılandırın.

Bildirimleri, izlemek istediğiniz uygulama veya sunucu ve yanıt türüne göre daraltabilirsiniz.

**Tetikleyici Örneği: Slack'te Ele Geçirilmiş Kimlik Bilgilerinin Kullanım Girişimi Bildirimi**

Bu örnekte, ele geçirilmiş kimlik bilgilerinin kullanıldığı yeni bir girişim tespit edildiğinde, yapılandırdığınız Slack kanalına bu konuda bir bildirim gönderilecektir.

![Credential stuffing trigger](../images/user-guides/triggers/trigger-example-credentials-stuffing.png)

**Tetikleyiciyi Test Etmek İçin:**

1. [US](https://us1.my.wallarm.com/integrations/) veya [EU](https://my.wallarm.com/integrations/) bulutundaki Wallarm Console → **Integrations** bölümüne giderek [Slack ile entegrasyonu](../user-guides/settings/integrations/slack.md) yapılandırın.
2. **Credential Stuffing** bölümünde, Credential Stuffing'in etkin olduğunu doğrulayın ve **Önerilen uç noktalar** listesinden aktif **Authentication endpoints** listesine Wallarm'ın önceden tanımlanmış aşağıdaki kuralını ekleyin:

    İstek:
    ```
    /**/{{login|auth}}.*
    ```

    Şifre burada konumlanmıştır:
    ```
    ([^/](|((api|current|new|old|plain)(|\.|-|_)))(pass(|word|wd))|^pass(|wd|word))$
    ```

    Giriş bilgisi burada konumlanmıştır:
    ```
    ^((w+.)|_|.|)(login|user|auth)(|_|-.)(user|client|auth|id|name|)(|[\d])$
    ```

3. **Triggers** bölümünde yukarıda gösterildiği gibi bir tetikleyici oluşturun ve bunu kendi Slack entegrasyonunuza eşleyin.
4. Node'unuzun `localhost/login` uç noktasına ele geçirilmiş kimlik bilgilerini içeren bir istek gönderin:
    ```
    curl -X POST http://localhost/login -d '{"password": "123456", "user": "user-01@company.com"}'
    ```
5. **Attacks** bölümünde, isteğinizin `credential_stuffing` türünde, ele geçirilmiş kimlik bilgilerini kullanma girişimi olarak kaydedildiğini kontrol edin.
6. Saldırıyı genişleterek, ele geçirilmiş giriş bilgilerinin doğru şekilde listelendiğini doğrulayın.
7. Slack kanalınızdaki mesajları kontrol edin. Yeni mesaj aşağıdaki gibi görünmelidir:
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

Şu anda, Credential Stuffing Detection modülü aşağıdaki şekilde dağıtılan Wallarm node'larında desteklenmemektedir:

* [Terraform module for AWS](../installation/cloud-platforms/aws/terraform-module/overview.md)
* [Envoy-based Docker image](../admin-en/installation-guides/envoy/envoy-docker.md)