[link-deployment-se]:           ../installation/security-edge/overview.md
[link-deployment-hybrid]:       ../installation/supported-deployment-options.md
[link-deployment-on-prem]:      ../installation/on-premise/overview.md

# お客様データの共有責任

Wallarmは共有責任のセキュリティモデルに基づいています。このモデルでは、関係者（Wallarmとそのお客様）が、お客様データ（個人を特定できる情報(PII)やカード会員データを含む）のセキュリティに関してそれぞれ異なる責任範囲を担います。

## 概要

Wallarmには2つの主要コンポーネントがあります。Wallarm filtering nodeとWallarm Cloudです。概要は[こちら](../about-wallarm/overview.md#how-wallarm-works)をご覧ください。これらのコンポーネントは3つの形態のいずれかでデプロイでき、各形態でWallarmとお客様の責任分担が異なります。

--8<-- "../include/deployment-forms.md"

![責任分担の模式図](../images/shared-responsibility-variants.png)

## Security Edge

このデプロイメント形態では、Wallarm filtering nodeとWallarm CloudのいずれのコンポーネントもWallarmが管理するため、責任の大部分はWallarm側にあります。

**Wallarmの責任**

* Wallarmクラウド環境のセキュリティと可用性、Wallarm filtering nodeコードおよびWallarm内部システムのセキュリティ。

    これには、サーバーレベルのパッチ適用、Wallarmクラウドサービス提供に必要なサービスの運用、脆弱性テスト、セキュリティイベントのログ記録と監視、インシデント管理、運用監視、24時間365日のサポートなどが含まれますが、これらに限定されません。Wallarmはまた、Wallarmクラウド環境のサーバーおよび境界ファイアウォール構成（セキュリティグループ）の管理にも責任を負います。

* [Edge Inline Node](../installation/security-edge/inline/upgrade-and-management.md#upgrading-the-edge-inline)または[Edge Connector Node](../installation/security-edge/se-connector.md#upgrading-the-edge-node)を[定期的](../updating-migrating/versioning-policy.md)にアップグレードします。
* ご要望があれば、最新のWallarm SOC 2 Type II監査報告書のコピーを提供します。
* Wallarmが提供するサービスの継続に資する事業継続および災害復旧計画(BCDRP)を策定し、必要に応じて実装します。

**お客様の責任**

* Wallarmのサービスに関連する重要な職務や活動に以前関与していた退職済みユーザーのアカウント削除を実施します。
* Wallarmが実施するサービスに直接関与する人員に変更がある場合は、速やかにWallarmへ通知します。これらの人員は、Wallarmが提供するサービスに直接関連する財務、技術、または補助的な管理機能に関与している場合があります。

## ハイブリッド

このデプロイメント形態では、Wallarmのお客様がWallarm filtering nodeをデプロイ・管理し、WallarmがWallarm Cloudコンポーネントを管理します。したがって、責任は同等に分担されます。

**Wallarmの責任**

* Wallarmクラウド環境のセキュリティと可用性、Wallarm filtering nodeコードおよびWallarm内部システムのセキュリティ。
* Wallarm filtering nodeコンポーネントを[定期的](../updating-migrating/versioning-policy.md)に更新します。なお、これらのアップデートの適用はお客様の責任です。
* ご要望があれば、最新のWallarm SOC 2 Type II監査報告書のコピーを提供します。

**お客様の責任**

Wallarmのお客様は次の点に責任を負います。

* Wallarm filtering nodeおよびWallarm Cloudを含む、Wallarmに関連するすべての内部コンポーネントについて、一般的なITシステムのアクセスおよびシステム利用の適切性に関する健全で一貫した内部統制を実装します。

* Wallarmのサービスに関連する重要な職務や活動に以前関与していた退職済みユーザーのアカウント削除を実施します。

* お客様のセキュリティ境界外に出て、検出された悪意のあるリクエストの報告の一部としてWallarm Cloudに送信される可能性がある機微なデータに対して、適切な[データマスキングルール](../user-guides/rules/sensitive-data-rule.md)を設定します。

* Wallarmのサービスに関連する取引が適切に承認され、取引が安全で、適時に処理され、完全であることを確保します。

* Wallarmが実施するサービスに直接関与する人員に変更がある場合は、速やかにWallarmへ通知します。これらの人員は、Wallarmが提供するサービスに直接関連する財務、技術、または補助的な管理機能に関与している場合があります。

* Wallarmがリリースした新しいソフトウェアアップデートをフィルタリングノードに速やかに適用します。

* Wallarmが提供するサービスの継続に資する事業継続および災害復旧計画(BCDRP)を策定し、必要に応じて実装します。

## オンプレミス

このデプロイメント形態では、Wallarm filtering nodeとWallarm Cloudの両コンポーネントをお客様がホストおよび管理するため、責任の大部分（管理も含む）はお客様側にあります。

**Wallarmの責任**

* Wallarm filtering nodeおよびCloudのコードのセキュリティ。
* Wallarm filtering nodeおよびCloudコンポーネントを定期的に更新します。なお、これらのアップデートの適用はお客様の責任です。

**お客様の責任**

* Wallarm filtering nodeおよびWallarm Cloudのデプロイに使用する環境のセキュリティと可用性を確保します。
* Wallarmがリリースする新しいソフトウェアアップデートを、フィルタリングノードおよびWallarm Cloudに速やかに適用します。
* Wallarm filtering nodeおよびWallarm Cloudを含む、Wallarmに関連するすべての内部コンポーネントについて、一般的なITシステムのアクセスおよびシステム利用の適切性に関する健全で一貫した内部統制を実装します。
* Wallarmのサービスに関連する重要な職務や活動に以前関与していた退職済みユーザーのアカウント削除を実施します。
* Wallarmのサービスに関連する取引が適切に承認され、取引が安全で、適時に処理され、完全であることを確保します。
* Wallarmが提供するサービスの継続に資する事業継続および災害復旧計画(BCDRP)を策定し、必要に応じて実装します。

## Wallarm Cloudにおけるお客様データの保存

Wallarmのハイブリッドおよびクラウドのデプロイメントでは、フィルタリングノードから送信されたすべてのデータはWallarmが完全に管理するWallarm Cloudに保存されます。

* リクエストおよび攻撃データはPostgreSQLデータベースに保存され、関連コンテンツはGoogle Cloud Storage（S3互換）に永続化され、パフォーマンス向上のためRedisにキャッシュされます。Google Cloud外部のサードパーティサービスは使用していません。
* すべてのストレージは、Wallarmのセキュアなインフラストラクチャの一部としてGoogle Cloud Platform上でホストされています。
* GCPはGDPRおよびその他の国際的なデータ保護基準に準拠しており、データのセキュリティとプライバシーを確保します。
* Wallarmは複数の[リージョン](overview.md#cloud)（USとEU）でのデプロイに対応しており、希望する管轄区域内にデータを保持できます。