İsteği kaydetmeyi uygulamak için, aşağıdaki ayarları otomatik uygulama testinin adımına uygulayın:

1. FAST Docker konteynırını çalıştıran komutu, gerekli [değişkenler](../ci-mode-recording.md#environment-variables-in-recording-mode) ile birlikte `CI_MODE=recording` modunda ve otomatik testleri çalıştıran komutu __öncesine__ ekleyin. Örneğin:

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=app-test -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. Otomatik testlerin FAST düğümü üzerinden proxy'ini yapılandırın. Örneğin:

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! uyarı "Docker Ağı"
    İstekleri kaydetmeden önce, FAST düğümünün ve otomatik test aracının aynı ağda çalıştığından emin olun.