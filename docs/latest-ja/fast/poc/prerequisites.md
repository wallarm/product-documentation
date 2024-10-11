[link-wl-portal-us]:        https://us1.my.wallarm.com
[link-wl-portal-eu]:        https://my.wallarm.com    
[link-selenium]:            https://www.seleniumhq.org/

[doc-create-node]:          ../operations/create-node.md
[doc-about-token]:          ../operations/internals.md#token
[doc-integration-overview]: integration-overview.md


#   統合前提条件

FASTをCI / CDワークフローに統合するには、次のものが必要です：

* Contact the [Wallarm Sales Team](mailto:sales@wallarm.com) to get access to the Wallarm account and FAST node management.
* FASTノードのDockerコンテナは、HTTPSプロトコル（`TCP/443`）を介して`us1.api.wallarm.com` Wallarm APIサーバーにアクセスできる必要があります。
--8<-- "../include-ja/fast/cloud-note.md"

 * CI / CDワークフローにDockerコンテナを作成および運用するための権限
    
* 脆弱性をテストするウェブアプリケーションまたはAPI（*ターゲットアプリケーション*）
    
    このアプリケーションはHTTPまたはHTTPSプロトコルを使用して通信しなければなりません。
    
    ターゲットアプリケーションは、FASTのセキュリティテストが終了するまで利用可能でなければなりません。
    
* HTTPおよびHTTPSリクエストを使用してターゲットアプリケーションをテストするテストツール（*リクエストソース*）。
    
    リクエストソースはHTTPまたはHTTPSプロキシサーバーで動作できる必要があります。
    
    [Selenium][link-selenium]は、以上の要件を満たすテストツールの一例です。
    
* 1つ以上の[トークン][doc-about-token]。
    <p id="anchor-token"></p>

    Wallarmのクラウドで[FASTノードを作成][doc-create-node]し、CI/CDタスクを実行する際のDockerコンテナで対応するトークンを使用します。
    
    このトークンは、CI/CDジョブ実行中のFASTノードを持つDockerコンテナによって使用されます。

    同時に実行されているいくつかのCI/CDジョブがある場合は、Wallarmのクラウドで適切な数のFASTノードを作成します。

    !!! info "トークンの例"
        このガイド全体で`token_Qwe12345` の値がトークンの例として使用されます。