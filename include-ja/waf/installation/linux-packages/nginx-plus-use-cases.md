すべてのサポートされている[Wallarm deployment options][platform]の中で、NGINX Plus向けのDEB/RPMパッケージは以下の**ユースケース**におけるWallarmのデプロイに推奨します:

* お客様のインフラがコンテナベースの手法を使用せずにベアメタルまたは仮想マシンをベースとしている場合。通常、これらのセットアップはAnsibleやSaltStackなどのInfrastructure as Code (IaC)ツールで管理されます。
* お客様のサービスがNGINX Plusを中心に構築されている場合。Wallarmはこれらのパッケージを利用して機能を拡張できます。