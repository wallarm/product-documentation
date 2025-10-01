[doc-node-deployment-api]:          node-deployment.md
[doc-fast-recording-mode]:          ci-mode-recording.md#running-a-fast-node-in-recording-mode

[doc-integration-overview]:         integration-overview.md


#   Proxy Kurallarının Yapılandırılması

!!! warning "Dikkat"
    Bu bölümde açıklanan adımları yalnızca FAST node ya [API][doc-node-deployment-api] üzerinden ya da [CI Mode (kayıt modu)][doc-fast-recording-mode] üzerinden dağıtılıyorsa gerçekleştirin.

İstek kaynağınızı, hedef uygulamaya gönderilen tüm istekler için FAST node'u bir HTTP proxy olarak kullanacak şekilde yapılandırın.

CI/CD altyapınızın FAST node’un Docker konteyneriyle nasıl etkileşim kurduğuna bağlı olarak, node’a aşağıdaki yollarla erişebilirsiniz:
* IP adresi.
* Alan adı.

!!! info "Örnek"
    Test aracınız bir Linux Docker konteyneri olarak çalışıyorsa, o konteynerden gelen tüm HTTP isteklerinin FAST node üzerinden proxy edilmesini etkinleştirmek için konteynere aşağıdaki ortam değişkenini iletebilirsiniz:
    
    ```
    HTTP_PROXY=http://<FAST node name or IP address>:<port>
    ```