# OktaとSSOを接続する

[doc-setup-sp]:                     setup-sp.md
[doc-setup-idp]:                    setup-idp.md    
[doc-metadata-transfer]:            metadata-transfer.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.md

[doc-employ-sso]:                   ../employ-user-auth.md
[doc-disable-sso]:                  ../change-sso-provider.md

[link-okta]:                        https://www.okta.com/

このガイドでは、[Okta][link-okta]サービスをアイデンティティプロバイダとしてWallarm（サービスプロバイダとして機能）に接続するプロセスを説明します。

!!! 注意

    既定では、適切なサービスを有効にしない限り、Wallarm上でのSSO接続は利用できません。SSOサービスを有効にするには、アカウントマネージャーや[Wallarmのサポートチーム](mailto:support@wallarm.com)にご連絡ください。
    
    サービスを有効にした後には、
    
    * 以下のSSO接続手順を実行でき、また
    * 「インテグレーション」タブにSSO関連のブロックが表示されます。
    
    さらに、WallarmとOktaの両方の管理権限を持つアカウントが必要です。

OktaとSSOを接続するプロセスは以下の手順で行います：
1.  [Wallarm側でパラメータを生成する。][doc-setup-sp]
2.  [Oktaでアプリケーションを作成し設定する。][doc-setup-idp]
3.  [OktaのメタデータをWallarm設定ウィザードに転送する。][doc-metadata-transfer]
4.  [Okta側でWallarmアプリケーションへのアクセスを許可する][doc-allow-access-to-wl]

その後、[SSO認証を設定する][doc-employ-sso] Wallarmユーザー。