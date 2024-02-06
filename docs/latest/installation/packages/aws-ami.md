[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #2-create-a-security-group
[anchor2]:      #1-create-a-pair-of-ssh-keys-in-aws

[img-create-sg]:                ../../images/installation-ami/common/create_sg.png
[versioning-policy]:            ../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../installation/supported-deployment-options.md
[node-token]:                       ../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../installation/supported-deployment-options.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../admin-en/configure-parameters-en.md
[autoscaling-docs]:                 ../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../admin-en/configure-logging.md
[oob-advantages-limitations]:       ../oob/overview.md#advantages-and-limitations
[wallarm-mode]:                     ../../admin-en/configure-wallarm-mode.md
[inline-docs]:                      ../inline/overview.md
[oob-docs]:                         ../oob/overview.md
[wallarm-api-via-proxy]:            ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png
[cloud-init-spec]:                  ../cloud-platforms/cloud-init.md
[wallarm_force_directive]:          ../../admin-en/configure-parameters-en.md#wallarm_force

--8<-- "../include/waf/installation/cloud-platforms/article-for-inline-oob-ami.md"
