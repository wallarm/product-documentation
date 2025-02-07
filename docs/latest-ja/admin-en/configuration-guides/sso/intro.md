# SAML SSOソリューションとの統合の概要

[doc-admin-sso-gsuite]:     gsuite/overview.md
[doc-admin-sso-okta]:       okta/overview.md

[link-saml]:                https://wiki.oasis-open.org/security/FrontPage
[link-saml-sso-roles]:      https://www.oasis-open.org/committees/download.php/27819/sstc-saml-tech-overview-2.0-cd-02.pdf     

会社がすでに[SAML][link-saml] SSOソリューションを使用している場合、Single Sign‑On (SSO) テクノロジーを使用してWallarmポータルに会社のユーザーを認証できます。

Wallarmは、SAML標準に対応したあらゆるソリューションと統合できます。SSOガイドでは例として[Okta][doc-admin-sso-okta]または[Google Suite(G Suite)][doc-admin-sso-gsuite]を使用した統合方法を説明します。

SSOを利用するためのWallarmの構成および運用に関するドキュメントでは、以下が前提になります:
*　Wallarmは**サービスプロバイダー** (SP) として動作します。
*　GoogleまたはOktaは**アイデンティティプロバイダー** (IdP) として動作します。

SAML SSOにおける役割の詳細については、こちら ([PDF][link-saml-sso-roles]) を参照してください。

!!! warning "SSOサービスの有効化"
    デフォルトではWallarmでSSO接続は、該当するサービスを有効化しなければ利用できません。SSOサービスを有効化するには、アカウントマネージャーまたは[Wallarmサポートチーム](mailto:support@wallarm.com)にお問い合わせください。
    
    SSOサービスが有効化されていない場合、Wallarm Consoleの**Integrations**セクションにSSO関連のブロックは表示されません。