システムへの通知はリクエストを介して送信されます。システムが利用不可能である場合や統合パラメータが正しく設定されていない場合、リクエストに対する応答でエラーコードが返されます。

システムがWallarmのリクエストに`2xx`以外の任意のコードで応答する場合、`2xx`コードを受信するまでWallarmは間隔を置いてリクエストを再送信します：

* 最初のサイクル間隔：1, 3, 5, 10, 10秒
* 二番目のサイクル間隔：0, 1, 3, 5, 30秒
* 三番目のサイクル間隔：1, 1, 3, 5, 10, 30分

12時間にわたって失敗したリクエストの割合が60%に達すると、統合は自動的に無効になります。システム通知を受信する場合は、統合が自動的に無効になったことに関するメッセージが届きます。

<!-- ## デモ動画

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/DVfoXYuBy-Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->