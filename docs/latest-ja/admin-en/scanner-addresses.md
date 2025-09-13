[file-ips-list-us]: ../downloads/scanner-ip-addresses-us.txt
[file-ips-list-eu]: ../downloads/scanner-ip-addresses-eu.txt

# 脆弱性スキャンのIPアドレス <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

本書では、Wallarmが[API攻撃対象領域管理](../api-attack-surface/security-issues.md)および[脅威リプレイテスト](../vulnerability-detection/threat-replay-testing/overview.md)を使用して、企業リソースの脆弱性、統合されたWAAPソリューションおよびセキュリティポスチャをスキャンする際に使用する、US CloudおよびEU CloudのIPアドレス一覧を提供します。

自動的にトラフィックをフィルタリングおよびブロックするために使用している（Wallarm以外の）ソフトウェアまたはハードウェアのソリューションの**ホワイトリスト**に、該当する一覧のアドレスを追加することを推奨します。これにより、これらのソリューションによってWallarmのコンポーネントがブロックされることを防げます。

## US Cloud

Wallarmが[US Cloud](https://us1.my.wallarm.com)でお客様のアセットをスキャンする発信元のIPアドレスは次のとおりです。

--8<-- "../include/scanner-ip-request-us.md"

!!! info "IPアドレス一覧をダウンロード"
    [US CloudでのWallarmのアセットスキャン用IP一覧を含むプレーンテキストファイルをダウンロード][file-ips-list-us]

## EU Cloud

Wallarmが[EU Cloud](https://my.wallarm.com)でお客様のアセットをスキャンする発信元のIPアドレスは次のとおりです。

--8<-- "../include/scanner-ip-request.md"

!!! info "IPアドレス一覧をダウンロード"
    [EU CloudでのWallarmのアセットスキャン用IP一覧を含むプレーンテキストファイルをダウンロード][file-ips-list-eu]