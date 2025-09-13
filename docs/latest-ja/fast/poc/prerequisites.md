[link-wl-portal-us]:        https://us1.my.wallarm.com
[link-wl-portal-eu]:        https://my.wallarm.com    
[link-selenium]:            https://www.seleniumhq.org/

[doc-create-node]:          ../operations/create-node.md
[doc-about-token]:          ../operations/internals.md#token
[doc-integration-overview]: integration-overview.md


#   インテグレーションの前提条件

FASTをCI/CDワークフローに統合するには、次が必要です。

* WallarmアカウントとFASTノードの管理へのアクセスを得るために、[Wallarm営業チーム](mailto:sales@wallarm.com)に連絡してください。
* FASTノードのDockerコンテナが、HTTPSプロトコル（`TCP/443`）でWallarm APIサーバー`us1.api.wallarm.com`にアクセスできる必要があります
--8<-- "../include/fast/cloud-note.md"

 * CI/CDワークフローでDockerコンテナを作成して実行するための権限が必要です。
    
* 脆弱性をテストするためのWebアプリケーションまたはAPI（*対象アプリケーション*）
    
    このアプリケーションは通信にHTTPまたはHTTPSプロトコルを使用する必要があります。
    
    対象アプリケーションは、FASTによるセキュリティテストが完了するまで利用可能な状態を維持する必要があります。
    
* HTTPおよびHTTPSリクエストを使用して対象アプリケーションをテストするテストツール（*リクエストソース*）。
    
    リクエストソースは、HTTPまたはHTTPSのプロキシサーバーで動作できる必要があります。
    
    [Selenium][link-selenium]は、上記の要件を満たすテストツールの一例です。
    
* 1つ以上の[トークン][doc-about-token]。
    <p id="anchor-token"></p>

    Wallarm Cloudで[FASTノードを作成][doc-create-node]し、CI/CDタスクを実行する際にDockerコンテナで対応するトークンを使用してください。  
    
    トークンは、CI/CDジョブの実行中にFASTノードを実行するDockerコンテナによって使用されます。

    複数のCI/CDジョブが同時に実行されている場合は、Wallarm Cloudに適切な数のFASTノードを作成してください。

    !!! info "トークンの例"
        このガイド全体で、`token_Qwe12345`の値をトークンの例として使用しています。   