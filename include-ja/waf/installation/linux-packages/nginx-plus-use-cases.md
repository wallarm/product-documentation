サポートされている[Wallarmのデプロイオプション][platform]の中では、NGINX Plus向けDEB/RPMパッケージが次の**ユースケース**でのWallarmのデプロイに推奨されます：

* インフラストラクチャはコンテナベースの方式を使用せず、ベアメタルまたは仮想マシンを基盤としています。通常、これらの環境はAnsibleやSaltStackなどのInfrastructure as Code（IaC）ツールで管理されます。
* サービスはNGINX Plusを中心に構築されています。Wallarmは、これらのパッケージを使用してNGINX Plusの機能を拡張できます。