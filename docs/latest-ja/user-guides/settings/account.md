[link-2fa-android-app]:     https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en
[link-2fa-ios-app]:         https://apps.apple.com/app/google-authenticator/id388497605

[img-profile]:              ../../images/user-guides/settings/profile.png
[img-2fa-page]:             ../../images/user-guides/settings/2fa-page.png

# プロフィールの確認

プロフィールデータと設定の確認は、**Settings**→**Profile**タブに進みます。

プロフィールでは、アカウント情報を確認できます：

* メールアドレス
* 割り当てられた[役割](users.md#user-roles) - **Admin**, **Analyst**,または**Read only**
* 名前と電話番号
* Wallarmシステムで使用する優先の日付・時刻フォーマット
* セキュリティ：最後のパスワード変更日と二要素認証の状態。一部の要素はSSO認証をご使用の場合、利用できないことがあります。
* サインイン履歴

Wallarmアカウントからログアウトするには、*Sign out*ボタンをクリックできます。

![プロフィール概要][img-profile]

必要に応じて、同じページ上でアカウント情報を編集可能です。

## パスワードの変更

!!! info "SSO認証をご使用の場合は利用できません"
    もしSSO認証をご使用の場合、メール／パスワード認証は利用できず、パスワードの使用または変更ができません。パスワード変更セクションは利用できなくなります。

1. *Change*ボタンをクリックします。
1. 表示されたフォームに現在のパスワード、新しいパスワード、および新しいパスワードの確認を入力します。
1. *Change password*ボタンをクリックします。

## 二要素認証の有効化

Google Authenticator（またはTOTPをサポートする類似のアプリ）を使用して二要素認証を有効化できます。

!!! info "SSO認証をご使用の場合は利用できません"
    もしSSO認証をご使用の場合、二要素認証は有効化できません。**Two-factor authentication**セクションは利用できなくなります。

1. *Google Authenticator*アプリ（[Android][link-2fa-android-app]、[iOS][link-2fa-ios-app]）または互換性のある任意のアプリをインストールします。
1. Two-Factor Authentication設定で*Enable*ボタンをクリックします。
1. 表示されるQRコードをスキャンするか、*manual entry*リンクをクリックして手動入力オプションを使用します。
1. アプリで生成された6桁の認証コードを入力します。
1. パスワードを入力します。
1. *Confirm*ボタンをクリックします。

サインインするたび、パスワード入力後に二要素認証コードの入力が求められます。このコードはGoogle Authenticatorアプリから取得します。

パスワードは二要素認証をオフにする際に必要です。

![二要素認証ページの概要][img-2fa-page]

!!! info "互換性"
    Time‑Based One‑Time Password Algorithm (RFC6238)をサポートする任意のアプリケーションまたはデバイスを使用して、ワンタイムコードを生成できます。