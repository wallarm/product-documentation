[link-2fa-android-app]:     https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en
[link-2fa-ios-app]:         https://apps.apple.com/app/google-authenticator/id388497605

[img-profile]:              ../../images/user-guides/settings/profile.png
[img-2fa-page]:             ../../images/user-guides/settings/2fa-page.png

# プロファイルの確認

プロファイルのデータと設定を表示するには、**Settings** → **Profile**タブに移動します。

プロファイルでは、次のアカウント情報を確認できます：

* Email
* 割り当てられた[ロール](users.md#user-roles) - **Admin**、**Analyst**、または**Read only**
* Nameとphone
* Wallarmシステムで使用する希望の日時形式
* Security: 直近のパスワード変更と二要素認証の状態。SSO認証を使用している場合、一部の要素は利用できない場合があります。
* Sign-in history

Wallarmアカウントからログアウトするには、*Sign out*ボタンをクリックします。

![プロファイルの概要][img-profile]

必要に応じて、同じページでアカウント情報を編集できます。

## パスワードの変更

!!! info "SSO使用時は利用不可"
    SSO認証を使用している場合、メール/パスワード認証は利用できないため、パスワードを使用したり変更したりすることはできません。パスワード変更セクションは表示されません。

1. *Change*ボタンをクリックします。
1. 表示されたフォームで、現在のパスワード、新しいパスワード、新しいパスワードの確認を入力します。
1. *Change password*ボタンをクリックします。

## 二要素認証の有効化

二要素認証を有効にするには、Google Authenticator（またはTOTPに対応した同等のアプリ）を使用できます。

!!! info "SSO使用時は利用不可"
    SSO認証を使用している場合は、二要素認証を有効にできません。**Two-factor authentication**セクションは表示されません。

1. Google Authenticatorアプリ（[Android][link-2fa-android-app], [iOS][link-2fa-ios-app]）または互換アプリをインストールします。
1. **Two-Factor Authentication**設定で**Enable**をクリックします。
1. 表示されたQRコードをスキャンします（または**manual entry**リンクをクリックし、手動入力オプションを使用します）。
1. アプリで生成された6桁の確認コードを入力します。
1. パスワードを入力します。
1. **Confirm**をクリックします。

サインインのたびに、パスワードのプロンプトを通過した後に第2要素コードの入力が求められます。このコードはGoogle Authenticatorアプリから取得します。

二要素認証をオフにするにはパスワードが必要です。管理者が会社に対して[2FA強制モード](users.md#enforcing-for-all-users)を有効にしている場合、オフにすることはできません。

![二要素認証ページの概要][img-2fa-page]

!!! info "互換性"
    ワンタイムコードを生成するには、Time‑Based One‑Time Password Algorithm (RFC6238) に対応する任意のアプリケーションまたはデバイスを使用できます。