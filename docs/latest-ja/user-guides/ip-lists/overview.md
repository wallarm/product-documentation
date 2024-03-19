# IPリストのタイプとコアロジック

Wallarmコンソールの **IPリスト** セクションでは、許可リスト、拒否リスト、グレーリストのIPアドレスを使用して、アプリケーションへのアクセスを制御することができます。

* **許可リスト**は、信頼できるIPアドレスのリストで、これらから発信されるリクエストに攻撃の兆候が含まれていても、アプリケーションにアクセスすることを許可されています。
* **拒否リスト**は、アプリケーションへのアクセスが許可されていないIPアドレスのリストです。フィルタリングノードは、拒否リストに登録されたIPアドレスから発信されるすべてのリクエストをブロックします。
* **グレーリスト**は、これらから発信されるリクエストに攻撃の兆候が含まれていない場合にのみ、アプリケーションへのアクセスを許可されているIPアドレスのリストです。

![すべてのIPリスト](../../images/user-guides/ip-lists/ip-lists-home-apps.png)

## IPリスト処理のアルゴリズム

フィルタリングノードは、選択した操作[モード](../../admin-en/configure-wallarm-mode.md)に基づいてIPリストを解析するための異なるアプローチを採用しています。特定のモードでは、許可リスト、拒否リスト、グレーリストという3つのタイプのIPリストすべてを評価します。しかし、他のモードでは、特定のIPリストのみに焦点を当てます。

以下の画像は、各操作モードにおけるIPリストの優先順位と組み合わせを視覚的に表現し、どのリストが各ケースで考慮されるかを強調しています：

![IPリストの優先順位](../../images/user-guides/ip-lists/ip-lists-priorities.png)

## IPリストの設定

IPリストを設定するには：

1. WallarmノードがロードバランサーやCDNの背後にある場合は、WallarmノードがエンドユーザーのIPアドレスを適切に報告するように設定してください：

    * [NGINXベースのWallarmノードの指示](../../admin-en/using-proxy-or-balancer-en.md)（AWS / GCPイメージおよびDockerノードコンテナを含む）
    * [Wallarm Kubernetes Ingressコントローラーとしてデプロイされたフィルタリングノードの指示](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)
2. IPリストにリクエストソースを追加してください：

    * [許可リスト](allowlist.md)
    * [拒否リスト](denylist.md)
    * [グレーリスト](graylist.md)

!!! warning "追加のトラフィックフィルタリング設備の使用"
    自動的にトラフィックをフィルタリングしブロックする追加の設備（ソフトウェアまたはハードウェア）を使用する場合は、[Wallarm スキャナー](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)のIPアドレスを許可リストに設定することをお勧めします。これにより、Wallarmのコンポーネントがリソースの脆弱性をシームレスにスキャンすることができます。

    * [Wallarm US Cloudに登録されたスキャナーのIPアドレス](../../admin-en/scanner-addresses.md)
    * [Wallarm EU Cloudに登録されたスキャナーのIPアドレス](../../admin-en/scanner-addresses.md)