# Security Edge Inlineの管理 <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

Wallarm Consoleから、設定の更新、Nodeバージョンのアップグレード、ステータスの監視、デプロイメントの削除を行って[Security Edge Inline](overview.md)のデプロイメントを管理できます。

## ステータス

Edge Nodeセクションでは、オリジン、ホスト、リージョンのデプロイおよび設定状態のリアルタイムステータスを表示します:

=== "ホスト"
    ![!](../../../images/waf-installation/security-edge/inline/host-statuses.png)
=== "オリジン"
    ![!](../../../images/waf-installation/security-edge/inline/origin-statuses.png)
=== "リージョン"
    ![!](../../../images/waf-installation/security-edge/inline/region-statuses.png)
=== "ノード"
    **Nodes**タブでは、各Edge Nodeの技術的な詳細を提供します。このビューは主にトラブルシューティングを支援するためのWallarm Support向けです。Nodesの数はトラフィック需要に依存し、Wallarmのオートスケーリングによって自動的に管理されます。

    ![!](../../../images/waf-installation/security-edge/inline/nodes-tab.png)

* **Pending cert CNAME**: 証明書の発行のために[証明書のCNAMEレコード](deployment.md#5-certificate-cname-configuration)をDNSに追加するのを待機しています（該当する場合）。
* **Pending traffic CNAME**または**Pending traffic A record**: デプロイメントは完了しており、トラフィックをEdge Nodeにルーティングするための[トラフィック用CNAMEまたはAレコード](deployment.md#6-routing-traffic-to-the-edge-node)の追加を待機しています。
* **Deploying**: Edge Nodeを現在セットアップしており、まもなく利用可能になります。
* **Active**: Edge Nodeは完全に稼働しており、設定どおりにトラフィックをフィルタリングしています。
* **Cert CNAME error**: DNSで[証明書CNAME](deployment.md#5-certificate-cname-configuration)の検証に問題がありました。CNAMEが正しく構成されていることを確認してください（該当する場合）。
* **Deployment failed**: Edge Nodeのデプロイに失敗しました（例: 証明書のCNAMEが14日以内に追加されなかったなど）。設定を確認して再デプロイを試行するか、支援が必要な場合は[Wallarm Supportチーム](https://support.wallarm.com)に連絡してください。
* **Degraded**: Edge Nodeは当該リージョンで稼働していますが、機能が制限されている、または軽微な問題が発生している可能性があります。支援が必要な場合は[Wallarm Supportチーム](https://support.wallarm.com)に連絡してください。

ホストおよびオリジンごとのRPSとリクエスト数は、[バージョン](../../../updating-migrating/node-artifact-versions.md#all-in-one-installer)5.3.0以降で返されます。

## Edge Inlineのアップグレード

**Admin settings**で**Auto update**を有効にすると、（選択したオプションに応じて）新しいマイナーまたはパッチバージョンがリリースされ次第、Edge Nodeは自動的にアップグレードされます。初期設定はすべて保持されます。既定ではAuto updateはオフです。

![!](../../../images/waf-installation/security-edge/inline/admin-settings.png)

Edge Nodeを手動でアップグレードするには、**Configure** → **Admin settings**に移動し、一覧からバージョンを選択します。最適なパフォーマンスとセキュリティのために最新バージョンの使用を推奨します。

新しいメジャーバージョンへのアップグレードは手動でのみ可能です。

各バージョンの変更履歴は[記事](../../../updating-migrating/node-artifact-versions.md#all-in-one-installer)を参照してください。Edge Nodeのバージョンは`<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>`形式で、リンク先の記事の同じバージョンに対応します。Edge Nodeのバージョンに含まれるビルド番号は小規模な変更を示します。

## Edge Inlineの削除

Edgeのデプロイメントを削除するには、**Configure** → **Admin settings** → **Delete inline**をクリックします。

Nodesを削除して再作成する予定の場合は、[既存のデプロイメントの設定を調整](deployment.md)することで、更新された設定でNodesが再デプロイされます。

サブスクリプションが期限切れになった場合、Edge Nodeは14日後に自動的に削除されます。