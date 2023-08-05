# G SuiteとSSOの接続

[doc-setup-sp]:                     setup-sp.md
[doc-setup-idp]:                    setup-idp.md    
[doc-metadata-transfer]:            metadata-transfer.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.md

[doc-employ-sso]:                   ../employ-user-auth.md
[doc-disable-sso]:                  ../change-sso-provider.md

[link-gsuite]:                      https://gsuite.google.com/

このガイドでは、[G Suite][link-gsuite]（Google）サービスをアイデンティティプロバイダとしてWallarm（サービスプロバイダ）に接続するプロセスを説明します。

!!! 注意
    デフォルトでは、Wallarm上のSSO接続は適切なサービスを有効化しないと利用できません。SSOサービスを有効化するには、アカウントマネージャーまたは[Wallarmサポートチーム](mailto:support@wallarm.com)にお問い合わせください。
    
    サービスを有効化した後
    
    * 次のSSO接続手順を実行できるようになり、
    * SSO関連のブロックが「インテグレーション」タブに表示されます。
    
    加えて、WallarmとG Suiteの両方に対する管理権限を持つアカウントが必要です。

G SuiteとSSOを接続するプロセスは次の手順で構成されています：
1.  [Wallarm側でのパラメータの生成。][doc-setup-sp]
2.  [G Suiteでのアプリケーションの作成と設定。][doc-setup-idp]
3.  [G SuiteのメタデータをWallarm設定ウィザードに転送。][doc-metadata-transfer]
4.  [G Suite側でWallarmアプリケーションへのアクセスを許可。][doc-allow-access-to-wl]

その後、Wallarmのユーザー用に[SSO認証を設定します。][doc-employ-sso]