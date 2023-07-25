# G Suite と SSO の連携

[doc-setup-sp]:                     setup-sp.ja.md
[doc-setup-idp]:                    setup-idp.ja.md    
[doc-metadata-transfer]:            metadata-transfer.ja.md
[doc-allow-access-to-wl]:           allow-access-to-wl.ja.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.ja.md

[doc-employ-sso]:                   ../employ-user-auth.ja.md
[doc-disable-sso]:                  ../change-sso-provider.ja.md

[link-gsuite]:                      https://gsuite.google.com/

このガイドでは、[G Suite][link-gsuite] (Google) サービスを、Wallarmがサービスプロバイダーとしてのアイデンティティプロバイダーに接続するプロセスを説明します。

!!! 注意
    デフォルトでは、WallarmでのSSO接続は、適切なサービスを有効化せずには利用できません。 SSOサービスの有効化については、アカウントマネージャーまたは [Wallarmサポートチーム](mailto:support@wallarm.com) にお問い合わせください。
    
    サービスを有効にした後
    
    *   以下のSSO接続手順を実行できますし、
    *   「インテグレーション」タブにSSO関連のブロックが表示されます。
    
    さらに、WallarmとG Suiteの両方で管理者権限を持つアカウントが必要です。

G Suite と SSO の連携プロセスは以下のステップで構成されています：
1.  [Wallarm 側でパラメーターを生成する][doc-setup-sp]
2.  [G Suite でアプリケーションを作成および設定する][doc-setup-idp]
3.  [G Suite メタデータを Wallarm 設定ウィザードに転送する][doc-metadata-transfer]
4.  [G Suite 側で Wallarm アプリケーションへのアクセスを許可する][doc-allow-access-to-wl]

その後、Wallarm ユーザーの [SSO 認証を設定します][doc-employ-sso] 。