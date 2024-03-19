[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #2-セキュリティグループの作成
[anchor2]:      #1-AWSのSSHキーのペアの作成

[img-create-sg]:                ../../../../images/installation-ami/common/create_sg.png
[versioning-policy]:            ../../../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../../installation/supported-deployment-options.md
[node-token]:                   ../../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                    ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:          ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                     ../../../../installation/supported-deployment-options.md
[ptrav-attack-docs]:            ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:          ../../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:     ../../../../admin-en/configure-parameters-en.md
[autoscaling-docs]:             ../../../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md
[real-ip-docs]:                 ../../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:         ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:  ../../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                    ../../../../admin-en/configure-logging.md
[wallarm-mode]:                 ../../../../admin-en/configure-wallarm-mode.md
[wallarm-api-via-proxy]:        ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[img-grouped-nodes]:            ../../../../images/user-guides/nodes/grouped-nodes.png

# Amazon Machine ImageからWallarmのデプロイ

この記事では、[公式Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD)を使用して、AWS線形にWallarmをデプロイするための指示を提供します。

<!-- ???
すべての地域がサポートされていることを述べます -->

--8<-- "../include-ja/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.md"

## 6. Wallarmにトラフィックの分析を許可する

--8<-- "../include-ja/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis-inline.md"

## 7. NGINXの再起動

--8<-- "../include-ja/waf/installation/cloud-platforms/restart-nginx.md"

## 8. トラフィックをWallarmインスタンスに送信する設定

--8<-- "../include-ja/waf/installation/sending-traffic-to-node-inline.md"

## 9. Wallarmの操作のテスト

--8<-- "../include-ja/waf/installation/cloud-platforms/test-operation-inline.md"

## 10. デプロイされたソリューションの微調整

--8<-- "../include-ja/waf/installation/cloud-platforms/fine-tuning-options.md"