Wallarmノードがミラーされたトラフィックを処理できるように、次の構成を設定します:

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#ミラーリングサーバーのアドレスに222.222.222.22を変更します
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursiveをonに設定
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* Wallarm Consoleが攻撃者のIPアドレスを表示するために、[`real_ip_header`](../../using-proxy-or-balancer-en.md)ディレクティブが必要です。
* ミラーされたトラフィックから受信したコピー以外のすべてのリクエストの解析を無効化するために、`wallarm_force_response_*`ディレクティブが必要です。
* 悪意のあるリクエストは[ブロックできない](overview.md#limitations-of-mirrored-traffic-filtration)ため、`wallarm_mode`ディレクティブまたはWallarm Cloudがセーフまたは通常のブロッキングモードを設定しても（オフに設定されたモードを除き）、Wallarmノードは常に監視[モード](../../configure-wallarm-mode.md)でリクエストを解析します。

ミラーされたトラフィックの処理は、NGINXベースのノードのみがサポートします。提供された構成は次の方法で設定できます:

* ノードをDEB/RPMパッケージからインストールする場合は、NGINX構成ファイル`/etc/nginx/conf.d/default.conf`に設定します。
* ノードを[AWS](../../installation-ami-en.md)または[GCP](../../installation-gcp-en.md)クラウドイメージからデプロイする場合は、NGINX構成ファイル`/etc/nginx/nginx.conf`に設定します。
* ノードを[Docker image](../../installation-docker-en.md)からデプロイする場合は、提供された構成ファイルをコンテナにマウントします。
* ノードを[Ingress controller](../../installation-kubernetes-en.md)として実行する場合は、提供された構成を含むConfigMapをポッドにマウントします。