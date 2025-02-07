# G SuiteとのSSO接続

[doc-setup-sp]:                     setup-sp.md  
[doc-setup-idp]:                    setup-idp.md    
[doc-metadata-transfer]:            metadata-transfer.md  
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.md

[doc-employ-sso]:                   ../employ-user-auth.md  
[doc-disable-sso]:                  ../change-sso-provider.md

[link-gsuite]:                      https://gsuite.google.com/

本ガイドでは、[G Suite][link-gsuite]（Google）のサービスをアイデンティティプロバイダーとしてWallarmに接続する手順について解説します。Wallarmはサービスプロバイダーとして機能します。

!!! 注意
    初期状態では、該当サービスを有効化しない限りWallarmでのSSO接続は利用できません。SSOサービスを有効化するには、アカウント担当者または[Wallarmサポートチーム](mailto:support@wallarm.com)にお問い合わせください。
    
    サービスを有効化した後、以下が可能となります。
    
    *   次のSSO接続手順を実行できるようになり、
    *   「Integrations」タブにSSOに関連するブロックが表示されます。
    
    さらに、WallarmとG Suiteの両方で管理権限を持つアカウントが必要です。

G SuiteとのSSO接続のプロセスは以下の手順で構成されています:
1.  [Wallarm側でパラメータを生成する。][doc-setup-sp]
2.  [G Suiteでアプリケーションを作成し、構成する。][doc-setup-idp]
3.  [G SuiteのメタデータをWallarmセットアップウィザードに転送する。][doc-metadata-transfer]
4.  [G Suite側でWallarmアプリケーションへのアクセスを許可する。][doc-allow-access-to-wl]

その後、Wallarmユーザー用に[SSO認証を構成する][doc-employ-sso]