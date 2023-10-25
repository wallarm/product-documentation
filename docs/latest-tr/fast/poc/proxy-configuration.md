[doc-node-deployment-api]:          node-deployment.md
[doc-fast-recording-mode]:          ci-mode-recording.md#running-a-fast-node-in-recording-mode

[doc-integration-overview]:         integration-overview.md


#   Proxy Kurallarının Yapılandırılması

!!! warning "Dikkat"
    Bu bölümde anlatılan adımları yalnızca FAST düğümü [API][doc-node-deployment-api] veya [CI Modu (kayıt modu)][doc-fast-recording-mode] aracılığıyla dağıtılıyorsa gerçekleştirin.

Talep kaynağınızı, hedef uygulamaya yönelik tüm talepler için FAST düğümünü bir HTTP proxy olarak kullanacak şekilde yapılandırın.

CI/CD altyapınızın FAST düğümünün Docker konteyneriyle nasıl etkileşime girdiğine bağlı olarak, düğüme aşağıdaki yolların biriyle ulaşabilirsiniz:
* IP adresi.
* Alan adı.

!!! info "Örnek"
    Test aracınız bir Linux Docker konteyneri olarak çalışıyorsa, aşağıdaki ortam değişkenini, konteynerden gelen tüm HTTP isteklerinin FAST düğümü aracılığıyla yönlendirilmesini sağlamak için konteynera iletebilirsiniz:
    
    ```
    HTTP_PROXY=http://<FAST node name or IP address>:<port>
    ```