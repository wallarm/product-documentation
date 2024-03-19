# SSL/TLS 設定

このガイドでは、API ファイアウォールと保護されたアプリケーション間の SSL/TLS 接続を構成するための環境変数の設定方法について説明します。また、API ファイアウォール サーバー自体のための設定方法も説明します。これらの変数は、[REST API](../installation-guides/docker-container.md) または [GraphQL API](../installation-guides/graphql/docker-container.md) の API ファイアウォール Docker コンテナを起動する際に提供します。

## API ファイアウォールとアプリケーション間のセキュアな SSL/TLS 接続

API ファイアウォールと保護されたアプリケーションのサーバー間にセキュアな接続を確立するために、カスタム CA 証明書を使用して、以下の環境変数を利用します：

1. カスタム CA 証明書を API ファイアウォールコンテナにマウントします。例えば、`docker-compose.yaml`で以下の変更を行います：

    ```diff
    ...
        volumes:
          - <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>
    +     - <HOST_PATH_TO_CA>:<CONTAINER_PATH_TO_CA>
    ...
    ```
1. 以下の環境変数を使用して、マウントされたファイルパスを提供します：

| 環境変数 | 説明 |
| -------------------- | ----------- |
| `APIFW_SERVER_ROOT_CA`<br>(`APIFW_SERVER_INSECURE_CONNECTION` の値が `false` の場合のみ) | Docker コンテナ内の保護されたアプリケーションサーバの CA 証明書へのパス。 |

## API ファイアウォールとアプリケーション間のセキュアでない接続

API ファイアウォールと保護されたアプリケーションのサーバー間のセキュアでない接続（つまり、SSL/TLS 検証をバイパスする）を設定するには、この環境変数を使用します：

| 環境変数 | 説明 |
| -------------------- | ----------- |
| `APIFW_SERVER_INSECURE_CONNECTION` | 保護されたアプリケーションサーバの SSL/TLS 証明書の検証を無効にすべきかどうかを決定します。サーバーアドレスは `APIFW_SERVER_URL` 変数で示されます。デフォルト（`false`）は、システムがデフォルトの CA 証明書または `APIFW_SERVER_ROOT_CA` で指定された証明書を使用してセキュアな接続を試みます。 |

## API ファイアウォールサーバーの SSL/TLS

API ファイアウォールを実行しているサーバーが HTTPS 接続を受け入れるようにするには、以下の手順に従います：

1. 証明書とプライベートキーのディレクトリを API ファイアウォール コンテナにマウントします。例えば、`docker-compose.yaml`で以下の変更を行います：

    ```diff
    ...
        volumes:
          - <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>
    +     - <HOST_PATH_TO_CERT_DIR>:<CONTAINER_PATH_TO_CERT_DIR>
    ...
    ```
1. 以下の環境変数を使用して、マウントされたファイルパスを提供します：

| 環境変数 | 説明 |
| -------------------- | ----------- |
| `APIFW_TLS_CERTS_PATH`            | API ファイアウォールの証明書とプライベートキーがマウントされているディレクトリへのコンテナ内のパス。 |
| `APIFW_TLS_CERT_FILE`             | `APIFW_TLS_CERTS_PATH` ディレクトリ内にある API ファイアウォールの SSL/TLS 証明書のファイル名。 |
| `APIFW_TLS_CERT_KEY`              | `APIFW_TLS_CERTS_PATH` ディレクトリにある API ファイアウォールの SSL/TLS プライベートキーのファイル名。 |