# 脅威防止ダッシュボード

Wallarmは自動的に処理したトラフィックのメトリクスを収集し、それらをWallarmコンソールの**Dashboards → Threat Prevention**セクションで表示します。このダッシュボードでは、任意のユーザーが悪意のあるトラフィックと正当なトラフィックの傾向を分析し、特定の期間におけるアプリケーションの脆弱性状況を把握することができます。

メトリクスは次のウィジェットで表示されます：

* 現在の月の統計とリクエストエンカウンタの速度
* 正常なトラフィックと悪意のあるトラフィック
* 攻撃の種類
* APIプロトコル
* 攻撃の源
* 攻撃対象
* 脆弱性スキャナー

ウィジェットのデータは[アプリケーション](../settings/applications.ja.md)と時間期間によってフィルタリングできます。デフォルトでは、ウィジェットは過去一か月間のすべてのアプリケーションに対する統計を表示します。

すべてのウィジェットでは、統計が収集された[イベントリスト](../events/check-attack.ja.md)を開くことができます。

!!! info "Wallarmの始め方"
    アメリカの[Cloud](../../about-wallarm/overview.ja.md#cloud)でWallarmアカウントを登録した場合、Wallarmコンソールのセクションに対して読み取り専用のアクセス権を持つ**Playground**で、Wallarmの主要な機能を探索することができます。これを使用して、自分の環境に何もデプロイすることなくWallarmプラットフォームの主要な機能を試してみてください。
    
    ダッシュボードセクションには、新しいユーザー向けの**Get started**ボタンも含まれています。このボタンをクリックすると、以下のような製品発見オプションのリストが表示されます：
    
    * **Onboarding tour**オプションは、Wallarmがサポートするデプロイオプションと関連するデプロイ手順へのリンクを提供します。
    * **Wallarm Playground**オプションは、読み取り専用アクセスを持つWallarmコンソールの遊び場へとあなたを案内します。このオプションは、US Cloudのユーザーのみが利用可能です。

## 現在の月の統計とリクエストエンカウンタの速度

このウィジェットは以下のデータを表示します：

* [定期プラン](../../about-wallarm/subscription-plans.ja.md)で指定された月間リクエスト量
* 現在の月中に検出された[ヒット](../../about-wallarm/protecting-against-attacks.ja.md#hit)と[ブロック](../../admin-en/configure-wallarm-mode.ja.md)された数
* リクエストとヒットがエンカウントされるリアルタイムの速度

![!Current month statistics](../../images/user-guides/dashboard/current-month-stats.png)

## 期間に対する正常なトラフィックと悪意のあるトラフィック

このウィジェットは、選択した期間中に処理されたトラフィックの集計統計を表示します：

* グラフは時間経過に伴うデータ分布を表示し、最も活発な活動の期間を追跡することが可能です。
* 処理されたリクエスト、[ヒット](../../glossary-en.ja.md#hit)、[インシデント](../../glossary-en.ja.md#security-incident)の合計数およびブロックされたヒットの数
* トレンド：選択した期間とその前の同じ期間のイベント数の変動

![!Normal and malicious traffic](../../images/user-guides/dashboard/traffic-stats.png)

## 攻撃の種類

このウィジェットは[検出された攻撃の上位タイプ](../../attacks-vulns-list.ja.md)を表示し、悪意のあるトラフィックのパターンと攻撃者の行動を分析するのに役立ちます。

このデータを使用して、異なる攻撃タイプに対するサービスの脆弱性を分析し、サービスのセキュリティを改善するための適切な措置を講じることができます。

![!Attack types](../../images/user-guides/dashboard/attack-types.png)

## APIプロトコル

このウィジェットは攻撃者が用いたAPIプロトコルに関する統計を表示します。Wallarmは以下のAPIプロトコルを識別することができます：

* GraphQL
* gRPC
* WebSocket
* REST API
* SOAP
* XML-RPC
* JSON-RPC
* WebDAV

このウィジェットを使用すると、特定のプロトコルを介して送信された悪意のあるリクエストを分析し、そのようなリクエストに対するシステムの脆弱性を評価することができます。

![!Attack types](../../images/user-guides/dashboard/api-protocols.png)

## CVEs

**CVEs** ウィジェットでは、選択した時間枠内に攻撃者が悪用したCVE脆弱性の上位を表示します。ソートタイプを変更することで、最新のCVEを把握したり、最も攻撃されたCVEを追跡することができます。

各CVEは、[脆弱性データベース](https://vulners.com/)から取得したCVSS v3.0スコア、攻撃の複雑さ、必要な権限などの詳細とともに示されます。2015年より前に登録された脆弱性にはCVSS v3.0スコアが提供されません。

![!CVE](../../images/user-guides/dashboard/cves.png)

システム上のハイライトされた脆弱性を確認し、見つけた場合は、適切な対処推奨事項を実装して脆弱性の悪用リスクを排除することができます。

## 認証

このウィジェットは、指定した時間枠内に攻撃者が使用した認証方法を表示します、例えば：

* API Key
* Basic Auth
* Bearer Token
* Cookie Auth等

![!Auth](../../images/user-guides/dashboard/authentication.png)

この情報により、弱い認証方法を特定し、予防策を講じることができます。

## 攻撃の源

このウィジェットは攻撃源グループの統計を表示します：

* ロケーション
* タイプ、例えば、Tor、Proxy、VPN、AWS、GCP等

このデータは、不正な攻撃源を特定し、グレーまたは否認の[IPアドレスリスト](../ip-lists/overview.ja.md)を使用して、そこからのリクエストをブロックするのに役立ちます。

各源グループのデータは別々のタブで表示することができます。

![!Attack sources](../../images/user-guides/dashboard/attack-sources.png)

## 攻撃対象

このウィジェットは最も攻撃されているドメインと[アプリケーション](../settings/applications.ja.md)を表示します。各オブジェクトごとに以下のメトリックが表示されます：

* 検出されたインシデントの数
* 検出されたヒットの数
* トレンド：選択された期間と前の同じ期間のヒット数の変動。例えば、最後の月の統計をチェックすると、トレンドは最後の月と前の月との間のヒット数の差をパーセントで表示します

ドメインとアプリケーションのデータは別々のタブで表示することができます。

![!Attack targets](../../images/user-guides/dashboard/attack-targets.png)

## 脆弱性スキャナー

スキャナーウィジェットは、[公開アセット](../scanner.ja.md)で検出された脆弱性に関する統計を表示します：

* 選択した期間中に検出された全リスクレベルの脆弱性の数
* 選択した期間の終わりにアクティブだった全リスクレベルの脆弱性の数
* 選択された期間の全リスクレベルの脆弱性の数の変化

![!Scanner widget](../../images/user-guides/dashboard/dashboard-scanner.png)

<!-- ----------
    
<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/6KBn59aGFxQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->