# SAML SSOソリューションとの統合の概要

[doc-admin-sso-gsuite]:     gsuite/overview.md
[doc-admin-sso-okta]:       okta/overview.md

[link-saml]:                https://wiki.oasis-open.org/security/FrontPage
[link-saml-sso-roles]:      https://www.oasis-open.org/committees/download.php/27819/sstc-saml-tech-overview-2.0-cd-02.pdf     

あなたの会社が既に[SAML][link-saml] SSOソリューションを使用している場合、SSO（シングルサインオン）技術を使用して、あなたの会社のユーザーをWallarmポータルに認証することができます。

Wallarmは、SAML規格をサポートする任意のソリューションと統合できます。SSOガイドでは、[Okta][doc-admin-sso-okta]または[Google Suite（G Suite）][doc-admin-sso-gsuite]を例に統合を説明しています。

SSOとWallarmの設定および運用に関連する文書は、以下を前提としています：
*   Wallarmは**サービスプロバイダ**（SP）として動作します。
*   GoogleまたはOktaは**アイデンティティプロバイダ**（IdP）として動作します。

SAML SSOの役割についての詳細情報はこちら（[PDF][link-saml-sso-roles]）で見つけることができます。

!!! warning "SSOサービスの有効化"
    デフォルトでは、Wallarm上のSSO接続は適切なサービスを有効化しないと利用できません。SSOサービスを有効化するには、アカウントマネージャーや[Wallarmサポートチーム](mailto:support@wallarm.com)に連絡してください。
    
    SSOサービスが有効化されていない場合、Wallarmコンソールの**統合**セクションにSSO関連のブロックは表示されません。