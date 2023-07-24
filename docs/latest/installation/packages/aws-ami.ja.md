[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #2-セキュリティグループの作成
[anchor2]:      #1-AWSでSSHキーペアを作成

[img-create-sg]:                ../../images/installation-ami/common/create_sg.png
[versioning-policy]:            ../../updating-migrating/versioning-policy.md#バージョン一覧
[img-wl-console-users]:         ../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../installation/supported-deployment-options.md
[node-token]:                       ../../quickstart.md#Wallarmフィルタリングノードのデプロイ
[api-token]:                        ../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#ノード作成用のAPIとノードトークン
[platform]:                         ../../installation/supported-deployment-options.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#パストラバーサル
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../admin-et/configure-parameters-jp.md
[autoscaling-docs]:                 ../../admin-jp/installation-guides/amazon-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../admin-jp/using-proxy-or-balancer-jp.md
[allocate-memory-docs]:             ../../admin-jp/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../admin-jp/configure-logging.md
[oob-advantages-limitations]:       ../oob/overview.md#利点と制限事項
[wallarm-mode]:                     ../../admin-jp/configure-wallarm-mode.md
[oob-docs]:                         ../oob/overview.md
[wallarm-api-via-proxy]:            ../../admin-jp/configuration-guides/access-to-wallarm-api-via-proxy.md
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#トラフィックミラーリングのWebサーバー設定の事例
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png

--8<-- "../include/waf/installation/cloud-platforms/article-for-inline-oob-ami.md"
