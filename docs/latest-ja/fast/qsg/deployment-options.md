---
description: FASTは、FASTノードとWallarmクラウドを含む二つのコンポーネントからなる解決策です。このガイドでは、FASTノードのデプロイ方法について説明します。
---

[img-fast-integration]:         ../../images/fast/qsg/en/deployment-options/0-qsg-fast-depl.png
[img-fast-scheme]:              ../../images/fast/qsg/en/deployment-options/1-qsg-fast-work-scheme.png       
[img-fast-deployment-options]:  ../../images/fast/qsg/en/deployment-options/2-qsg-fast-depl-options.png    
[img-insecure-connection]:     ../../images/fast/qsg/common/deployment-options/3-qsg-fast-depl-insecure-cert.png    
[img-qsg-deployment-scheme]:    ../../images/fast/qsg/en/deployment-options/4-qsg-fast-depl-scheme.png
    
[link-https-google-gruyere]:    https://google-gruyere.appspot.com   

    
#   デプロイメントオプション

FASTは、FASTノードとWallarmクラウドを含む二つのコンポーネントからなる解決策です。このガイドでは、FASTノードのデプロイ方法について説明します。

--8<-- "../include-ja/fast/cloud-note.md"

アプリケーションのテストを行うために、HTTPまたはHTTPSのリクエストは最初にFASTノードを経由してプロキシされます。FASTは、クラウドから取得したポリシーに基づいて、元のクエリから新しいリクエストセットを作成します。新しく作成されたリクエストは、アプリケーションの脆弱性をテストするために実行されるセキュリティテストセットを形成します。

![FASTを使ったテストの流れ][img-fast-integration]

ベースラインリクエスト（アプリケーションへの元のリクエスト）は様々なソースから取得することができます。例えば、ベースラインリクエストはアプリケーションテスターによって書かれるか、既存のテスト自動化ツールによって生成されることがあります。FASTはすべてのベースラインリクエストが悪意のあるものである必要はありません：セキュリティテストセットは正当なリクエストに基づいて生成することも可能です。FASTノードは、セキュリティテストセットの作成と実行のために使用されます。

![FASTの動作方法][img-fast-scheme]
    
    
##  利用可能なデプロイメントオプション 

FASTノードのデプロイオプションは3つから選ぶことができます。ノードのインストールは次の場所で行うことができます。
1.  ベースラインリクエストのソースとなるホスト（例えば、テスターのノートPC）
2.  対象アプリケーションが存在するホスト
3.  専用のホスト

![FASTのデプロイオプション][img-fast-deployment-options]
    
    
##  主なデプロイメントの配慮事項

FASTノードはDockerコンテナとして提供され、Dockerをサポートするすべてのプラットフォーム（Linux、Windows、macOSを含む）上で実行することができます。

FASTのデプロイメントには、Wallarmクラウドのアカウントが必須です。クラウドはFASTの設定のためのユーザーインターフェースを提供する責任があります。テスト結果もクラウドによって収集されます。

FASTノードのデプロイメントを完了した後、次のことを確認してください。
1.  ノードは対象アプリケーションにアクセスできます。
2.  ノードはWallarmクラウドにアクセスできます。
3.  すべてのベースラインHTTPまたはHTTPSリクエストはノードを経由してプロキシされます。

!!! info "SSL証明書のインストール"
    対象アプリケーションとのやり取りにHTTPSを使用する場合、リクエストのソースはFASTノードのインストールから取得した自己証明SSL証明書を信頼しない可能性があります。たとえば、Mozilla Firefoxブラウザをリクエストサイトとして使用すると、次のようなメッセージが表示される可能性があります（他のブラウザーやリクエストソースでは異なるメッセージが表示される場合があります）。
    
    ![“Insecure connection” message][img-insecure-connection]
    
    証明書の問題を解決するための2つのオプションがあります。

    1.  FASTノードからの自己証明SSL証明書をリクエストソースに信頼される証明書としてインストールします。
    1.  既存の信頼されるSSL証明書をFASTノードにインストールします。

##  クイックスタートガイドにおけるFASTのデプロイメントの特性

このガイドは、ノードがローカルにインストールされ、リクエストソースと一緒に使用されるデプロイメントオプションを利用して、FASTの操作を説明することを目的としています。

このガイドで使用されるインストールには次のような特性があります。

* Mozilla Firefoxブラウザはベースラインリクエストソースとして動作します。
* 一つのHTTPSベースラインリクエストが構築されます。
* FASTノードからの自己証明SSL証明書がブラウザにインストールされます。
* Google Gruyereが対象アプリケーションとして動作します。
* 対象アプリケーションはXSSの脆弱性に対してテストされます。
* ポリシーはWallarmクラウドのウェブインターフェースで作成されます。
* テストプロセスはWallarmクラウドのウェブインターフェースで開始されます。

![クイックスタートガイドのデプロイメントスキーム][img-qsg-deployment-scheme]

!!! info "Google Gruyere"
    Google Gruyereは、セキュリティテスト用に特別に作成されたアプリケーションです。意図的に多くの脆弱性が組み込まれています。したがって、各アプリケーションインスタンスは、セキュリティのために分離されたサンドボックスで実行されます。アプリケーションの使用を開始するには、<https://google-gruyere.appspot.com>に移動して、Gruyereアプリケーションの分離されたインスタンスでサンドボックスを実行する必要があります。