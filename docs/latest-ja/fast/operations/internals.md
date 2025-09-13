[img-testpolicy-id]:                        ../../images/fast/operations/common/internals/policy-id.png
[img-execution-timeline-recording]:         ../../images/fast/operations/en/internals/execution-timeline.png
[img-execution-timeline-no-recording]:      ../../images/fast/operations/en/internals/execution-timeline-existing-testrecord.png
[img-testrecord]:                           ../../images/fast/operations/en/internals/testrecord-explained.png           
[img-fast-node]:                            ../../images/fast/operations/common/internals/fast-node.png
[img-reuse-token]:                          ../../images/fast/operations/common/internals/reuse-token.png
[img-components-relations]:                 ../../images/fast/operations/common/internals/components-relations.png
[img-common-timeline-no-recording]:         ../../images/fast/operations/en/internals/common-timeline-existing-testrecord.png

[doc-ci-intro]:                     ../poc/integration-overview.md
[doc-node-deployment-api]:          ../poc/node-deployment.md
[doc-node-deployment-ci-mode]:      ../poc/ci-mode-recording.md
[doc-quick-start]:                  ../qsg/deployment-options.md
[doc-integration-overview]:         ../poc/integration-overview.md

[link-create-policy]:               test-policy/general.md
[link-use-policy]:                  test-policy/using-policy.md
[doc-policy-in-detail]:             test-policy/overview.md

[anchor-testpolicy]:    #fast-test-policy
[anchor-testrun]:       #test-run
[anchor-token]:         #token
[anchor-testrecord]:    #test-record

[doc-testpolicy-creation-example]:  ../qsg/test-preparation.md#2-create-a-test-policy-targeted-at-xss-vulnerabilities
[doc-about-timeout]:                create-testrun.md
[doc-node-deployment]:              ../poc/node-deployment.md#deployment-of-the-docker-container-with-the-fast-node

[link-wl-portal-new-policy]:    https://us1.my.wallarm.com/testing/policies/new#general 
[link-wl-portal-policy-tab]:    https://us1.my.wallarm.com/testing/policies
[link-wl-portal-node-tab]:      https://us1.my.wallarm.com/testing/nodes

#   FASTの動作

--8<-- "../include/fast/cloud-note.md"

!!! info "本ドキュメントの内容に関する短い補足"
    以下に示すエンティティ間の関係および本章で説明するテストシナリオは、Wallarm APIを使用したテストに関するものです。この種のテストはすべてのエンティティを利用します。そのため、各エンティティがどのように相互作用するかについて包括的な洞察を提供できます。
    
    FASTをCI/CDワークフローに統合する場合でも、これらのエンティティは変わりません。ただし、ケースにより手順の順序が異なる場合があります。詳細は[このドキュメント][doc-ci-intro]をお読みください。

FASTは以下のエンティティを使用します:

* [テストレコード。][anchor-testrecord]
* [FASTテストポリシー。][anchor-testpolicy]
* [テストラン。][anchor-testrun]
* [トークン。][anchor-token]

前述のエンティティ間には重要な関係がいくつかあります:
* テストポリシーとテストレコードは、複数のテストランやFASTノードで使用できます。
* トークンはWallarm cloud内の単一のFASTノード、当該FASTノードを含む単一のDockerコンテナ、および単一のテストランに関連します。
* トークンが他のFASTノードを含むDockerコンテナで使用中でない限り、既存のトークン値をFASTノードを含むDockerコンテナに渡すことができます。
* 他のテストランが実行中のFASTノードに対して新しいテストランを作成すると、現在のテストランは停止され新しいテストランに置き換わります。

![コンポーネント間の関係][img-components-relations]

##   FASTで使用するエンティティ

FASTノードは、リクエストソースから対象アプリケーションへのすべてのリクエストのプロキシとして動作します。Wallarmの用語では、これらのリクエストを*ベースラインリクエスト*と呼びます。

FASTノードがリクエストを受信すると、後でそれらに基づいてセキュリティテストを作成するために、特別な「テストレコード」オブジェクトに保存します。Wallarmの用語では、このプロセスを「ベースラインリクエストの記録」と呼びます。

ベースラインリクエストの記録後、FASTノードは[*テストポリシー*][anchor-testpolicy]に従ってセキュリティテストセットを作成します。次に、そのセキュリティテストセットを実行して、対象アプリケーションの脆弱性を評価します。

テストレコードにより、以前に記録したベースラインリクエストを再利用して、同じ対象アプリケーションまたは別の対象アプリケーションを再度テストできます。これは、テストレコード内のベースラインリクエストがアプリケーションのテストに適している場合にのみ可能です。


### テストレコード

FASTは、テストレコードに保存されたベースラインリクエストからセキュリティテストセットを作成します。

