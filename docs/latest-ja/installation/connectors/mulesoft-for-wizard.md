# wizard向けMuleSoft Mule

Wallarm Edge nodeは、[同期](../inline/overview.md)モードでMule Gatewayに接続し、リクエストを一切ブロックすることなく、トラフィックがMule APIに到達する前に検査できます。

以下の手順に従って接続を設定します。

**1. WallarmポリシーをMuleSoft Exchangeにアップロードします**

1. ご利用のプラットフォーム向けに提供されているコードバンドルをダウンロードします。
1. ポリシーのアーカイブを展開します。
1. MuleSoft Anypoint Platform → **Access Management** → **Business Groups** → 組織を選択 → そのIDをコピーします。
1. ダウンロードした`pom.xml`ファイルの`groupId`パラメータに、コピーしたグループIDを指定します:

    ```xml hl_lines="2"
    <?xml version="1.0" encoding="UTF-8"?>
        <groupId>BUSINESS_GROUP_ID</groupId>
        <artifactId>wallarm</artifactId>
    ```
1. 展開したアーカイブ内で`conf`ディレクトリを作成し、その中に次の内容の`settings.xml`ファイルを作成します:

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

    `username`と`password`をご自身の資格情報に置き換えます。
1. ポリシーをMuleSoftにデプロイします:

    ```
    mvn clean deploy -s conf/settings.xml
    ```

これで、カスタムポリシーはMuleSoft Anypoint Platform Exchangeで利用可能です。

**2. WallarmポリシーをAPIに適用する**

Wallarmポリシーは個別のAPIまたはすべてのAPIに適用できます。

1. ポリシーを個別のAPIに適用するには、Anypoint Platform → **API Manager** → 対象のAPIを選択 → **Policies** → **Add policy**に移動します。
1. すべてのAPIに適用するには、Anypoint Platform → **API Manager** → **Automated Policies** → **Add automated policy**に移動します。
1. ExchangeからWallarmポリシーを選択します。
1. `https://`を含むWallarmノードのURLを指定します。
1. 必要に応じて他のパラメータを変更します。
1. ポリシーを適用します。

[詳細](mulesoft.md)

<style>
  h1#mulesoft-mule-for-wizard {
    display: none;
  }

  .md-footer {
    display: none;
  }

  .md-header {
    display: none;
  }

  .md-content__button {
    display: none;
  }

  .md-main {
    background-color: unset;
  }

  .md-grid {
    margin: unset;
  }

  button.md-top.md-icon {
    display: none;
  }

  .md-consent {
    display: none;
  }
</style>