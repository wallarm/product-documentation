# LDAPの使用

貴社がすでにLDAPソリューションを使用している場合、LDAP技術を使用して貴社のユーザーをWallarm Consoleに対して認証できます。本記事では、ディレクトリサービスとのLDAP統合を構成する方法を説明します。

## 概要

貴社の既存のユーザー管理システム（[ディレクトリサービス](https://en.wikipedia.org/wiki/Directory_service#LDAP_implementations)）、たとえば[Microsoft Active Directory (AD)](https://learn.microsoft.com/en-us/entra/architecture/auth-ldap)とシームレスに統合できるよう、WallarmはLDAPプロトコルを介したこれらのシステムとの統合をサポートしています。こうした統合により、次のことが可能です:

* ディレクトリサービスに保存された認証情報を使用して、Wallarm Consoleへの事前登録なしに貴社のユーザーがWallarm Consoleにログインできるようにします。
* ディレクトリサービスからWallarm Consoleへユーザーロールと権限を転送します。
* ディレクトリサービスがサポートするデータ暗号化を使用します。

## 要件

* LDAP設定は有効化されるまで利用できません。有効化には[Wallarmサポートチーム](mailto:support@wallarm.com)へご連絡ください。
* 認証はLDAPまたはSSOのいずれか一方のみを使用できます。LDAPを構成するには、SSOを利用している場合はまずSSOを削除してください。
* ファイアウォールは、WallarmのIPアドレスからの受信リクエストを許可するように構成する必要があります:

    --8<-- "../include/wallarm-cloud-ips.md"

* LDAP内のユーザーには次の属性が必要です: 

    * `displayName`
    * `mail` または `email`（カスタマイズ可能です）

* グループは次を満たす必要があります: 

    * `groupOfNames` または `groupOfUniqueNames` であること
    * `member` 属性を持つこと

## 設定

[要件](#requirements)が満たされている場合、Wallarm Consoleの**Integrations** → **LDAP** → **LDAP**でLDAP統合を設定できます。

![LDAP統合の設定](../../../images/admin-guides/configuration-guides/ldap/configuring-ldap.png)

LDAP統合では、LDAPグループをWallarmの[ユーザーロール](../../../user-guides/settings/users.md#user-roles)にマッピングする必要があります。少なくとも1つのLDAPグループをマッピングし、必要に応じて追加できます。

!!! info "LDAPグループDN"
    **LDAP group name**にはグループDNを使用してください。例: 
    
    `cn=wallarm_partner_admin,ou=groups,dc=users,dc=example,dc=com`

基本オプションとして、次を設定します: 

* **LDAP Server**にLDAPサーバーのURLとポートを設定します。
* **Base DN**（ベース識別名）を設定します。
* **Bind DN**およびパスワード: LDAPサーバーにバインド（接続）するために使用する、LDAP階層内のオブジェクトの完全名です。パスワードを伴う必要があります。
* **Email attribute name**は、ユーザーのメールアドレスを保存するLDAPサーバー上のフィールド名を指定します。
* 認証タイプは`Simple`に設定されており、変更できません。
* SSL/TLS暗号化を使用する場合は、対応する証明書と秘密鍵の値を貼り付けて設定します。