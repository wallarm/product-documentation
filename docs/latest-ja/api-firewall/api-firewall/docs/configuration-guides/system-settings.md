# システム設定

システムAPI Firewallの設定を細かく調整するには、次のオプション環境変数を使用します：

| 環境変数 | 説明 |
| -------------------- | ----------- |
| `APIFW_READ_TIMEOUT`              | アプリケーションURLに送信されたフルリクエスト（ボディ含む）をAPI Firewallが読み取るまでのタイムアウトです。デフォルト値は `5s` です。                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `APIFW_WRITE_TIMEOUT`             | アプリケーションURLに送信されたリクエストへの応答をAPI Firewallが返すまでのタイムアウトです。デフォルト値は `5s` です。                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `APIFW_SERVER_MAX_CONNS_PER_HOST` | API Firewallが同時に処理できる最大接続数です。デフォルト値は `512` です。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `APIFW_SERVER_READ_TIMEOUT`       | アプリケーションによってリクエストに対して返されたフルレスポンス（ボディ含む）をAPI Firewallが読み取るまでのタイムアウトです。デフォルト値は `5s` です。                                                                                                                                                                                                                                                                                                                                                                                                                |
| `APIFW_SERVER_WRITE_TIMEOUT`      | アプリケーションに対してフルリクエスト（ボディ含む）をAPI Firewallが書き込むまでのタイムアウトです。デフォルト値は `5s` です。                                                                                                                                                                                                                                                                                                                                                                                                             |
| `APIFW_SERVER_DIAL_TIMEOUT`       | API Firewallがアプリケーションに接続するまでのタイムアウトです。デフォルト値は `200ms` です。                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `APIFW_SERVER_CLIENT_POOL_CAPACITY`       | fasthttpクライアントの最大数です。デフォルト値は `1000` です。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `APIFW_HEALTH_HOST`       | ヘルスチェックサービスのホストです。デフォルト値は `0.0.0.0:9667` です。生存確認サービスパスは `/v1/liveness` 、準備完了サービスパスは `/v1/readiness` です。                                                                                                                                                                                                                                                                                                                                                                                                                                              |