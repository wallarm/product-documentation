# Okta との SSO 接続

[doc-setup-sp]:                     setup-sp.md
[doc-setup-idp]:                    setup-idp.md    
[doc-metadata-transfer]:            metadata-transfer.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.md

[doc-employ-sso]:                   ../employ-user-auth.md
[doc-disable-sso]:                  ../change-sso-provider.md

[link-okta]:                        https://www.okta.com/

このガイドでは、[Okta][link-okta] サービスを Wallarm のサービスプロバイダとしてのアイデンティティプロバイダとして接続するプロセスについて説明します。

!!! note

    デフォルトでは、Wallarm 上の SSO 接続は適切なサービスをアクティブ化しないと利用できません。SSO サービスをアクティブ化するには、アカウントマネージャーまたは [Wallarm サポートチーム](mailto:support@wallarm.com) にお問い合わせください。
    
    サービスをアクティブ化した後
    
    *   以下の SSO 接続手順を実行できるようになり、
    *   SSO 関連のブロックが「インテグレーション」タブに表示されます。
    
    さらに、Wallarm と Okta の両方で管理権限を持つアカウントが必要です。

Okta との SSO 接続のプロセスは、以下のステップで構成されています：
1.  [Wallarm 側でのパラメータ生成。][doc-setup-sp]
2.  [Okta でのアプリケーションの作成と設定。][doc-setup-idp]
3.  [Okta のメタデータを Wallarm 設定ウィザードに転送する。][doc-metadata-transfer]
4.  [Okta 側で Wallarm アプリケーションへのアクセスを許可する][doc-allow-access-to-wl]

その後、[Wallarm ユーザーの SSO 認証を設定][doc-employ-sso] します。