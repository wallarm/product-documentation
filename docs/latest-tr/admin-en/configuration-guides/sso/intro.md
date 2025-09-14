# SAML SSO Kimlik Doğrulama Genel Bakış

Wallarm Console’a şirketinizin kullanıcılarını kimlik doğrulamak için tek oturum açma (SSO) teknolojisini kullanabilirsiniz. Wallarm, hizmet sağlayıcı (SP) olarak davranırken, Google veya Okta gibi SAML standardını destekleyen herhangi bir kimlik sağlayıcı (IdP) ile sorunsuz biçimde entegre olur.

![Integrations - SSO](../../../images/admin-guides/configuration-guides/sso/sso-integration-add.png)

## Mevcut seçenekler

### Provisioning

Wallarm SSO entegrasyonunu **provisioning** ile veya **provisioning** olmadan ayarlayabilirsiniz. Provisioning, SAML SSO çözümünden Wallarm’a verilerin otomatik aktarımıdır: SAML SSO çözümü kullanıcılarınız ve bunların grup üyelikleri Wallarm’a erişimi ve oradaki izinleri belirler; tüm kullanıcı yönetimi SAML SSO çözümü tarafında gerçekleştirilir.

**Provisioning** kapalıyken, SAML SSO çözümünüzde bulunan kullanıcılar için Wallarm’da karşılık gelen kullanıcıları oluşturmanız gerekir. Kullanıcı rolleri de Wallarm’da tanımlanır ve hangi kullanıcıların SSO ile oturum açacağını seçebilirsiniz - kalanlar kullanıcı adı/parola kullanır. Ayrıca, tüm şirket hesabı kullanıcıları için tek seferde SSO kimlik doğrulamasını etkinleştiren **Strict SSO** seçeneğini de etkinleştirebilirsiniz.

SSO kullanan kullanıcılar:

* Kullanıcı adı ve parola ile kimlik doğrulaması yapamaz ve iki faktörlü kimlik doğrulama (2FA) etkinleştirilemez.
* Provisioning ile, Wallarm tarafında devre dışı bırakılamaz veya silinemez.

Provisioning ve bunu kullanmadığınızda mevcut seçeneklerin ayrıntıları için [buraya bakın](setup.md#step-4-saml-sso-solution-configure-provisioning).

### Kiracıya bağlı izinler

[Çok kiracılık](../../../installation/multi-tenant/overview.md) özelliğini kullanıyor ve kullanıcılara **farklı kiracılarda farklı izinler** vermek istiyorsanız, bu seçeneğin etkinleştirilmesi için [Wallarm destek ekibi](https://support.wallarm.com/) ile iletişime geçin.

Bununla neler yapabileceğinize bir örnek: SAML SSO çözümünüzde `Department A` adlı bir grubunuz ve iki kiracınız olduğunu varsayalım: `TEST environment` ve `PROD environment`. Grubun kullanıcılarının TEST için yönetici izinlerine (**Administrator** rolü) ve PROD için kısıtlı izinlere (**Analyst** rolü) sahip olmasını istiyorsunuz.

Bunu yapmak için, **farklı kiracılarda farklı izinler** seçeneğinin etkinleştirilmiş ve [yapılandırılmış](setup.md#tenant-dependent-permissions) olması gerekir.

Ayrıca bu seçenekle, farklı SAML SSO çözümü gruplarının yalnızca belirli kiracılara erişmesini, diğerlerine erişmemesini de yapılandırabilirsiniz; örneğin, `Department B` SAML SSO çözümü grubunuz yalnızca TEST’e (seçtiğiniz izinlerle) erişebilir.

## Etkinleştirme ve kurulum

Varsayılan olarak, Wallarm’da kimlik doğrulama için SSO hizmeti etkin değildir, ilgili bloklar Wallarm Console’daki **Integrations** bölümünde görünmez.

SSO hizmetini etkinleştirmek için [Wallarm destek ekibi](https://support.wallarm.com/) ile iletişime geçin.

Hizmet etkinleştirildikten sonra, gerekli yapılandırmayı hem Wallarm tarafında hem de SAML SSO çözümünüz tarafında sağlayarak kurulumu gerçekleştirebilirsiniz. Ayrıntılar için [buraya bakın](setup.md).

Wallarm, SAML standardını destekleyen herhangi bir çözümle entegre olabilse de aynı anda yalnızca tek bir etkin SSO entegrasyonu olabilir.