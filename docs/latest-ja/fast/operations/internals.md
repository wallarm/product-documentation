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

# FASTの動作方法

--8<-- "../include/fast/cloud-note.md"

!!! info "文書内容に関する簡単な注意"
    この章で説明するエンティティ間の関係（以下参照）およびテストシナリオは、Wallarm APIを使用したテストに関連します。この種のテストはすべてのエンティティを活用するため、これらのエンティティがどのように相互作用するかを包括的に把握することが可能です。
    
    FASTをCI/CDワークフローに統合する場合、これらのエンティティは変更されませんが、手順の順序は特定のケースごとに異なる場合があります。詳細は[こちらの文書][doc-ci-intro]をお読みください。

FASTは以下のエンティティを使用します:

* [テストレコード][anchor-testrecord]
* [FASTテストポリシー][anchor-testpolicy]
* [テストラン][anchor-testrun]
* [トークン][anchor-token]

前述のエンティティ間にはいくつか重要な関係があります:
* テストポリシーとテストレコードは複数のテストランおよびFASTノードで使用可能です。
* トークンはWallarm Cloud内の単一のFASTノード、該当FASTノードを含む単一のDockerコンテナ、および単一のテストランに関連付けられます。
* 他のDockerコンテナでそのFASTノードが同一トークンを使用していない場合、既存のトークン値をDockerコンテナに渡すことができます。
* 既存のテストラン中に新たなテストランを同一FASTノードで作成すると、現在のテストランは停止され、新しいものに置き換えられます。

![コンポーネント間の関係][img-components-relations]

## FASTが使用するエンティティ

FASTノードは、リクエスト元からターゲットアプリケーションへのすべてのリクエストのプロキシとして機能します。Wallarmの用語では、これらのリクエストは*ベースラインリクエスト*と呼ばれます。

FASTノードがリクエストを受信すると、後でそれらに基づいてセキュリティテストを作成するため、特別な「テストレコード」オブジェクトに保存します。Wallarmの用語では、このプロセスは「ベースラインリクエストの記録」と呼ばれます。

ベースラインリクエストの記録後、FASTノードは[*テストポリシー*][anchor-testpolicy]に基づいてセキュリティテストセットを作成し、その後、ターゲットアプリケーションの脆弱性評価のためにセキュリティテストセットが実行されます。

テストレコードは、以前に記録されたベースラインリクエストを再利用し、同一または別のターゲットアプリケーションに対して再びテストを実施することを可能にします。同一のベースラインリクエストを再度FASTノード経由で送信する必要はありません。ただし、テストレコード内のベースラインリクエストがそのアプリケーションのテストに適している場合に限ります。


### テストレコード

FASTはテストレコードに保存されたベースラインリクエストからセキュリティテストセットを作成します。

テストレコードにベースラインリクエストを登録するには、このテストレコードとFASTノードに紐付いた[テストラン][anchor-testrun]を実行し、FASTノードを通じてベースラインリクエストを送信する必要があります。  

あるいは、テストランを作成せずにテストレコードを登録することも可能です。その場合、FASTノードを記録モードで実行します。詳細は[こちらの文書][doc-node-deployment-ci-mode]を参照してください。 

テストレコードにリクエストが登録されている場合、テストレコードに保存されたベースラインリクエストの一部を使用してターゲットアプリケーションの脆弱性評価が可能であれば、別のテストランと併用することができます。  

単一のテストレコードは複数のFASTノードおよびテストランで利用可能です。これは、例えば以下の場合に有用です:
* 同じターゲットアプリケーションに対して再度テストを実施する場合。
* 複数のターゲットアプリケーションが同一のベースラインリクエストで同時にテストされる場合。

![テストレコードの利用][img-testrecord]
 

### FASTテストポリシー

*テストポリシー*は、脆弱性検出プロセスの実施ルールのセットを定義します。特に、アプリケーションに対してテストすべき脆弱性の種類を選択できます。さらに、ポリシーはセキュリティテストセット作成時に処理対象となるベースラインリクエスト内のパラメータを決定します。これらのデータは、ターゲットアプリケーションが攻撃可能かどうかを検証するテストリクエストを作成する際にFASTが使用します。

