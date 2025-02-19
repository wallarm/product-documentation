To implement the request recording, apply the following settings to the step of automated application testing:  
İstek kaydını uygulamak için, otomatik uygulama testlerinin adımına aşağıdaki ayarları uygulayın:

1. Add the command running FAST Docker container in the `CI_MODE=recording` mode with other required [variables](../ci-mode-recording.md#environment-variables-in-recording-mode) __before__ the command running automated tests. For example:  
   Otomatik testleri çalıştıran komuttan __önce__, diğer gerekli [değişkenler](../ci-mode-recording.md#environment-variables-in-recording-mode) ile `CI_MODE=recording` modunda çalışan FAST Docker konteynerini başlatan komutu ekleyin. Örneğin:  

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=app-test -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. Configure proxying of automated tests via FAST node. For example:  
   Otomatik testlerin, FAST node üzerinden proxy edilmesini yapılandırın. Örneğin:  

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! warning "Docker Network"
    Before recording requests, make sure the FAST node and tool for automated testing are running on the same network.  
    İstekleri kaydetmeden önce, FAST node ve otomatik test aracı aynı ağda çalıştığından emin olun.