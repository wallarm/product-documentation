Among all supported [Wallarm deployment options][platform]の中で、Google Compute Engine(GCE)上でDockerイメージを使用したWallarmのデプロイは次の**ユースケース**で推奨します:

* アプリケーションがマイクロサービスアーキテクチャを採用しており、すでにGCE上でコンテナ化され運用されている場合。
* 各コンテナを細かく管理する必要がある場合、Dockerイメージが優れています。従来のVMベースのデプロイで通常可能な場合よりも高いレベルのリソース分離を提供します。