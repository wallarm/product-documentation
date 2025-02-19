Among all supported [Wallarm deployment options][platform]の中で、AWS ECS上でDocker imageを使用したWallarmのデプロイは、以下の**ユースケース**で推奨されます：

* アプリケーションがマイクロサービスアーキテクチャを活用しており、すでにコンテナ化されAWS ECS上で稼働している場合です。
* 各コンテナに対してきめ細かな制御が必要な場合、Docker imageが優れており、従来のVMベースのデプロイで通常実現可能なものよりも高いレベルのリソース分離性を提供します。