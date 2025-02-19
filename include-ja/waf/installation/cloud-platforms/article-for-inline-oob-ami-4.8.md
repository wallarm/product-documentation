# Amazon Machine ImageからWallarmを展開する

本記事では[公式Amazon Machine Image（AMI）](https://aws.amazon.com/marketplace/pp/B073VRFXSD)を使用してAWS上にWallarmを展開する手順を説明します。ソリューションはインライン[inline-docs]またはアウトオブバンド[oob-docs]として展開できます。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.md"

## 6. Wallarmがトラフィックを解析できるようにする

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 7. NGINXを再起動する

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 8. Wallarmインスタンスへのトラフィック送信を設定する

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. Wallarm動作をテストする

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 10. 展開済みソリューションを微調整する

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"