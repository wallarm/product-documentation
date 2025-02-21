[doc-node-deployment-api]:          node-deployment.md
[doc-fast-recording-mode]:          ci-mode-recording.md#running-a-fast-node-in-recording-mode

[doc-integration-overview]:         integration-overview.md

# Proxy Kurallarının Yapılandırılması

!!! warning "Attention"
    Bu bölümde açıklanan adımları yalnızca FAST node’un [API][doc-node-deployment-api] veya [CI Mode (recording mode)][doc-fast-recording-mode] kullanılarak dağıtılması durumunda uygulayın.

İstek kaynağınızı, hedef uygulamaya gönderilen tüm istekler için FAST node’u bir HTTP proxy’si olarak kullanacak şekilde yapılandırın.

CI/CD altyapınızın FAST node’un Docker konteyneriyle etkileşim biçimine bağlı olarak, node’a aşağıdaki yollarla erişebilirsiniz:
* IP adresi.
* Alan adı.

!!! info "Example"
    Test aracınız bir Linux Docker konteyneri olarak çalışıyorsa, o konteynere aşağıdaki ortam değişkenini geçirerek tüm HTTP isteklerinin FAST node üzerinden proxy yapılmasını etkinleştirebilirsiniz:
    
    ```
    HTTP_PROXY=http://<FAST node name or IP address>:<port>
    ```