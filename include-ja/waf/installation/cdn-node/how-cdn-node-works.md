Wallarm CDNノードは保護対象サーバーへのリバースプロキシとして動作します。受信トラフィックを解析し、悪意のあるリクエストを軽減し、正当なリクエストを保護対象サーバーへ転送します。

![CDNノードの動作図][cdn-node-operation-scheme]

!!! warning "CDNノードで保護できる対象"
    CDNノードでは、第3レベル（4階層目、5階層目などを含む）のドメインを保護できます。例えば、`ple.example.com`向けのCDNノードは作成できますが、`example.com`向けには作成できません。

Wallarm CDNノードのその他の特徴は次のとおりです。

* サードパーティのクラウドプロバイダー（Section.io）でホストされるため、CDNノードをデプロイするためにお使いのインフラストラクチャからリソースは必要ありません。

    !!! info "サードパーティのクラウドプロバイダーへのリクエストデータのアップロード"
        処理済みリクエストに関する一部のデータはLumenサービスにアップロードされます。
* 一部のリクエストデータをWallarm Cloudにアップロードします。[アップロードされるデータと機微なデータのマスキングの詳細][data-to-wallarm-cloud-docs]
* **safe blocking**モードで[動作します][operation-modes-docs]。疑わしいトラフィックを特定してブロックするために[IP graylistの内容][graylist-populating-docs]に基づきます。

    モードを変更するには、該当する[ルール][operation-mode-rule-docs]を使用します。
* CDNノードはWallarm Console UIから完全に構成します。唯一、別途の操作が必要なのは、保護対象リソースのDNSレコードにWallarmのCNAMEレコードを追加する設定です。
* ノードの[アプリケーション構成][link-app-conf]の実施は、[Wallarmサポートチーム](mailto:support@wallarm.com)に依頼できます。