# ステップ4：G Suite側でWallarmアプリケーションへのアクセスを許可する

[img-gsuite-console]:           ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-user-list]:                ../../../../images/admin-guides/configuration-guides/sso/gsuite/user-list.png
[img-gsuite-navigation-saml]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-navigation-saml.png
[img-app-page]:                 ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png

[doc-use-user-auth]:            ../employ-user-auth.md

G Suiteを通じて認証するためには、G Suite側でアカウントを作成し、ユーザーがWallarmアプリケーションへのアクセス権を持っている必要があります。アクセス権を付与するための必要な手順のシーケンスは以下に記載します。

まず、*ユーザー*ブロックをクリックして、G Suiteのユーザー管理セクションに移動します。

![!G Suiteコンソール][img-gsuite-console]

SSO認証を経由してアプリケーションへのアクセスを付与する予定のユーザーが、あなたの組織のユーザーリストに存在していることを確認してください。

![!G Suiteユーザーリスト][img-user-list]

下図のように* SAMLアプリ *メニューアイテムをクリックして、SAMLアプリケーションセクションに移動します。

![!SAMLアプリケーションへの移動][img-gsuite-navigation-saml]

望むアプリケーションの設定を入力し、アプリケーションのステータスが“全員に対してON”であることを確認します。アプリケーションのステータスが“全員に対してOFF”である場合は、*サービスを編集*ボタンをクリックします。

![!G Suite内のアプリケーションページ][img-app-page]

“全員に対してON”のステータスを選択し、*保存*をクリックします。

その後、サービスのステータスが更新されたというメッセージが表示されます。 Wallarmアプリケーションは、G Suiteのあなたの組織のすべてのユーザーに対してSSO認証を通じて利用可能になりました。

## 設定完了

これでG SuiteベースのSSOの設定が完了し、次にWallarm側で[user specific][doc-use-user-auth] SSO認証を設定することができます。