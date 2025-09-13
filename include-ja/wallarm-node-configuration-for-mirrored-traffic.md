Wallarmノードがミラーリングされたトラフィックを処理できるように、次の設定を行います:

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#ミラーリングサーバーのアドレスに222.222.222.22を置き換えます
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* [`real_ip_header`](../../using-proxy-or-balancer-en.md)ディレクティブは、Wallarm Consoleに攻撃元のIPアドレスを表示するために必要です。
* `wallarm_force_response_*`ディレクティブは、ミラーリングされたトラフィックから受信したコピー以外のすべてのリクエストの解析を無効にするために必要です。
* 悪意のあるリクエストは[ブロックできない](overview.md#limitations-of-mirrored-traffic-filtration)ため、`wallarm_mode`ディレクティブまたはWallarm Cloudが安全または通常のブロッキングモード（offに設定されたモードを除く）を設定している場合でも、Wallarmノードは常にモニタリング[モード](../../configure-wallarm-mode.md)でリクエストを解析します。

ミラーリングされたトラフィックの処理はNGINXベースのノードでのみサポートされます。次のとおり設定します:

* ノードをオールインワンインストーラ、[AWS](../../installation-ami-en.md)または[GCP](../../installation-gcp-en.md)のクラウドイメージからデプロイする場合 - '/etc/nginx/nginx.conf'のNGINX構成ファイルに設定します。
* ノードを[Dockerイメージ](../../installation-docker-en.md)からデプロイする場合 - この設定を記述したファイルをコンテナにマウントします。
* ノードを[Sidecar](../../../installation/kubernetes/sidecar-proxy/deployment.md)または[Ingressコントローラ](../../installation-kubernetes-en.md)として実行する場合 - この設定を含むConfigMapをpodにマウントします。