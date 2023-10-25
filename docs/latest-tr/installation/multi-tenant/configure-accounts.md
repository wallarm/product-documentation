# Wallarm Konsolunda Kiracı Hesapları Oluşturma

Bu talimatlar, [kiracı hesaplarının](overview.md) doğru yapılandırması için adımları size sunar.

--8<-- "../include-tr/waf/features/multi-tenancy/partner-client-term.md"

## Kiracı hesaplarının yapılandırılması

Kiracı hesaplarını yapılandırmak için:

1. Wallarm Konsolu'na kaydolun ve hesabınız için çoklu kiracılık özelliğinin aktif hale getirilmesi talebinizi Wallarm teknik destek ekibine gönderin.
1. Bir kiracı hesabı oluşturun.
1. Belirli bir trafiği kiracı ve uygulamalarıyla ilişkilendirin.

### Adım 1: Kaydolun ve çoklu kiracılık özelliğini aktif hale getirme talebini gönderin

1. [ABD Bulutu'ndaki](https://us1.my.wallarm.com/signup) veya [AB Bulutu'ndaki](https://my.wallarm.com/signup) Wallarm Konsolu'nda kayıt formunu doldurun ve onaylayın.

    ![Kayıt formu](../../images/signup-en.png)

    !!! bilgi "Kurumsal e-posta"
        Lütfen bir kurumsal e-posta adresi kullanarak kaydolun.
2. E-posta gelen kutunuzu açın ve gelen mesajdaki linkle hesabı aktifleştirin.
3. Çoklu kiracılık özelliğinin hesabınız için aktifleştirilmesi talebini [Wallarm teknik desteğine](mailto:support@wallarm.com) gönderin. Talebyle birlikte aşağıdaki bilgileri gönderin:
   * Kullanılan Wallarm Bulutu'nun adı (ABD Bulutu veya AB Bulutu)
   * Global hesap ve teknik kiracı hesabı için adlar
   * Kiracı hesaplarına erişim sağlanacak çalışanların e-posta adresleri (çoklu kiracılık özelliği aktif olduktan sonra çalışanları kendiniz ekleyebileceksiniz)
   * Markalı Wallarm Konsolu için logo
   * Wallarm Konsolu için özel etki alanı, sertifika ve etki alanı için şifreleme anahtarı
   * Teknik destek e-posta adresiniz
   
Talebinizi aldıktan sonra Wallarm teknik destek ekibi:

1. Wallarm Bulutu'nda global bir hesap ve teknik kiracı hesabı oluşturacaktır.
2. Sizi, teknik istemci hesabının kullanıcı listesine **Global yönetici** [rolüyle](../../user-guides/settings/users.md) ekleyecektir.
3. Çalışanlarınızın e-posta adresleri verilmişse, Wallarm teknik destek ekibi, çalışanları teknik kiracı hesabının kullanıcı listesine, **Global salt okunur** [rolüyle](../../user-guides/settings/users.md) ekleyecektir.

    Kayıtlı olmayan çalışanlar, teknik kiracı hesabına erişmek için yeni bir parola belirlemek üzere bir bağlantı içeren e-postalar alacaklar.
4. UUID'nizi gönderecektir (ana kiracı UUID'si, izole ortamlar için çoklu kiracılık kullanan Wallarm ortak şirketi veya Wallarm müşterisini gösterir).

    Alınan UUID, ilerleyen adımlarda gereklidir.

### Adım 2: Kiracıyı Oluşturma

#### Wallarm Konsolu Üzerinden

**Global Yönetici** hesabı altında, Wallarm Konsolu → kiracı seçici → **Kiracı Oluştur** üzerinden kiracılar oluşturabilirsiniz.

![!Wallarm Konsolu aracılığıyla kiracının oluşturulması](../../images/partner-waf-node/tenant-create-via-ui.png)

