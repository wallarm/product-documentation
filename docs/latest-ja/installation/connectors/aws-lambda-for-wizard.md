# ウィザード用CloudFront

Wallarm Edge nodeをAmazon CloudFrontに接続すると、[同期](../inline/overview.md)または[非同期](../oob/overview.md)モードでリクエストをブロックすることなくトラフィックを検査できます。

以下の手順に従って接続を設定してください。

1. ご利用のプラットフォーム向けに提供されたコードバンドルをダウンロードしてください。
1. AWS Console → **Services** → **Lambda** → **Functions**に進んでください。
1. `us-east-1` (N. Virginia)リージョンを選択してください。これは[Lambda@Edge関数に必要です](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-how-it-works-tutorial.html#lambda-edge-how-it-works-tutorial-create-function)。
1. 次の設定で**Create function**してください：

    * Runtime: Python 3.x.
    * Execution role: **Create a new role from AWS policy templates** → **Basic Lambda@Edge permissions (for CloudFront trigger)**.
    * その他の設定はデフォルトのままで問題ありません。
1. 関数が作成されたら、**Code**タブでWallarmのリクエスト処理コードを貼り付けてください。
1. コード内の次のパラメータを更新してください：

    * `wlrm_node_addr`: WallarmノードのURLです。
    * `wlrm_inline`: [非同期（アウトオブバンド）](../oob/overview.md)モードを使用する場合は`False`に設定してください。
    * 必要に応じて、他のパラメータも変更してください。
1. **Actions** → **Deploy to Lambda@Edge**に進み、次の設定を指定してください：

    * 新しいCloudFrontトリガーを構成してください。
    * Distribution: 保護したいオリジンにトラフィックをルーティングするCDNです。
    * Cache behavior: Lambda関数に対するキャッシュ動作。通常は`*`です。
    * CloudFront event: 
        
        * **Origin request**: CloudFront CDNがバックエンドにデータを要求する場合にのみ関数を実行します。CDNがキャッシュ済みレスポンスを返す場合、関数は実行されません。
        * **Viewer request**: CloudFront CDNへのすべてのリクエストに対して関数を実行します。
    * **Include body**をチェックしてください。
    * **Confirm deploy to Lambda@Edge**をチェックしてください。
1. Wallarm提供のレスポンス関数についても同じ手順を繰り返し、トリガーとしてレスポンスを選択してください。

    レスポンストリガーがリクエストトリガーに一致することを確認してください（origin requestにはorigin response、viewer requestにはviewer response）。

[詳細](aws-lambda.md)

<style>
  h1#cloudfront-for-wizard {
    display: none;
  }

  .md-footer {
    display: none;
  }

  .md-header {
    display: none;
  }

  .md-content__button {
    display: none;
  }

  .md-main {
    background-color: unset;
  }

  .md-grid {
    margin: unset;
  }

  button.md-top.md-icon {
    display: none;
  }

  .md-consent {
    display: none;
  }
</style>