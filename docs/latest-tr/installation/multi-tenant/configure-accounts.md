# Wallarm Console'da Kiracı Hesapları Oluşturma

Bu talimatlar, [kiracı hesaplarının](overview.md) doğru yapılandırılması için adımları sağlar.

--8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"

## Kiracı hesaplarını yapılandırma

Kiracı hesaplarını yapılandırmak için:

1. Wallarm Console’a kaydolun ve hesabınız için çoklu kiracılık özelliğinin etkinleştirilmesi talebini Wallarm teknik desteğine gönderin.
1. Bir kiracı hesabı oluşturun.
1. Belirli trafiği kiracı ve onun uygulamalarıyla ilişkilendirin.

### Adım 1: Kayıt olun ve çoklu kiracılık özelliğinin etkinleştirilmesi için talep gönderin

1. Wallarm Console’daki kayıt formunu [US Cloud](https://us1.my.wallarm.com/signup) veya [EU Cloud](https://my.wallarm.com/signup) için doldurun ve onaylayın.

    ![Kayıt formu](../../images/signup-en.png)

    !!! info "Kurumsal e-posta"
        Lütfen kurumsal e-posta adresi kullanarak kaydolun.
2. E-posta gelen kutunuzu açın ve gelen mesajdaki bağlantıyı kullanarak hesabı etkinleştirin.
3. Hesabınız için çoklu kiracılık özelliğinin etkinleştirilmesi talebini [Wallarm teknik desteğine](mailto:support@wallarm.com) gönderin. Talep ile birlikte aşağıdaki verileri iletin:
    * Kullanılan Wallarm Cloud adı (US Cloud veya EU Cloud)
    * Global hesap ve teknik kiracı hesabı için adlar
    * Kiracı hesaplarına erişim verilecek çalışanların e-posta adresleri (çoklu kiracılık özelliği etkinleştirildikten sonra çalışanları kendiniz ekleyebileceksiniz)
    * Markalı Wallarm Console için logo
    * Wallarm Console için özel alan adı, alan adına ait sertifika ve şifreleme anahtarı
    * Teknik destek e-posta adresiniz

Talebinizi aldıktan sonra Wallarm teknik destek şunları yapacaktır:

1. Wallarm Cloud’da bir global hesap ve teknik kiracı hesabı oluşturur.
2. Sizi teknik istemci hesabının kullanıcı listesine **Global administrator** [rolü](../../user-guides/settings/users.md) ile ekler.
3. Çalışanlarınızın e-posta adresleri sağlanmışsa, Wallarm teknik destek çalışanları teknik kiracı hesabının kullanıcı listesine **Global read only** [rolü](../../user-guides/settings/users.md) ile ekler.

    Kayıtlı olmayan çalışanlar, teknik kiracı hesabına erişmek için yeni bir parola belirleme bağlantısını içeren e-postalar alacaktır.
4. UUID’nizi gönderir (izole ortamlar için çoklu kiracılığı kullanan Wallarm iş ortağı şirketini veya Wallarm müşterisini belirten ana kiracı UUID’si).

    Alınan UUID sonraki adımlarda gerekecektir.

### Adım 2: Kiracıyı oluşturun

#### Wallarm Console üzerinden

**Global administrator** hesabı altında, Wallarm Console → tenant selector → **Create tenant** yolunu izleyerek kiracılar oluşturabilirsiniz.

![!Wallarm Console üzerinden kiracı oluşturma](../../images/partner-waf-node/tenant-create-via-ui.png)

Yeni kiracınız için yeni bir **Administrator** [kullanıcı](../../user-guides/settings/users.md#user-roles) oluşturabilirsiniz. Davet e-postası belirtilen adrese gönderilecektir.

#### Wallarm API aracılığıyla

Kiracı oluşturmak için Wallarm API’ye kimliği doğrulanmış istekler gönderebilirsiniz. Wallarm API’ye kimliği doğrulanmış istekler, kendi API istemcinizden veya kimlik doğrulama yöntemini tanımlayan [Wallarm API Console](../../api/overview.md) üzerinden gönderilebilir:

* İstekler **Wallarm API Console** üzerinden gönderilecekse, Wallarm Console’a **Global administrator** kullanıcı rolüyle giriş yapmanız ve şu adreste mevcut olan Wallarm API Console sayfasını yenilemeniz gerekir:
    * US Cloud için https://apiconsole.us1.wallarm.com/
    * EU Cloud için https://apiconsole.eu1.wallarm.com/
* İstekler **kendi API istemcinizden** gönderilecekse, istekte [Global Administrator izinlerine sahip API token'ı](../../user-guides/settings/api-tokens.md) iletmeniz gerekir.

Bu adımda, bir global hesaba bağlı bir kiracı hesabı oluşturulacaktır.

1. Aşağıdaki parametrelerle `/v1/objects/client/create` rotasına POST isteği gönderin:

    Parametre | Açıklama | İstek bölümü | Gerekli
    --------- | -------- | ------------- | ---------
    `X-WallarmApi-Token` | **Global Administrator** izinlerine sahip [API token](../../user-guides/settings/api-tokens.md). | Header | Evet, isteği kendi API istemcinizden gönderirken
    `name` | Kiracının adı. | Body | Evet
    `vuln_prefix` | Wallarm’ın güvenlik açığı izleme ve kiracı ile ilişkilendirme için kullanacağı güvenlik açığı öneki. Önek, dört büyük harf veya rakam içermeli ve kiracının adıyla ilişkili olmalıdır, örn.: `Tenant` kiracısı için `TNNT`. | Body | Evet
    `partner_uuid` | Global hesap oluşturulurken alınan [ana kiracı UUID’si](#step-1-sign-up-and-send-a-request-to-activate-the-multitenancy-feature). | Body | Evet

    ??? info "Kendi API istemcinizden gönderilen istek örneğini göster"
        === "US Cloud"
            ```bash
            curl -v -X POST "https://us1.api.wallarm.com/v1/objects/client/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```
        === "EU Cloud"
            ``` bash
            curl -v -X POST "https://api.wallarm.com/v1/objects/client/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```

    ??? info "Yanıt örneğini göster"
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

2. İsteye gelen yanıttaki `uuid` parametresinin değerini kopyalayın. Bu parametre, kiracının trafiğini kiracı hesabına bağlarken kullanılacaktır.

Oluşturulan kiracılar, [global kullanıcılar](../../user-guides/settings/users.md#user-roles) için Wallarm Console’da görüntülenecektir. Örneğin, `Tenant 1` ve `Tenant 2`:

![Wallarm Console’da kiracı seçici](../../images/partner-waf-node/clients-selector-in-console.png)

### Adım 3: Belirli trafiği kiracınızla ilişkilendirin

!!! info "Ne zaman yapılandırmalı?"
    Bu yapılandırma, düğüm dağıtımı sırasında ve yalnızca tüm kiracıların trafiği tek bir Wallarm düğümü tarafından [işleniyorsa veya işlenecekse](deploy-multi-tenant-node.md) yapılır.

    Ayrı bir düğüm her bir kiracının trafiğini işliyorsa, lütfen bu adımı atlayın ve [düğüm dağıtımı ve yapılandırmasına](deploy-multi-tenant-node.md) geçin.

Wallarm Cloud’a hangi trafiğin hangi kiracı hesabı altında görüntüleneceğine dair bilgiyi sağlamak için belirli trafiği oluşturulan kiracıyla ilişkilendirmemiz gerekir. Bunu yapmak için, NGINX yapılandırma dosyasına kiracıyı, **Adım 3**’te elde edilen `uuid` değerini [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) yönergesi için değer olarak kullanarak ekleyin. Örneğin:

```
server {
  server_name  tenant1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
}
```

Yukarıdaki yapılandırmada, `tenant1.com` hedefli trafik `11111111-1111-1111-1111-111111111111` istemcisiyle ilişkilendirilecektir.

## Kullanıcılara hesaplara erişim sağlama

* Teknik kiracı hesabında, kullanıcılara verilebilecek **global** ve **normal** [roller](../../user-guides/settings/users.md) vardır.

    Global kullanıcılar bağlı tüm kiracı hesaplarına erişebilecektir.

    Normal kullanıcılar yalnızca teknik kiracı hesabına erişebilecektir.
* Belirli kiracı hesaplarında, kullanıcılara verilebilecek yalnızca **normal** [roller](../../user-guides/settings/users.md) vardır.

    Kullanıcılar, belirli bir kiracı hesabı kapsamında engellenen istekleri takip edebilecek, keşfedilen güvenlik açıklarını analiz edebilecek ve filtreleme düğümünün ek yapılandırmalarını gerçekleştirebilecektir. Roller buna izin veriyorsa kullanıcılar birbirlerini kendileri ekleyebilecektir.

[Çok kiracılı düğümün dağıtımı ve yapılandırmasına geçin →](deploy-multi-tenant-node.md)

## Wallarm Console'da kiracı hesaplarını devre dışı bırakma ve etkinleştirme

Wallarm Console’da, **Global administrator** rolüne sahip kullanıcı, bu yöneticinin hizmet verdiği global hesaba bağlı kiracı hesaplarını devre dışı bırakabilir. Kiracı hesabı devre dışı bırakıldığında:

* Bu kiracı hesabının kullanıcıları Wallarm Console’a erişemez.
* Bu [kiracı seviyesinde](deploy-multi-tenant-node.md#multi-tenant-node-characteristics) kurulu filtreleme düğümü(leri) trafik işlemeyi durdurur.

Devre dışı bırakılan hesaplar silinmez ve yeniden etkinleştirilebilir.

Bir kiracı hesabını devre dışı bırakmak için, tenant selector içinde, kiracı menüsünden **Deactivate** öğesini seçin ve ardından onaylayın. Kiracı hesabı devre dışı bırakılacak ve kiracı listesinden gizlenecektir.

![Kiracı - Deactivate](../../images/partner-waf-node/tenant-deactivate.png)

Önceden devre dışı bırakılmış bir kiracı hesabını etkinleştirmek için, tenant selector içinde **Show deactivated tenants** öğesine tıklayın, ardından kiracınız için **Activate** seçeneğini belirleyin.