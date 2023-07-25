# APIの乱用防止<a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmプラットフォームの**APIの乱用防止**モジュールは、クレデンシャルのスタッフィング、偽のアカウント作成、コンテンツスクレイピングなどのAPIの乱用を行うボットの検出および緩和を提供します。

## APIの乱用防止によってブロックされる自動化された脅威

**APIの乱用防止** モジュールは、デフォルトで以下のボットタイプを検出します:

* [APIの乱用](../attacks-vulns-list.ja.md#api-abuse)
* [アカウント乗っ取り](../attacks-vulns-list.ja.md#api-abuse-account-takeover)
* [セキュリティクローラー](../attacks-vulns-list.ja.md#api-abuse-security-crawlers)
* [スクレイピング](../attacks-vulns-list.ja.md#api-abuse-scraping)

[API乱用プロファイルの設定](../user-guides/api-abuse-prevention.ja.md#creating-api-abuse-profile) の間に、**APIの乱用防止** モジュールをすべてのタイプのボットから保護するように構成するか、特定の脅威に対するみを制限して保護するように構成できます。## API 不正アクセス防止の動作方法

**API 不正アクセス防止** モジュールは、ML ベースの方法をはじめ、統計的、数学的奇妙探索方法や直接的な不正行為のケースなど、複雑なボット検出モデルを使用します。モジュールは、自己学習によって通常のトラフィックのプロファイルを識別し、著しく異なる動作を異常として特定します。

API 不正アクセス防止は、悪意のあるボットを識別するために複数の検出器を使用します。モジュールは、どの検出器がマークされたかの統計情報を提供します。

以下の検出器が関与する可能性があります。

* **リクエストの間隔**-リクエスト間の時間間隔を分析して、ボット動作であることを示すランダム性の欠如を見つけます。
* **リクエストのユニーク性**-セッション中に訪問した一意のエンドポイントの数を分析します。クライアントが一貫して一定のパーセンテージのエンドポイント（10％以下）を訪問する場合、人間のユーザーではなく、ボットである可能性があります。
* **リクエストレート**-特定の時間間隔で行われたリクエストの数を分析します。API クライアントが一貫して一定の閾値を超えるリクエストの高い割合を行う場合、人間のユーザーではなく、ボットである可能性があります。
* **不正なユーザーエージェント**-リクエストに含まれる `User-Agent`ヘッダーを分析します。この検出器は、クローラー、スクレイパー、セキュリティチェッカーなどの特定のシグネチャをチェックします。
* **更新されていないブラウザー**-リクエストで使用されるブラウザーやプラットフォームを分析します。クライアントが更新されていないまたはサポートされていないブラウザーやプラットフォームを使用している場合、人間のユーザーではなく、ボットである可能性があります。
* **不審な振る舞いスコア**-セッション中に行われた通常および異常なビジネスロジック API リクエストを分析します。
* **ビジネスロジックスコア**-「アプリケーションの動作の文脈で、重要なまたは機密性の高い API エンドポイントの使用を分析します。

![!API 不正アクセス防止統計情報](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

1つ以上の検出器がボット攻撃の兆候を指摘する場合（[#automated-threats-blocked-by-api-abuse-prevention](#automated-threats-blocked-by-api-abuse-prevention)）、モジュールは異常トラフィックの元のソースを1時間の間 [denylistsまたはgraylists](#reaction-to-malicious-bots)します。メトリクス値は、Wallarm Console UIの各ボットのIPの信頼度に反映されます。

モジュールは、トラフィックの異常を深く観察し、悪意のあるボットのアクションとブロックされた元を特定する前に行動をしっかりと観察します。メトリック収集と分析には時間がかかるため、初回の悪意のあるリクエストが起こったときにモジュールは悪意のあるボットをリアルタイムでブロックしませんが、平均して異常なアクティビティを大幅に減らします。## API濫用防止の有効化

**API濫用防止**モジュールは、無効化された状態で提供されます。これは、CDNノードを含む[Wallarmノード4.2以上のすべての形式](../installation/supported-deployment-options.ja.md)に含まれます。

API濫用防止をアクティブにするには以下の手順を実行してください。

1. Wallarmノード4.2以降でトラフィックがフィルタされていることを確認します。
1. [サブスクリプションプラン](subscription-plans.ja.md#subscription-plans)にAPI濫用防止が含まれているかを確認してください。サブスクリプションプランの変更は、[sales@wallarm.com](mailto:sales@wallarm.com)までリクエストを送信してください。
1. Wallarm Console → **API濫用防止**で少なくとも1つの[API濫用プロファイル](../user-guides/api-abuse-prevention.ja.md)を作成または有効にします。

    !!! info "API濫用防止設定へのアクセス"
        企業のWallarmアカウントの[管理者](../user-guides/settings/users.ja.md#user-roles)のみが**API濫用防止**セクションにアクセスできます。このアクセス権がない場合は、管理者に問い合わせてください。

    ![!API濫用防止プロファイル](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

## 許容範囲

許容範囲を指定することで、悪意のあるボットの兆候がどの程度監視され、偽陽性検出の数が制御されるかを設定できます。これは、[API濫用プロファイル](../user-guides/api-abuse-prevention.ja.md#creating-api-abuse-profile)内の**許容範囲**パラメータで設定されます。

3つのレベルが用意されています。

* ボットへの低い許容範囲はアプリケーションへのボットのアクセスが少なくなりますが、偽陽性のため一部の正当なリクエストがブロックされる可能性があります。
* 標準的な許容範囲は、多くの偽陽性を避け、大部分の悪意のあるボットリクエストをAPIに到達させないための最適なルールを使用します。
* ボットへの高い許容範囲は、アプリケーションへのボットのアクセスが多くなりますが、正当なリクエストは削除されません。

## 悪意のあるボットに対する対応

以下の方法でAPI濫用防止の対応を設定できます。

* **拒否リストに追加**：WallarmはボットのIPを[拒否リスト](../user-guides/ip-lists/denylist.ja.md)に追加し、これらのIPから生成されるすべてのトラフィックをブロックします。
* **グレーリストに追加**：この対応により、ボットのブロックを回避してAPI濫用防止の機能を試すことができます。

    Wallarmは、ボットの攻撃を登録し、ボットのIPを[グレーリスト](../user-guides/ip-lists/denylist.ja.md)に置きますが、これらのIPから生成されるトラフィックはブロックされません。

    フィルタリングノードをセーフブロック[モード](../admin-en/configure-wallarm-mode.ja.md)で使用している場合、グレーリストから発生した攻撃の一部はブロックされます。[詳細を読む](../user-guides/ip-lists/graylist.ja.md)

## 悪意のあるボットと攻撃の調査

Wallarm Console UIでボットの活動を以下のように調査できます。

* **IPリスト**セクションで悪意のあるボットを調査する
* **イベント**セクションでボットによって実行されたAPI濫用を調査する

[ボットの活動を調査する方法を学ぶ →](../user-guides/api-abuse-prevention.ja.md#exploring-blocked-malicious-bots-and-their-attacks)