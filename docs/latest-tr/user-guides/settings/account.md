[link-2fa-android-app]:     https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en
[link-2fa-ios-app]:         https://apps.apple.com/app/google-authenticator/id388497605

[img-profile]:              ../../images/user-guides/settings/profile.png
[img-2fa-page]:             ../../images/user-guides/settings/2fa-page.png

# Profilinizi Kontrol Etme

Profil verilerinizi ve ayarlarınızı görmek için **Settings** → **Profile** sekmesine gidin.

Profilinizde, hesap bilgilerinizi kontrol edebilirsiniz:

* E-posta
* Atanan [rol](users.md#user-roles) - **Admin**, **Analyst** veya **Read only**
* İsim ve telefon
* Wallarm sisteminde kullanılacak tercih edilen tarih ve saat biçimi
* Güvenlik: parolanızdaki son değişiklik ve iki faktörlü kimlik doğrulama durumu. SSO kimlik doğrulaması kullanıyorsanız bazı öğeler kullanılamayabilir.
* Oturum açma geçmişi

Wallarm hesabınızdan çıkış yapmak için *Sign out* düğmesine tıklayabilirsiniz.

![Profil genel görünümü][img-profile]

Gerekirse, hesap bilgilerini aynı sayfada düzenleyebilirsiniz.

## Parolanızı Değiştirme

!!! info "SSO kullanılıyorsa mevcut değil"
    SSO kimlik doğrulaması kullanıyorsanız, e-posta/parola ile kimlik doğrulama mevcut değildir ve parolanızı kullanamaz veya değiştiremezsiniz. Parola değiştirme bölümü kullanılabilir olmayacaktır.

1. *Change* düğmesine tıklayın.
1. Açılan formda mevcut parolanızı, yeni parolanızı ve yeni parolanızın doğrulamasını girin.
1. *Change password* düğmesine tıklayın

## İki Faktörlü Kimlik Doğrulamayı Etkinleştirme

İki faktörlü kimlik doğrulamayı etkinleştirmek için Google Authenticator’ı (veya TOTP destekleyen benzer uygulamaları) kullanabilirsiniz.

!!! info "SSO kullanılıyorsa mevcut değil"
    SSO kimlik doğrulaması kullanıyorsanız, iki faktörlü kimlik doğrulama etkinleştirilemez. **Two-factor authentication** bölümü kullanılabilir olmayacaktır.

1. Google Authenticator uygulamasını ([Android][link-2fa-android-app], [iOS][link-2fa-ios-app]) veya uyumlu herhangi birini yükleyin.
1. **Two-Factor Authentication** ayarında **Enable**’a tıklayın.
1. Görünen QR kodunu tarayın (veya **manual entry** bağlantısına tıklayın ve manual entry seçeneğini kullanın).
1. Uygulamanız tarafından oluşturulan 6 haneli doğrulama kodunu girin.
1. Parolanızı girin.
1. **Confirm**’e tıklayın.

Oturum açtığınız her seferinde, parola istemini geçtikten sonra ikinci faktör kodunuz istenecektir. Bu kodu Google Authenticator uygulamanızdan alın. 

İki faktörlü kimlik doğrulamayı kapatmak istiyorsanız parola gereklidir. Yöneticiniz şirketiniz için [2FA enforcement mode](users.md#enforcing-for-all-users) etkinleştirdiyse bunu kapatamazsınız.

![Two-factor authentication sayfasının genel görünümü][img-2fa-page]

!!! info "Uyumluluk"
    Zaman Tabanlı Tek Kullanımlık Parola Algoritmasını (RFC6238) destekleyen herhangi bir uygulama veya cihazı tek kullanımlık kodlar üretmek için kullanabilirsiniz.