テストレコードにベースラインリクエストを投入するには、このテストレコードとFASTノードに結び付けられた[テストラン][anchor-testrun]を実行し、いくつかのベースラインリクエストをFASTノード経由で送信する必要があります。  

あるいは、テストランを作成せずにテストレコードを投入することも可能です。その場合は、FASTノードを記録モードで起動します。詳細は[このドキュメント][doc-node-deployment-ci-mode]を参照してください。 

テストレコードにリクエストが投入されていれば、被検アプリケーションがテストレコードに保存されたベースラインリクエストのサブセットで脆弱性評価できる場合、別のテストランでそのテストレコードを使用できます。  

1つのテストレコードは、複数のFASTノードおよびテストランで利用できます。これは次のような場合に有用です:
* 同じ対象アプリケーションを再テストする。
* 同一のベースラインリクエストで複数の対象アプリケーションを同時にテストする。

![テストレコードの操作][img-testrecord]
 

### FASTテストポリシー

*テストポリシー*は、脆弱性検出プロセスを実施するための一連のルールを定義します。特に、アプリケーションをどの脆弱性タイプに対してテストするかを選択できます。加えて、ポリシーはセキュリティテストセット作成時に処理対象とするベースラインリクエスト内のどのパラメータが適格かを決定します。これらのデータを基に、FASTは対象アプリケーションが悪用可能かどうかを判定するためのテストリクエストを生成します。

新しいポリシーを[作成][link-create-policy]することも、既存のポリシーを[使用][link-use-policy]することもできます。

!!! info "適切なテストポリシーの選択"
    テストポリシーの選択は、被検アプリケーションの動作に依存します。テストする各アプリケーションごとに個別のテストポリシーを作成することを推奨します。

!!! info "追加情報"

    * クイックスタートガイドの[テストポリシー例][doc-testpolicy-creation-example]
    * [テストポリシーの詳細][doc-policy-in-detail]

### テストラン

*テストラン*は、脆弱性テストプロセスの1回の反復を表します。

テストランには次の情報が含まれます:

* [テストポリシー][anchor-testpolicy]の識別子
* [テストレコード][anchor-testrecord]の識別子

FASTノードは、対象アプリケーションのセキュリティテストを実施する際にこれらの値を使用します。

各テストランは単一のFASTノードと密接に結び付いています。あるFASTノードでテストラン`A`が進行中に同じノード向けの新しいテストラン`B`を作成すると、テストラン`A`の実行は中断され、`B`に置き換わります。

テストランは、次の2つの異なるテストシナリオで作成できます:
* 1つ目のシナリオでは、対象アプリケーションの脆弱性テストとベースラインリクエストの記録（新しいテストレコードへの）を同時に行います。ベースラインリクエストを記録するには、リクエストソースから対象アプリケーションへのHTTP/HTTPSリクエストがFASTノードを経由して流れる必要があります。 

    本ガイドでは、このシナリオに対するテストランの作成を「テストランの作成」と呼びます。

* 2つ目のシナリオでは、既存の空ではないテストレコードから抽出したベースラインリクエストを用いて、対象アプリケーションの脆弱性テストを行います。このシナリオでは、リクエストソースをデプロイする必要はありません。

    本ガイドでは、このシナリオに対するテストランの作成を「テストランのコピー」と呼びます。

テストランを新規作成またはコピーすると、その実行は直ちに開始されます。採用するテストシナリオに応じて、実行プロセスは異なる手順に従います（以下参照）。

### テストランの実行フロー（ベースラインリクエストの記録が行われる場合）

テストランを作成すると、その実行は直ちに開始され、以下の手順に従います:

1.  FASTノードはテストランを待機します。 

    FASTノードがテストランの開始を検知すると、テストランからテストポリシーとテストレコードの識別子を取得します。
    
2.  識別子を取得すると、*ベースラインリクエストの記録プロセス*が開始されます。
    
    これでFASTノードは、リクエストソースから対象アプリケーションへのリクエストを受け取る準備が整います。
    
3.  記録が有効になったら、既存のテストの実行を開始します。HTTPおよびHTTPSリクエストはFASTノードを経由して送信され、FASTノードはそれらをベースラインリクエストとして認識します。

    すべてのベースラインリクエストは、テストランに対応するテストレコードに保存されます。
    
4.  テストの実行が完了したら、記録プロセスを停止できます。
    
    テストランの作成時には特別なタイムアウト値が設定されます。これは、新たなベースラインリクエストが到着しない場合に、FASTが記録プロセスを停止するまでどのくらい待機するかを決定します（[`inactivity_timeout`][doc-about-timeout]パラメータ）。
    
    記録プロセスを手動で停止しない場合は、次のようになります: 
    
    * FASTのセキュリティテストがすでに完了していても、タイムアウト値が期限切れになるまでテストランは実行を継続します。
    * このテストランが停止するまで、他のテストランはテストレコードを再利用できません。 
    
    これ以上待機中のベースラインリクエストがない場合は、FASTノード上で記録プロセスを停止できます。次の点に注意してください:

    *  セキュリティテストの作成と実行のプロセスは停止しません。対象アプリケーションの脆弱性評価が完了したときにテストランの実行が停止します。この挙動は、CI/CDジョブの実行時間を短縮するのに役立ちます。
    *  記録が停止されると、他のテストランはテストレコードを再利用できるようになります。
    
