Among all supported [Wallarm deployment options][platform]の中で、Dockerイメージを使用したAlibaba Cloud ECS上でのWallarm展開は、これらの**ユースケース**で推奨します:

* アプリケーションがマイクロサービスアーキテクチャを採用しており、既にコンテナ化されAlibaba Cloud ECS上で稼働している場合。
* 各コンテナに対して細かな制御が必要な場合、Dockerイメージは優れています。従来のVMベースの展開で通常可能なよりも高いレベルのリソース隔離を提供します。