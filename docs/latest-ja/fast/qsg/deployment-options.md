---
description: FASTは2コンポーネントソリューションで、FASTノードとWallarm cloudで構成されます。このガイドはFASTノードの展開方法について説明します。
---

[img-fast-integration]:         ../../images/fast/qsg/en/deployment-options/0-qsg-fast-depl.png
[img-fast-scheme]:              ../../images/fast/qsg/en/deployment-options/1-qsg-fast-work-scheme.png       
[img-fast-deployment-options]:  ../../images/fast/qsg/en/deployment-options/2-qsg-fast-depl-options.png    
[img-insecure-connection]:     ../../images/fast/qsg/common/deployment-options/3-qsg-fast-depl-insecure-cert.png    
[img-qsg-deployment-scheme]:    ../../images/fast/qsg/en/deployment-options/4-qsg-fast-depl-scheme.png
    
[link-https-google-gruyere]:    https://google-gruyere.appspot.com    

    
# 展開オプション

FASTは2コンポーネントソリューションで、FASTノードとWallarm cloudで構成されます。このガイドはFASTノードの展開方法について説明します。

--8<-- "../include/fast/cloud-note.md"

アプリケーションテストを実施するため、HTTPまたはHTTPSリクエストは最初にFASTノードを経由してプロキシされます。FASTはcloudから取得したポリシーに基づいて元のクエリをもとに新しいリクエストセットを生成します。新たに生成されたリクエストはセキュリティテストセットを構成し、アプリケーションの脆弱性を検出します。

![FASTによるテストプロセス][img-fast-integration]

ベースラインリクエスト（アプリケーションへの元のリクエスト）は様々なソースから取得可能です。たとえば、ベースラインリクエストはアプリケーションテスターが作成する場合や、既存のテスト自動化ツールによって生成される場合があります。FASTは全てのベースラインリクエストが悪意のあるものである必要はなく、正当なリクエストに基づいてセキュリティテストセットを生成することも可能です。FASTノードはセキュリティテストセットの生成および実行に利用されます。

![FASTの仕組み][img-fast-scheme]
    
    
## 利用可能な展開オプション 

FASTノードの展開オプションは3種類選択可能です。ノードのインストールは以下のホストに配置できます:
1. ベースラインリクエストのソースとして機能するホスト（例：テスターのラップトップ）
2. ターゲットアプリケーションが存在するホスト
3. 専用ホスト

![FAST展開オプション][img-fast-deployment-options]
    
    
## 主な展開時の考慮事項

FASTノードはDockerコンテナとして提供され、Dockerをサポートする全てのプラットフォーム上で実行可能です（Linux、Windows、macOSが含まれます）。

FAST展開にはWallarm cloudのアカウントが必須です。cloudはFASTの設定用ユーザーインターフェースの提供と、テスト結果の収集を担います。

FASTノードの展開後は、以下を確認してください:
1. ノードがターゲットアプリケーションにアクセス可能であること。
2. ノードがWallarm cloudにアクセス可能であること。
3. すべてのベースラインHTTPまたはHTTPSリクエストがノードを経由してプロキシされること。

!!! info "SSL証明書のインストール"
    HTTPSを使用してターゲットアプリケーションと通信する場合、リクエストソースがFASTノードのインストールから取得した自己署名SSL証明書を信頼しない可能性があります。たとえば、MozillaFirefoxブラウザをリクエストソースとして使用する場合、同様のメッセージが表示される場合があります（他のブラウザやリクエストソースの場合は異なる可能性があります）:
    
    ![「Insecure connection」メッセージ][img-insecure-connection]
    
    証明書の問題を解決する方法は2通りあります:

    1. FASTノードからの自己署名SSL証明書をリクエストソースに信頼済み証明書としてインストールする。
    1. 信頼済みの既存SSL証明書をFASTノードにインストールする。
  
## クイックスタートガイドにおけるFAST展開の詳細 

このガイドは、ノードがリクエストソースとローカルにインストールされる展開オプションを活用し、FASTの動作を実演します。

本ガイドで使用されるインストール構成は以下の特徴があります:

* MozillaFirefoxブラウザがベースラインリクエストのソースとして使用されます。
* HTTPSのベースラインリクエストが1件構築されます。
* FASTノードの自己署名SSL証明書がブラウザにインストールされます。
* GoogleGruyereがターゲットアプリケーションとして利用されます。
* ターゲットアプリケーションに対してXSS脆弱性のテストが実施されます。
* ポリシーはWallarm cloudのwebインターフェースで作成されます。
* テストプロセスはWallarm cloudのwebインターフェースで開始されます。

![クイックスタートガイド展開スキーム][img-qsg-deployment-scheme]

!!! info "Google Gruyere"
    GoogleGruyereはセキュリティテスト専用に設計されたアプリケーションです。意図的に組み込まれた多数の脆弱性が存在するため、各アプリケーションインスタンスはセキュリティ上の理由から分離されたサンドボックス内で実行されます。アプリケーションの利用を開始するには、<https://google-gruyere.appspot.com>にアクセスし、Gruyereアプリケーションの分離インスタンスを含むサンドボックスを起動してください。