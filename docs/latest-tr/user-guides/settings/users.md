[link-audit-log]:               audit-log.md

[link-glossary-incident]:       ../../glossary-en.md#security-incident
[link-glossary-vulnerability]:  ../../glossary-en.md#vulnerability

[img-configure-user]:       ../../images/user-guides/settings/configure-user.png
[img-disabled-users]:       ../../images/user-guides/settings/disabled-users.png
[img-search-user]:          ../../images/user-guides/settings/search-users.png
[img-add-user]:             ../../images/user-guides/settings/integrations/webhook-examples/adding-user.png
[img-user-menu]:            ../../images/user-guides/settings/user-menu.png
[img-disabled-user-menu]:   ../../images/user-guides/settings/disabled-user-menu.png
[img-edit-user]:            ../../images/user-guides/settings/edit-user.png
[img-user-disable-2fa]:     ../../images/user-guides/settings/users-disable-2fa.png
[img-user-menu-disable-2fa]:    ../../images/user-guides/settings/disable-2fa-button.png
[img-disable-delete-multi]:     ../../images/user-guides/settings/users-multi-disable-access.png
[img-enable-delete-multi]:      ../../images/user-guides/settings/users-multi-enable-access.png    

# Kullanıcıları Yapılandırma

*Settings* kısmında bulunan *Kullanıcı* sekmesinde kullanıcı hesaplarını yönetebilirsiniz.

!!! Uyarı "Yönetici Erişimi"
    Sadece **Yönetici** rolündeki kullanıcılar bu ayarlara erişebilir.

## Kullanıcı Roller

Wallarm müşteri kullanıcıları aşağıdaki rollere sahip olabilir:

* **Yönetici**: Tüm Wallarm ayarlarına erişim hakkı
* **Analist**: Ana Wallarm ayarlarını görüntüleme ve saldırganlık, [olay][link-glossary-incident] ve [saldırganlık][link-glossary-vulnerability] bilgilerini yönetme yeteneği
* **Salt Okunur**: Ana Wallarm ayarlarını görme yeteneği
* **API Geliştirme**: [API Keşif](../../api-discovery/overview.md) modülü tarafından keşfedilen API envanterini görüntüleme ve indirme yeteneği. Bu, görevleri yalnızca Wallarm'ı kullanarak şirket API'leri hakkında güncel veri bulunan kullanıcıları belirlemeyi sağlar. Bu kullanıcıların Wallarm Konsolu bölümlerine **API Keşif** ve **Ayarlar → Profil** dışında erişimi yoktur.

Çok katmanlı özellik[çok kiracılık](../../installation/multi-tenant/overview.md), **Global Yönetici**, **Global Analist**, **Global Salt Okunur** gibi global rolleri de kullanabilmenizi sağlar. Global roller, kullanıcılara teknik kiracı hesabına ve bağlantılı kiracı hesaplarına erişim sağlar, düzenli roller kullanıcıların yalnızca teknik kiracı hesabına erişimini sağlar.

Farklı kullanıcı rollerinin Wallarm öğelerine erişim hakkında daha ayrıntılı bilgi aşağıdaki tabloda verilmiştir. Öğe yönetimi, öğe oluşturmayı, düzenlemeyi ve silmeyi içerir.

