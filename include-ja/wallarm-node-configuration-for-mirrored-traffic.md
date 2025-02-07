Wallarmノードがミラーされたトラフィックを処理できるようにするには、次の設定を行います:

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#222.222.222.22をミラーリングサーバのアドレスに変更します
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* [`real_ip_header`](../../using-proxy-or-balancer-en.md)ディレクティブは、Wallarm Consoleが攻撃者のIPアドレスを表示するために必要です。
* `wallarm_force_response_*`ディレクティブは、ミラーされたトラフィックから受信したコピー以外のすべてのリクエストの解析を無効化するために必要です。
* 悪意あるリクエストは[ブロックできない](overview.md#limitations-of-mirrored-traffic-filtration)ため、`wallarm_mode`ディレクティブやWallarm Cloudがセーフモードまたは通常のブロックモード（オフに設定されたモードを除く）を指定していても、Wallarmノードは常に[モニタリングモード](../../configure-wallarm-mode.md)でリクエストを解析します。

ミラーされたトラフィックの処理は、NGINXベースのノードのみサポートされます。提供された設定は次のように設定できます:

* オールインワンインストーラー、[AWS](../../installation-ami-en.md)または[GCP](../../installation-gcp-en.md)のクラウドイメージからノードをデプロイする場合は、`/etc/nginx/nginx.conf`のNGINX設定ファイル内に設定します。
* [Dockerイメージ](../../installation-docker-en.md)からノードをデプロイする場合は、提供された設定ファイルをコンテナにマウントします。
* ノードを[Sidecar](../../../installation/kubernetes/sidecar-proxy/deployment.md)または[Ingress controller](../../installation-kubernetes-en.md)として実行する場合は、提供された設定を含むConfigMapをポッドにマウントします。