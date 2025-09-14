# Test Çalıştırmalarının Kimlik Doğrulamasını Yapılandırma

Uygulamanıza gelen isteklerin kimlik doğrulaması gerekiyorsa, güvenlik testleri de kimlik doğrulaması gerektirir. Bu talimat, test çalıştırmalarını başarıyla kimlik doğrulamadan geçirmek için kimlik bilgilerinin iletilme yöntemini sağlar.

## Test Çalıştırması Kimlik Doğrulamasını Yapılandırma Yöntemi

Test çalıştırması kimlik doğrulaması için kimlik bilgilerini iletmek amacıyla, FAST node Docker konteynerini [dağıtmadan](../qsg/deployment.md#4-deploy-the-fast-node-docker-container) önce aşağıdaki adımları uygulayın:

1. `.yml` veya `.yaml` uzantılı yerel bir dosya oluşturun. Örneğin: `auth_dsl.yaml`.
2. Oluşturulan dosyada [FAST DSL](../dsl/intro.md) sözdizimini kullanarak kimlik doğrulama parametrelerini aşağıdaki şekilde tanımlayın:
    1. Dosyaya [`modify`](../dsl/phase-modify.md) bölümünü ekleyin.
    2. `modify` bölümünde, kimlik doğrulama parametrelerinin iletildiği istek bölümünü belirtin. İstek bölümü [nokta](../dsl/points/basics.md) biçiminde belirtilmelidir.

        !!! info "Token parametresi için bir nokta örneği"
            İstek kimlik doğrulaması için bir token kullanılıyor ve değeri `Cookie` istek başlığındaki `token` parametresinde iletiliyorsa, nokta şu şekilde görünebilir: `HEADER_COOKIE_COOKIE_token_value`.
    
    3. Kimlik doğrulama parametrelerinin değerlerini aşağıdaki şekilde belirtin:
        
        ```
        modify:
            - HEADER_COOKIE_COOKIE_token_value:  "fl49qam93mfu0uhgh00gilssj2"
        ```

        Kullanılan kimlik doğrulama parametrelerinin sayısı sınırlandırılmamıştır.
3. Konteyneri dağıtırken `-v {path_to_folder}:/opt/dsl_auths` seçeneğini kullanarak `.yml`/`.yaml` dosyasını içeren dizini FAST node Docker konteynerine bağlayın. Örneğin:
    ```
    docker run --name fast-proxy -e WALLARM_API_TOKEN='dfjyt8C79DxZptWwQS3/0RHiuJLNFrqTdgCIzPPZq' -v /home/username/dsl_auth:/opt/dsl_auths -p 8080:8080 wallarm/fast
    ```

    !!! warning "Bağlanan dizindeki dosyalar"
        Lütfen bağlanan dizinde yalnızca kimlik doğrulama kimlik bilgilerini içeren dosyanın bulunması gerektiğine dikkat edin.

## .yml/.yaml Dosyalarında Tanımlı Kimlik Doğrulama Parametreleri Örnekleri

`.yml`/`.yaml` dosyasında tanımlanan parametre seti, uygulamanızda kullanılan kimlik doğrulama yöntemine bağlıdır.

Aşağıda API isteklerinin en yaygın kimlik doğrulama yöntemlerini tanımlamaya yönelik örnekler yer almaktadır:

* `username` ve `password` parametreleri `Cookie` istek başlığında iletilir

    ```
    modify:
        - HEADER_Cookie_COOKIE_username_value: "test_account"
        - HEADER_Cookie_COOKIE_password_value: "Qww3okei"
    ```

* `token` parametresi `Cookie` istek başlığında iletilir

    ```
    modify:
        - HEADER_COOKIE_COOKIE_token_value: "fl49qam93mfu0uhgh00gilssj2"
    ```