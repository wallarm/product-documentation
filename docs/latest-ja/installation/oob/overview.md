```markdown
# Wallarmアウトオブバンド展開の概要

Wallarmはミラーしたトラフィックを通してリクエストを検査するセルフホスト方式のアウトオブバンド（OOB）セキュリティソリューションとして展開できます。本記事では、このアプローチについて詳細に説明します。

OOBアプローチは、Wallarmソリューションを別のネットワークセグメントに配置し、主要なデータパスに影響を与えずに着信トラフィックを検査します。その結果、アプリケーションのパフォーマンスに影響を与えません。悪意あるリクエストを含むすべての着信リクエストは、宛先のサーバーに到達します。

## ユースケース

トラフィックミラーリングは、OOBアプローチの主要な要素です。着信トラフィックのミラー（コピー）がWallarm OOBソリューションへ送信され、実際のトラフィックではなくコピーに対して動作します。

OOBソリューションは悪意ある活動を記録するだけで遮断しないため、リアルタイム保護の要求がそれほど厳しくない組織において、WebアプリケーションおよびAPIのセキュリティを実装する効果的な方法です。OOBソリューションは以下のユースケースに適しています：

* アプリケーションのパフォーマンスに影響を与えることなく、WebアプリケーションやAPIが直面する可能性のある脅威をすべて把握します。
* モジュール[in-line](../inline/overview.md)を実行する前に、トラフィックコピーを用いてWallarmソリューションをトレーニングします。
* 監査目的でセキュリティログを取得します。Wallarmは、多くのSIEMシステムやメッセンジャーなどとの[native integrations](../../user-guides/settings/integrations/integrations-intro.md)を提供します。

以下の図は、Wallarmのアウトオブバンド展開における一般的なトラフィックフローを視覚的に表現したものです。図はすべてのインフラ構成のバリエーションを網羅しているわけではありません。トラフィックミラーは、インフラの任意のサポート層で生成され、Wallarmノードへ送信されます。さらに、特定のセットアップでは、ロードバランシングやその他のインフラレベルの構成が異なる場合があります。

![OOB scheme](../../images/waf-installation/oob/wallarm-oob-deployment-scheme.png)

## 利点

Wallarm展開におけるOOBアプローチは、インライン展開など他の展開方法に比べ、いくつかの利点を提供します：

* セキュリティソリューションが主要なデータパスとインラインで動作する場合に発生する遅延やその他のパフォーマンス問題を引き起こしません。
* ソリューションを主要なデータパスに影響を与えることなく追加または削除できるため、柔軟性と展開の容易さが提供されます。

## 制限事項

OOB展開アプローチは安全性を提供する一方で、いくつかの制限事項があります。以下の表は、各展開オプションに関連する制限事項を詳細に示しています：

| 機能 | [eBPF](ebpf/deployment.md) | [TCP mirror](tcp-traffic-mirror/deployment.md) | [Web server mirror](web-server-mirroring/overview.md) |
| --- | --- | --- | --- |
| 悪意あるリクエストの即時ブロック | - | - | - |
| [パッシブ検出](../../about-wallarm/detecting-vulnerabilities.md#passive-detection)を使用した脆弱性の発見 | - | + | - |
| [API Discovery](../../api-discovery/overview.md) | + (応答構造は除外) | + | - |
| [強制ブラウジングからの保護](../../admin-en/configuration-guides/protecting-against-bruteforce.md) | + | + | - |
| [レート制限](../../user-guides/rules/rate-limiting.md) | - | - | - |
| [IPリスト](../../user-guides/ip-lists/overview.md) | - | - | - |

## サポートされる展開オプション

Wallarmは、以下のアウトオブバンド（OOB）展開オプションを提供します：

* [eBPFベースのソリューション](ebpf/deployment.md)
* [TCPトラフィックミラー解析](tcp-traffic-mirror/deployment.md)のためのソリューション
* NGINX、Envoy、Istioなどによってミラーされたトラフィックの解析にWallarmを展開するために利用できる多くのWallarmアーティファクトが利用可能です。[Webサーバーミラーリング](web-server-mirroring/overview.md)で使用できます。これらのサービスは通常、トラフィックミラーリングのための組み込み機能を提供しており、Wallarmアーティファクトはそのようなソリューションによってミラーされたトラフィックの解析に適しています。
```