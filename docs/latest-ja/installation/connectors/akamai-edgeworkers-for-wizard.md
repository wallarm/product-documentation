# Akamai for wizard

Wallarm Edge nodeをAkamaiに接続すると、[同期](../inline/overview.md)または[非同期](../oob/overview.md)モードで、リクエストをブロックすることなくトラフィックを検査できます。

以下の手順に従って接続を設定します。

**1. WallarmバンドルからEdgeWorkersを作成する**

1. お使いのプラットフォーム向けに提供されたコードバンドルをダウンロードします。
1. Akamai Control Center → **EdgeWorkers** → **Create EdgeWorker ID**に移動し、コードバンドル`wallarm-main`をインポートします。
1. 別のEdgeWorker IDを作成し、`wallarm-sp`バンドルをインポートします。

**2. Wallarm Nodeプロパティを作成する** 

1. Akamai Property Managerで新しいpropertyを作成します：

    * **Property name / hostname**: 専用のNodeホスト名（例：`node.customer.com`）。このホスト名はお客様が管理するDNSゾーンに属している必要があります。
    * **Property type**: `Dynamic Site Accelerator`。
    * **Origin type**: `Web server`。
    * **Origin Hostname**: Wallarm nodeのURL。
1. propertyのTLSを設定します：

    * **Akamai Managed Certificate**を選択します（Akamaiが`node.customer.com`の証明書を発行して管理します）、または
    * 必要に応じて独自の証明書をアップロードします。
1. propertyを保存します。AkamaiがEdge Hostname（例：`node.customer.com.edgesuite.net`）を生成します。
1. DNSゾーンで、Nodeホスト名をEdge Hostnameに向けるCNAMEレコードを作成します。例：`node.customer.com → node.customer.com.edgesuite.net`。
1. [ステージングでpropertyを有効化](https://techdocs.akamai.com/property-mgr/docs/activate-stage)し、動作を確認したら、[本番で有効化](https://techdocs.akamai.com/property-mgr/docs/activate-prod)します。

**3. オリジンpropertyの変数を設定する**

既存のオリジンpropertyを開き、→ **Edit New Version** で以下の変数を設定します：

* `PMUSER_WALLARM_NODE`: `wallarm-main` EdgeWorker用に作成したproperty名。
* `PMUSER_WALLARM_HEADER_SECRET`: 任意の秘密文字列（例：`aj8shd82hjd72hs9`）。指定した値は、EdgeWorkerが同じpropertyにリクエストをフォワードするときに、リクエストヘッダー`x-wlrm-checked`として渡されます。これによりループを防ぎ、偽のヘッダーを持つリクエストをブロックします。
* `PMUSER_WALLARM_ASYNC`: [非同期（out-of-band）](../oob/overview.md)モードを使用する場合、この変数を`true`に設定します。

必要に応じて、[他の変数](akamai-edgeworkers.md#4-configure-variables-in-the-origin-property)も変更します。

**4. Wallarm EdgeWorkerルールを追加する**

オリジンpropertyで、新しい空のルールを作成します：

* Criteria:

    ```
    If 
    Request Header 
    x-wlrm-checked
    does not exist
    ```
* Behavior: EdgeWorkers → the `wallarm-main` EdgeWorker

**5. なりすまし防止ルールを追加する**

オリジンpropertyで、別の新しい空のルールを作成します：

* Criteria:

    ```
    If 
    Request Header 
    x-wlrm-checked
    exists
    ```
* Behavior: EdgeWorkers → the `wallarm-sp` EdgeWorker

**6. propertyを保存して有効化する**

1. 新しいオリジンpropertyバージョンを保存します。
1. [ステージング環境で有効化します](https://techdocs.akamai.com/property-mgr/docs/activate-stage)。
1. 検証後、[本番で有効化](https://techdocs.akamai.com/property-mgr/docs/activate-prod)します。

[詳細はこちら](akamai-edgeworkers.md)

<style>
  h1#akamai-for-wizard {
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