新しいポリシーを[作成][link-create-policy]するか、[既存のものを使用][link-use-policy]してください。

!!! info "適切なテストポリシーの選定"
    テストポリシーの選択は、テスト対象のアプリケーションの動作に依存します。テストする各アプリケーションごとに個別のテストポリシーを作成することを推奨します。

!!! info "追加情報"

    * クイックスタートガイドの[テストポリシー例][doc-testpolicy-creation-example]
    * [テストポリシーの詳細][doc-policy-in-detail]

### テストラン

*テストラン*は、脆弱性テストプロセスの単一の反復を示します。

テストランには以下が含まれます:

* [テストポリシー][anchor-testpolicy]識別子
* [テストレコード][anchor-testrecord]識別子

FASTノードはこれらの値を使用して、ターゲットアプリケーションへのセキュリティテストを実施します。

各テストランは単一のFASTノードと密接に連携しています。もし同一FASTノードでテストランAの実行中に新たなテストランBを作成すると、テストランAの実行は中断され、テストランBに置き換えられます。

テストランは2種類のテストシナリオに対して作成することが可能です:
* 1つ目のシナリオでは、ターゲットアプリケーションに対して脆弱性テストが行われると同時に、ベースラインリクエストの記録が新たなテストレコードに対して実施されます。リクエストはベースラインリクエストとして記録されるため、リクエスト元からターゲットアプリケーションへFASTノードを通じて流れる必要があります。 

    このシナリオでのテストランの作成は、以降の説明では「テストラン作成」と呼びます。

* 2つ目のシナリオでは、既存の非空のテストレコードから抽出されたベースラインリクエストを使用してターゲットアプリケーションの脆弱性を評価します。このシナリオでは、リクエスト元のデプロイは不要です。

    このシナリオでのテストランの作成は、以降の説明では「テストランコピー」と呼びます。

テストランの作成またはコピー後、実行は即座に開始されます。実行プロセスは、実施中のテストシナリオに応じて異なる手順に従います（以下参照）。

### テストラン実行フロー（ベースラインリクエストの記録あり）

テストラン作成後、実行は即座に開始され、以下の手順に従います:

1.  FASTノードはテストランを待機します。 

    FASTノードがテストランの開始を検知すると、テストランからテストポリシーおよびテストレコードの識別子を取得します。
    
2.  識別子の取得後、*ベースラインリクエスト記録プロセス*が開始されます。
    
    この時点で、FASTノードはリクエスト元からターゲットアプリケーションへのリクエストを受信する準備が整います。
    
3.  リクエスト記録が有効な場合、既存のテストの実行を開始します。HTTPおよびHTTPSリクエストがFASTノードを通じて送信され、これらはベースラインリクエストとして認識されます。

    すべてのベースラインリクエストは、テストランに対応するテストレコードに保存されます。
    
4.  テスト実行が完了した後、記録プロセスを停止することが可能です。
    
    テストラン作成後に設定される特別なタイムアウト値により、新たなベースラインリクエストが到着しない場合に自動的に記録プロセスが停止されます（[`inactivity_timeout`][doc-about-timeout]パラメータ）。
    
    手動で記録プロセスを停止しない場合、以下の動作となります:
    
    * FASTセキュリティテストが既に完了していても、タイムアウト値が経過するまでテストランの実行は継続されます。
    * このテストランが停止するまでは、他のテストランはテストレコードを再利用できません。
    
    リクエスト元からの待機中のベースラインリクエストがなくなった場合、FASTノード上で記録プロセスを停止することができます。なお、以下にご留意ください:

    * セキュリティテストの作成および実行プロセスは停止されません。ターゲットアプリケーションの脆弱性評価が完了すると、テストランの実行は停止されます。この動作はCI/CDジョブの実行時間短縮に寄与します。
    * 記録が停止されると、他のテストランがテストレコードを再利用できるようになります。
    
5.  FASTノードは、各ベースラインリクエスト（適用されたテストポリシーを満たす場合のみ）に基づいて1つ以上のテストリクエストを作成します。
     
6.  FASTノードは、作成したテストリクエストをターゲットアプリケーションに送信することで、テストリクエストを実行します。