| Öğe              | Yönetici / Global Yönetici | Analist / Global Analist | Salt Okunur / Global Salt Okunur | API Geliştirme |
|---------------------|--------------------------------------|--------------------------|------------------------------|---|
| **Filtreleme Noktaları**       | Görüntüle ve yönet                      | Görüntüle                     | Görüntüle                         | - |
| **Panel**       | Görüntüle                                 | Görüntüle                     | Görüntüle                         | - |
| **Olaylar**          | Görüntüle ve yönet                      | Görüntüle ve yönet          | Görüntüle                         | - |
| **Saldırganlık** | Görüntüle ve yönet                      | Görüntüle ve yönet          | Görüntüle              | - |
| **API Envanteri API Keşif Tarafından**   | Görüntüle ve yönet                      | Görüntüle ve yönet  | -                            | Görüntüle ve indir |
| **API Spesifikasyonları**   | Görüntüle ve yönet                      | Görüntüle          | Görüntüle                            | Görüntüle |
| **Tarayıcı**         | Görüntüle ve yönet                      | Görüntüle ve yönet  | Görüntüle                         | - |
| **Tetikleyiciler**        | Görüntüle ve yönet                      | -                        | -                            | - |
| **IP listeleri**       | Görüntüle, yönet ve dışa aktar             | Görüntüle, yönet ve dışa aktar | Görüntüle ve dışa aktar              | - |
| **Kurallar**           | Görüntüle ve yönet                      | Görüntüle ve yönet          | Görüntüle                         | - |
| **BOLA Koruması**           | Görüntüle ve yönet                      | Görüntüle          | - | - |
| **Entegrasyonlar**    | Görüntüle ve yönet                      | -                        | -                            | - |
| **Filtrasyon modu**        | Görüntüle ve yönet                      | Görüntüle                     | Görüntüle                         | - |
| **Uygulamalar**    | Görüntüle ve yönet                      | Görüntüle                     | Görüntüle                         | - |
| **Kullanıcılar**           | Görüntüle ve yönet                      | -                        | Görüntüle                         | - |
| **Aktivite Kaydı**    | Görüntüle                                 | -                        | Görüntüle                         | - |

## Kullanıcıları Görüntüleme

Aşağıdaki sekmelerde kullanıcı listelerini görüntüleyebilirsiniz:
*   Ana *Kullanıcılar* sekmesi, Wallarm bulutta kayıtlı şirketinizin tüm kullanıcılarını içerir. Bu sekmede, pasifize edilmiş herhangi bir kullanıcı gri renkte vurgulanır.

    ![Kullanıcı listesi][img-configure-user]

*   *Disabled* sekmesi yalnızca pasifize edilmiş kullanıcıları içerir.

    ![Pasifize edilmiş kullanıcılar listesi][img-disabled-users]

Tablonuk başlığındaki hücrelere tıklayarak kullanıcıları isme, role, e-maile ve son oturum açma tarihine göre sıralayabilirsiniz.

Ayrıca kullanıcı adlarının solundaki kutucukları işaretleyerek bir veya birkaç kullanıcı seçebilir; böylece bir kullanıcı grubuna işlemler yapabilirsiniz.

## Kullanıcıları Arama

Tablonun üzerindeki arama alanını kullanarak kullanıcıları isme, e-maile veya sistem rolüne göre arayabilirsiniz.

![Kullanıcı arama][img-search-user]

## Kullanıcı Oluşturma

1.  *Settings* bölümünün *Kullanıcılar* sekmesinde, *Kullanıcı ekle* düğmesine tıklayın.
2.  Açılan listeden kullanıcı rolünü seçin.
3.  Kullanıcı için bir isim, soy isim ve e-posta girin.

    ![Yeni kullanıcı formu][img-add-user]

4.  *Kullanıcı ekle* düğmesine tıklayın.

    Yeni kullanıcı, oturum açma bağlantısı ve bir parola belirleme linkini içeren otomatik bir e-posta alacaktır.

Yeni eklenen kullanıcılar hakkında bildirim almak için ilgili [tetikleyici](../triggers/triggers.md)'yi ayarlayabilirsiniz. Bildirimler mesajlaşma ve SOAR (örneğin: Slack, Microsoft Teams, OpsGenie) sistemlerine gönderilecektir.

## Kullanıcı Bilgisini Değiştirme

Kullanıcı bilgisini değiştirmek için aşağıdaki eylemleri gerçekleştirin:
1.  *Settings* bölümünün *Kullanıcılar* sekmesinde, düzenlemek için kullanıcıyı seçin.
2.  İlgili kullanıcının sağ tarafındaki düğmeye tıklayarak kullanıcı eylemleri menüsünü açın.

    ![Kullanıcı eylemleri menüsü][img-user-menu]

3.  *Kullanıcı ayarlarını düzelt* seçeneğine tıklayın.
4.  Açılan formda yeni kullanıcı bilgilerini girin ve *Kaydet* düğmesine tıklayın.

    ![Kullanıcı bilgileri düzenleme formu][img-edit-user]

Eski kullanıcı bilgileri yenisiyle değiştirilecektir.

## İki Faktörlü Kimlik Doğrulama Ayarlarını Sıfırlama

