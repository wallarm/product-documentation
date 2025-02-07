# 設定済みSSO認証の変更

[img-disable-sso-provider]:     ../../../images/admin-guides/configuration-guides/sso/disable-sso-provider.png

[doc-setup-sso-gsuite]:     gsuite/overview.md
[doc-setup-sso-okta]:       okta/overview.md

[anchor-edit]:      #editing
[anchor-disable]:   #disabling
[anchor-remove]:    #removing

設定済みSSO認証を[編集][anchor-edit]、[無効化][anchor-disable]、または[削除][anchor-remove]できます。

!!! warning "注意：すべてのユーザーに対してSSOが無効化されます"
    SSO認証を無効化または削除すると、すべてのユーザーに対して無効化されることに注意してください。ユーザーには、SSO認証が無効化され、パスワードを復元する必要があることが通知されます。

## 編集

設定済みSSO認証を編集するには:

1. Wallarm UIの**Settings → Integration**に移動します。
2. 設定済みSSOプロバイダーのメニューから**Edit**オプションを選択します。
3. SSOプロバイダーの詳細を更新し、**Save changes**をクリックします。

## 無効化

SSOを無効化するには、*Settings → Integration*に移動します。対応するSSOプロバイダーのブロックをクリックし、続いて*Disable*ボタンをクリックします。

![disabling-sso-provider][img-disable-sso-provider]

ポップアップウィンドウで、SSOプロバイダーの無効化およびすべてのユーザーに対するSSO認証の無効化を確認する必要があります。*Yes, disable*をクリックします。

確認後、SSOプロバイダーは切断されますが、その設定は保存され、将来的に再度このプロバイダーを有効化できます。また、無効化後は別のSSOプロバイダー（別のサービスをアイデンティティプロバイダーとして）を接続することができます。

## 削除

!!! warning "注意：SSOプロバイダーの削除について"
    無効化と比較して、SSOプロバイダーを削除すると、そのすべての設定が復旧不可能な状態で失われます。
    
    プロバイダーを再接続する必要がある場合は、再度設定する必要があります。

SSOプロバイダーの削除は無効化と同様です。

*Settings → Integration*に移動します。対応するSSOプロバイダーのブロックをクリックし、続いて*Remove*ボタンをクリックします。

ポップアップウィンドウで、プロバイダーの削除およびすべてのユーザーに対するSSO認証の無効化を確認する必要があります。*Yes, remove*をクリックします。

確認後、選択されたSSOプロバイダーは削除され、以後利用できなくなります。また、別のSSOプロバイダーを接続することができます。