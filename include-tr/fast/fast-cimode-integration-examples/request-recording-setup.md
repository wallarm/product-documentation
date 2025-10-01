İstek kaydını uygulamak için, otomatik uygulama testinin adımına aşağıdaki ayarları uygulayın:

1. Otomatik testleri çalıştıran komuttan __önce__, `CI_MODE=recording` modunda ve gerekli diğer [değişkenlerle](../ci-mode-recording.md#environment-variables-in-recording-mode) FAST Docker konteynerini çalıştıran komutu ekleyin. Örneğin:

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=app-test -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. Otomatik testlerin FAST node üzerinden proxy’lenmesini yapılandırın. Örneğin:

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! warning "Docker Ağı"
    İstekleri kaydetmeden önce, FAST node ve otomatik test aracının aynı ağda çalıştığından emin olun.