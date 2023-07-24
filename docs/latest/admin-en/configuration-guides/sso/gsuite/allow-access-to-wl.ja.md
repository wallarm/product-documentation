# ステップ 4：G Suite 側で Wallarm アプリケーションへのアクセスを許可する

[img-gsuite-console]:           ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-user-list]:                ../../../../images/admin-guides/configuration-guides/sso/gsuite/user-list.png
[img-gsuite-navigation-saml]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-navigation-saml.png
[img-app-page]:                 ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png

[doc-use-user-auth]:            ../employ-user-auth.md

G Suite を介した認証を行うには、G Suite 側にアカウントが作成されている必要があり、また、ユーザーには Wallarm アプリケーションへのアクセス権が与えられている必要があります。アクセス権限を付与するための必要な一連の操作が以下に説明されています。

*Users* ブロックをクリックして、G Suite のユーザー管理セクションに移動します。

![!G Suite console][img-gsuite-console]

組織のユーザーリストに SSO 認証を介してアプリケーションへのアクセスを許可しようとするユーザーが存在することを確認します。

![!G Suite user list][img-user-list]

以下に示すように、 *SAML apps* メニュー項目をクリックして、SAML アプリケーションセクションに移動します。

![!Navigate to the SAML applications][img-gsuite-navigation-saml]

所望のアプリケーションの設定に入り、「すべてのユーザーに対して ON」というステータスが設定されていることを確認します。アプリケーションのステータスが「すべてのユーザーに対して OFF」となっている場合、*Edit service*ボタンをクリックしてください。

![!Application page in G Suite][img-app-page]

「すべてのみなさんについての ON」のステータスを選択し、*Save* をクリックします。

その後、サービスのステータスが更新されたというメッセージが表示されます。これで、Wallarm アプリケーションが G Suite の組織内のすべてのユーザーの SSO 認証に利用できるようになります。

##  設定完了

これで G Suite ベースの SSO の設定が完了し、Wallarm 側で [ユーザー固有][doc-use-user-auth] の SSO 認証を設定することができます。