İki faktörlü kimlik doğrulama ayarlarını sıfırlamak için aşağıdaki eylemleri gerçekleştirin:
1.  *Settings* bölümünün *Kullanıcılar* sekmesinde, ilgili kullanıcıyı seçin.
2.  İlgili kullanıcının sağ tarafındaki düğmeye tıklayarak kullanıcı eylemleri menüsünü açın.

    ![Kullanıcı eylemleri menüsü][img-user-menu-disable-2fa]

3.  *Disable 2FA* seçeneğine tıklayın.
4.  Açılan formda Wallarm Yönetici hesabınızın şifresini girin ve *Disable 2FA* düğmesine tıklayın.

    ![2-faktörlü kimlik doğrulamanın devre dışı bırakılması][img-user-disable-2fa]

2-faktörlü kimlik doğrulama fonksiyonu, seçilen kullanıcı için devre dışı bırakılacaktır. Kullanıcı, 2-faktörlü kimlik doğrulamayı [profil ayarlarından](account.md#enabling-two-factor-authentication) yeniden etkinleştirebilir.

## Kullanıcı İçin Erişimi Devre Dışı Bırakma

Bir kullanıcı için erişimi devre dışı bırakma, kullanıcının Wallarm hesabını pasifize eder.

Belirli bir kullanıcının Wallarm hesabını devre dışı bırakmak için aşağıdaki eylemleri gerçekleştirin:
1.  *Settings* bölümünün *Kullanıcılar* sekmesinde, kullanıcı seçin.
2. İlgili kullanıcının sağ tarafındaki düğmeye tıklayarak kullanıcı eylemleri menüsünü açın.

    ![Kullanıcı eylemleri menüsü][img-user-menu]

3.  *Erişimi Devre Dışı Bırak* seçeneğine tıklayın.

Artık seçili kullanıcı, Wallarm hesabını kullanamaz.

Eğer birden fazla kullanıcı hesabı için erişimi devre dışı bırakmanız gerekiyorsa, erişimlerini iptal etmek istediğiniz kullanıcıları seçin. Eylem paneli görünecektir. Bu panelde, *Erişimi Devre Dışı Bırak* düğmesine tıklayın.

![Birkaç kullanıcının hesabının devre dışı bırakılması][img-disable-delete-multi]

## Kullanıcı İçin Erişimi Etkinleştirme

Bir kullanıcı için erişimi etkinleştireme, kullanıcının Wallarm hesabını etkinleştirir.

Belirli bir kullanıcının Wallarm hesabını etkinleştirmek için aşağıdaki eylemleri gerçekleştirin:
1.  *Settings* bölümünün *Kullanıcılar* sekmesinden, devre dışı bırakılan erişimi olan kullanıcıyı seçin.
2. İlgili kullanıcının sağ tarafındaki düğmeye tıklayarak kullanıcı eylemleri menüsünü açın.

    ![Devre dışı kullanıcı eylemleri menüsü][img-disabled-user-menu]

3.  *Erişimi Etkinleştir* seçeneğine tıklayın.

Artık seçili kullanıcı, Wallarm hesabını kullanabilir.

Eğer birden fazla kullanıcı hesabı için erişimi etkinleştirmeniz gerekiyorsa, erişim sağlamak istediğiniz kullanıcıları seçin. Eylem paneli görünecektir. Bu panelde, *Erişimi Etkinleştir* düğmesine tıklayın.

![Birkaç kullanıcının hesabının etkinleştirilmesi][img-enable-delete-multi]

## Kullanıcıyı Silme

Belirli bir kullanıcı hesabını silmek için aşağıdaki eylemleri gerçekleştirin:
1.  *Settings* bölümünün *Kullanıcılar* sekmesinde, silmek istediğiniz kullanıcıyı seçin.
2. İlgili kullanıcının sağ tarafındaki düğmeye tıklayarak kullanıcı eylemleri menüsünü açın.

    ![Kullanıcı eylemleri menüsü][img-user-menu]

3.  *Delete* seçeneğine tıklayın.

Eğer birden fazla kullanıcı hesabını silmeniz gerekiyorsa, hesaplarını silmek istediğiniz kullanıcıları seçin. Eylem paneli görünecektir. Bu panelde, *Sil* düğmesine tıklayın.

![Birkaç kullanıcının hesaplarının silinmesi][img-disable-delete-multi]