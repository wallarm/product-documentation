Wallarm CDNノードは保護対象サーバーに対してリバースプロキシとして動作します。受信トラフィックを解析し、不正なリクエストを軽減し、正当なリクエストを保護対象サーバーに転送します。

![CDN node operation scheme][cdn-node-operation-scheme]

!!! warning "CDNノードで保護できるもの"
    CDNノードを使用すると、サードレベル（または4レベル、5レベルなど）以下のドメインを保護できます。例えば、`ple.example.com`用のCDNノードを作成できますが、`example.com`用には作成できません。

Wallarm CDNノードのその他の特徴は以下の通りです:

* サードパーティのクラウドプロバイダー（Section.io）にホストされているため、CDNノードを展開するためにお客様のインフラからリソースを割り当てる必要はありません。

    !!! info "サードパーティのクラウドプロバイダーへのリクエストデータのアップロード"
        処理されたリクエストの一部のデータがLumenサービスにアップロードされます。
* 一部のリクエストデータをWallarm Cloudにアップロードします。[アップロードされるデータとセンシティブデータの削除についての詳細はこちら][data-to-wallarm-cloud-docs]
* [動作][operation-modes-docs]は[IPグレイリストの内容][graylist-populating-docs]を利用し疑わしいトラフィックを識別しブロックする**セーフブロッキング**モードで動作します。

    モードを変更するには、対応する[ルール][operation-mode-rule-docs]を使用します。
* CDNノードはWallarm Console UIを使用して完全に構成されます。他の方法で変更する必要がある設定は、保護対象リソースのDNSレコードにWallarm CNAMEレコードを追加することのみです。
* お客様はノード用の[アプリケーション構成][link-app-conf]を[Wallarmサポートチーム](mailto:support@wallarm.com)に依頼できます。