Wallarmノードがミラーリングされたトラフィックを処理するために、以下の設定を行ってください。

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#ミラーリングサーバーのアドレスを222.222.222.22に変更します
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* [`real_ip_header`](../../using-proxy-or-balancer-en.ja.md) ディレクティブは、Wallarmコンソールに攻撃者のIPアドレスを表示するために必要です。
* `wallarm_force_response_*` ディレクティブは、ミラーリングされたトラフィックから受信したコピーを除いて、すべてのリクエストの解析を無効にする必要があります。
* 悪意のあるリクエストは[ブロックできない](overview.ja.md#limitations-of-mirrored-traffic-filtration)ため、Wallarmノードは `wallarm_mode` ディレクティブやWallarm Cloudが安全または通常のブロックモードを設定している場合でも、監視[モード](../../configure-wallarm-mode.ja.md)で常にリクエストを解析します（オフに設定されたモードを除く）。

ミラーリングされたトラフィックの処理は、NGINXベースのノードでのみサポートされています。 提供された設定は以下のように設定できます。

* [DEB/RPMパッケージ](../../installation-nginx-overview.ja.md)からノードをインストールする場合 - `/etc/nginx/conf.d/default.conf` NGINX設定ファイルに。
* [AWS](../../installation-ami-en.ja.md) や [GCP](../../installation-gcp-en.ja.md) のクラウドイメージからノードをデプロイする場合 - `/etc/nginx/nginx.conf` NGINX設定ファイルに。
* [Dockerイメージ](../../installation-docker-en.ja.md)からノードをデプロイする場合 - 設定が提供されたファイルをコンテナにマウントします。
* ノードを [Sidecar proxy](../../../installation/kubernetes/sidecar-proxy/deployment.ja.md) または [Ingress controller](../../installation-kubernetes-en.ja.md) として実行する場合 - 提供された設定を含むConfigMapをポッドにマウントします。