ベースラインリクエスト記録プロセスの停止は、テストリクエストの作成および実行プロセスに影響を与えません。

ベースラインリクエスト記録プロセスとFASTセキュリティテストの作成・実行プロセスは平行して実行されます:

![テストラン実行フロー（ベースラインリクエスト記録あり）][img-execution-timeline-recording]

注意: 上記の図は[FASTクイックスタートガイド][doc-quick-start]に記載されているフローを示しています。ベースラインリクエスト記録ありのフローは、手動のセキュリティテストまたはCI/CDツールを使用した自動テストのいずれにも適用可能です。

このシナリオでは、Wallarm APIを使用してテストランを操作する必要があります。詳細は[こちらの文書][doc-node-deployment-api]をご参照ください。 


### テストラン実行フロー（事前記録されたベースラインリクエストの使用）

テストランをコピーすると、実行は即座に開始され、以下の手順に従います:

1.  FASTノードはテストランを待機します。 

    FASTノードがテストランの開始を検知すると、テストランからテストポリシーおよびテストレコードの識別子を取得します。
    
2.  識別子の取得後、ノードはテストレコードからベースラインリクエストを抽出します。

3.  FASTノードは、抽出した各ベースラインリクエスト（適用されたテストポリシーを満たす場合のみ）に基づいて1つ以上のテストリクエストを作成します。

4.  FASTノードは、作成したテストリクエストをターゲットアプリケーションに送信することで実行します。

ベースラインリクエストの抽出プロセスは、FASTセキュリティテストの作成および実行プロセスの前に実施されます:

![テストラン実行フロー（事前記録されたベースラインリクエストの使用）][img-execution-timeline-no-recording]

上記は[FASTクイックスタートガイド][doc-quick-start]で使用される実行フローであることに注意してください。事前記録されたベースラインリクエストを使用するフローは、CI/CDツールを用いた自動セキュリティテストに適しています。

このシナリオでは、Wallarm APIまたはCIモードのFASTノードを使用してテストランを操作することが可能です。詳細は[こちらの文書][doc-integration-overview]を参照してください。

下記の図は、上記のタイムラインに沿った最も一般的なCI/CDワークフローを示しています:

![テストラン実行フロー（CI Mode）][img-common-timeline-no-recording]


## テストランの操作

本ガイドを読み進める中で、API呼び出しを使用してテストラン実行プロセスを管理する方法を学習します。具体的には:
* リクエスト元からの追加リクエストがない場合にベースラインリクエスト記録プロセスを停止する方法。
* テストラン実行状況を確認する方法。

これらのAPI呼び出しを行い、テストランをFASTノードに紐付けるためには[*トークン*][anchor-token]を取得する必要があります。

### トークン

FASTノードは以下で構成されます:
* FASTソフトウェアがインストールされた動作中のDockerコンテナ。
    
    ここで、トラフィックプロキシ、セキュリティテストの作成、実行のプロセスが行われます。
    
* Wallarm Cloud内のFASTノード。

トークンは、稼働中のDockerコンテナとCloud内のFASTノードを紐付けます:

![FASTノード][img-fast-node]

FASTノードをデプロイするには、以下の手順を実施してください:
1.  [Wallarmポータル][link-wl-portal-node-tab]を使用してWallarm Cloud内にFASTノードを作成し、提供されたトークンをコピーします。
2.  該当FASTノードを含むDockerコンテナをデプロイし、トークン値をコンテナに渡します（詳細は[こちら][doc-node-deployment]に記載）。
   
トークンは以下の目的にも使用されます:
* テストランとFASTノードの接続を行うため。
* API呼び出しによりテストラン実行プロセスを管理するため。

必要に応じて、Wallarm Cloud内に多数のFASTノードを作成し、それぞれのノードに対してトークンを取得することが可能です。たとえば、複数のCI/CDジョブでFASTが必要な場合、各ジョブごとにCloud上でFASTノードを起動できます。

他の稼働中のDockerコンテナが同じトークンを使用していない場合、以前に取得したトークンを再利用することが可能です（例えば、同一トークンを使用するノードを含むDockerコンテナが停止または削除されている場合）。

![トークンの再利用][img-reuse-token]