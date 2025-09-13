# ウィザード向けIBM API Connect

Wallarm Edge nodeをIBM DataPowerに[同期](../inline/overview.md)モードで接続すると、管理対象APIに到達する前のトラフィックを、どのリクエストもブロックすることなく検査できます。

接続を設定するには、次の手順に従ってください。

**1. IBM API ConnectのAPIにWallarmポリシーを適用します**

1. プラットフォーム用に提供されたコードバンドルをダウンロードします。
1. リクエスト検査ポリシーを登録します：

    ```
    apic policies:create \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        --configured-gateway-service <GATEWAY SERVICE NAME OR ID> \
        /<PATH>/wallarm-pre.zip
    ```
1. レスポンス検査ポリシーを登録します：

    ```
    apic policies:create \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        --configured-gateway-service <GATEWAY SERVICE NAME OR ID> \
        /<PATH>/wallarm-post.zip
    ```

ほとんどの場合、`configured-gateway-service`の名前は`datapower-api-gateway`です。

**2. Wallarmの検査ステップをassemblyパイプラインに統合します**

API仕様の`x-ibm-configuration.assembly.execute`セクション内で、トラフィックをWallarm Node経由にルーティングするため、次のステップを追加または更新します。

1. `invoke`ステップの前に、受信リクエストをWallarm Nodeへプロキシする`wallarm_pre`ステップを追加します。
1. `invoke`ステップが次のように構成されていることを確認します：
    
    * `target-url`は`$(target-url)$(request.path)?$(request.query-string)`の形式にします。これにより、クエリパラメータを含め、リクエストが元のバックエンドのパスへプロキシされます。
    * `header-control`および`parameter-control`は、すべてのヘッダーとパラメータの通過を許可します。これにより、Wallarm Nodeがリクエスト全体を解析し、任意の箇所の攻撃を検知し、APIインベントリを正確に構築できます。
1. `invoke`ステップの後に、レスポンスを検査のためにWallarm Nodeへプロキシする`wallarm_post`ステップを追加します。

```yaml hl_lines="8-22"
...
x-ibm-configuration:
  properties:
    target-url:
      value: <BACKEND_ADDRESS>
  ...
  assembly:
    execute:
      - wallarm_pre:
          version: 1.0.1
          title: wallarm_pre
          wallarmNodeAddress: <WALLARM_NODE_URL>
      - invoke:
          title: invoke
          version: 2.0.0
          verb: keep
          target-url: $(target-url)$(request.path)?$(request.query-string)
          persistent-connection: true
      - wallarm_post:
          version: 1.0.1
          title: wallarm_post
          wallarmNodeAddress: <WALLARM_NODE_URL>
...
```

**3. 更新したAPIを含む製品を公開します**

トラフィックフローへの変更を適用するには、変更したAPIを含む製品を再公開します：

```
apic products:publish \
    --scope <CATALOG OR SPACE> \
    --server <MANAGEMENT SERVER ENDPOINT> \
    --org <ORG NAME OR ID> \
    --catalog <CATALOG NAME OR ID> \
    <PATH TO THE UPDATED PRODUCT YAML>
```

[詳細](ibm-api-connect.md)

<style>
  h1#ibm-api-connect-for-wizard {
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