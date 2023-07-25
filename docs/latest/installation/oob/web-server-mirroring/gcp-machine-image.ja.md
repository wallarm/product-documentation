[link-launch-instance]:     https://cloud.google.com/deep-learning-vm/docs/quickstart-marketplace

[img-ssh-key-generation]:       ../../../images/installation-gcp/common/ssh-key-generation.png
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
[autoscaling-docs]:                 ../../../admin-en/installation-guides/google-cloud/autoscaling-overview.ja.md
[real-ip-docs]:                     ../../../admin-en/using-proxy-or-balancer-en.ja.md
[allocate-memory-docs]:             ../../../admin-en/configuration-guides/allocate-resources-for-node.ja.md
[limiting-request-processing]:      ../../../user-guides/rules/configure-overlimit-res-detection.ja.md
[logs-docs]:                        ../../../admin-en/configure-logging.ja.md
[oob-advantages-limitations]:       ../overview.ja.md#advantages-and-limitations
[wallarm-mode]:                     ../../../admin-en/configure-wallarm-mode.ja.md
[wallarm-api-via-proxy]:            ../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.ja.md
[img-grouped-nodes]:                ../../../images/user-guides/nodes/grouped-nodes.png

# GCPマシンイメージからWallarm OOBをデプロイする

この記事では、[公式マシンイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を使用して、GCP上の[Wallarm OOB](overview.ja.md)をデプロイするための手順を提供します。ここで説明されているソリューションは、ウェブサーバまたはプロキシサーバによってミラーリングされたトラフィックを分析するために設計されています。

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.ja.md"

## 5. Wallarmがミラーリングされたトラフィックを分析できるようにする

--8<-- "../include/waf/installation/oob/steps-for-mirroring-cloud.ja.md"

## 6. NGINXを再起動する

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.ja.md"

## 7. ウェブサーバまたはプロキシサーバを設定し、そのトラフィックをWallarmノードにミラーリングする

ウェブサーバまたはサーバ（例：NGINX、Envoy）を設定して、インカムトラフィックをWallarmノードにミラーリングします。設定の詳細については、ウェブサーバまたはプロキシサーバのドキュメンテーションを参照することをお勧めします。

この[リンク](overview.ja.md#examples-of-web-server-configuration-for-traffic-mirroring)の中には、最も人気のあるウェブサーバとプロキシサーバ（NGINX、Traefik、Envoy）の設定例があります。

## 8. Wallarmの操作をテストする

--8<-- "../include/waf/installation/cloud-platforms/test-operation-oob.ja.md"

## 9. デプロイされたソリューションの微調整

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.ja.md"