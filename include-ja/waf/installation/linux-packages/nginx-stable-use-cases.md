サポートされている[Wallarmのデプロイオプション][platform]のうち、NGINX Stable向けのDEB/RPMパッケージは、次の**ユースケース**でのWallarmのデプロイ時に推奨されます：

* インフラストラクチャがベアメタルまたは仮想マシンを基盤としており、コンテナベースの方式を使用していません。通常、これらの構成はAnsibleやSaltStackのようなInfrastructure as Code（IaC）ツールで管理されます。
* サービスがNGINX Stableを中心に構築されています。Wallarmはこれらのパッケージを使用して機能を拡張できます。