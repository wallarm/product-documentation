# Wallarm Console'da Kiracı Hesapları Oluşturma

Bu talimatlar, [kiracı hesaplarının](overview.md) doğru yapılandırılması için gereken adımları size sunar.

--8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"

## Kiracı Hesaplarının Yapılandırılması

Kiracı hesaplarını yapılandırmak için:

1. Wallarm Console için kayıt olun ve hesabınız için çok kiracılılık özelliğini etkinleştirme talebinizi Wallarm teknik destek ekibine gönderin.
2. Bir kiracı hesabı oluşturun.
3. Belirli trafiği kiracı ve uygulamalarıyla ilişkilendirin.

### Adım 1: Kayıt Olun ve Çok Kiracılılık Özelliğini Etkinleştirme Talebinizi Gönderin

1. Wallarm Console'da kayıt formunu doldurun ve onaylayın. [US Cloud](https://us1.my.wallarm.com/signup) veya [EU Cloud](https://my.wallarm.com/signup) üzerinden kayıt olabilirsiniz.

    ![Kayıt Formu](../../images/signup-en.png)

    !!! info "Kurumsal e-posta"
        Lütfen kurumsal bir e-posta adresi kullanarak kayıt olun.
2. E-posta gelen kutunuzu açın ve gelen mesajdaki bağlantı aracılığıyla hesabınızı etkinleştirin.
3. Çok kiracılılık özelliğini etkinleştirmek için hesabınızla birlikte aşağıdaki bilgileri içeren bir talebi [Wallarm teknik destek](mailto:support@wallarm.com) ekibine gönderin:
    * Kullanılan Wallarm Cloud'un adı (US Cloud veya EU Cloud)
    * Global hesap ve teknik kiracı hesabı için adlar
    * Kiracı hesaplarına erişim sağlanacak çalışanların e-posta adresleri (çok kiracılılık özelliği etkinleştirildikten sonra çalışanları kendiniz ekleyebileceksiniz)
    * Markalı Wallarm Console için logo
    * Wallarm Console için özel alan adı, alan adı için sertifika ve şifreleme anahtarı
    * Teknik destek e-posta adresiniz

Talebiniz alındıktan sonra, Wallarm teknik destek:

1. Wallarm Cloud'da bir global hesap ve teknik kiracı hesabı oluşturur.
2. Sizi, [rol](../../user-guides/settings/users.md) olarak **Global administrator** bulunan teknik müşteri hesabı kullanıcıları listesine ekler.
3. Çalışanlarınızın e-posta adresleri sağlanırsa, Wallarm teknik destek, çalışanları [rol](../../user-guides/settings/users.md) olarak **Global read only** atanan teknik kiracı hesabı kullanıcıları listesine ekler.

    Kayıtlı olmayan çalışanlar, teknik kiracı hesabına erişim için yeni bir şifre belirlemeleri adına bağlantılı e-postalar alacaktır.
4. Size UUID'nizi gönderir (izole ortamlar için çok kiracılılığı kullanan Wallarm partner şirketi veya Wallarm müşteri belirtisi olan ana kiracı UUID'si).

    Alınan UUID daha sonraki adımlarda gerekecektir.

### Adım 2: Kiracıyı Oluşturma

#### Wallarm Console Üzerinden

**Global administrator** hesabı altında, Wallarm Console → kiracı seçici → **Create tenant** seçeneğini kullanarak kiracılar oluşturabilirsiniz.

![Wallarm Console üzerinden kiracı oluşturma](../../images/partner-waf-node/tenant-create-via-ui.png)

