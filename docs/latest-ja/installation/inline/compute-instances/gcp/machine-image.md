```markdown
[link-launch-instance]:     https://cloud.google.com/deep-learning-vm/docs/quickstart-marketplace

[img-ssh-key-generation]:       ../../../../images/installation-gcp/common/ssh-key-generation.png
[versioning-policy]:            ../../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../../installation/supported-deployment-options.md
[node-token]:                       ../../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../../installation/supported-deployment-options.md
[ptrav-attack-docs]:                ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../../../admin-en/configure-parameters-en.md
[autoscaling-docs]:                 ../../../../admin-en/installation-guides/google-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../../../admin-en/configure-logging.md
[wallarm-mode]:                     ../../../../admin-en/configure-wallarm-mode.md
[wallarm-api-via-proxy]:            ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png
[cloud-init-spec]:                  ../../../cloud-platforms/cloud-init.md
[wallarm_force_directive]:          ../../../../admin-en/configure-parameters-en.md#wallarm_force
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../../../api-specification-enforcement/overview.md

# GCPマシンイメージからWallarmのデプロイ

本記事では[公式マシンイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を使用してGCP上にWallarmをデプロイする手順について説明します。

## 利用ケース

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. フィルタリングノードをWallarm Cloudに接続

クラウドインスタンスのノードは[cloud-init.py][cloud-init-spec]スクリプトを介してCloudに接続します。このスクリプトは、提供されたトークンを使用してノードをWallarm Cloudに登録し、グローバルにモニタリングの[mode][wallarm-mode]に設定し、`--proxy-pass`フラグに基づいて正当なトラフィックを転送するようにノードを構成します。NGINXの再起動によりセットアップが完了します。

クラウドイメージから作成されたインスタンス上で`cloud-init.py`スクリプトを次のように実行します：

=== "USクラウド"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
    ```
=== "EUクラウド"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
    ```

* `WALLARM_LABELS='group=<GROUP>'`は、ノードグループ名を設定します（既存の場合はそのグループが使用され、存在しない場合は作成されます）。これはAPIトークン使用時にのみ適用されます。
* `<TOKEN>`はトークンのコピーされた値です。
* `<PROXY_ADDRESS>`は、Wallarmノードが正当なトラフィックを中継する宛先のアドレスです。アーキテクチャによっては、アプリケーションインスタンスのIP、ロードバランサ、DNS名などが該当します。

## 6. Wallarmインスタンスへのトラフィック送信の設定

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 7. Wallarm動作のテスト

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 8. デプロイ済みソリューションの微調整

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"
```