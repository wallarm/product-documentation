すべてのサポート対象の[Wallarm deployment options][platform]の中で、配布版NGINX向けのDEB/RPMパッケージが以下の**ユースケース**におけるWallarmの展開に推奨されます:

* コンテナベースの手法を利用せず、物理サーバまたは仮想マシンに基づいたインフラをご利用の場合、通常、これらのセットアップはAnsibleやSaltStackなどのInfrastructure as Code (IaC)ツールによって管理されます。
* お使いのサービスが配布版NGINXを中心に構築されている場合、Wallarmはこれらのパッケージを使用して機能を拡張できます。