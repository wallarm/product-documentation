Wallarmノードがミラーリングされたトラフィックを処理するためには、次の設定を行ってください:

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#222.222.222.22をミラーリングサーバーのアドレスに変更します
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* [`real_ip_header`](../../using-proxy-or-balancer-en.md) 指令は、攻撃者のIPアドレスをWallarmコンソールに表示するために必要です。
* `wallarm_force_response_*`指令は、ミラーリングされたトラフィックから受信したコピーリクエスト以外のすべてのリクエストの分析を無効化するために必要です。
* 悪意のあるリクエストは[ブロックすることができない](overview.md#limitations-of-mirrored-traffic-filtration)ため、Wallarmノードは常に、`wallarm_mode`指令やWallarm Cloudが安全または通常のブロックモードに設定していても（オフに設定されているモードを除く）、監視[モード](../../configure-wallarm-mode.md)でリクエストを分析します。

ミラーリングされたトラフィックの処理は、NGINXベースのノードのみがサポートしています。以下のように提供された設定を設定できます:

* DEB/RPMパッケージからノードをインストールする場合 - `/etc/nginx/conf.d/default.conf` NGINX設定ファイル内。
* [AWS](../../installation-ami-en.md)または[GCP](../../installation-gcp-en.md)クラウドイメージからノードをデプロイする場合 - `/etc/nginx/nginx.conf` NGINX設定ファイル内。
* [Dockerイメージ](../../installation-docker-en.md)からノードをデプロイする場合 - コンテナに提供された設定のファイルをマウントします。
* ノードを[Sidecar proxy](../../../installation/kubernetes/sidecar-proxy/deployment.md)または[Ingress controller](../../installation-kubernetes-en.md)として実行する場合 - ConfigMapをポッドにマウントします。