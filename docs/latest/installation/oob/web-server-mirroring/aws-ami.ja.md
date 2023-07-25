[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #2-セキュリティ-グループを作る
[anchor2]:      #1-awsでsshキーペアを作成する

[img-create-sg]:                ../../../images/installation-ami/common/create_sg.png
[versioning-policy]:            ../../../updating-migrating/versioning-policy.ja.md#version-list
[img-wl-console-users]:         ../../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../../installation/supported-deployment-options.ja.md
[node-token]:                       ../../../quickstart.ja.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.ja.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.ja.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../installation/supported-deployment-options.ja.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.ja.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../../admin-en/configure-parameters-en.ja.md
[autoscaling-docs]:                 ../../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.ja.md
[real-ip-docs]:                     ../../../admin-en/using-proxy-or-balancer-en.ja.md
[allocate-memory-docs]:             ../../../admin-en/configuration-guides/allocate-resources-for-node.ja.md
[limiting-request-processing]:      ../../../user-guides/rules/configure-overlimit-res-detection.ja.md
[logs-docs]:                        ../../../admin-en/configure-logging.ja.md
[oob-advantages-limitations]:       ../overview.ja.md#advantages-and-limitations
[wallarm-mode]:                     ../../../admin-en/configure-wallarm-mode.ja.md
[wallarm-api-via-proxy]:            ../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.ja.md
[img-grouped-nodes]:                ../../../images/user-guides/nodes/grouped-nodes.png

# Amazon ImageからWallarm OOBをデプロイする

この記事では、[公式のAmazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD)を使用してAWS上で[Wallarm OOB](overview.ja.md)をデプロイするための手順を提供します。ここで説明されているソリューションは、ウェブサーバーまたはプロキシサーバーからミラーリングされたトラフィックを分析するように設計されています。

<!-- ???
指す全ての地域がサポートできます -->

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.ja.md"

## 6. Wallarmにミラーリングされたトラフィックの分析を許可する

--8<-- "../include/waf/installation/oob/steps-for-mirroring-cloud.ja.md"

## 7. NGINXの再起動

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.ja.md"

## 8. あなたのウェブまたはプロキシサーバーをWallarmノードにトラフィックをミラーリングするように設定します

あなたのウェブまたはプロキシサーバー（例えば、NGINX、Envoy）を、受信トラフィックをWallarmノードにミラーリングするように設定します。設定の詳細については、あなたのウェブまたはプロキシサーバーのドキュメンテーションを参照することをお勧めします。

[リンク](overview.ja.md#examples-of-web-server-configuration-for-traffic-mirroring)の中では、最も人気のあるウェブ・プロキシサーバー（NGINX、Traefik、Envoy）の構成例が見つけることができます。

## 9. Wallarmの動作テスト

--8<-- "../include/waf/installation/cloud-platforms/test-operation-oob.ja.md"

## 10. デプロイしたソリューションの微調整

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.ja.md"