[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# MuleSoft Mule Gateway向けWallarmコネクタ

本ガイドでは、Wallarmコネクタを使用して[Mule Gateway](https://docs.mulesoft.com/mule-gateway/mule-gateway-capabilities-mule4)で管理されるMule APIを保護する方法について説明します。

Mule GatewayのコネクタとしてWallarmを使用するには、Wallarmノードを外部にデプロイし、MuleSoftでWallarm提供のポリシーを適用して、トラフィックを解析のためにWallarmノードへルーティングする必要があります。

Mule Gateway向けWallarmコネクタは、[インライン](../inline/overview.md)でのトラフィック解析のみをサポートします。

![Wallarmポリシーを適用したMuleSoft](../../images/waf-installation/gateways/mulesoft/traffic-flow-mule-gateway-inline.png)

## ユースケース

本ソリューションは、Mule Gatewayで管理されるMule APIを保護するための推奨方法です。

## 制限事項

--8<-- "../include/waf/installation/connectors/native-node-limitations.md"

## 要件

デプロイを進める前に、以下の要件を満たしていることを確認してください。

* MuleSoftプラットフォームについての理解があること。
* Anypoint PlatformのEnterpriseサブスクリプション（カスタムポリシーのデプロイおよび外部トラフィックのルーティングに必須）。
* ホストシステムに[Docker](https://docs.docker.com/engine/install/)がインストールされ、稼働していること。
* [Maven (`mvn`)](https://maven.apache.org/install.html)がインストールされていること。
* MuleSoftのユーザーが、MuleSoft Anypoint Platformアカウントにアーティファクトをアップロードできる権限を持っていること。
* [`<MAVEN_DIRECTORY>/conf/settings.xml`]ファイルに[ MuleSoft Exchangeの認証情報（ユーザー名とパスワード）](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange#deploying-a-policy-created-using-the-maven-archetype)が設定されていること。
* アプリケーションとAPIが関連付けられ、Mule Gateway上で稼働していること。
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセス権があること。

## デプロイ

### 1. Wallarmノードをデプロイする

WallarmノードはWallarmプラットフォームの中核コンポーネントで、デプロイが必要です。受信トラフィックを検査し、悪意あるアクティビティを検出し、脅威の緩和を行うように構成できます。

必要とする管理レベルに応じて、Wallarmがホストするノードとして、またはお客様のインフラストラクチャ内にセルフホストしてデプロイできます。

=== "Edge node"
    コネクタ向けのWallarmホスト型ノードをデプロイするには、[手順](../security-edge/se-connector.md)に従ってください。
=== "セルフホストノード"
    セルフホスト型ノードのデプロイに使用するアーティファクトを選び、以下の手順に従ってください：

    * ベアメタルまたはVM上のLinuxインフラ向けの[All-in-one installer](../native-node/all-in-one.md)
    * コンテナ化されたデプロイを使用する環境向けの[Docker image](../native-node/docker-image.md)
    * AWSインフラ向けの[AWS AMI](../native-node/aws-ami.md)
    * Kubernetesを利用するインフラ向けの[Helm chart](../native-node/helm-chart.md)

### 2. Wallarmポリシーを取得してMuleSoft Exchangeにアップロードする

MuleSoft ExchangeにWallarmポリシーを取得・アップロードするには、次の手順に従ってください。

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle**に進み、プラットフォーム用のコードバンドルをダウンロードします。

    セルフホスト型ノードを使用している場合は、コードバンドル入手のためsales@wallarm.comまでご連絡ください。
1. ポリシーのアーカイブを展開します。
1. `pom.xml`ファイル内で以下を設定します。

    === "グローバルインスタンス"
        1. MuleSoft Anypoint Platform → **Access Management** → **Business Groups** → 組織を選択 → そのIDをコピーします。
        1. `pom.xml`ファイルの`groupId`パラメータにコピーしたグループIDを指定します。

        ```xml hl_lines="2"
        <?xml version="1.0" encoding="UTF-8"?>
            <groupId>BUSINESS_GROUP_ID</groupId>
            <artifactId>wallarm</artifactId>
        ```
    === "リージョナルインスタンス"
        1. MuleSoft Anypoint Platform → **Access Management** → **Business Groups** → 組織を選択 → そのIDをコピーします。
        1. `pom.xml`ファイルの`groupId`パラメータにコピーしたグループIDを指定します。
        1. 特定のリージョンでホストされるMuleSoftインスタンスの場合、対応するリージョンのURLを使用するように`pom.xml`を更新します。例として、欧州リージョンのMuleSoftインスタンスの場合：

        ```xml hl_lines="2 7 14 24"
        <?xml version="1.0" encoding="UTF-8"?>
            <groupId>BUSINESS_GROUP_ID</groupId>
            <artifactId>wallarm</artifactId>
            
            <properties>
                <mule.maven.plugin.version>4.1.2</mule.maven.plugin.version>
                <exchange.url>https://maven.eu1.anypoint.mulesoft.com/api/v1/organizations/${project.groupId}/maven</exchange.url>
            </properties>

            <distributionManagement>
                <repository>
                    <id>anypoint-exchange-v3</id>
                    <name>Anypoint Exchange</name>
                    <url>https://maven.eu1.anypoint.mulesoft.com/api/v3/organizations/${project.groupId}/maven
                    </url>
                    <layout>default</layout>
                </repository>
            </distributionManagement>

            <repositories>
                <repository>
                    <id>anypoint-exchange-v3</id>
                    <name>Anypoint Exchange</name>
                    <url>https://maven.eu1.anypoint.mulesoft.com/api/v3/maven</url>
                    <layout>default</layout>
                </repository>
            </repositories>
        ```
1. `conf`ディレクトリを作成し、その中に次の内容の`settings.xml`ファイルを作成します。

    === "ユーザー名とパスワード"
        `username`と`password`を実際の認証情報に置き換えます。

        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
        <servers>
            <server>
                <id>anypoint-exchange-v3</id>
                <username>myusername</username>
                <password>mypassword</password>
            </server>
            <server>
                <id>mulesoft-releases-ee</id>
                <username>myusername</username>
                <password>mypassword</password>
            </server>
        </servers>
        </settings>
        ```
    === "トークン（MFAが有効な場合）"
        [`password`パラメータにトークンを生成して指定](https://docs.mulesoft.com/access-management/saml-bearer-token)します。

        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
        <servers>
            <server>
                <id>anypoint-exchange-v3</id>
                <username>~~~Token~~~</username>
                <password>01234567-89ab-cdef-0123-456789abcdef</password>
            </server>
            <server>
                <id>mulesoft-releases-ee</id>
                <username>~~~Token~~~</username>
                <password>01234567-89ab-cdef-0123-456789abcdef</password>
            </server>
        </servers>
        </settings>
        ```
1. 次のコマンドでポリシーをMuleSoftにデプロイします。

    ```
    mvn clean deploy -s conf/settings.xml
    ```

これで、カスタムポリシーがMuleSoft Anypoint PlatformのExchangeで利用可能になりました。

![Wallarmポリシーを適用したMuleSoft](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. WallarmポリシーをAPIに適用する

Wallarmポリシーは個別のAPI、またはすべてのAPIに適用できます。

1. 個別のAPIに適用するには、Anypoint Platform → **API Manager** → 対象APIを選択 → **Policies** → **Add policy**に進みます。
1. すべてのAPIに適用するには、Anypoint Platform → **API Manager** → **Automated Policies** → **Add automated policy**に進みます。
1. ExchangeからWallarmポリシーを選択します。
1. `http://`または`https://`を含むWallarmノードのURLを指定します。
1. 必要に応じて他のパラメータを調整します。
1. ポリシーを適用します。

![Wallarmポリシー](../../images/waf-installation/gateways/mulesoft/policy-setup.png)

## テスト

デプロイ済みポリシーの動作をテストするには、次の手順に従ってください。

1. テスト用の[パストラバーサル][ptrav-attack-docs]攻撃を含むリクエストをAPIに送信します。

    ```
    curl http://<GATEWAY_URL>/etc/passwd
    ```
1. [US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)のWallarm Console → **Attacks**セクションを開き、攻撃が一覧に表示されていることを確認します。
    
    ![インターフェースのAttacks][attacks-in-ui-image]

    Wallarmノードのモードが[blocking](../../admin-en/configure-wallarm-mode.md)に設定され、トラフィックがインラインで流れている場合、リクエストはブロックされます。

## トラブルシューティング

期待どおりに動作しない場合は、MuleSoft Anypoint Platform → **Runtime Manager** → 対象アプリケーション → **Logs**にアクセスし、APIのログを確認してください。

また、**API Manager**で対象APIを開き、**Policies**タブに適用済みのポリシーを確認することで、ポリシーがAPIに適用されているかを検証できます。自動ポリシーの場合、**See covered APIs**オプションを使って適用対象のAPIと除外理由を確認できます。

## ポリシーのアップグレード

デプロイ済みのWallarmポリシーを[新しいバージョン](code-bundle-inventory.md#mulesoft-mule-gateway)にアップグレードするには、次のとおりです。

1. 更新されたWallarmポリシーをダウンロードし、[手順2](#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)に従ってMuleSoft Exchangeにアップロードします。
1. 新しいバージョンがExchangeに表示されたら、**API Manager** → 対象API → **Policies** → Wallarmポリシー → **Edit configuration** → **Advanced options**に進み、ドロップダウンから新しいポリシーバージョンを選択します。
1. 新しいバージョンで追加のパラメータが導入されている場合は、必要な値を入力します。

    例: 2.xから3.xにアップグレードする場合

    * **CLIENT HOST EXPRESSION**: 特別な変更が不要な限り、デフォルト値`#[attributes.headers['x-forwarded-host']]`を使用します。
    * **CLIENT IP EXPRESSION**: 特別な変更が不要な限り、デフォルト値`#[attributes.headers['x-forwarded-for']]`を使用します。
1. 変更を保存します。

Wallarmポリシーが自動ポリシーとして適用されている場合、直接のアップグレードができないことがあります。その場合は、現在のポリシーを削除し、新しいバージョンを手動で再適用してください。

ポリシーのアップグレードでは、特にメジャーバージョン更新時に、Wallarmノードのアップグレードが必要になることがあります。セルフホスト型Nodeのリリースノートおよびアップグレード手順は[Native Nodeの変更履歴](../../updating-migrating/native-node/node-artifact-versions.md)を、Wallarmホスト型ノードの場合は[Edgeコネクタのアップグレード手順](../security-edge/se-connector.md#upgrading-the-edge-node)を参照してください。将来のアップグレードを容易にし、非推奨化を避けるためにも、ノードは定期的に更新することを推奨します。

## ポリシーのアンインストール

Wallarmポリシーをアンインストールするには、自動ポリシー一覧または個別APIに適用されたポリシー一覧で**Remove policy**オプションを使用します。