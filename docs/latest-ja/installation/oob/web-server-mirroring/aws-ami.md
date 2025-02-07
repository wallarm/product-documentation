```markdown
[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #2-create-a-security-group
[anchor2]:      #1-create-a-pair-of-ssh-keys-in-aws

[img-create-sg]:                ../../../images/installation-ami/common/create_sg.png
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
[autoscaling-docs]:                 ../../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md
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

# AmazonイメージからWallarm OOBをデプロイする

本記事では、[公式Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD)を使用してAWS上に[Wallarm OOB](overview.md)をデプロイする手順について説明します。本ソリューションは、Webサーバまたはプロキシサーバによってミラーリングされたトラフィックを解析するために設計されています。

## 利用ケース

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. インスタンスをWallarm Cloudに接続する

クラウドインスタンスのノードは、[cloud-init.py][cloud-init-spec]スクリプトを使用してCloudに接続します。このスクリプトは、指定されたトークンを用いてノードをWallarm Cloudに登録し、監視[mode][wallarm-mode]にグローバル設定し、 NGINGX の`location /`ブロック内に[`wallarm_force`][wallarm_force_directive]ディレクティブを設定してミラーリングされたトラフィックのコピーのみを解析するようにします。NGINXの再起動により、セットアップが完了します。

クラウドイメージから作成したインスタンス上で`cloud-init.py`スクリプトを以下のように実行します:

=== "US Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
    ```
=== "EU Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
    ```

* `WALLARM_LABELS='group=<GROUP>'`は、ノードグループ名を設定します（既存の場合はそのまま、存在しなければ作成されます）。APIトークンを使用している場合にのみ適用されます。
* `<TOKEN>`はコピーしたトークンの値です。

## 7. WebサーバまたはプロキシサーバでWallarmノードへのトラフィックミラーリングを設定する

1. Webサーバまたはプロキシサーバ（例: NGINX、Envoy）に対して、受信トラフィックをWallarmノードにミラーリングするよう設定します。設定の詳細については、それぞれのWebサーバまたはプロキシサーバのドキュメントを参照することを推奨します。

    [link][web-server-mirroring-examples]内に、最も一般的なWebサーバおよびプロキシサーバ（NGINX、Traefik、Envoy）の設定例が記載されています。
1. ノードを持つインスタンスの`/etc/nginx/sites-enabled/default`ファイル内に、次の設定を記述します:

    ```
    location / {
        include /etc/nginx/presets.d/mirror.conf;
        
        # 222.222.222.22をミラーリングサーバのアドレスに変更してください
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
    }
    ```

    `set_real_ip_from`および`real_ip_header`ディレクティブは、Wallarm Consoleが攻撃者のIPアドレスを[表示する][real-ip-docs]ために必要です。

## 8. Wallarmの動作をテストする

--8<-- "../include/waf/installation/cloud-platforms/test-operation-oob.md"

## 9. デプロイしたソリューションの微調整

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"
```