					!!! info "もし複数のWallarmノードをデプロイする場合"
    あなたの環境へデプロイされるすべてのWallarmノードは、**同じバージョン**でなければなりません。分散してインストールされたpostanalyticsモジュールも**同じバージョン**でなければなりません。

    追加のノードをインストールする前に、それが既にデプロイされているモジュールと同じバージョンである事を確認してください。もしデプロイされているモジュールのバージョンが[非推奨、または近く非推奨になる（`4.0`以下）][versioning-policy]の場合、すべてのモジュールを最新バージョンにアップグレードしてください。

    ランニングインスタンスに接続して次のコマンドを実行することで、起動バージョンを確認することができます：

    ```
    apt list wallarm-node
    ```