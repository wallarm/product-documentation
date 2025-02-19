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

# 拡張機能のロジック

拡張機能のロジックは、いくつかのフェーズを用いて記述できます:
1.  [収集][link-phase-collect]
2.  [照合][link-phase-match]
3.  [変更][link-phase-modify]
4.  [生成][link-phase-generate]
5.  [送信][link-phase-send]
6.  [検知][link-phase-detect]

これらのフェーズを組み合わせることで、FAST DSLは2種類の拡張機能を記述できます:
* 最初の拡張機能は、受信したベースラインリクエストのパラメータを変更することで1つ以上のテストリクエストを生成します。

    本ガイドでは、この拡張機能を「変更型拡張機能」と呼びます。

* 次の拡張機能は、あらかじめ定義されたテストリクエストを利用し、受信したベースラインリクエストのパラメータを変更しません。

    本ガイドでは、この拡張機能を「非変更型拡張機能」と呼びます。

各拡張機能タイプは、それぞれ異なるフェーズのセットを使用します。一部のフェーズは必須ですが、そうでないものもあります。

検知フェーズの使用は、各拡張機能タイプにおいて必須です。このフェーズはテストリクエストに対する対象アプリケーションの応答を受け取ります。拡張機能は、これらの応答をもとにアプリケーションに特定の脆弱性が存在するかどうかを判定します。検知フェーズから得られた情報はWallarm cloudに送信されます。

!!! info "リクエスト要素記述シンタックス"
    FAST拡張機能を作成する際、アプリケーションに送信されるHTTPリクエスト及びアプリケーションから受信されるHTTPレスポンスの構造を理解し、pointsを使用して取り扱う必要のあるリクエスト要素を正しく記述する必要があります。
    
    詳細な情報については、この[リンク][link-points]をご参照ください。

## 変更型拡張機能の動作原理

変更型拡張機能の動作中、ベースラインリクエストは順次、収集、照合、変更、生成の各フェーズを経由します。これらのフェーズはすべて任意であり、拡張機能に含まれない場合もあります。これらのフェーズを経る結果として、1つまたは複数のテストリクエストが生成されます。これらのリクエストは対象アプリケーションに送信され、脆弱性の有無を検査します。

!!! info "オプションフェーズが無い拡張機能"
    ベースラインリクエストにオプションフェーズが適用されない場合、テストリクエストはベースラインリクエストと一致します。

![変更型拡張機能フェーズ概要][img-phases-mod-overview]

もしベースラインリクエストが定義されたFAST [テストポリシー][doc-policy-in-detail]に適合する場合、そのリクエストには処理が許可された1つ以上のパラメータが含まれます。変更型拡張機能はこれらのパラメータを順次処理します:

 1. 各パラメータは拡張機能の各フェーズを経由し、対応するテストリクエストが生成および実行されます。
 2. 拡張機能は、ポリシーに適合するすべてのパラメータが処理されるまで、次のパラメータに進みます。

以下の画像は、いくつかのPOSTパラメータを含むPOSTリクエストの例を示しています。

![変更型拡張機能ワークフロー概要][img-mod-workflow]

## 非変更型拡張機能の動作原理

非変更型拡張機能の動作中、ベースラインリクエストは単一の送信フェーズを経由します。

このフェーズでは、ベースラインリクエストの`Host`ヘッダ値からIPアドレスのホスト名のみが抽出されます。その後、あらかじめ定義されたテストリクエストがこのホストに送信されます。

FASTノードが同一の`Host`ヘッダ値を持つ複数のベースラインリクエストを受信する可能性があるため、これらのリクエストは暗黙の収集フェーズを経由し、一意の`Host`ヘッダ値を持つリクエストのみが収集されます（「一意条件」については[こちら][doc-collect-uniq]を参照ください）。

![非変更型拡張機能フェーズ概要][img-phases-non-mod-overview]

非変更型拡張機能が動作する場合、送信フェーズで処理される各ベースラインリクエストの`Host`ヘッダに記載されたホストへ、1つ以上のあらかじめ定義されたテストリクエストが送信されます:

![非変更型拡張機能ワークフロー概要][img-non-mod-workflow]

## 拡張機能のリクエスト処理方法

### 複数の拡張機能によるリクエスト処理

複数の拡張機能が同時にFASTノードで使用される場合があります。
受信した各ベースラインリクエストは、組み込まれているすべての拡張機能を通過します。

![ワーカーで使用される拡張機能][img-workers]

各時点で、拡張機能は1つのベースラインリクエストを処理します。FASTは並列のベースラインリクエスト処理をサポートしており、受信された各ベースラインリクエストは空いているワーカーに送信され、処理が高速化されます。別々のワーカーが、同時に異なるベースラインリクエストに対して同じ拡張機能を実行する場合があります。拡張機能は、ベースラインリクエストに基づいてテストリクエストを生成するかどうかを定義します。

FASTノードが並列に処理できるリクエスト数はワーカー数に依存します。ワーカー数はFASTノードのDockerコンテナ実行時に環境変数`WORKERS`に割り当てられた値によって定義されます（デフォルト値は10です）。

!!! info "テストポリシーの詳細"
    テストポリシーの取り扱いに関する詳細な説明については、[こちらのリンク][doc-policy-in-detail]をご参照ください。