Yeni kiracınız için yeni bir **Yönetici** [kullanıcı](../../user-guides/settings/users.md#user-roles) oluşturabilirsiniz. Davet e-postası belirttiğiniz adrese gönderilecektir.

#### Wallarm API Üzerinden

Kiracıyı oluşturmak için, Wallarm API'ye kimlik doğrulamalı istekler gönderebilirsiniz. Kimlik doğrulamalı istekler, kendi API istemcinizden veya kimlik doğrulama yöntemini belirleyen [Wallarm API Konsolu](../../api/overview.md)'ndan Wallarm API'ye gönderilebilir:

* **Wallarm API Konsolu**'ndan gönderilecek istekler için, Wallarm Konsolu'na **Global Yönetici** kullanıcı rolüyle oturum açmak ve aşağıdaki adreslerde bulunan Wallarm API Konsolu sayfasını güncellemek gereklidir:
    * ABD Bulutu için https://apiconsole.us1.wallarm.com/
    * AB Bulutu için https://apiconsole.eu1.wallarm.com/.
* **Kendi API istemcinizden** gönderilecek istekler için, istekte **Global Yönetici** izinlerine sahip [API belirteci](../../user-guides/settings/api-tokens.md#creating-tokens-with-global-role-permissions) iletmek gereklidir.

Bu adımda, global bir hesapla bağlantılı bir kiracı hesabı oluşturulacak.

1. Aşağıdaki parametrelerle `/v1/objects/client/create` rotasına POST isteği gönderin:

    Parametre | Açıklama | İstek Parçası | Zorunlu Ayar
    --------- | -------- | ------------- | ---------
    `X-WallarmApi-Token` | **Global Yönetici**'nin izinleriyle [API belirteci](../../user-guides/settings/api-tokens.md#configuring-tokens). | Başlık | Evet, isteği kendi API istemciniz üzerinden gönderirken
    `name` | Kiracının adı. | Gövde | Evet
    `vuln_prefix` | Wallarm'ın kiracı ile ilişkilendirme ve açıklık izleme için kullanacağı açıklık öneki. Önek, dört büyük harf veya sayı içermeli ve kiracının adına bağlantılı olmalıdır, örn.: `TNNT` kiracısı için `Kiracı`. | Gövde | Evet
    `partner_uuid` | Global hesap oluşturulurken alınan [ana kiracı UUID](#step-2-get-access-to-the-tenant-account-creation) | Gövde | Evet

    ??? info "Kendi API istemcinizden gönderilen isteğin bir örneğini göster"
        === "ABD Bulutu"
            ```bash
            curl -v -X POST "https://us1.api.wallarm.com/v1/objects/client/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```
        === "AB Bulutu"
            ``` bash
            curl -v -X POST "https://api.wallarm.com/v1/objects/client/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```

    ??? info "Yanıtın bir örneğini göster"
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

2. İsteğin yanıtından `uuid` parametresinin değerini kopyalayın. Parametre, kiracı trafiğinin kiracı hesabına bağlanması işleminde kullanılacak.

Oluşturulan kiracılar, Wallarm Konsolu'nda [global kullanıcılar](../../user-guides/settings/users.md#user-roles) için görüntülenecektir. Örneğin `Kiracı 1` ve `Kiracı 2`:

![Wallarm Konsolu'ndaki kiracı seçicisi](../../images/partner-waf-node/clients-selector-in-console.png)

### Adım 3: Belirli bir trafiği kiracınız ile ilişkilendirin

!!! bilgi "Ne zaman yapılandırılmalı?"
    Bu yapılandırma, düğüm dağıtımı sırasında ve tüm kiracıların trafiği [işleniyor veya işlenmesi](deploy-multi-tenant-node.md) planlanıyorsa yalnızca bir Wallarm düğümü tarafından gerçekleştirilir.

    Her kiracının trafiğini ayrı bir düğüm işlerse, lütfen bu adımı atlayın ve [düğümün dağıtımına ve yapılandırılmasına](deploy-multi-tenant-node.md) devam edin.

Hangi trafiğin hangi kiracı hesabı altında görüntüleneceği bilgisini Wallarm Bulutu'na sağlamak için, belirli bir trafiği oluşturulan kiracı ile ilişkilendirmemiz gerekiyor. Bunu yapmak için, NGINX yapılandırma dosyasına kiracıyı dahil edin ve [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) yönergesi için değer olarak UUID'sini (**Adım 3**'te elde edilmiştir) kullanın. Örneğin:

```
server {
  server_name  tenant1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
}
```

Yukarıdaki yapılandırmada, `tenant1.com` hedefli trafik, `11111111-1111-1111-1111-111111111111` istemcisi ile ilişkilendirilmiş olacaktır.

## Kullanıcıların Hesaplara Erişimini Sağlamak

* Teknik kiracı hesabında, kullanıcılara sunulacak olan **global** ve **standart** [roller](../../user-guides/settings/users.md) bulunmaktadır.

    Global kullanıcılar tüm bağlı kiracı hesaplarına erişim hakkına sahip olacaklardır.

    Standart kullanıcılar yalnızca teknik kiracı hesabına erişim hakkına sahip olacaklardır.
* Belirli kiracı hesaplarında, kullanıcılara sunulacak olan yalnızca **standart** [roller](../../user-guides/settings/users.md) bulunmaktadır.

    Kullanıcılar, belirli bir kiracı hesabı içerisinde engellenen istekleri izleyebilir, bulunan güvenlik açıklıklarını analiz edebilir ve filtreleme düğümünün ek konfigürasyonlarını gerçekleştirebilirler. Rolleri bu işlemi yapmaya izin veriyorsa, kullanıcılar birbirlerini ekleyebileceklerdir.

[Çoklu kiracı düğümünün dağıtımına ve yapılandırılmasına ilerleyin →](deploy-multi-tenant-node.md)


## Wallarm Konsolu'nda Kiracı Hesaplarını Deaktifleştirme ve Aktifleştirme 

Wallarm Konsolu'nda, **Global Yönetici** rolündeki kullanıcı, bu yöneticinin hizmet verdiği global hesaba bağlı kiracı hesapları deaktifleştirebilir. Kiracı hesabı deaktifleştirildiğinde:

* Bu kiracı hesabının kullanıcılarının Wallarm Konsolu'na erişimi yoktur.
* Bu [kiracı seviyesine](deploy-multi-tenant-node.md#multi-tenant-node-characteristics) yüklenmiş filtreleme düğüm(leri) trafik işlemeyi durdurur.

Deaktifleştirilen hesaplar silinmez ve yeniden aktifleştirilebilirler.

Bir kiracı hesabını deaktifleştirmek için, kiracı seçicide, kiracı menüsünden **Deaktif** seçeneğini seçin, ardından onaylayın. Kiracı hesabı deaktifleştirilecek ve kiracı listesinden gizlenecektir.

![Kiracı - Deaktif](../../images/partner-waf-node/tenant-deactivate.png)

Daha önce deaktifleştirilmiş kiracı hesabını aktifleştirmek için, kiracı seçicide, **Deaktif Kiracıları Göster** düğmesine tıklayın, ardından kiracınız için **Aktif** seçeneğini seçin.