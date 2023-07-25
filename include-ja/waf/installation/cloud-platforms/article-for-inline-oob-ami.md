# Amazon Machine ImageからWallarmをデプロイする

この記事では、[公式のAmazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD)を使用してAWS上にWallarmをデプロイする方法を提供します。このソリューションは、インラインあるいは[Out-of-Band][oob-docs]でデプロイすることが可能です。

<!-- ???
すべてのリージョンがサポートされていると言ってください -->

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.md"

## 6. Wallarmがトラフィックを分析できるようにする

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 7. NGINXを再起動する

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 8. トラフィックをWallarmインスタンスに送信する設定を行う

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. Wallarmの操作をテストする

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 10. デプロイしたソリューションの微調整をする

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"