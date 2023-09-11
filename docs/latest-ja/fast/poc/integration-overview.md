[doc-integration-api]:          integration-overview-api.md
[doc-integration-ci-mode]:      integration-overview-ci-mode.md
[doc-concurrent-pipelines]:     ci-mode-concurrent-pipelines.md

[img-api-mode]:                 ../../images/fast/poc/en/integration-overview/api-mode-common.png
[img-ci-mode]:                  ../../images/fast/poc/en/integration-overview/ci-mode-common.png
[img-ci-mode-build-id]:         ../../images/fast/poc/en/integration-overview/ci-build-id-common.png

[anchor-build-id]:              #deploying-fast-node-with-ci-mode-for-use-in-concurrent-cicd-workflows

[doc-qsg]:              ../qsg/deployment-options.md

#   FASTとCI/CDワークフロー

FASTをCI/CDワークフローに統合すると、既存のCI/CDワークフローにいくつかの追加手順が加わります。これらの手順は、既存のCI/CDジョブの一部であっても、別のジョブであってもかまいません。

具体的な追加手順は、使用中のテスト実行作成シナリオによって異なります。可能なすべてのシナリオを以下に説明します。

##  Wallarm APIを介した統合（通称「API経由のデプロイ」）

このシナリオでは、FASTノードはWallarm APIを介して管理されます。APIはまた、テスト実行の管理にも使用されます。FASTノードは、ベースライントリクエストを記録するか、既に記録されたベースライントリクエストを使用することができます：
    
![API経由での統合][img-api-mode]

このシナリオでは、FASTは以下のような振る舞いを示します：
* 単一のFASTノードDockerコンテナは、対応する単一のクラウドFASTノードにバインドされます。複数のコンテナにFASTノードを同時に実行するには、デプロイしたいコンテナの数と同じ数のクラウドFASTノードとトークンが必要です。
* クラウドFASTノードに新しいFASTノードを作成し、そのクラウドノードに既にバインドされた別のFASTノードがある場合、後者のノードのテスト実行は中断されます。
* テストポリシーとテストレコードは、複数のテスト実行とFASTノードで使用できます。

このケースでのFAST統合の詳細については、[この文書][doc-integration-api]を参照してください。

##  FASTノードを介した統合（通称「CI MODEでのデプロイ」）

このシナリオでは、FASTノードはテストモードと記録モードで使用されます。運用モードは、ノードを持つコンテナをデプロイする際の`CI_MODE`環境変数の操作により切り替えられます。FASTノードはテスト実行を自身で管理するため、CI/CDツールがWallarm APIとやり取りする必要はありません。

以下の画像は、このシナリオの概説的な説明です：

![CI MODEでの統合][img-ci-mode]

このシナリオでは、FASTは以下のような振る舞いを示します：
* 単一のFASTノードDockerコンテナは、対応する単一のクラウドFASTノードにバインドされます。複数のコンテナにFASTノードを同時に実行するには、デプロイ計画によるコンテナの数と同じ数のクラウドFASTノードとトークンが必要です。
    並行CI/CDワークフローでの使用に適した多数のFASTノードを正確にデプロイするには、以下に[説明されている][anchor-build-id]CI MODEと似た別のアプローチを使用する必要があります。
* クラウドFASTノードに新しいFASTノードを作成し、そのクラウドノードに既にバインドされた別のFASTノードがある場合、後者のノードのテスト実行は中断されます。
* テストポリシーとテストレコードは、複数のテスト実行とFASTノードで使用できます。

このケースでのFAST統合の詳細については、[この文書][doc-integration-ci-mode]を参照してください。


### 並行CI/CDワークフローでの使用に向けたCI MODEを用いたFASTノードのデプロイ

並行CI/CDワークフローに適したようにFASTノードをデプロイするには、上記で説明したようにCI MODEを使用し、ノードのコンテナに追加の`BUILD_ID`環境変数を渡す必要があります。

`BUILD_ID`パラメーターにより、単一のクラウドFASTノードを使用しながら、複数の異なるテストレコードに記録することが可能になり、これらのテストレコードを後でいくつかの同時テスト実行を起動するために再利用できます。

以下の画像は、このシナリオの概説的な説明です：

![BUILD_IDでの統合][img-ci-mode-build-id]

このシナリオでは、FASTは以下のような振る舞いを示します：
* 複数のFASTノードが単一のクラウドFASTノードを通じて運用することで、並行なCI/CDワークフローで動作することができます。この際には、これらのFASTノードすべてが**同じトークンを使用**します。
* テスト実行は、それぞれ異なる`BUILD_ID`識別子でマークされた異なるテストレコードを使用します。
* これらのテスト実行は並行して実行されます。また、必要に応じて異なるテストポリシーを使用することも可能です。

並行CI/CDワークフローでのFAST使用方法の詳細な説明については、[この文書][doc-concurrent-pipelines]を参照してください。

!!! info "HTTPS対応"
    この説明では、HTTPプロトコルで動作するアプリケーションをテストするためのFASTとCI/CDの統合について説明しています。 
    
    FASTノードは、HTTPSプロトコルで動作するアプリケーションのテストにも対応しています。詳細は[クイックスタートガイド][doc-qsg]をご覧ください。