Among all supported [Wallarm deployment options][platform], this solution is the recommended one for the following **use cases**:
  
* インフラはコンテナベース手法を使用せず、ベアメタルまたは仮想マシンで構成されています。一般的には、これらのセットアップはInfrastructure as Codeツール（例：AnsibleやSaltStack）で管理されます。
* サービスはNGINXを中心に構築されています。Wallarmはオールインワンインストーラーを使用して機能を拡張できます。