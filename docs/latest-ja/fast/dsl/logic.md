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

拡張のロジックは、次の複数のフェーズで表現できます:
1.  [収集][link-phase-collect]
2.  [照合][link-phase-match]
3.  [変更][link-phase-modify]
4.  [生成][link-phase-generate]
5.  [送信][link-phase-send]
6.  [検出][link-phase-detect]

これらのフェーズを組み合わせることで、FAST DSLでは2種類の拡張を記述できます:
* 1つ目は、受信したベースラインリクエストのパラメータを変更して、1つ以上のテストリクエストを作成します。

    本ガイドでは、この拡張を「変更型拡張」と呼びます。

* 2つ目は、事前定義されたテストリクエストを使用し、受信したベースラインリクエストのパラメータを変更しません。

    本ガイドでは、この拡張を「非変更型拡張」と呼びます。

各拡張タイプは異なるフェーズセットを使用します。いくつかのフェーズは必須ですが、そうでないものもあります。 

Detectフェーズの使用は各拡張タイプで必須です。このフェーズはテストリクエストに対する対象アプリケーションのレスポンスを受け取ります。拡張はこれらのレスポンスを使用して、アプリケーションに特定の脆弱性があるかどうかを判断します。Detectフェーズの情報はWallarm cloudに送信されます。

!!! info "リクエスト要素の記述構文"
    FASTの拡張を作成する際には、アプリケーションに送信するHTTPリクエストと、アプリケーションから受信するHTTPレスポンスの構造を理解し、ポイントを使用して作業対象となるリクエスト要素を正しく記述する必要があります。
    
    詳細については、この[リンク][link-points]をご覧ください。
 
##  変更型拡張の動作

変更型拡張の動作中、ベースラインリクエストは収集、照合、変更、生成の各フェーズを順に通過します。これらはすべてオプションであり、拡張に含めない場合もあります。これらのフェーズを通過した結果として、1つまたは複数のテストリクエストが形成されます。これらのリクエストを対象アプリケーションに送信して、脆弱性をチェックします。

!!! info "オプションフェーズを含まない拡張"
    ベースラインリクエストにオプションフェーズを適用しない場合、テストリクエストはベースラインリクエストと一致します。 

![変更型拡張のフェーズ概要][img-phases-mod-overview]

ベースラインリクエストが定義済みのFASTの[テストポリシー][doc-policy-in-detail]を満たす場合、そのリクエストには処理が許可された1つ以上のパラメータが含まれます。変更型拡張はこれらのパラメータを順に処理します:

 1. 各パラメータは拡張のフェーズを通過し、それに対応するテストリクエストが作成され実行されます。
 2. ポリシーに適合するすべてのパラメータを処理し終えるまで、拡張は次のパラメータへと進みます。  

以下の図は、いくつかのPOSTパラメータを持つPOSTリクエストの例です。

![変更型拡張のワークフロー概要][img-mod-workflow]

##  非変更型拡張の動作

非変更型拡張の動作中、ベースラインリクエストは1つの送信フェーズのみを通過します。

このフェーズでは、ベースラインリクエストの`Host`ヘッダーの値から、ホスト名（IPアドレスの場合はその値）のみを取り出します。次に、事前定義されたテストリクエストをこのホストに送信します。 

FAST nodeが同じ`Host`ヘッダー値を持つ複数のベースラインリクエストを受け取る可能性があるため、これらのリクエストは暗黙の収集フェーズを通過し、`Host`ヘッダー値が一意なリクエストのみを収集します（[「一意性の条件」][doc-collect-uniq]を参照してください）。

![非変更型拡張のフェーズ概要][img-phases-non-mod-overview]

非変更型拡張が動作する際、送信フェーズで処理される各ベースラインリクエストの`Host`ヘッダーに記載されたホストへ、1つ以上の事前定義されたテストリクエストを送信します:

![非変更型拡張のワークフロー概要][img-non-mod-workflow]


##  拡張によるリクエストの処理方法

### 複数の拡張によるリクエストの処理

FAST nodeで同時に使用する拡張を複数定義できます。
受信した各ベースラインリクエストは、組み込まれているすべての拡張を通過します。

![ワーカーが使用する拡張][img-workers]

任意の時点で、各拡張は単一のベースラインリクエストを処理します。FASTはベースラインリクエストの並列処理をサポートします。受信した各ベースラインリクエストは、処理を高速化するために空いているワーカーに送られます。異なるワーカーが、異なるベースラインリクエストに対して同じ拡張を同時に実行することがあります。拡張は、ベースラインリクエストに基づいてテストリクエストを作成すべきかどうかを定義します。

FAST nodeが並列に処理できるリクエスト数は、ワーカー数に依存します。ワーカー数は、FAST nodeのDockerコンテナ実行時に環境変数`WORKERS`に設定した値で定義します（既定値は10）。

!!! info "テストポリシーの詳細"
    テストポリシーの詳細な説明は、この[リンク][doc-policy-in-detail]をご覧ください。