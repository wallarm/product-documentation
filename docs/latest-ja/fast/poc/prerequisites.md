```markdown
# 統合前提条件

FASTをCI/CDワークフローに統合するためには、以下のものが必要です

* WallarmのアカウントおよびFASTノード管理へアクセスするために[Wallarm Sales Team](mailto:sales@wallarm.com)に連絡してください。
* FASTノードのDockerコンテナは、HTTPSプロトコル（`TCP/443`）を使用して`us1.api.wallarm.com` Wallarm APIサーバへアクセスできる必要があります。
--8<-- "../include/fast/cloud-note.md"

* CI/CDワークフロー用にDockerコンテナを作成・実行する権限
* 脆弱性をテストするためのWebアプリケーションまたはAPI（*対象アプリケーション*）
    
    このアプリケーションは通信にHTTPまたはHTTPSプロトコルを使用する必要があります。
    
    FASTセキュリティテストが完了するまで、対象アプリケーションは利用可能な状態を維持する必要があります。
    
* HTTPおよびHTTPSリクエストを使用して対象アプリケーションをテストするテストツール（*リクエストソース*）。
    
    リクエストソースはHTTPまたはHTTPSプロキシサーバと連携できる必要があります。
    
    [Selenium][link-selenium]は上記要件を満たすテストツールの例です。
    
* 1つ以上の[tokens][doc-about-token].
    <p id="anchor-token"></p>

    Wallarm cloudで[FASTノードの作成][doc-create-node]を行い、CI/CDタスク実行時に該当するトークンをDockerコンテナで使用してください。
    
    CI/CDジョブ実行中、DockerコンテナはFASTノードとともにこのトークンを使用します。

    複数のCI/CDジョブが同時に実行される場合、Wallarm cloudに適切な数のFASTノードを作成してください。

    !!! info "トークンの例"
        このガイド全体では、`token_Qwe12345`という値がトークンの例として使用されます。
```