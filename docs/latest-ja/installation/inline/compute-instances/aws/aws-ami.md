``` markdown
[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #2-create-a-security-group
[anchor2]:      #1-create-a-pair-of-ssh-keys-in-aws

[img-create-sg]:                ../../../../images/installation-ami/common/create_sg.png
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
[autoscaling-docs]:                 ../../../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md
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
[link-wallarm-health-check]:        ../../../../admin-en/uat-checklist-en.md

# Amazon Machine ImageからWallarmをデプロイする

本記事では、[公式Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD)を使用してAWS上にWallarmをデプロイする手順について説明します。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. インスタンスをWallarm Cloudに接続する

クラウドインスタンスのノードは[cloud-init.py][cloud-init-spec]スクリプトを介してCloudに接続します。このスクリプトは、提供されたトークンを使用してノードをWallarm Cloudに登録し、グローバルに監視[mode][wallarm-mode]を設定し、`--proxy-pass`フラグに基づいてノードが正当なトラフィックを転送するように設定します。NGINXの再起動によってセットアップが完了します。

クラウドイメージから作成したインスタンス上で`cloud-init.py`スクリプトを次のように実行します。

=== "USクラウド"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
    ```
=== "EUクラウド"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
    ```

* `WALLARM_LABELS='group=<GROUP>'`はノードグループ名を設定します（既存の場合はそのまま、存在しない場合は新規作成されます）。これはAPIトークンを使用している場合にのみ適用されます。
* `<TOKEN>`はトークンのコピーされた値です。
* `<PROXY_ADDRESS>`はWallarmノードが正当なトラフィックをプロキシする先のアドレスです。アーキテクチャに応じて、これはアプリケーションインスタンスのIP、ロードバランサ、またはDNS名などの場合があります。

## 7. Wallarmインスタンスへのトラフィック送信の設定

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 8. Wallarmの動作のテスト

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. デプロイしたソリューションの微調整

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"
```