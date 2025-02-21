Notifications to the system are sent via requests. システムへの通知はリクエストで送信されます。もしシステムが利用不可の場合または統合パラメーターが正しく設定されていない場合は、エラーコードがリクエストのレスポンスとして返されます。

If the system responds to Wallarm request with any code other than `2xx`, Wallarm resends the request with the interval until the `2xx` code is received:  
もしシステムがWallarmのリクエストに対し `2xx` 以外のコードで応答した場合、`2xx` コードが受信されるまでWallarmは間隔をおいてリクエストを再送します:

* The first cycle intervals: 1, 3, 5, 10, 10 seconds  
  第一サイクルの間隔: 1, 3, 5, 10, 10秒
* The second cycle intervals: 0, 1, 3, 5, 30 seconds  
  第二サイクルの間隔: 0, 1, 3, 5, 30秒
* The third cycle intervals:  1, 1, 3, 5, 10, 30 minutes  
  第三サイクルの間隔: 1, 1, 3, 5, 10, 30分

If the percentage of unsuccessful requests reaches 60% in 12 hours, the integration is automatically disabled. If you receive system notifications, you will get a message about automatically disabled integration.  
12時間以内に失敗したリクエストの割合が60%に達すると、自動的に統合が無効化されます。システム通知を受け取った場合、自動的に無効化された統合に関するメッセージが届きます。

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/DVfoXYuBy-Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->