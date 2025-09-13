# API Abuse Prevention <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmプラットフォームの**API Abuse Prevention**モジュールは、クレデンシャルスタッフィング、偽アカウント作成、コンテンツスクレイピングなど、APIの不正利用を行うボットを検知・対策します。お客様のAPIを標的とするその他の悪意ある行為にも対応します。

## API Abuse Preventionでブロックされる自動化された脅威

**API Abuse Prevention**モジュールは、デフォルトで次の種類のボットを検出します。

* [不審なAPIアクティビティ](../attacks-vulns-list.md#suspicious-api-activity)
* [アカウント乗っ取り](../attacks-vulns-list.md#account-takeover)
* [セキュリティクローラー](../attacks-vulns-list.md#security-crawlers)
* [スクレイピング](../attacks-vulns-list.md#scraping)
* [無制限のリソース消費](../attacks-vulns-list.md#unrestricted-resource-consumption)（[NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.3.0以上が必要で、現時点では[Native Node](../installation/nginx-native-node-internals.md#native-node)ではサポートされていません）

[API不正利用プロファイルのセットアップ](../api-abuse-prevention/setup.md#creating-profiles)の際に、**API Abuse Prevention**モジュールをすべてのボットタイプから保護するよう構成するか、特定の脅威に限定して保護するよう構成できます。

## API Abuse Preventionはどのように動作しますか？

**API Abuse Prevention**モジュールは、MLベースの手法に加え、統計的・数理的な異常検知手法や直接的な不正のケースを取り入れた複合的なボット検知モデルを使用します。本モジュールは正常なトラフィックプロファイルを自己学習し、著しく異なる振る舞いを異常として識別します。

API Abuse Preventionは、[セッション](../api-sessions/overview.md#api-sessions-and-api-abuse-prevention)内で悪意あるボットを識別するために複数のdetectorを使用します。どのdetectorが判定に関与したかの統計も提供します。

関与する可能性のあるdetectorは次のとおりです。

* **Bad user-agent** リクエストに含まれる`User-Agent`ヘッダーを分析します。このdetectorは、クローラー、スクレイパー、セキュリティチェッカーに属するものを含む特定のシグネチャを確認します。
* **Authentication abuse** 認証リクエスト数の比率やインターバルあたりのリクエスト数を所定のしきい値に対して分析し、異常な振る舞いを特定します。誤検知を避けるため、アプリケーション全体の認証リクエスト総量も考慮します。
* **Request uniqueness** セッション中に訪問したユニークなエンドポイントの数を分析します。クライアントが一貫して10%以下などユニークエンドポイントの割合が低い場合、ユーザーではなくボットである可能性が高いです。
* **Suspicious behavior score** セッション中に行われた通常および異常なビジネスロジックAPIリクエストを分析します。
* **Business logic score** アプリケーションの振る舞いの文脈で、重要または機密なAPIエンドポイントの利用状況を分析します。
* **Request rate** 特定の時間間隔に行われたリクエスト数を分析します。APIクライアントが一定のしきい値を超えるリクエストを一貫して高い割合で行う場合、ユーザーではなくボットである可能性が高いです。
* **Request interval** 連続するリクエスト間の時間間隔を分析し、ボット行動の兆候であるランダム性の欠如を検出します。
* **Query abuse** あらかじめ定義したしきい値を超えるリクエスト量を異常として分析します。パラメータを変化させるクエリでしきい値を超えるクライアントも異常と見なします。さらに、クライアントのクエリパターンを通常の振る舞いと比較し、ボット活動を特定します。
* **Outdated browser** リクエストで使用されるブラウザとプラットフォームを分析します。クライアントが古い、またはサポートされていないブラウザやプラットフォームを使用している場合、ユーザーではなくボットである可能性が高いです。
* **Wide scope** IPアクティビティの広がりを分析し、振る舞いに基づいてクローラー様のボットを特定します。
* **IP rotation** 攻撃者がIPアドレスプールを利用する[アカウント乗っ取り](../attacks-vulns-list.md#account-takeover)攻撃の一部であるかどうかを分析します。
* **Session rotation** 攻撃者がセッションのプールを悪用する[アカウント乗っ取り](../attacks-vulns-list.md#account-takeover)攻撃の一部であるかどうかを分析します。
* **Persistent ATO** 長期間にわたって徐々に発生する[アカウント乗っ取り](../attacks-vulns-list.md#account-takeover)攻撃の一部であるかどうかを分析します。
* **Credential stuffing** 異なるクレデンシャルで繰り返しログイン試行を行いながらリクエスト属性を安定させている[アカウント乗っ取り](../attacks-vulns-list.md#account-takeover)攻撃（[クレデンシャルスタッフィング](../attacks-vulns-list.md#credential-stuffing)）の一部であるかどうかを分析します。
* **Low-frequency credential stuffing** 後続のAPIインタラクションを伴わない、散発的または最小限の認証試行（[クレデンシャルスタッフィング](../attacks-vulns-list.md#credential-stuffing)）を特徴とする[アカウント乗っ取り](../attacks-vulns-list.md#account-takeover)攻撃の一部であるかどうかを分析します。攻撃者は検知回避のため、セッションまたはクライアントあたりのログイン試行回数を意図的に制限します。
* **Response time anomaly** APIレスポンスのレイテンシにおける異常なパターンを特定し、自動化された不正やバックエンドの悪用の試みを示唆する可能性があります（[無制限のリソース消費](../attacks-vulns-list.md#unrestricted-resource-consumption)攻撃の一種としてマークされます）。
* **Excessive request consumption** APIに異常に大きなリクエストペイロードを送信するクライアントを特定し、バックエンド処理リソースの乱用や誤用を示す可能性があります（[無制限のリソース消費](../attacks-vulns-list.md#unrestricted-resource-consumption)攻撃の一種としてマークされます）。
* **Excessive response consumption** セッションのライフタイム全体で転送されたレスポンスデータの総量に基づいて、不審なセッションにフラグを付けます。個々のリクエストに着目するdetectorと異なり、このdetectorは[セッション全体](../api-sessions/overview.md)にわたりレスポンスサイズを集計し、スロードリップ型や分散型のスクレイピング攻撃を特定します（[無制限のリソース消費](../attacks-vulns-list.md#unrestricted-resource-consumption)攻撃の一種としてマークされます）。

!!! info "信頼度"
    detectorの動作結果として、すべての[検出された](../api-abuse-prevention/exploring-bots.md)ボットに対し、これはボットであるとどの程度確信できるかを示す**信頼度パーセンテージ**が付与されます。各ボットタイプでは、detectorごとに相対的重要度や投票数が異なります。したがって、信頼度パーセンテージは、そのボットタイプにおける可能な全投票数に対して獲得した票の割合（作動したdetectorが付与した票）です。

![API Abuse Preventionの統計](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics-detectors.png)

1つ以上のdetectorが[ボット攻撃の兆候](#automated-threats-blocked-by-api-abuse-prevention)を示した場合、本モジュールは異常トラフィックの送信元を1時間denylistまたはgraylistに追加します。Wallarmは、過去30日以内にdenylistおよびgraylistに登録されたボットIPを集計し、直前の30日間と比べてそれらの数が何パーセント増減したかを表示します。

本ソリューションは、トラフィックの異常を悪意あるボット行為と断定して発信元をブロックする前に、深く観察します。メトリクスの収集と分析には時間がかかるため、最初の悪意あるリクエストが発生した瞬間にリアルタイムでボットをブロックするわけではありませんが、平均的には異常な活動を大幅に低減します。

## セットアップ

**API Abuse Prevention**モジュールで悪意あるボットの検知と緩和を開始するには、1つ以上の[API不正利用プロファイル](../api-abuse-prevention/setup.md#creating-profiles)を作成して構成します。

API Abuse Preventionの機能をより精緻にするため、リクエストを[セッション](../api-sessions/overview.md)にまとめる際に未認証トラフィックをより適切に識別できるよう、[JA3 fingerprinting](../admin-en/enabling-ja3.md)を有効化することを推奨します。