5.  FASTノードは、受信した各ベースラインリクエストに基づいて1つ以上のテストリクエストを作成します（ベースラインリクエストが適用されたテストポリシーを満たす場合に限ります）。
     
6.  FASTノードは、テストリクエストを対象アプリケーションに送信して実行します。

ベースラインリクエストの記録プロセスを停止しても、テストリクエストの作成および実行プロセスには影響しません。

ベースラインリクエストの記録と、FASTセキュリティテストの作成および実行のプロセスは並行して進行します:

![テストランの実行フロー（ベースラインリクエストの記録あり）][img-execution-timeline-recording]

注記: 上の図は[FASTクイックスタートガイド][doc-quick-start]で説明しているフローを示しています。ベースラインリクエストの記録を伴うフローは、手動のセキュリティテストにも、CI/CDツールを用いた自動セキュリティテストにも適しています。

このシナリオでは、テストランを操作するためにWallarm APIが必要です。詳細は[このドキュメント][doc-node-deployment-api]を参照してください。 


### テストランの実行フロー（事前に記録されたベースラインリクエストを使用する場合）

テストランをコピーすると、その実行は直ちに開始され、以下の手順に従います:

1.  FASTノードはテストランを待機します。 

    FASTノードがテストランの開始を検知すると、テストランからテストポリシーとテストレコードの識別子を取得します。
    
2.  識別子を取得後、ノードはテストレコードからベースラインリクエストを抽出します。

3.  FASTノードは、抽出した各ベースラインリクエストに基づいて1つ以上のテストリクエストを作成します（ベースラインリクエストが適用されたテストポリシーを満たす場合に限ります）。

4.  FASTノードは、テストリクエストを対象アプリケーションに送信して実行します。

ベースラインリクエストの抽出は、FASTセキュリティテストの作成および実行に先立って行われます:

![テストランの実行フロー（事前記録済みベースラインリクエストの使用）][img-execution-timeline-no-recording]

なお、この実行フローは[FASTクイックスタートガイド][doc-quick-start]で使用されているものです。事前に記録されたベースラインリクエストを用いるフローは、CI/CDツールを用いた自動セキュリティテストに適しています。

このシナリオでは、テストランの操作にWallarm APIまたはCIモードのFASTノードを使用できます。詳細は[このドキュメント][doc-integration-overview]を参照してください。

以下の図は、上記のタイムラインに準拠した最も一般的なCI/CDワークフローを示します:

![テストランの実行フロー（CIモード）][img-common-timeline-no-recording]


##  テストランの操作

本ガイドを読むことで、APIコールを使用してテストランの実行プロセスを管理する方法を学べます。具体的には次のとおりです:
* リクエストソースからのリクエストがもうない場合に、ベースラインリクエストの記録プロセスを停止する方法。
* テストランの実行ステータスを確認する方法。

そのようなAPIコールを実行し、テストランをFASTノードに結び付けるには、[*トークン*][anchor-token]を取得する必要があります。

### トークン

FASTノードは次の要素で構成されます:
* FASTソフトウェアが稼働中のDockerコンテナ。
    
    ここでトラフィックのプロキシ、セキュリティテストの作成、実行のプロセスが行われます。
    
* Wallarm cloudのFASTノード。

トークンは、稼働中のDockerコンテナとクラウド内のFASTノードを結び付けます:

![FASTノード][img-fast-node]

FASTノードをデプロイするには、次の手順を実施します:
1.  [Wallarm portal][link-wl-portal-node-tab]を使用してWallarm cloudにFASTノードを作成します。発行されたトークンをコピーします。
2.  ノードを含むDockerコンテナをデプロイし、トークンの値をコンテナに渡します（このプロセスの詳細は[こちら][doc-node-deployment]に記載しています）。

トークンには次の役割もあります:
* テストランとFASTノードを接続すること。
* APIコールによりテストランの実行プロセスを管理できるようにすること。

必要に応じてWallarm cloudにいくつでもFASTノードを作成し、各ノードのトークンを取得できます。例えば、FASTが必要なCI/CDジョブが複数ある場合、各ジョブ用にクラウドでFASTノードを起動できます。

以前に取得したトークンは、他のアクティブなFASTノードを含むDockerコンテナで使用中でなければ再利用できます（例: 同じトークンを使用するノードを含むいずれかのDockerコンテナが停止または削除されている場合）:

![トークンの再利用][img-reuse-token]