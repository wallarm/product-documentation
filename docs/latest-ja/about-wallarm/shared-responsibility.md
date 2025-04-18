# クライアントデータに対する共有責任のセキュリティモデル

Wallarmは共有責任のセキュリティモデルに依拠しています。このモデルでは、クライアントデータのセキュリティ（PIIやCardholder Dataを含む）に関して、全ての関係者（Wallarmとクライアント）が異なる責任範囲を有します。

Wallarmはハイブリッドソリューション（ソフトウェアとSaaSの両方）であり、異なる責任範囲を有する2つの主要なコンポーネントがあります：

* **Wallarm filtering node**ソフトウェアは、クライアントのインフラ内に展開され、クライアントが管理します。Wallarm nodeコンポーネントは、エンドユーザーリクエストのフィルタリング、安全なリクエストをクライアントのアプリケーションに送信し、不正なリクエストをブロックする役割を担います。Wallarm nodeはトラフィックをローカルで転送し、リクエストが不正かどうかを判断します。トラフィックはWallarm Cloudに分析のためミラーリングされません。
* **Wallarm Cloud**は、Wallarmが管理するクラウドコンポーネントであり、フィルタリングノードから処理済みリクエストや検知された攻撃に関するメタ情報を受信するとともに、アプリケーション固有のフィルタリングルールを生成し、ノードがダウンロード可能な状態にします。Wallarm Consoleや公開APIにより、セキュリティレポートや個々のイベントの確認、トラフィックフィルタリングルールの管理、Wallarm Consoleユーザー、外部連携などが行えます。

![Responsibilities scheme](../images/shared-responsibility.png)

## Wallarmの責任

Wallarmは以下の点について責任を負います：

* Wallarm Cloud環境のセキュリティと可用性、Wallarm filtering nodeのコードおよび内部Wallarmシステムのセキュリティ

    これには、サーバーレベルのパッチ適用、Wallarm Cloudサービス提供に必要なサービスの運用、脆弱性テスト、セキュリティイベントの記録と監視、インシデント管理、運用監視、24/7サポートなどが含まれますが、これに限定されません。Wallarmはまた、Wallarm Cloud環境のサーバーおよびパリメーターファイアウォールの構成（セキュリティグループ）の管理について責任を負います。
* Wallarm filtering nodeコンポーネントの定期的な更新（ただし、これらの更新の適用はクライアントの責任です）。
* リクエストされた場合、最新のWallarm SOC 2 Type II監査報告書のコピーを提供します。

## クライアントの責任

Wallarmクライアントは以下の点について責任を負います：

* Wallarmに関連する内部コンポーネント全体（Wallarm filtering nodeおよびWallarm Cloudを含む）に対する一般的なITシステムアクセスおよびシステム使用の妥当性に関して、健全かつ一貫した内部統制を実施します。
* 解雇されたユーザーや、Wallarmのサービスに関連する重要な機能または活動にかかわっていたユーザーアカウントの削除を実施します。
* Wallarm Cloudへ送信される可能性がある、クライアントのセキュリティパリメーター外に出るあらゆるセンシティブデータに対して、適切な[データマスキングルール](../user-guides/rules/sensitive-data-rule.md)を設定します。
* Wallarmのサービスに関連するクライアント組織の取引が適切に認可され、取引が安全、タイムリーかつ完全であることを確保します。
* Wallarmが行うサービスに直接関与する人材に関する変更を適時にWallarmに通知します。この人材は、Wallarmが提供するサービスに直接関連する、財務、技術または補助的な管理機能にかかわる可能性があります。
* Wallarmがリリースする新しいソフトウェア更新に合わせて、フィルタリングノードを適時に更新します。
* 必要に応じて、Wallarmが提供するサービスの継続を支援するための事業継続および災害復旧計画（BCDRP）を策定し、実施します。

## センシティブデータのマスキング

他のサードパーティサービスと同様に、WallarmクライアントはWallarmに送信されるクライアントデータの内容を理解し、センシティブデータがWallarm Cloudに到達しないことを保証する必要があります。PCI DSS、GDPRその他の要件を有するWallarmクライアントには、特別なルールを用いてセンシティブデータをマスクすることが推奨されます。

フィルタリングノードからWallarm Cloudへ送信されるデータで、センシティブな詳細を含む可能性があるのは、検知された不正リクエストに関する情報のみです。不正リクエストにセンシティブデータが含まれる可能性は非常に低いですが、推奨されるアプローチは、PIIやクレジットカード情報を含む可能性があるHTTPリクエストのフィールド（例：`token`、`password`、`api_key`、`email`、`cc_number`など）をマスクすることです。このアプローチを採用することで、指定された情報フィールドがクライアントのセキュリティパリメーター外に出ないことが保証されます。

**Mask sensitive data**と呼ばれる特別なルールを適用することで、フィルタリングノードからWallarm Cloudへ攻撃情報を送信する際に省略すべきフィールド（リクエストURI、ヘッダーまたはボディ内）を指定できます。データマスキングの詳細については、[こちらのドキュメント](../user-guides/rules/sensitive-data-rule.md)をご覧になるか、[Wallarmサポートチーム](mailto:request@wallarm.com)までお問い合わせください。