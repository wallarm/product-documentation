[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# MuleSoft用Wallarmコネクタ

[MuleSoft](https://www.mulesoft.com/)は、サービス間のシームレスな接続とデータ統合を可能にする統合プラットフォームであり、APIゲートウェイがクライアントアプリケーションのAPIアクセスのエントリポイントとして機能します。Wallarmは、MuleSoft上で稼働するAPIの保護のためのコネクタとして機能します。

MuleSoft用のコネクタとしてWallarmを使用するには、**Wallarmノードを外部にデプロイ**し、**Wallarmが提供するポリシーをMuleSoftに適用**してトラフィックをWallarmノードに転送し、解析する必要があります。

MuleSoft用Wallarmコネクタは[in-line](../inline/overview.md)トラフィック解析のみをサポートします:

![Mulesoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/traffic-flow-inline.png)

## ユースケース

サポートされている全[Wallarmデプロイメントオプション](../supported-deployment-options.md)の中で、このソリューションは、単一のポリシーでMuleSoft Anypointプラットフォーム上にデプロイされたAPIの保護に推奨されます。

## 制限事項

* Wallarmルールによる[レート制限](../../user-guides/rules/rate-limiting.md)はサポートされていません。
* [マルチテナンシー](../multi-tenant/overview.md)はまだサポートされていません。

## 要件

デプロイを進めるため、下記の要件を満たしていることをご確認ください:

* MuleSoftプラットフォームの理解。
* ホストシステムに[Docker](https://docs.docker.com/engine/install/)がインストールされ、稼働していること。
* [Maven(`mvn`)](https://maven.apache.org/install.html)がインストールされていること。
* MuleSoft Exchangeのコントリビューターとしての権限が付与され、組織のMuleSoft Anypoint Platformアカウントにアーティファクトをアップロードできること。
* MuleSoft Exchangeの認証情報（ユーザ名とパスワード）が`<MAVEN_DIRECTORY>/conf/settings.xml`ファイルに指定されていること。
* アプリケーションとAPIがMuleSoft上で連携し、稼働していること。
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールのアカウントにアクセスできること。

## デプロイ

### 1. Wallarmノードのデプロイ

WallarmノードはWallarmプラットフォームの中核コンポーネントであり、着信トラフィックを検査し、不正な活動を検知し、脅威を軽減するように構成できます。

必要なコントロールのレベルに応じて、Wallarmにホスティングされたノードまたは自己管理のインフラストラクチャにデプロイすることが可能です。

=== "Edge node"
    コネクタ用のWallarmホスティングノードをデプロイするには、[指示](../se-connector.md)に従ってください。
=== "Self-hosted node"
    自己管理ノードデプロイメント用のアーティファクトを選択し、添付の手順に従ってください:

    * ベアメタルまたはVM上のLinuxインフラ向け[All-in-one installer](../native-node/all-in-one.md)
    * コンテナ化デプロイを使用する環境向け[Docker image](../native-node/docker-image.md)
    * Kubernetesを利用するインフラ向け[Helm chart](../native-node/helm-chart.md)

### 2. WallarmポリシーのMuleSoft Exchangeへの取得とアップロード

以下の手順に従い、Wallarmポリシーを取得し、MuleSoft Exchangeにアップロードしてください:

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle**に進み、プラットフォームに適したコードバンドルをダウンロードしてください。

    自己管理ノードを使用している場合は、sales@wallarm.comに連絡しコードバンドルを入手してください。
2. ポリシーアーカイブを展開してください。
3. `pom.xml`ファイル内で、以下の内容を指定してください:

    === "Global instance"
        1. MuleSoft Anypoint Platformにアクセスし、**Access Management** → **Business Groups** → 組織を選択し、そのIDをコピーしてください。
        1. `pom.xml`ファイルの`groupId`パラメーターにコピーしたグループIDを指定してください:

        ```xml hl_lines="2"
        <?xml version="1.0" encoding="UTF-8"?>
            <groupId>BUSINESS_GROUP_ID</groupId>
            <artifactId>wallarm</artifactId>
        ```
    === "Regional instance"
        1. MuleSoft Anypoint Platformにアクセスし、**Access Management** → **Business Groups** → 組織を選択し、そのIDをコピーしてください。
        1. `pom.xml`ファイルの`groupId`パラメーターにコピーしたグループIDを指定してください。
        1. 特定地域でホスティングされているMuleSoftインスタンスの場合、`pom.xml`ファイルを更新し、対応する地域のURLを使用してください。例えば、MuleSoftの欧州インスタンスの場合:

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
4. `conf`ディレクトリを作成し、その中に次の内容の`settings.xml`ファイルを作成してください:

    === "Username and password"
        `username`と`password`を実際の認証情報に置き換えてください:

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
        </servers>
        </settings>
        ```
    === "Token (if MFA is enabled)"
        `password`パラメーターに[トークンを生成し指定](https://docs.mulesoft.com/access-management/saml-bearer-token)してください:

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
        </servers>
        </settings>
        ```
5. 次のコマンドを使用して、ポリシーをMuleSoftにデプロイしてください:

    ```
    mvn clean deploy -s conf/settings.xml
    ```

カスタムポリシーがMuleSoft Anypoint Platform Exchangeに利用可能になりました。

![Mulesoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. WallarmポリシーをAPIに適用

Wallarmポリシーは、すべてのAPIまたは個別のAPIに適用できます。

#### 個別のAPIにポリシーを適用

個別のAPIにWallarmポリシーを適用して保護するには、以下の手順に従ってください:

1. Anypoint Platformで**API Manager**に移動し、対象のAPIを選択してください。
2. **Policies** → **Add policy**に移動し、Wallarmポリシーを選択してください。
3. [Wallarmノードインスタンス](#1-deploy-a-wallarm-node)のアドレスを`http://`または`https://`を含めて指定してください。
4. 必要に応じて、他のパラメーターを変更してください。
5. ポリシーを適用してください。

![Wallarm policy](../../images/waf-installation/gateways/mulesoft/policy-setup.png)

#### すべてのAPIにポリシーを適用

[MuleSoftのAutomated policyオプション](https://docs.mulesoft.com/mule-gateway/policies-automated-overview)を使用してすべてのAPIにWallarmポリシーを適用するには、以下の手順に従ってください:

1. Anypoint Platformの**API Manager** → **Automated Policies**に移動してください。
2. **Add automated policy**をクリックし、ExchangeからWallarmポリシーを選択してください。
3. [Wallarmノードインスタンス](#1-deploy-a-wallarm-node)のアドレスを`http://`または`https://`を含めて指定してください。
4. 必要に応じて、他のパラメーターを変更してください。
5. ポリシーを適用してください。

## テスト

デプロイされたポリシーの機能をテストするには、以下の手順に従ってください:

1. テスト用の[Path Traversal][ptrav-attack-docs]攻撃を含むリクエストをAPIに送信してください:

    ```
    curl http://<YOUR_APP_DOMAIN>/etc/passwd
    ```
2. Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)の**Attacks**セクションを開き、攻撃がリストに表示されていることを確認してください。
    
    ![Attacks in the interface][attacks-in-ui-image]

    もしWallarmノードモードが[blocking](../../admin-en/configure-wallarm-mode.md)に設定され、トラフィック解析がin-lineの場合、リクエストはブロックされます。

## トラブルシューティング

ソリューションが期待通りに機能しない場合は、MuleSoft Anypoint Platformの**Runtime Manager** → 対象アプリケーション → **Logs**からAPIのログを参照してください。

また、**API Manager**で対象APIに移動し、**Policies**タブに表示される適用ポリシーを確認することで、APIにポリシーが適用されているかどうかを検証できます。Automated policiesの場合、**See covered APIs**オプションを使用して、カバーされているAPIと除外理由を確認してください。

## ポリシーのアップグレード

デプロイされたWallarmポリシーを[新しいバージョン](code-bundle-inventory.md#mulesoft)へアップグレードするには:

1. [ステップ2](#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)で説明されているように、更新されたWallarmポリシーをダウンロードし、MuleSoft Exchangeにアップロードしてください。
2. 新バージョンがExchangeに表示されたら、**API Manager** → 対象API → **Policies** → Wallarmポリシー → **Edit configuration** → **Advanced options**に移動し、ドロップダウンから新しいポリシーバージョンを選択してください。
3. 新バージョンで追加のパラメーターが導入された場合、必要な値を入力してください。

    例えば、2.xから3.xにアップグレードする場合:

    * **CLIENT HOST EXPRESSION**：特に変更が必要ない限り、デフォルト値`#[attributes.headers['x-forwarded-host']]`を使用してください。
    * **CLIENT IP EXPRESSION**：特に変更が必要ない限り、デフォルト値`#[attributes.headers['x-forwarded-for']]`を使用してください。
4. 変更を保存してください。

もしWallarmポリシーがautomated policyとして適用されている場合、直接のアップグレードが不可能なことがあります。その場合は、現行ポリシーを削除し、新バージョンを手動で再適用してください。

ポリシーのアップグレードには、特にメジャーバージョンアップの場合、Wallarmノードのアップグレードが必要となることがあります。リリース更新やアップグレード手順については[Wallarm Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md)を参照してください。将来的なアップグレードの簡便さと非推奨の回避のため、定期的なノードの更新を推奨します。

## ポリシーのアンインストール

Wallarmポリシーをアンインストールするには、automated policyリストまたは個別APIに適用されているポリシー一覧の**Remove policy**オプションを使用してください。