```markdown
[link-using-search]:    ../search-and-filters/use-search.md
[img-attacks-tab]:      ../../images/user-guides/events/check-attack.png
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[use-search]:             ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action
[link-attacks]:         ../../user-guides/events/check-attack.md
[link-incidents]:       ../../user-guides/events/check-incident.md
[link-sessions]:        ../../api-sessions/overview.md

# インシデント分析

Wallarm Consoleでは、検出されたインシデントを**Incidents**セクション内で分析できます。必要なデータを見つけるため、[こちら][use-search]で説明されている検索フィールドを使用するか、手動で必要な検索フィルターを設定してください。

## インシデントの確認

![Incidents tab][img-incidents-tab]

* **Date**: 悪意のあるリクエストの日時です。
    * 同じタイプの複数のリクエストが短時間に検出された場合、攻撃期間が日付の下に表示されます。期間とは、指定された時間枠内で特定のタイプの最初のリクエストと最後のリクエストの間の時間を指します。
    * 攻撃が現在進行中の場合、適切なラベルが表示されます。
* **Payloads**: 攻撃タイプおよび一意の[悪意のあるペイロード](../../glossary-en.md#malicious-payload)の数です。
* **Hits**: 指定された時間枠内での攻撃におけるヒット（リクエスト）の数です。
* **Top IP / Source**: 悪意のあるリクエストの送信元となったIPアドレスです。複数のIPアドレスから悪意のあるリクエストが送信された場合、インターフェイスには最も多くのリクエストを送信したIPアドレスが表示されます。IPアドレスに関しては、以下の情報も表示されます：
     * 指定された時間枠内で同一攻撃中にリクエストが送信された全IPアドレスの総数です。
     * IPアドレスが登録されている国/地域（IP2Locationなどのデータベースで確認された場合）です。
     * **Public proxy**、**Web proxy**、**Tor**、またはIPが登録されているクラウドプラットフォームなど、ソースの種類（IP2Locationなどのデータベースで確認された場合）です。
     * IPアドレスが悪意のある活動で知られている場合、**Malicious IPs**ラベルが表示されます。これは公開記録および専門家の検証に基づいています。
* **Domain / Path**: リクエストの対象となったドメイン、パスおよびアプリケーションIDです。
* **Status**: 攻撃ブロックの状態です（[traffic filtration mode](../../admin-en/configure-wallarm-mode.md)に依存します）：
     * Blocked: 攻撃のすべてのヒットがフィルタリングノードによりブロックされました。
     * Partially blocked: 攻撃の一部のヒットはブロックされ、残りはただ登録されました。
     * Monitoring: 攻撃のすべてのヒットが登録されましたが、ブロックはされませんでした。
* **Parameter**: 悪意のあるリクエストに適用されたパラメータおよび[parsers](../rules/request-processing.md)のタグです。
* **Vulnerabilities**: インシデントが悪用する脆弱性です。脆弱性をクリックすると、その詳細な説明と修正方法が表示されます。

最新のリクエストの時間でインシデントを並べ替えるには、**Sort by latest hit**スイッチを使用してください。

## 脅威アクターの活動の全体像

--8<-- "../include/request-full-context.md"

## インシデントへの対応

[incidents](../../glossary-en.md#security-incident)は、確認された脆弱性を標的とした攻撃です。

![Incidents tab][img-incidents-tab]

一度**Incidents**セクションにインシデントが表示されたら：

1. 任意で（推奨）、インシデントの悪意のあるリクエストの[脅威アクターの活動の全体像](#full-context-of-threat-actor-activities)を調査してください：どの[user session](../../api-sessions/overview.md)に属しているか、またそのセッション内のリクエストの全シーケンスを確認できます。

     これにより、脅威アクターのすべての活動およびロジック、攻撃ベクトル、またどのリソースが危険にさらされるかを理解できます。

2. **Vulnerabilities**列のリンクを辿り、この脆弱性の詳細な情報（修正方法の手順および関連するインシデントのリストを含む）を確認してください。 

     ![Vulnerability detailed information](../../images/user-guides/vulnerabilities/vuln-info.png)

     **Fix the vulnerability**を実施し、その後Wallarmでクローズ済みとしてマークしてください。詳細については[Managing Vulnerabilities](../vulnerabilities.md)記事を参照してください。

3. リストのインシデントに戻り、システムがどのような仕組みで反応したのかを調査してください（攻撃の`Blocked`、`Partially blocked`、`Monitoring`[statuses](check-attack.md#attack-analysis)にご留意ください）。また、同様のリクエストに対してシステムが今後どのように振る舞うか、および必要に応じてこの将来の挙動をどのように調整するかを確認してください。

インシデントの場合、この調査および調整は他のすべての攻撃と同様の方法で実施されます（[こちら](check-attack.md#responding-to-attacks)参照）。

## インシデント取得のためのAPI呼び出し

インシデントの詳細を取得するには、Wallarm Console UIを使用するほかに、[Wallarm APIを直接呼び出す](../../api/overview.md)ことができます。以下は、**過去24時間に検出された最初の50件のインシデントを取得する**ためのAPI呼び出しの例です。

このリクエストは攻撃の一覧を取得するために[使用されたもの](check-attack.md#api-calls-to-get-attacks)と似ています。ただし、インシデントをリクエストするために`"!vulnid": null`という項目が追加されています。この項目は、脆弱性IDが指定されていないすべての攻撃を無視するようAPIに指示し、これによりシステムが攻撃とインシデントを区別します。

`TIMESTAMP`は、24時間前の日付を[Unix Timestamp](https://www.unixtimestamp.com/)形式に変換した値に置換してください。

--8<-- "../include/api-request-examples/get-incidents-en.md"
```