Yeni oluşan kiracı için bir **Administrator** [kullanıcı](../../user-guides/settings/users.md#user-roles) oluşturabilirsiniz. Davet e-postası belirtilen adrese gönderilecektir.

#### Wallarm API Üzerinden

Kiracıyı oluşturmak için, kimlik doğrulamalı istekleri Wallarm API'ye gönderebilirsiniz. Wallarm API'ye kimlik doğrulamalı istekler, kendi API istemcinizden veya kimlik doğrulama yöntemini tanımlayan [Wallarm API Console](../../api/overview.md)'dan gönderilebilir:

* **Wallarm API Console** üzerinden gönderilecek istekler için, **Global administrator** kullanıcı rolüyle Wallarm Console'a giriş yapmanız ve aşağıdaki URL'lerde bulunan Wallarm API Console sayfasını güncellemeniz gerekir:
    * US Cloud için: https://apiconsole.us1.wallarm.com/
    * EU Cloud için: https://apiconsole.eu1.wallarm.com/
* **Kendi API istemcinizden** gönderilecek istekler için, isteğe [Global Administrator izinlerine sahip API token](../../user-guides/settings/api-tokens.md) eklemeniz gerekir.

Bu adımda, global hesapla bağlantılı bir kiracı hesabı oluşturulacaktır.

1. Aşağıdaki parametrelerle `/v1/objects/client/create` rotasına POST isteği gönderin:

    Parametre | Açıklama | İstek bölümü | Gerekli
    --------- | -------- | ------------- | ---------
    `X-WallarmApi-Token` | **Global Administrator** izinlerine sahip [API token](../../user-guides/settings/api-tokens.md). | Header | Kendi API istemcinizden istek gönderilmesi durumunda Evet
    `name` | Kiracının adı. | Body | Evet
    `vuln_prefix` | Wallarm'ın zafiyet takibi ve kiracı ile ilişkilendirme için kullanacağı zafiyet ön eki. Önek, dört büyük harf veya rakam içermeli ve kiracının adıyla ilişkili olmalıdır, örn: `TNNT` kiracı `Tenant` için. | Body | Evet
    `partner_uuid` | Global hesap oluşturulurken alınan [ana kiracı UUID'si](#step-1-sign-up-and-send-a-request-to-activate-the-multitenancy-feature). | Body | Evet

    ??? info "Kendi API istemcinizden gönderilen isteğin örneğini göster"
        === "US Cloud"
            ```bash
            curl -v -X POST "https://us1.api.wallarm.com/v1/objects/client/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```
        === "EU Cloud"
            ``` bash
            curl -v -X POST "https://api.wallarm.com/v1/objects/client/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```

    ??? info "İstek yanıtının örneğini göster"
        ``` bash
        {
        "status":200,
        "body": {
            "id":10110,
            "name":"Tenant 1",
            "components":["waf"],
            "vuln_prefix":"TNTST",
            ...
            "uuid":"11111111-1111-1111-1111-111111111111",
            ...
            }
        }
        ```

2. Yanıt içerisindeki `uuid` değerini kopyalayın. Bu parametre, kiracıya ait trafiğin kiracı hesabıyla ilişkilendirilmesinde kullanılacaktır.

Oluşturulan kiracılar, [global kullanıcılar](../../user-guides/settings/users.md#user-roles) için Wallarm Console'da görüntülenecektir. Örneğin, `Tenant 1` ve `Tenant 2`:

![Wallarm Console'da kiracı seçici](../../images/partner-waf-node/clients-selector-in-console.png)

### Adım 3: Belirli Trafiği Kiracınızla İlişkilendirin

!!! info "Ne zaman yapılandırmalı?"
    Bu yapılandırma, yalnızca tüm kiracıların trafiğinin tek bir Wallarm düğümü tarafından [işlenmekte veya işlenecek](deploy-multi-tenant-node.md) olması durumunda, düğüm dağıtımı sırasında gerçekleştirilir.

    Her kiracının trafiğini ayrı ayrı bir düğüm işliyorsa, lütfen bu adımı atlayın ve [düğüm dağıtımı ve yapılandırmasına](deploy-multi-tenant-node.md) geçin.

Wallarm Cloud'a hangi trafiğin hangi kiracı hesabı altında görüntüleneceği bilgisini sağlamak için, belirli trafiği oluşturulan kiracı ile ilişkilendirmemiz gerekmektedir. Bunu yapmak için, NGINX yapılandırma dosyasında kiracıyı, [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) yönergesine **(Adım 3'te elde edilen)** `uuid` değerini atayarak dahil edin. Örneğin:

```
server {
  server_name  tenant1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
}
```

Yukarıdaki yapılandırmada, `tenant1.com` hedefine yönelen trafik, `11111111-1111-1111-1111-111111111111` numaralı müşteri ile ilişkilendirilecektir.

## Kullanıcılara Hesap Erişimi Sağlama

* Teknik kiracı hesabında, kullanıcılara **global** ve **normal** [roller](../../user-guides/settings/users.md) sağlanmaktadır.

    Global kullanıcılar, tüm bağlantılı kiracı hesaplarına erişebilecektir.

    Normal kullanıcılar, yalnızca teknik kiracı hesabına erişebilecektir.
* Belirli kiracı hesaplarında ise yalnızca kullanıcılara **normal** [roller](../../user-guides/settings/users.md) sağlanmaktadır.

    Kullanıcılar, engellenen istekleri takip edebilecek, keşfedilen zafiyetleri analiz edebilecek ve belirli bir kiracı hesabı kapsamında filtreleme düğümüne yönelik ek yapılandırmalar yapabilecektir. Rollerin buna izin vermesi durumunda, kullanıcılar birbirlerini kendileri ekleyebilecektir.

[Çok kiracılı düğüm dağıtımına ve yapılandırmasına devam etmek için →](deploy-multi-tenant-node.md)

## Wallarm Console'da Kiracı Hesaplarının Devre Dışı Bırakılması ve Etkinleştirilmesi

Wallarm Console'da, **Global administrator** rolündeki kullanıcı, kendisinin hizmet verdiği global hesaba bağlı kiracı hesaplarını devre dışı bırakabilir. Kiracı hesabı devre dışı bırakıldığında:

* Bu kiracı hesabının kullanıcıları Wallarm Console'a erişim sağlayamaz.
* Bu [kiracı seviyesi](deploy-multi-tenant-node.md#multi-tenant-node-characteristics) üzerinde yüklü olan filtreleme düğümü(leri) trafik işlemeyi durdurur.

Devre dışı bırakılan hesaplar silinmez ve tekrar etkinleştirilebilir.

Bir kiracı hesabını devre dışı bırakmak için, kiracı seçicide, kiracı menüsünden **Deactivate** seçeneğini seçin ve ardından onaylayın. Kiracı hesabı devre dışı bırakılarak, kiracı listesinden gizlenecektir.

![Kiracı - Devre Dışı Bırakma](../../images/partner-waf-node/tenant-deactivate.png)

Daha önce devre dışı bırakılmış bir kiracı hesabını etkinleştirmek için, kiracı seçicide **Show deactivated tenants** seçeneğine tıklayın, ardından kiracınız için **Activate** seçeneğini seçin.