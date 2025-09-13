---
description: FASTはFASTノードとWallarm cloudで構成される2つのコンポーネントのソリューションです。本ガイドではFASTノードのデプロイ方法を説明します。
---

[img-fast-integration]:         ../../images/fast/qsg/en/deployment-options/0-qsg-fast-depl.png
[img-fast-scheme]:              ../../images/fast/qsg/en/deployment-options/1-qsg-fast-work-scheme.png       
[img-fast-deployment-options]:  ../../images/fast/qsg/en/deployment-options/2-qsg-fast-depl-options.png    
[img-insecure-connection]:     ../../images/fast/qsg/common/deployment-options/3-qsg-fast-depl-insecure-cert.png    
[img-qsg-deployment-scheme]:    ../../images/fast/qsg/en/deployment-options/4-qsg-fast-depl-scheme.png
    
[link-https-google-gruyere]:    https://google-gruyere.appspot.com    

    
#   デプロイオプション

FASTはFASTノードとWallarm cloudで構成される2つのコンポーネントのソリューションです。本ガイドではFASTノードのデプロイ方法を説明します。

--8<-- "../include/fast/cloud-note.md"

アプリケーションをテストするには、まずHTTPまたはHTTPSリクエストをFASTノード経由でプロキシします。FASTは、Wallarm cloudから取得したポリシーに従い、元のリクエストを基に新しいリクエストセットを作成します。作成されたリクエストはセキュリティテストセットを構成し、アプリケーションの脆弱性を検証するために実行されます。

![FASTでのテストプロセス][img-fast-integration]

ベースラインリクエスト（アプリケーションへの元のリクエスト）は、さまざまな送信元から取得できます。たとえば、アプリケーションテスターが作成することも、既存のテスト自動化ツールが生成することもあります。FASTは、ベースラインリクエストがすべて悪意あるものである必要はありません。正当なリクエストからでもセキュリティテストセットを生成できます。FASTノードは、セキュリティテストセットの作成と実行に使用します。

![FASTの仕組み][img-fast-scheme]
    
    
##  利用可能なデプロイオプション 

FASTノードのデプロイオプションは3つあります。ノードのインストール先は次のいずれかです
1.  ベースラインリクエストの送信元となるホスト（例: テスターのラップトップ）
2.  対象アプリケーションが稼働するホスト
3.  専用ホスト

![FASTのデプロイオプション][img-fast-deployment-options]
    
    
##  主なデプロイ時の考慮事項

FASTノードはDockerコンテナとして提供され、Dockerをサポートするあらゆるプラットフォーム（Linux、Windows、macOSを含む）で実行できます。

FASTをデプロイするにはWallarm cloudのアカウントが必須です。Wallarm cloudはFASTの設定用ユーザーインターフェースを提供します。テスト結果もWallarm cloudに集約されます。

FASTノードのデプロイ後、次を確認してください
1.  ノードが対象アプリケーションへアクセスできること。
2.  ノードがWallarm cloudへアクセスできること。
3.  すべてのベースラインHTTPまたはHTTPSリクエストがノード経由でプロキシされること。

!!! info "SSL証明書のインストール"
    対象アプリケーションとHTTPSでやり取りする場合、FASTノードのインストールで提供される自己署名SSL証明書がリクエスト送信元で信頼されないことがあります。たとえば、リクエスト送信元としてMozilla Firefoxブラウザーを使用している場合、次のようなメッセージが表示されることがあります（他のブラウザーや送信元では異なる場合があります）:
    
    ![「安全でない接続」メッセージ][img-insecure-connection]
    
    証明書の問題を解決するには、次の2つの方法があります:

    1.  FASTノードの自己署名SSL証明書をリクエスト送信元に信頼済み証明書としてインストールします。
    1.  既存の信頼済みSSL証明書をFASTノードにインストールします。
  
##  クイックスタートガイドにおけるFASTデプロイの詳細 

本ガイドでは、ノードをリクエスト送信元と同一ホストにローカルインストールするデプロイオプションを用いて、FASTの動作をデモンストレーションします。 

本ガイドで使用する構成は次のとおりです:

* Mozilla Firefoxブラウザーをベースラインリクエストの送信元として使用します。
* HTTPSのベースラインリクエストを1件作成します。
* FASTノードの自己署名SSL証明書をブラウザーにインストールします。
* 対象アプリケーションはGoogle Gruyereです。
* 対象アプリケーションに対してXSS脆弱性のテストを実施します。
* ポリシーはWallarm cloudのWebインターフェイスで作成します。
* テストはWallarm cloudのWebインターフェイスから開始します。

![クイックスタートガイドのデプロイ構成図][img-qsg-deployment-scheme]

!!! info "Google Gruyere"
    Google Gruyereはセキュリティテスト用に設計されたアプリケーションです。意図的に多数の脆弱性が組み込まれています。そのため、安全上の理由から各アプリケーションインスタンスは分離されたサンドボックスで実行されます。アプリケーションの利用を開始するには、<https://google-gruyere.appspot.com>にアクセスし、Gruyereアプリケーションの分離インスタンスを持つサンドボックスを起動してください。