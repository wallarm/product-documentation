システムへの通知はリクエスト経由で送信されます。システムが利用できない、またはインテグレーションのパラメータが正しく設定されていない場合は、リクエストの応答でエラーコードが返されます。

システムがWallarmのリクエストに`2xx`以外のコードで応答した場合、`2xx`コードを受信するまで、Wallarmは次の間隔でリクエストを再送します:

* 第1サイクルの間隔: 1、3、5、10、10秒
* 第2サイクルの間隔: 0、1、3、5、30秒
* 第3サイクルの間隔:  1、1、3、5、10、30分

12時間の間に失敗したリクエストの割合が60%に達すると、インテグレーションは自動的に無効化されます。システム通知を受信している場合は、自動的に無効化されたインテグレーションに関するメッセージが届きます。

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/DVfoXYuBy-Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->