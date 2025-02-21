Among all supported [Wallarm展開オプション][platform]、NGINX Stable用DEB/RPMパッケージはこれらの**ユースケース**におけるWallarmの展開に推奨されます:

* お使いのインフラはコンテナベースの手法を使用せず、ベアメタルまたは仮想マシンに依存しています。一般に、これらの構成はAnsibleやSaltStackなどのInfrastructure as Code（IaC）ツールで管理されます。
* お使いのサービスはNGINX Stableを中心に構築されています。Wallarmはこれらのパッケージを使用して機能を拡張できます。