# 侵害されたトークンでのリクエストのブロック

Wallarm API Firewallは、漏洩した認証トークンの使用を防ぐ機能を提供しています。このガイドでは、[REST API](../installation-guides/docker-container.md) または [GraphQL API](../installation-guides/graphql/docker-container.md) 用のAPI Firewall Dockerコンテナを使用してこの機能を有効にする方法を概説します。

この機能は、侵害されたトークンに関するあなたが提供したデータに依存しています。これをアクティブにするには、これらのトークンが含まれる.txtファイルをファイアウォールDockerコンテナにマウントし、対応する環境変数を設定してください。この機能についてより詳しく知るには、[こちらのブログ記事](https://lab.wallarm.com/oss-api-firewall-unveils-new-feature-blacklist-for-compromised-api-tokens-and-cookies/)をお読みください。

REST APIの場合、フラグが立てられたトークンがリクエストに現れた場合、API Firewallは[`APIFW_CUSTOM_BLOCK_STATUS_CODE`](../installation-guides/docker-container.md#apifw-custom-block-status-code) 環境変数で指定されたステータスコードを使用して応答します。GraphQL APIの場合、フラグが立てられたトークンが含まれるリクエストは、マウントされたスキーマに合致していても、ブロックされます。

デナイリスト機能を有効にするには:

1. 侵害されたトークンが含まれる.txtファイルを作成します。各トークンは新しい行にする必要があります。例は以下の通りです:

    ```txt
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODIifQ.CUq8iJ_LUzQMfDTvArpz6jUyK0Qyn7jZ9WCqE0xKTCA
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODMifQ.BinZ4AcJp_SQz-iFfgKOKPz_jWjEgiVTb9cS8PP4BI0
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODQifQ.j5Iea7KGm7GqjMGBuEZc2akTIoByUaQc5SSX7w_qjY8
    ```
1. 作成したデナイリストファイルをファイアウォールDockerコンテナにマウントします。例えば、`docker-compose.yaml`に以下の修正を加えます:

    ```diff
    ...
        volumes:
          - <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>
    +     - <HOST_PATH_TO_LEAKED_TOKEN_FILE>:<CONTAINER_PATH_TO_LEAKED_TOKEN_FILE>
    ...
    ```
1. Dockerコンテナを起動するときに、以下の環境変数を入力します:

| 環境変数 | 説明 |
| -------------------- | ----------- |
| `APIFW_DENYLIST_TOKENS_FILE` | コンテナ内でマウントされたデナイリストファイルへのパス。例: `/auth-data/tokens-denylist.txt`。 |
| `APIFW_DENYLIST_TOKENS_COOKIE_NAME` | 認証トークンを運ぶCookieの名前。 |
| `APIFW_DENYLIST_TOKENS_HEADER_NAME` | 認証トークンを伝達するヘッダーの名前。`APIFW_DENYLIST_TOKENS_COOKIE_NAME`および`APIFW_DENYLIST_TOKENS_HEADER_NAME`の両方が指定されている場合、API Firewallはこれらを順にチェックします。 |
| `APIFW_DENYLIST_TOKENS_TRIM_BEARER_PREFIX` | デナイリストとの比較中に認証ヘッダーから`Bearer`プレフィックスを取り除くべきかどうかを示します。デナイリスト内のトークンにこのプレフィックスがないが、認証ヘッダーにはこのプレフィックスがある場合、トークンが正しく一致しないかもしれません。`true`または`false`（デフォルト）を受け付けます。 |