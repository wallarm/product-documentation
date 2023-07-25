# 設定されたSSO認証の変更

[img-disable-sso-provider]:     ../../../images/admin-guides/configuration-guides/sso/disable-sso-provider.png

[doc-setup-sso-gsuite]:     gsuite/overview.ja.md
[doc-setup-sso-okta]:       okta/overview.ja.md

[anchor-edit]:      #editing
[anchor-disable]:   #disabling
[anchor-remove]:    #removing

設定されたSSO認証を[編集][anchor-edit]、[無効化][anchor-disable]、または[削除][anchor-remove]することができます。

!!! warning "注意: すべてのユーザーのSSOが無効になります"
    SSO認証を無効にしたり削除したりすると、すべてのユーザーに対して無効になります。ユーザーには、SSO認証が無効になり、パスワードを復元する必要があることが通知されます。

## 編集

設定されたSSO認証を編集する方法：

1. Wallarm UI の **設定 → インテグレーション** に移動します。
2. 設定されたSSOプロバイダのメニューで**編集**オプションを選択します。
3. SSOプロバイダの詳細を更新し、**変更を保存**します。

## 無効化

SSOを無効にするには、*Settings → Integration*に移動します。対応するSSOプロバイダのブロックをクリックしてから、*Disable*ボタンをクリックします。

![!disabling-sso-provider][img-disable-sso-provider]

ポップアップウィンドウでは、SSOプロバイダを無効にし、すべてのユーザのSSO認証を無効にすることを確認する必要があります。
*はい、無効にする*をクリックします。

確認後、SSOプロバイダは切断されますが、その設定は保存され、今後このプロバイダを再び有効にすることができます。また、無効化後、別のSSOプロバイダ（別のサービスとしてのIDプロバイダ）に接続することができます。

## 削除

!!! warning "注意: SSOプロバイダの削除について"
    無効化と比較して、SSOプロバイダを削除すると、その設定がすべて失われ、復元することができなくなります。
    
    プロバイダを再接続する必要がある場合は、再設定する必要があります。

SSOプロバイダを削除する方法は、無効化する方法に似ています。

*Settings → Integration*に移動します。対応するSSOプロバイダのブロックをクリックしてから、*Remove*ボタンをクリックします。

ポップアップウィンドウでは、プロバイダの削除とすべてのユーザのSSO認証の無効化を確認する必要があります。
*はい、削除する*をクリックします。

確認後、選択したSSOプロバイダは削除され、これ以上使用できなくなります。また、別のSSOプロバイダに接続することができるようになります。