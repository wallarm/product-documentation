Notifications to the system are sent via requests. If the system is unavailable or integration parameters are configured incorrectly, the error code is returned in the response to the request.

If the system responds to Wallarm request with any code other than `2xx`, Wallarm resends the request with the interval until the `2xx` code is received:

* The first cycle intervals: 1, 3, 5, 10, 10 seconds
* The second cycle intervals: 0, 1, 3, 5, 30 seconds
* The third cycle intervals:  1, 1, 3, 5, 10, 30 minutes

If the percentage of unsuccessful requests reaches 60% in 12 hours, the integration is automatically disabled. If you receive system notifications, you will get a message about automatically disabled integration.

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/DVfoXYuBy-Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->