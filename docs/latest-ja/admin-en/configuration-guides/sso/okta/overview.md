# OktaとのSSO接続

[doc-setup-sp]:                     setup-sp.md
[doc-setup-idp]:                    setup-idp.md    
[doc-metadata-transfer]:            metadata-transfer.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.md

[doc-employ-sso]:                   ../employ-user-auth.md
[doc-disable-sso]:                  ../change-sso-provider.md

[link-okta]:                        https://www.okta.com/

本ガイドでは、[Okta][link-okta]サービスをWallarmのアイデンティティプロバイダーとして接続するプロセスについて説明します。このプロセスにより、Wallarmはサービスプロバイダーとして動作します。

!!! note "注意"

    デフォルトでは、WallarmでSSO接続は該当サービスを有効化しない限り利用できません。SSOサービスを有効化するには、アカウントマネージャまたは[Wallarm support team](mailto:support@wallarm.com)にお問い合わせください。
    
    サービス有効化後、
    
    *   以下のSSO接続手順を実行できるようになります。
    *   「Integrations」タブにSSO関連のブロックが表示されます。
    
    さらに、WallarmとOktaの両方で管理者権限を持つアカウントが必要です。

OktaとのSSO接続プロセスは、以下の手順で構成されます:
1.  [Wallarm側でパラメータ生成][doc-setup-sp]
2.  [Oktaでアプリケーションの作成と設定][doc-setup-idp]
3.  [OktaのメタデータをWallarmのセットアップウィザードに転送][doc-metadata-transfer]
4.  [Okta側でWallarmアプリケーションへのアクセスを許可][doc-allow-access-to-wl]

その後、WallarmユーザーのSSO認証を[構成してください][doc-employ-sso]。