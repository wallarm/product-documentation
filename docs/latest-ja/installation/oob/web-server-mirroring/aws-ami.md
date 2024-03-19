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
[node-token]:                       ../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
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
[oob-advantages-limitations]:       ../overview.md#advantages-and-limitations
[wallarm-mode]:                     ../../../admin-en/configure-wallarm-mode.md
[wallarm-api-via-proxy]:            ../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[img-grouped-nodes]:                ../../../images/user-guides/nodes/grouped-nodes.png

# AmazonイメージからWallarm OOBをデプロイ

この記事では、[Wallarm OOB](overview.md)を[AWS公式のAmazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD)を利用してAWSにデプロイする方法を提供します。 ここで説明されているソリューションは、ウェブサーバーやプロキシサーバーによってミラーリングされたトラフィックの分析を目指して設計されています。

<!-- ???
すべての地域がサポートされています -->

--8<-- "../include-ja/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.md"

## 6. Wallarmにミラーリングトラフィックの分析を許可

--8<-- "../include-ja/waf/installation/oob/steps-for-mirroring-cloud.md"

## 7. NGINXを再起動

--8<-- "../include-ja/waf/installation/cloud-platforms/restart-nginx.md"

## 8. Wおためのェブサーバーまたはプロキシサーバーを設定して、Wallarmノードにトラフィックをミラーリング

ウェブまたはプロキシサーバー（例：NGINX、Envoy）を設定して、インカムトラフィックをWallarmノードにミラーリングします。設定の詳細については、ウェブまたはプロキシサーバーのマニュアルを参照することを推奨します。

[link](overview.md#examples-of-web-server-configuration-for-traffic-mirroring)の中には、最も一般的なウェブとプロキシサーバー（NGINX、Traefik、Envoy）のサンプル設定が見つかります。

## 9. Wallarmの動作をテスト

--8<-- "../include-ja/waf/installation/cloud-platforms/test-operation-oob.md"

## 10. デプロイしたソリューションの微調整

--8<-- "../include-ja/waf/installation/cloud-platforms/fine-tuning-options.md"