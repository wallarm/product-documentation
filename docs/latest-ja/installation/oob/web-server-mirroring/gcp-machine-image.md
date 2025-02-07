```markdown
[link-launch-instance]:     https://cloud.google.com/deep-learning-vm/docs/quickstart-marketplace

[img-ssh-key-generation]:       ../../../images/installation-gcp/common/ssh-key-generation.png
[versioning-policy]:            ../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../installation/supported-deployment-options.md
[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../installation/supported-deployment-options.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../../admin-en/configure-parameters-en.md
[autoscaling-docs]:                 ../../../admin-en/installation-guides/google-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../../admin-en/configure-logging.md
[oob-advantages-limitations]:       ../overview.md#limitations
[wallarm-mode]:                     ../../../admin-en/configure-wallarm-mode.md
[wallarm-api-via-proxy]:            ../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[img-grouped-nodes]:                ../../../images/user-guides/nodes/grouped-nodes.png
[cloud-init-spec]:                  ../../cloud-platforms/cloud-init.md
[wallarm_force_directive]:          ../../../admin-en/configure-parameters-en.md#wallarm_force
[web-server-mirroring-examples]:    overview.md#configuration-examples-for-traffic-mirroring
[ip-lists-docs]:                    ../../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../../api-specification-enforcement/overview.md

# GCPマシンイメージからのWallarm OOBのデプロイ

本記事では、[公式マシンイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を使用してGoogle Cloud Platform上に[Wallarm OOB](overview.md)をデプロイする手順を説明します。本ソリューションは、ウェブまたはプロキシサーバがミラーリングしたトラフィックを解析するために設計されています。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. フィルタリングノードをWallarm Cloudに接続

クラウドインスタンスのノードは[cloud-init.py][cloud-init-spec]スクリプトを介してCloudに接続します。このスクリプトは、提供されたトークンを使用してノードをWallarm Cloudに登録し、グローバルにモニタリング[mode][wallarm-mode]に設定し、NGINXの`location /`ブロック内の[`wallarm_force`][wallarm_force_directive]ディレクティブをミラーリングされたトラフィックのコピーのみ解析するように設定します。NGINXの再起動により設定が完了します。

クラウドイメージから作成したインスタンス上で以下のように`cloud-init.py`スクリプトを実行します:

=== "US Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
    ```
=== "EU Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
    ```

* `WALLARM_LABELS='group=<GROUP>'` はノードグループ名を設定します（既存の場合、存在しなければ作成されます）。APIトークンを使用している場合にのみ適用されます。
* `<TOKEN>` はトークンのコピーされた値です。

## 6. Wallarmノードにトラフィックをミラーリングするようウェブまたはプロキシサーバを設定

1. ウェブまたはプロキシサーバ（例:NGINX, Envoy）を設定して、受信トラフィックをWallarmノードにミラーリングします。設定の詳細については、対象のウェブまたはプロキシサーバのドキュメントを参照することを推奨します。

    [web-server-mirroring-examples]内に、最も一般的なウェブおよびプロキシサーバ（NGINX, Traefik, Envoy）の設定例が掲載されています。
1. ノードが配置されているインスタンスの`/etc/nginx/sites-enabled/default`ファイルに、以下の設定を行います:

    ```
    location / {
        include /etc/nginx/presets.d/mirror.conf;
        
        # 222.222.222.22をミラーリングサーバのアドレスに変更
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
    }
    ```

    `set_real_ip_from`および`real_ip_header`ディレクティブは、Wallarm Consoleが攻撃者のIPアドレスを表示するために必要です。[real-ip-docs]を参照してください。

## 7. Wallarmの動作をテスト

--8<-- "../include/waf/installation/cloud-platforms/test-operation-oob.md"

## 8. デプロイされたソリューションの微調整

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"
```