[link-launch-instance]:     https://cloud.google.com/deep-learning-vm/docs/quickstart-marketplace

[img-ssh-key-generation]:       ../../../images/installation-gcp/common/ssh-key-generation.png
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
[autoscaling-docs]:                 ../../../admin-en/installation-guides/google-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../../admin-en/configure-logging.md
[oob-advantages-limitations]:       ../overview.md#advantages-and-limitations
[wallarm-mode]:                     ../../../admin-en/configure-wallarm-mode.md
[wallarm-api-via-proxy]:            ../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[img-grouped-nodes]:                ../../../images/user-guides/nodes/grouped-nodes.png

# GCPマシンイメージからWallarm OOBをデプロイする

この記事では、 [公式マシンイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を使用してGCPに[Wallarm OOB](overview.md)をデプロイする方法を説明します。ここで説明するソリューションは、ウェブサーバーやプロキシサーバーによってミラーリングされたトラフィックを分析するために設計されています。

--8<-- "../include-ja/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. Wallarmにミラーリングされたトラフィックの分析を有効にする

--8<-- "../include-ja/waf/installation/oob/steps-for-mirroring-cloud.md"

## 6. NGINXを再起動する

--8<-- "../include-ja/waf/installation/cloud-platforms/restart-nginx.md"

## 7. 自分のウェブサーバーやプロキシサーバーを設定して、トラフィックをWallarmノードにミラーリングする

あなたのウェブまたはサーバー（例：NGINX、Envoy）を設定し、着信トラフィックをWallarmノードにミラーリングします。設定の詳細については、あなたのウェブサーバーまたはプロキシサーバーのドキュメンテーションを参照することをお勧めします。

[リンク](overview.md#examples-of-web-server-configuration-for-traffic-mirroring)の中には、最も人気のあるウェブおよびプロキシサーバー（NGINX、Traefik、Envoy）の設定例があります。

## 8. Wallarmの動作をテストする

--8<-- "../include-ja/waf/installation/cloud-platforms/test-operation-oob.md"

## 9. デプロイしたソリューションの微調整

--8<-- "../include-ja/waf/installation/cloud-platforms/fine-tuning-options.md"