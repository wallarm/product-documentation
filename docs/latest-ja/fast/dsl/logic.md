[img-phases-mod-overview]:              ../../images/fast/dsl/common/mod-phases.png
[img-phases-non-mod-overview]:          ../../images/fast/dsl/common/non-mod-phases.png
[img-mod-workflow]:                     ../../images/fast/dsl/common/mod-workflow.png
[img-non-mod-workflow]:                 ../../images/fast/dsl/common/non-mod-workflow.png
[img-workers]:                          ../../images/fast/dsl/en/workers.png

[img-incomplete-policy]:                ../../images/fast/dsl/common/incomplete-policy.png
[img-incomplete-policy-remediation-1]:  ../../images/fast/dsl/common/incomplete-policy-remediation-1.png
[img-incomplete-policy-remediation-2]:  ../../images/fast/dsl/common/incomplete-policy-remediation-2.png
[img-wrong-baseline]:                   ../../images/fast/dsl/common/wrong-baseline.png   

[link-policy]:              ../terms-glossary.md#test-policy
[doc-policy-in-detail]:     ../operations/test-policy/overview.md

[link-phase-collect]:       phase-collect.md
[link-phase-match]:         phase-match.md
[link-phase-modify]:        phase-modify.md
[link-phase-generate]:      phase-generate.md
[link-phase-send]:          phase-send.md
[link-phase-detect]:        detect/phase-detect.md

[doc-collect-uniq]:         phase-collect.md#the-uniqueness-condition
[doc-point-uri]:            points/parsers/http.md#uri-filter

[link-points]:              points/intro.md

# 拡張のロジック

拡張のロジックはいくつかのフェーズを使用して説明できます：
1.  [Collect][link-phase-collect]
2.  [Match][link-phase-match]
3.  [Modify][link-phase-modify]
4.  [Generate][link-phase-generate]
5.  [Send][link-phase-send]
6.  [Detect][link-phase-detect]

これらのフェーズを組み合わせることで、FAST DSLは2つの拡張タイプを記述することができます：
* 最初のものは、ベースラインリクエストのパラメータを変更し、1つまたは複数のテストリクエストを作成します。

    このガイド全体で、この拡張は「変更拡張」を指します。

* 二番目のものは、定義済みのテストリクエストを使用し、ベースラインリクエストのパラメータを変更しません。

    このガイド全体で、この拡張は「非変更拡張」を指します。

それぞれの拡張タイプは、特性のフェーズセットを使用します。これらのフェーズのいくつかは必須で、他のフェーズはそうではありません。

Detectフェーズの使用は、それぞれの拡張タイプに必須です。このフェーズは、ターゲットアプリケーションからのテストリクエストのレスポンスを受け取ります。拡張は、これらのレスポンスを使用して、アプリケーションが特定の脆弱性を持つかどうかを判断します。Detectフェーズからの情報はWallarmクラウドに送信されます。

!!! info "リクエスト要素記述の構文"
   FAST拡張を作成する際には、HTTPリクエストの構造とアプリケーションから受信したHTTPレスポンスの構造を理解する必要があります。これにより、ポイントを使用して作業する必要があるリクエスト要素を正確に記述できます。

    詳しい情報を参照するには、この[link][link-points]に進んでください。

##  変更拡張がどのように機能するか

変更拡張の操作中、ベースラインリクエストは順番にCollect、Match、Modify、およびGenerateフェーズを通過します。これら全ては任意であり、拡張に含まれる必要はありません。これらのフェーズを通過する結果として、1つのテストリクエストか複数のテストリクエストが作成されます。これらのリクエストは、脆弱性をチェックするためにターゲットアプリケーションに送信されます。

!!! info "任意のフェーズがない拡張"
    ベースラインリクエストに任意のフェーズが適用されなければ、テストリクエストはベースラインリクエストと一致します。

![変更拡張のフェーズ概要][img-phases-mod-overview]

ベースラインリクエストが明確なFAST [test policy][doc-policy-in-detail]を満足していれば、そのリクエストには、処理を許可された1つまたは複数のパラメータが含まれます。変更拡張はこれらのパラメータを反復します：

 1. 各パラメータは拡張フェーズを通過し、対応するテストリクエストが作成され、実行されます。
 2. ポリシーに準拠しているすべてのパラメータが処理されるまで、拡張は次のパラメータに進みます。

以下の画像は、いくつかのPOSTパラメータを持つPOSTリクエストを例として示しています。

![変更拡張のワークフロー概要][img-mod-workflow]

##  非変更拡張がどのように機能するか

非変更拡張の操作中、ベースラインリクエストは単一のSendフェーズを通過します。

このフェーズでは、ベースラインリクエストの`Host`ヘッダの値からホスト名のIPアドレスだけが導出されます。その後、定義済みのテストリクエストがこのホストに送信されます。

`Host`ヘッダの値が同じであるいくつかの受信ベースラインリクエストがFASTノードに遭遇する可能性があるため、これらのリクエストはユニークな`Host`ヘッダ値を持つリクエストだけを集めるための暗黙のCollectフェーズを通過します（[“ユニークネス条件”][doc-collect-uniq]参照）。

![非変更拡張のフェーズ概要][img-phases-non-mod-overview]

非変更拡張の動作時に、1つ以上の定義済みのテストリクエストが、Sendフェーズで処理される各ベースラインリクエストの`Host`ヘッダに記載されたホストに送信されます：

![非変更拡張のワークフロー概要][img-non-mod-workflow]

##  拡張がリクエストをどのように処理するか

### 複数の拡張と共にリクエストを処理する

FASTノードは同時に使用するために定義された複数の拡張を持つことができます。
各受信ベースラインリクエストは、全てのプラグイン拡張を通過します。

![作業者が使用する拡張][img-workers]

各時間点で、拡張は単一のベースラインリクエストを処理します。FASTは平行したベースラインリクエストの処理をサポートします。受信した各ベースラインリクエストは、処理を加速するために空いている作業者に送信されます。異なる作業者は、同時に異なるベースラインリクエストに対して同じ拡張を実行することがあります。拡張は、ベースラインリクエストを基にテストリクエストが作成されるべきかどうかを定義します。

FASTノードが平行して処理できるリクエストの数は、作業者の数に依存します。作業者の数は、FASTノードDockerコンテナの実行時に環境変数`WORKERS`に割り当てられた値によって定義されます（デフォルトの変数値は10）。

!!! info "Test policyの詳細"
   [link][doc-policy-in-detail]に、テストポリシーの作業に関するより詳細な説明があります。