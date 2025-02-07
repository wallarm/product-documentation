```markdown
[doc-integration-api]:          integration-overview-api.md
[doc-integration-ci-mode]:      integration-overview-ci-mode.md
[doc-concurrent-pipelines]:     ci-mode-concurrent-pipelines.md

[img-api-mode]:                 ../../images/fast/poc/en/integration-overview/api-mode-common.png
[img-ci-mode]:                  ../../images/fast/poc/en/integration-overview/ci-mode-common.png
[img-ci-mode-build-id]:         ../../images/fast/poc/en/integration-overview/ci-build-id-common.png

[anchor-build-id]:              #deploying-the-fast-node-with-ci-mode-for-use-in-concurrent-cicd-workflows

[doc-qsg]:              ../qsg/deployment-options.md

# FASTを使用したCI/CDワークフロー

FASTをCI/CDワークフローに統合すると、既存のCI/CDワークフローにいくつかの追加ステップが加えられます。これらのステップは、既存のCI/CDジョブの一部として、または別個のジョブとして実行可能です。

具体的な追加ステップは実行中のテストラン作成シナリオに応じて異なります。考えられるシナリオは以下にすべて記載されています。

## Wallarm APIを通じた統合（別名「Deployment via API」）

このシナリオでは、FASTノードはWallarm APIを介して管理されます。また、テストランの管理にもAPIが使用されます。FASTノードは、ベースラインリクエストを記録するか、既に記録されたベースラインリクエストを利用できます。

![Integration via API][img-api-mode]

このシナリオにおけるFASTの動作は以下の通りです：
* 単一のFASTノードDockerコンテナが、1つの対応するクラウドFASTノードに紐付けられます。複数のコンテナを同時にFASTノードで実行する場合、展開予定のコンテナ数と同数のクラウドFASTノードおよびトークンが必要です。
* あるクラウドFASTノードに対して新たにFASTノードを作成し、既にそのクラウドノードに紐付けられたFASTノードが存在する場合、後者のノードのテストランは実行中止となります。
* テストポリシーおよびテスト記録は複数のテストランおよびFASTノードで利用可能です。

この場合のFAST統合の詳細については、[このドキュメント][doc-integration-api]を参照してください。

## FASTノードを使用した統合（別名「Deployment with CI MODE」）

このシナリオでは、FASTノードはテストモードおよび記録モードで使用されます。運用モードは、ノードのコンテナ展開時に`CI_MODE`環境変数を操作することで切り替えます。FASTノードはテストランを自律的に管理するため、CI/CDツールによるWallarm APIとのやり取りは不要です。

以下の図はこのシナリオの概略を示しています：

![Integration with CI MODE][img-ci-mode]

このシナリオにおけるFASTの動作は以下の通りです：
* 単一のFASTノードDockerコンテナが、1つの対応するクラウドFASTノードに紐付けられます。複数のコンテナを同時にFASTノードで実行する場合、展開予定のコンテナ数と同数のクラウドFASTノードおよびトークンが必要です。複数のFASTノードを正しく展開して並行CI/CDワークフローで使用するには、下記で[説明][anchor-build-id]するCI MODEに類似した異なるアプローチを用いる必要があります。
* あるクラウドFASTノードに対して新たにFASTノードを作成し、既にそのクラウドノードに紐付けられたFASTノードが存在する場合、後者のノードのテストランは実行中止となります。
* テストポリシーおよびテスト記録は複数のテストランおよびFASTノードで利用可能です。

この場合のFAST統合の詳細については、[このドキュメント][doc-integration-ci-mode]を参照してください。

### 並行CI/CDワークフローで使用するためのCI MODEを用いたFASTノードの展開

並行CI/CDワークフローに適した形でFASTノードを展開するには、上記の通りCI MODEを使用し、追加の`BUILD_ID`環境変数をノードのコンテナに渡す必要があります。

`BUILD_ID`パラメータを使用することで、単一のクラウドFASTノードで複数の異なるテスト記録に対して記録を行い、後にこれらのテスト記録を再利用して複数の並行テストランを実行できます。

以下の図はこのシナリオの概略を示しています：

![Integration with BUILD_ID][img-ci-mode-build-id]

このシナリオにおけるFASTの動作は以下の通りです：
* 複数のFASTノードが単一のクラウドFASTノードを経由して並行CI/CDワークフローで動作可能です。なお、これらすべてのFASTノードは**同一のトークンを使用**します。
* テストランは、異なる`BUILD_ID`識別子でマークされた異なるテスト記録を使用します。
* これらのテストランは並行して実行され、必要に応じて異なるテストポリシーを採用することも可能です。

並行CI/CDワークフローでFASTを使用する方法の詳細な説明については、[このドキュメント][doc-concurrent-pipelines]を参照してください。

!!! info "HTTPSサポート"
    本手順書は、HTTPプロトコルで動作するアプリケーションのテストを目的としたCI/CDとのFAST統合について説明します。
    
    FASTノードは、HTTPSプロトコルで動作するアプリケーションのテストにも対応しています。詳細は[Quick Startガイド][doc-qsg]に記載されています。
```