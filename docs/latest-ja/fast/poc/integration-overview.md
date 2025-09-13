[doc-integration-api]:          integration-overview-api.md
[doc-integration-ci-mode]:      integration-overview-ci-mode.md
[doc-concurrent-pipelines]:     ci-mode-concurrent-pipelines.md

[img-api-mode]:                 ../../images/fast/poc/en/integration-overview/api-mode-common.png
[img-ci-mode]:                  ../../images/fast/poc/en/integration-overview/ci-mode-common.png
[img-ci-mode-build-id]:         ../../images/fast/poc/en/integration-overview/ci-build-id-common.png

[anchor-build-id]:              #deploying-the-fast-node-with-ci-mode-for-use-in-concurrent-cicd-workflows

[doc-qsg]:              ../qsg/deployment-options.md

#   FASTを使用したCI/CDワークフロー

FASTをCI/CDワークフローに統合すると、既存のCI/CDワークフローにいくつかの追加手順が加わります。これらの手順は、既存のCI/CDジョブの一部にも、別個のジョブにもできます。   

具体的な追加手順は、採用するテスト実行の作成シナリオによって異なります。考えられるシナリオを以下に説明します。

##  Wallarm API経由の統合（別名「API経由のデプロイ」）

このシナリオでは、FAST nodeはWallarm API経由で管理します。APIはテスト実行の管理にも使用します。FAST nodeはベースラインリクエストを記録することも、既に記録済みのベースラインリクエストを用いて動作することもできます:
    
![API経由の統合][img-api-mode] 

このシナリオでは、FASTは次のように動作します:
* 1つのFAST nodeのDockerコンテナは、1つの対応するcloud FAST nodeに紐づきます。FAST nodeのコンテナを同時に複数実行するには、デプロイを予定しているコンテナ数と同数のcloud FAST nodeおよびトークンが必要です。
* cloud FAST nodeに対して新しいFAST nodeを作成すると、そのcloud nodeに既に紐づいている別のFAST nodeのテスト実行は中断されます。
* テストポリシーとテストレコードは、複数のテスト実行やFAST nodeで使用できます。
    
このケースでのFASTの統合方法の詳細は[こちらのドキュメント][doc-integration-api]をご参照ください。 

##  FAST node経由の統合（別名「CI MODEによるデプロイ」）

このシナリオでは、FAST nodeはテストモードと記録モードで使用します。ノードのコンテナをデプロイする際に環境変数`CI_MODE`を設定して、動作モードを切り替えます。FAST node自身がテスト実行を管理するため、CI/CDツールがWallarm APIとやり取りする必要はありません。

このシナリオの概略は、以下の図をご覧ください:

![CI MODEでの統合][img-ci-mode]

このシナリオでは、FASTは次のように動作します:
* 1つのFAST nodeのDockerコンテナは、1つの対応するcloud FAST nodeに紐づきます。FAST nodeのコンテナを同時に複数実行するには、デプロイを計画しているコンテナ数と同数のcloud FAST nodeおよびトークンが必要です。
    同時実行のCI/CDワークフローで多数のFAST nodeを正しくデプロイするには、CI MODE[以下で説明][anchor-build-id]に類似した別のアプローチを使用する必要があります。
* cloud FAST nodeに対して新しいFAST nodeを作成すると、そのcloud nodeに既に紐づいている別のFAST nodeのテスト実行は中断されます。
* テストポリシーとテストレコードは、複数のテスト実行やFAST nodeで使用できます。

このケースでのFASTの統合方法の詳細は[こちらのドキュメント][doc-integration-ci-mode]をご参照ください。 
    

### 同時実行のCI/CDワークフローで使用するためのCI MODEによるFAST nodeのデプロイ

同時実行のCI/CDワークフローに適した形でFAST nodeをデプロイするには、上述のとおりCI MODEを使用し、追加の環境変数`BUILD_ID`をノードのコンテナに渡します。

パラメータ`BUILD_ID`により、単一のcloud FAST nodeを使用しながら複数の異なるテストレコードに記録でき、後でこれらのテストレコードを再利用して複数のテスト実行を同時に開始できます。

このシナリオの概略は、以下の図をご覧ください:

![BUILD_IDによる統合][img-ci-mode-build-id]

このシナリオでは、FASTは次のように動作します:
* 複数のFAST nodeが単一のcloud FAST nodeを介して動作し、同時実行のCI/CDワークフローで利用できます。これらすべてのFAST nodeでは**同一のトークンが使用されます**。
* テスト実行は、`BUILD_ID`識別子が異なる別々のテストレコードを使用します。
* これらのテスト実行は並行して実行され、必要に応じて異なるテストポリシーを適用できます。

同時実行のCI/CDワークフローでFASTを使用する方法の詳細な説明は[こちらのドキュメント][doc-concurrent-pipelines]をご参照ください。


!!! info "HTTPSのサポート"
    この手順では、HTTPプロトコルで動作するアプリケーションをテストするためのFASTとCI/CDの統合について説明します。
    
    FAST nodeは、HTTPSプロトコルで動作するアプリケーションのテストもサポートします。詳細は[クイックスタートガイド][doc-qsg]に記載しています。