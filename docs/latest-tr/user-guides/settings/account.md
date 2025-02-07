[link-2fa-android-app]:     https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en
[link-2fa-ios-app]:         https://apps.apple.com/app/google-authenticator/id388497605

[img-profile]:              ../../images/user-guides/settings/profile.png
[img-2fa-page]:             ../../images/user-guides/settings/2fa-page.png

# Profilinizi Kontrol Etme

Profil verilerinizi ve ayarlarınızı görmek için **Settings** → **Profile** sekmesine gidin.

Profilinizde, hesap bilgilerinizi kontrol edebilirsiniz:

* E-posta
* Atanmış [rol](users.md#user-roles) - **Admin**, **Analyst** veya **Read only**
* İsim ve telefon
* Wallarm sisteminde kullanılacak tercih edilen tarih ve saat formatı
* Güvenlik: son şifre değişikliği ve iki faktörlü kimlik doğrulama durumu. SSO kimlik doğrulaması kullanıyorsanız bazı öğeler mevcut olmayabilir.
* Giriş geçmişi

Wallarm hesabınızdan çıkış yapmak için *Sign out* düğmesine tıklayabilirsiniz.

![Profile overview][img-profile]

Gerekirse, aynı sayfada hesap bilgilerinizi düzenleyebilirsiniz.

## Şifrenizi Değiştirme

!!! info "SSO kullanıyorsanız mevcut değil"
    SSO kimlik doğrulaması kullanıyorsanız, e-posta/şifre ile kimlik doğrulaması mevcut değildir; şifrenizi kullanamaz veya değiştiremezsiniz. Şifre değiştirme bölümü mevcut olmayacaktır.

1. *Change* düğmesine tıklayın.
1. Açılan formda mevcut şifrenizi, yeni şifrenizi ve yeni şifre teyidinizi girin.
1. *Change password* düğmesine tıklayın.

## İki Faktörlü Kimlik Doğrulamayı Etkinleştirme

İki faktörlü kimlik doğrulamayı etkinleştirmek için Google Authenticator (veya TOTP'yi destekleyen benzer uygulamaları) kullanabilirsiniz.

!!! info "SSO kullanıyorsanız mevcut değil"
    SSO kimlik doğrulaması kullanıyorsanız, iki faktörlü kimlik doğrulama etkinleştirilemez. **Two-factor authentication** bölümü mevcut olmayacaktır.

1. *Google Authenticator* uygulamasını ([Android][link-2fa-android-app], [iOS][link-2fa-ios-app]) veya uyumlu herhangi bir uygulamayı yükleyin.
1. İki Faktörlü Kimlik Doğrulama ayarında *Enable* seçeneğine tıklayın.
1. Görüntülenen QR kodunu tarayın (veya *manual entry* bağlantısına tıklayarak manuel giriş seçeneğini kullanın).
1. Uygulamanız tarafından oluşturulan 6 haneli doğrulama kodunu girin.
1. Şifrenizi girin.
1. *Confirm* düğmesine tıklayın.

Her oturum açtığınızda, şifre isteminin ardından size ikinci faktör kodu sorulacaktır. Bu kodu Google Authenticator uygulamanızdan edinin.

İki faktörlü kimlik doğrulamayı kapatmak isterseniz, şifre gereklidir.

![Two-factor authentication page overview][img-2fa-page]

!!! info "Uyumluluk"
    Zaman Tabanlı Tek Kullanımlık Şifre Algoritması (RFC6238) destekleyen herhangi bir uygulama veya cihazı tek kullanımlık kodlar oluşturmak için kullanabilirsiniz.