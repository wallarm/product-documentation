[link-2fa-android-app]:     https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en
[link-2fa-ios-app]:         https://apps.apple.com/app/google-authenticator/id388497605

[img-profile]:              ../../images/user-guides/settings/profile.png
[img-2fa-page]:             ../../images/user-guides/settings/2fa-page.png

# Profilinizi Kontrol Etme

Profil verilerinizi ve ayarlarınızı görmek için **Ayarlar** → **Profil** sekmesine gidin.

Profilinizde hesap bilgilerinizi kontrol edebilirsiniz:

* E-posta
* Atanmış [rol](users.md#user-roles) - **Yönetici**, **Analizci**, veya **Sadece okuma**
* İsim ve telefon
* Wallarm sistemde kullanılacak tercih edilen tarih ve saat formatı
* Güvenlik: Son şifre veri değişikliği ve iki faktörlü doğrulama durumu. Bazı unsurlar SSO kimlik doğrulaması kullanıyorsanız kullanılamayabilir.
* Oturum açma geçmişi

*Oturumu Kapat* düğmesine tıklayarak Wallarm hesabınızdan çıkış yapabilirsiniz.

![Profil genel bakış][img-profile]

Gerektiğinde, aynı sayfada hesap bilgilerini düzenleyebilirsiniz.

## Şifrenizi Değiştirme

!!! info "SSO Kullanırken Kullanılamaz"
    SSO kimlik doğrulamasını kullanıyorsanız, email/şifre kimlik doğrulaması kullanılamaz ve şifrenizi kullanamaz veya değiştiremezsiniz. Şifre değiştirme bölümü kullanılamaz olacaktır.

1. *Değiştir* düğmesine tıklayın.
1. Gelen formda, geçerli şifreniz, yeni şifreniz ve yeni şifre doğrulamanızı girin.
1. *Şifreyi Değiştir* düğmesine tıklayın

## İki Faktörlü Kimlik Doğrulamayı Etkinleştirme

Google Authenticator (ya da TOTP'yi destekleyen benzer uygulamalar) kullanarak iki faktörlü kimlik doğrulamayı etkinleştirebilirsiniz.

!!! info "SSO Kullanırken Kullanılamaz"
    SSO kimlik doğrulamasını kullanıyorsanız, iki faktörlü kimlik doğrulama etkinleştirilemez. **Two-factor authentication** bölümü kullanılamaz olacaktır.

1. *Google Authenticator* uygulamasını ([Android][link-2fa-android-app], [iOS][link-2fa-ios-app]) veya uyumlu bir tane yükleyin.
1. İki-Faktörlü Kimlik Doğrulama ayarında *Etkinleştir* seçeneğine tıklayın.
1. Görünen QR kodunu tarayın (veya *manual entry* linkine tıklayın ve manuel giriş seçeneğini kullanın).
1. Uygulamanız tarafından üretilen 6 haneli doğrulama kodunu girin.
1. Şifrenizi girin.
1. *Onayla* düğmesine tıklayın.

Oturum açtığınızda, şifre işleminden sonra ikinci faktör kodunuz için sorulacaktır. Bu kodu Google Authenticator uygulamanızdan alın.

İki faktörlü kimlik doğrulamayı devre dışı bırakmak isterseniz şifre gereklidir.

![Two-factor authentication page genel bakış][img-2fa-page]

!!! info "Uyumluluk"
    Zaman Temelli Tek Kullanımlık Parola Algoritması (RFC6238)'ı destekleyen herhangi bir uygulama veya cihazı, tek-kullanımlık kodları oluşturmak için kullanabilirsiniz.
