# APIの乱用防止 <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmプラットフォームの**APIの乱用防止**モジュールは、クレデンシャルの詰め込み、偽のアカウントの作成、コンテンツのスクレイピングなど、APIに対する悪意のある行為を実行するボットの検出と軽減を提供します。

## APIの乱用防止によりブロックされる自動化された脅威

**APIの乱用防止**モジュールは、デフォルトでは以下のボットタイプを検出します：

* [APIの乱用](../attacks-vulns-list.md#api-abuse)
* [アカウントの乗っ取り](../attacks-vulns-list.md#api-abuse-account-takeover)
* [セキュリティクローラー](../attacks-vulns-list.md#api-abuse-security-crawlers)
* [スクレイピング](../attacks-vulns-list.md#api-abuse-scraping)

[APIの乱用プロファイル設定](../api-abuse-prevention/setup.md#creating-api-abuse-profile)中に、**APIの乱用防止**モジュールを設定して、すべてのタイプのボットからの保護を提供するか、特定の脅威に対する保護のみを制限することができます。

## APIの乱用防止はどのように動作するのか？

**API Abuse Prevention** モジュールは、MLベースの方法を含む複雑なボット検出モデルを使用し、統計的および数学的な異常探索方法と直接の乱用のケースも含みます。このモジュールは正常なトラフィックプロファイルを自己学習し、大幅に異なる行動を異常として特定します。

APIの乱用防止は、悪意のあるボットを特定するために複数の検出器を使用します。このモジュールは、どの検出器がマーキングに関与したかについての統計情報を提供します。

以下の検出器が関与する可能性があります：

* **リクエスト間隔** は、連続したリクエストの間の時間間隔を分析して、ボットの行動の兆候であるランダム性の欠如を見つけます。
* **リクエストの一意性** は、セッション中に訪問された一意のエンドポイントの数を分析します。クライアントが一貫して一意のエンドポイントの低いパーセンテージ（例えば10%以下）を訪問している場合、それはボットである可能性が高いです。
* **リクエスト率** は、特定の時間間隔で行われたリクエストの数を分析します。APIクライアントが一定のしきい値以上のリクエストを一貫して大量に行っている場合、それはボットである可能性が高いです。
* **悪質なユーザーエージェント** は、リクエストに含まれる`User-Agent`ヘッダーを分析します。この検出器は、クローラーやスクレイパー、セキュリティチェッカーなどの特定のシグネチャをチェックします。
* **古いブラウザ** は、リクエストで使用されるブラウザとプラットフォームを分析します。クライアントが古くなったりサポートされていないブラウザやプラットフォームを使用している場合、それはボットである可能性が高いです。
* **異常行動スコア** は、セッション中に行われた通常と異常なビジネスロジックAPIリクエストを分析します。
* **ビジネスロジックスコア** は、アプリケーションの動作の文脈内で重要またはセンシティブなAPIエンドポイントの使用を分析します。

!!! info "信頼度"
    検出器の動作の結果として、すべての[検出された](../api-abuse-prevention/setup.md#exploring-blocked-malicious-bots-and-their-attacks)ボットは**信頼度のパーセンテージ**を得ます：私たちがそれがボットであることをどれほど確認しているか。各ボットタイプでは、検出器は相対的な重要性/投票数を持っています。したがって、信頼度のパーセンテージは、このボットタイプで可能なすべての投票中で得た投票数（動作した検出器によって提供される）です。

![API abuse prevention statistics](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

1つまたは複数の検出器が[ボットの攻撃の兆候](#automated-threats-blocked-by-api-abuse-prevention)を指摘した場合、モジュールは異常トラフィックの源を1時間[ブラックリストまたはグレーリスト](#reaction-to-malicious-bots)に登録します。Wallarmは、30日以内にブラックリストとグレーリストに登録されたボットのIPをカウントし、前の30日間と比較してこれらの量がどれだけ増減したかを表示します。

API Abuse Preventionは、それらを悪意のあるボットの行動として認定し、その起源をブロックする前に、トラフィックの異常を深く観察します。メトリクスの収集と分析には時間がかかるため、モジュールは最初の悪意のあるリクエストが発生した直後にリアルタイムで悪意のあるボットをブロックすることはありませんが、平均的には異常な活動を大幅に減らします。

## API Abuse Preventionの有効化

**APIの乱用防止**モジュールはデフォルトで無効になっており、[all forms of the Wallarm node 4.2 and above](../installation/supported-deployment-options.md)に含まれています。

API Abuse Preventionを有効にするには：

1. トラフィックがWallarmノード4.2またはそれ以降でフィルタリングされていることを確認します。
1. [subscription plan](../about-wallarm/subscription-plans.md)が**APIの乱用防止**モジュールを含んでいることを確認します。サブスクリプションプランを変更するには、[sales@wallarm.com](mailto:sales@wallarm.com)にリクエストを送信してください。
1. Wallarm Console → **APIの乱用防止**で、少なくとも1つの[API Abuse profile](../api-abuse-prevention/setup.md#creating-api-abuse-profile)を作成または有効にします。

    !!! info "APIの乱用防止設定へのアクセス"
        会社のWallarmアカウントの[管理者](../user-guides/settings/users.md#user-roles)のみが**APIの乱用防止**セクションにアクセスできます。このアクセスがない場合は、管理者に連絡してください。

    ![API Abuse prevention profile](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

## トレランス

あなたは、悪意のあるボットの兆候がどれほど厳密に監視されるかを設定し、これによって誤検知の数をコントロールすることができます。これは、[API Abuse profiles](../api-abuse-prevention/setup.md#creating-api-abuse-profile)内の**Tolerance**パラメーターで設定します。

次の3つのレベルが利用可能です：

* **Low** トレランスは、ボットへのアクセスが少ないことを意味しますが、誤検知により一部の正当なリクエストがブロックされることがあります。
* **Normal** トレランスは、多くの誤検知を避け、大部分の悪意のあるボットのリクエストをAPIに到達することを防ぐための最適なルールを使用します。
* **High** トレランスは、ボットへのアクセスが多いことを意味しますが、その場合、正当なリクエストは一切ドロップされません。

## 悪意のあるボットに対する反応

あなたはAPIの乱用防止を設定して、以下の方法のいずれかで悪意のあるボットに対応することができます：

* **Add to denylist**：WallarmはボットのIPを[denylist](../user-guides/ip-lists/denylist.md)に追加し、これらのIPが生成するすべてのトラフィックをブロックします。
* **Add to graylist**：WallarmはボットのIPを[graylist](../user-guides/ip-lists/graylist.md)に追加し、次の攻撃の兆候を含む、これらのIPから発生するリクエストのみをブロックします：

    * [Input validation attacks](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)
    * [Attacks of the vpatch type](../user-guides/rules/vpatch-rule.md)
    * [Attacks detected based on regular expressions](../user-guides/rules/regex-rule.md)

* **Only monitor**：Wallarmはボットの活動を[**Events**](../user-guides/events/check-attack.md)セクションで表示しますが、ボットのIPをブラックリストにもグレーリストにも追加しません。 

    このようなイベントの詳細から、あなたは**Add source IP to denylist**ボタンでボットを素早くブロックすることができます。IPは永久にブラックリストに追加されますが、**IP Lists**セクションでは、それを削除したり、リストに留まる時間を変更したりすることができます。

## 例外リスト

例外リストとは、正当なボットまたはクローラーに関連していると知られているIPアドレス、サブネット、場所、ソースタイプのリストであり、したがってAPIの乱用防止モジュールによるブロックや制約から除外されます。

あらかじめIPアドレスを例外リストに追加することも、既に誤って悪意のあるボットの活動と関連付けられているとフラグが立てられている場合でも、例外リストに追加することができます。 [Learn how to work with exception list →](../api-abuse-prevention/exceptions.md)

![API Abuse prevention - Exception list](../images/about-wallarm-waf/abi-abuse-prevention/exception-list.png)