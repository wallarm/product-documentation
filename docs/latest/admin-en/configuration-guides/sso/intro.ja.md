# SAML SSOソリューションとの統合の概要

[doc-admin-sso-gsuite]:     gsuite/overview.ja.md
[doc-admin-sso-okta]:       okta/overview.ja.md

[link-saml]:                https://wiki.oasis-open.org/security/FrontPage
[link-saml-sso-roles]:      https://www.oasis-open.org/committees/download.php/27819/sstc-saml-tech-overview-2.0-cd-02.pdf     

あなたの会社がすでに[SAML][link-saml] SSOソリューションを使用している場合、SSO（シングルサインオン）技術を使用して、会社のユーザーをWallarmポータルに認証することができます。

Wallarmは、SAML標準をサポートする任意のソリューションと統合できます。SSOガイドでは、[Okta][doc-admin-sso-okta]または[Google Suite（G Suite）][doc-admin-sso-gsuite]を例に統合方法を説明しています。

SSOを使用したWallarmの設定および操作に関連する文書は、次のことを前提としています。
*   Wallarmは**サービスプロバイダー**（SP）として機能します。
*   GoogleまたはOktaは**アイデンティティプロバイダー**（IdP）として機能します。

SAML SSOの役割に関する詳細は、こちら（[PDF][link-saml-sso-roles]）で見つけることができます。

!!! warning "SSOサービスの有効化"
    既定では、Wallarm上のSSO接続は、適切なサービスをアクティブ化せずには利用できません。SSOサービスをアクティブ化するには、アカウントマネージャーまたは[Wallarmサポートチーム](mailto:support@wallarm.com)にお問い合わせください。

    SSOサービスが有効化されていない場合、Wallarmコンソールの**Integrations**セクションに、SSO関連のブロックは表示されません。