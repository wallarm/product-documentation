[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #2-セキュリティグループの作成
[anchor2]:      #1-AWSでSSHキーペアを作成

[img-create-sg]:                ../../images/installation-ami/common/create_sg.png
[versioning-policy]:            ../../updating-migrating/versioning-policy.ja.md#バージョン一覧
[img-wl-console-users]:         ../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../installation/supported-deployment-options.ja.md
[node-token]:                       ../../quickstart.ja.md#Wallarmフィルタリングノードのデプロイ
[api-token]:                        ../../user-guides/settings/api-tokens.ja.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.ja.md#ノード作成用のAPIとノードトークン
[platform]:                         ../../installation/supported-deployment-options.ja.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.ja.md#パストラバーサル
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../admin-en/configure-parameters-en.ja.md
[autoscaling-docs]:                 ../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.ja.md
[real-ip-docs]:                     ../../admin-en/using-proxy-or-balancer-en.ja.md
[allocate-memory-docs]:             ../../admin-en/configuration-guides/allocate-resources-for-node.ja.md
[limiting-request-processing]:      ../../user-guides/rules/configure-overlimit-res-detection.ja.md
[logs-docs]:                        ../../admin-en/configure-logging.ja.md
[oob-advantages-limitations]:       ../oob/overview.ja.md#利点と制限事項
[wallarm-mode]:                     ../../admin-en/configure-wallarm-mode.ja.md
[oob-docs]:                         ../oob/overview.ja.md
[wallarm-api-via-proxy]:            ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.ja.md
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.ja.md#トラフィックミラーリングのWebサーバー設定の事例
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png

--8<-- "../include/waf/installation/cloud-platforms/article-for-inline-oob-ami.ja.md"
