[link-using-search]:    ../search-and-filters/use-search.md
[img-attacks-tab]:      ../../images/user-guides/events/check-attack.png
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[use-search]:             ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action
[link-attacks]:         ../../user-guides/events/check-attack.md
[link-incidents]:       ../../user-guides/events/check-incident.md
[link-sessions]:        ../../api-sessions/overview.md

# インシデントの分析

Wallarm Consoleでは、検出された[インシデント](../../glossary-en.md#security-incident)を**Incidents**セクションで分析できます。必要なデータを見つけるには、[こちら][use-search]で説明している検索フィールドを使用するか、必要な検索フィルターを手動で設定してください。

## インシデントの確認

![Incidentsタブ][img-incidents-tab]

* **Date**: 悪意のあるリクエストの日時です。
    * 同種のリクエストが短い間隔で複数検出された場合、日付の下に攻撃の継続時間が表示されます。継続時間とは、指定した期間内である種類の最初のリクエストから同じ種類の最後のリクエストまでの時間です。
    * 攻撃が現在進行中の場合は、その旨のラベルが表示されます。
* **Payloads**: 攻撃タイプと一意の[悪意のあるペイロード](../../glossary-en.md#malicious-payload)の数です。
* **Hits**: 指定の期間内に攻撃で発生したヒット数（リクエスト数）です。
* **Top IP / Source**: 悪意のあるリクエストの送信元IPアドレスです。悪意のあるリクエストが複数のIPアドレスから発生している場合、インターフェイスには最も多くのリクエストを送信したIPアドレスが表示されます。IPアドレスについては次のデータも表示されます。
     * 指定期間中に同一の攻撃でリクエストが発信されたIPアドレスの総数
     * IPアドレスが登録されている国/地域（IP2Locationなどのデータベースで判明している場合）
     * ソースの種類（例: **Public proxy**、**Web proxy**、**Tor**、またはIPが登録されているクラウドプラットフォームなど。IP2Locationなどのデータベースで判明している場合）
     * 当該IPアドレスが悪意ある活動で知られている場合は、**Malicious IPs**ラベルが表示されます。これは公開記録および専門家による検証に基づきます
* **Domain / Path**: リクエストの宛先であるドメイン、パス、アプリケーションIDです。
* **Status**: 攻撃のブロック状態（[トラフィックフィルタリングモード](../../admin-en/configure-wallarm-mode.md)に依存します）:
     * Blocked: 攻撃のすべてのHitsがフィルタリングノードによってブロックされました。
     * Partially blocked: 一部のHitsはブロックされ、他は記録のみされました。
     * Monitoring: 攻撃のすべてのHitsが記録されましたがブロックはされませんでした。
* **Parameter**: 悪意のあるリクエストのパラメーターと、そのリクエストに適用された[パーサー](../rules/request-processing.md)のタグです。
* **Vulnerabilities**: インシデントが悪用している脆弱性です。脆弱性をクリックすると、詳細な説明と修正方法が表示されます。

最後のリクエスト時刻でインシデントを並べ替えるには、**Sort by latest hit**スイッチを使用できます。

## 脅威アクターの活動の完全なコンテキスト

--8<-- "../include/request-full-context.md"

## インシデントへの対応

[インシデント](../../glossary-en.md#security-incident)は、確認済みの脆弱性を標的とした攻撃です。

![Incidentsタブ][img-incidents-tab]

**Incidents**セクションにインシデントが表示されたら:

1. 任意ですが（推奨）、インシデントの悪意のあるリクエストの[完全なコンテキスト](#full-context-of-threat-actor-activities)を調査し、それらがどの[ユーザーセッション](../../api-sessions/overview.md)に属するのか、このセッション内のリクエストの完全なシーケンスが何かを確認してください。

     これにより、脅威アクターの全アクティビティとロジックが把握でき、攻撃ベクターと侵害され得るリソースを理解できます。
  
1. **Vulnerabilities**列のリンクをたどり、修正手順や関連インシデント一覧を含む詳細な脆弱性情報を確認してください。

     ![脆弱性の詳細情報](../../images/user-guides/vulnerabilities/vuln-info.png)

     脆弱性を修正し、その後Wallarmでクローズとしてマークしてください。詳細は[脆弱性の管理](../vulnerabilities.md)を参照してください。
1. 一覧のインシデントに戻り、どのメカニズムがシステムの反応を引き起こしたのか（攻撃の[ステータス](check-attack.md#attack-analysis)である`Blocked`、`Partially blocked`、`Monitoring`に留意してください）、今後同様のリクエストに対してシステムがどのように動作するのか、必要に応じてその将来の動作をどのように調整するかを調査してください。

     インシデントについても、これらの調査と調整は他の攻撃と[同様の方法](check-attack.md#responding-to-attacks)で実施します。

## インシデントを取得するためのAPI呼び出し

インシデントの詳細を取得するには、Wallarm ConsoleのUIに加えて[Wallarm APIを直接呼び出す](../../api/overview.md)こともできます。以下は、過去24時間に検出された最初の50件のインシデントを取得するAPI呼び出し例です。

このリクエストは攻撃一覧に[使用するもの](check-attack.md#api-calls)と同様ですが、インシデントを要求するために`"!vulnid": null`という条件を追加します。この条件によりAPIは脆弱性IDが指定されていないすべての攻撃を無視し、これによってシステムは攻撃とインシデントを区別します。

`TIMESTAMP`は、24時間前の日付を[Unix Timestamp](https://www.unixtimestamp.com/)形式に変換した値に置き換えてください。

--8<-- "../include/api-request-examples/get-incidents-en.md"