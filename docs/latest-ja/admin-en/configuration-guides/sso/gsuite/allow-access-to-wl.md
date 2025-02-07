# 手順4: G Suite側でWallarmアプリケーションへのアクセスを許可します

[img-gsuite-console]:           ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-user-list]:                ../../../../images/admin-guides/configuration-guides/sso/gsuite/user-list.png
[img-gsuite-navigation-saml]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-navigation-saml.png
[img-app-page]:                 ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png

[doc-use-user-auth]:            ../employ-user-auth.md

G Suiteを通じた認証をご利用の場合、G Suite側でアカウントの作成が必要であり、ユーザーがWallarmアプリケーションへのアクセス権を有している必要があります。アクセス権の付与に必要な手順は以下に記載されています。

＊Users＊ブロックをクリックして、G Suiteのユーザー管理セクションへ移動してください。

![G Suiteコンソール][img-gsuite-console]

SSO認証でアプリケーションへアクセスできるユーザーが、組織のユーザーリストに含まれていることを確認してください。

![G Suiteユーザーリスト][img-user-list]

以下に示すように、*SAML apps*メニュー項目をクリックして、SAMLアプリケーションセクションへ移動してください。

![SAMLアプリケーションへ移動][img-gsuite-navigation-saml]

目的のアプリケーションの設定に入り、そのアプリケーションの状態が「ON for everyone」になっていることを確認してください。もしアプリケーションの状態が「OFF for everyone」の場合は、*Edit service*ボタンをクリックしてください。

![G Suiteのアプリケーションページ][img-app-page]

「ON for everyone」状態を選択し、*Save*をクリックしてください。

その後、サービスの状態が更新されたというメッセージが表示されます。WallarmアプリケーションはG Suiteの組織内のすべてのユーザーにSSO認証で利用可能となります。

## セットアップ完了

これでG Suiteに基づくSSOの設定は完了です。あとはWallarm側で[user specific][doc-use-user-auth]SSO認証の設定を開始できます。