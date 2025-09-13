# SAML SSO認証の概要

シングルサインオン(SSO)技術を使用して、貴社のユーザーをWallarm Consoleに対して認証できます。Wallarmはサービスプロバイダー(SP)として動作し、GoogleやOktaなどSAML標準をサポートする任意のアイデンティティプロバイダー(IdP)とシームレスに統合します。

![Integrations - SSO](../../../images/admin-guides/configuration-guides/sso/sso-integration-add.png)

## 利用可能なオプション

### プロビジョニング

WallarmのSSO連携は、プロビジョニングの有無にかかわらず設定できます。プロビジョニングとは、SAML SSOソリューションからWallarmへデータを自動的に転送することです。SAML SSOソリューションのユーザーおよびそのグループメンバーシップが、Wallarmへのアクセスとそこでの権限を定義します。ユーザー管理はすべてSAML SSOソリューション側で実施されます。

プロビジョニングをオフにする場合、SAML SSOソリューションに存在するユーザーに対応するユーザーをWallarm側に作成する必要があります。ユーザーロールもWallarmで定義し、SSOでログインすべきユーザーを選択できます。残りのユーザーはログイン/パスワードを使用します。また、Strict SSOオプションを有効化して、会社アカウントの全ユーザーに一括でSSO認証を適用できます。

SSOを使用するユーザー:

* ログインとパスワードで認証することはできず、二要素認証(2FA)を有効化することもできません。
* プロビジョニングを使用している場合、Wallarm側から無効化や削除をすることはできません。

プロビジョニングの詳細および未使用時に選択できるオプションについては[こちら](setup.md#step-4-saml-sso-solution-configure-provisioning)をご覧ください。

### テナントごとの権限

[マルチテナンシー](../../../installation/multi-tenant/overview.md)機能を使用し、ユーザーにテナントごとに異なる権限を付与したい場合は、このオプションを有効化するために[Wallarmサポートチーム](https://support.wallarm.com/)にご連絡ください。

この機能で何ができるかの例を考えてみます。SAML SSOソリューションに`Department A`というグループがあり、テナントが2つ、`TEST environment`と`PROD environment`あるとします。このグループのユーザーには、TESTでは管理権限(**Administrator**ロール)、PRODでは限定的な権限(**Analyst**ロール)を付与したいとします。

これを行うには、different permissions in different tenantsオプションを有効化し、[設定](setup.md#tenant-dependent-permissions)する必要があります。

また、このオプションを使用すると、SAML SSOソリューショングループごとに、特定のテナントのみにアクセスを許可し、他のテナントへはアクセスさせないように設定することもできます。たとえば、`Department B`のSAML SSOソリューショングループはTESTのみにアクセスし(権限は任意に設定)、他にはアクセスしないようにできます。

## 有効化と設定

デフォルトでは、Wallarmでの認証用SSOサービスは有効になっておらず、Wallarm ConsoleのIntegrationsセクションに該当ブロックは表示されません。

SSOサービスを有効化するには、[Wallarmサポートチーム](https://support.wallarm.com/)にご連絡ください。

サービスが有効化されたら、Wallarm側とSAML SSOソリューション側の両方で必要な設定を行えます。詳細は[こちら](setup.md)をご覧ください。

なお、WallarmはSAML標準をサポートする任意のソリューションと統合できますが、同時に有効化できるSSO連携は1つだけです。