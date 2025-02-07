# LDAPの使用

企業がすでにLDAPソリューションを使用している場合、企業のユーザーをWallarmポータルに認証するためにLDAPテクノロジーを使用できます。本記事では、ディレクトリサービスとのLDAP統合の設定方法について説明します。

## 概要

Wallarmは、[Microsoft Active Directory (AD)](https://learn.microsoft.com/en-us/entra/architecture/auth-ldap)などの企業の既存ユーザー管理システム（[ディレクトリサービス](https://en.wikipedia.org/wiki/Directory_service#LDAP_implementations)）とシームレスに統合できるよう、LDAPプロトコルを通じた統合をサポートします。これにより、以下が可能になります。

* ディレクトリサービスに保存された資格情報を使用して、Wallarm Consoleに事前登録することなく企業ユーザーがログインできるようにします。
* ディレクトリサービスからWallarm Consoleへユーザーの役割や権限を転送します。
* ディレクトリサービスがサポートするデータ暗号化を使用できます。

## 必要条件

* LDAPの設定は、アクティベーションされるまで利用できません。アクティベーションについては[Wallarmサポートチーム](mailto:support@wallarm.com)にお問い合わせください。
* 認証はLDAPまたはSSOのいずれかを使用でき、両方を同時に使用することはできません。LDAPの設定を行うには、まずSSOを削除してください。
* LDAP内のユーザーは、以下の属性を持っている必要があります。

    * `displayName`
    * `mail`または`email`（カスタマイズ可能）

* グループは以下の条件を満たす必要があります。

    * `groupOfNames`または`groupOfUniqueNames`であること。
    * `member`属性を持っていること。

## セットアップ

[必要条件](#必要条件)が満たされている場合、Wallarm Consoleの**Integrations** → **LDAP** → **LDAP**でLDAP統合を設定できます。

![LDAP統合の設定](../../../images/admin-guides/configuration-guides/ldap/configuring-ldap.png)

LDAP統合では、LDAPグループをWallarmの[ユーザー役割](../../../user-guides/settings/users.md#user-roles)にマッピングする必要があります。少なくとも1つのLDAPグループをマッピングし、必要に応じて追加することができます。

!!! info "LDAPグループDN"
    **LDAPグループ名**として、グループDNを使用します。例えば、 
    
    `cn=wallarm_partner_admin,ou=groups,dc=users,dc=example,dc=com`

基本オプションとして、以下を設定します。

* **LDAP Server**にLDAPサーバのURLとポートを設定します。
* ベースディストリビューション名**Base DN**を設定します。
* **Bind DN**とパスワード：LDAPサーバにバインド（接続）するために使用するLDAP階層内のオブジェクトの完全な名前と、それに対応するパスワードを設定します。
* **Email attribute name**は、ユーザーのメールアドレスが保存されるLDAPサーバ上のフィールド名を指定します。
* 認証タイプは`Simple`に設定され、変更できません。
* SSL/TLS暗号化を使用する場合は、対応する証明書と秘密鍵の値を貼り付けて設定します。