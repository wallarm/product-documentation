# Test Çalışmalarının Kimlik Doğrulamasının Yapılandırılması

Uygulamanıza giden isteklerin kimlik doğrulaması gerekiyorsa, güvenlik testi de kimlik doğrulama gerektirir. Bu talimat, kimlik bilgilerini başarılı bir şekilde test çalışmalarını doğrulamak için geçirme yöntemini sağlar.

## Test Çalışması Kimlik Doğrulamasını Yapılandırma Yöntemi

Test çalışması kimlik doğrulaması için kimlik bilgilerini aktarmak üzere, FAST node Docker konteynerini [dağıtmadan](../qsg/deployment.md#4-deploy-the-fast-node-docker-container) önce aşağıdaki adımları gerçekleştirin:

1. Yerel `.yml` veya `.yaml` uzantılı bir dosya oluşturun. Örneğin: `auth_dsl.yaml`.
2. Aşağıdaki şekilde [FAST DSL](../dsl/intro.md) sözdizimini kullanarak oluşturulan dosyada kimlik doğrulama parametrelerini tanımlayın:
    1. Dosyaya [`değiştir`](../dsl/phase-modify.md) bölümünü ekleyin.
    2. `Değiştir` bölümünde, kimlik doğrulama parametrelerinin aktarıldığı isteğin bölümünü belirtin. İstek bölümü, [nokta](../dsl/points/basics.md) formatında belirtilmelidir.

        !!! bilgi "Token parametresi için bir nokta örneği"
           Token, istek kimlik doğrulaması için kullanılıyorsa ve değeri `Cookie` istek başlığındaki `token` parametresinde geçiriliyorsa, nokta `HEADER_COOKIE_COOKIE_token_value` gibi görünebilir.
    
    3. Kimlik doğrulama parametrelerinin değerlerini aşağıdaki şekilde belirtin:
        
        ```
        modify:
            - HEADER_COOKIE_COOKIE_token_value:  "fl49qam93mfu0uhgh00gilssj2"
        ```

        Kullanılan kimlik doğrulama parametrelerinin sayısı sınırlı değildir.
3.  `.yml`/`.yaml` dosyasına sahip dizini, konteyneri dağıtırken `-v {path_to_folder}:/opt/dsl_auths` seçeneğini kullanarak FAST node Docker konteynerine monte edin. Örneğin:
    ```
    docker run --name fast-proxy -e WALLARM_API_TOKEN='dfjyt8C79DxZptWwQS3/0RHiuJLNFrqTdgCIzPPZq' -v /home/username/dsl_auth:/opt/dsl_auths -p 8080:8080 wallarm/fast
    ```

    !!! uyarı "Monte edilen dizindeki dosyalar"
        Lütfen monte edilen dizinin yalnızca kimlik bilgilerine sahip dosyayı içermesi gerektiğini unutmayın.

## Tanımlanmış Kimlik Doğrulama Parametreleri ile .yml/.yaml Dosyalarına Örnekler

`.yml`/`.yaml` dosyasında tanımlanan parametreler kitlesi, uygulamanızda kullanılan kimlik doğrulama yöntemine bağlıdır.

Aşağıdakiler, API isteklerinin en yaygın kimlik doğrulama yöntemlerinin tanımlanmasına dair örneklerdir:

* `username` ve `password` parametreleri `Cookie` istek başlığında iletilir

    ```
    modify:
        - HEADER_Cookie_COOKIE_username_value: "test_account"
        - HEADER_Cookie_COOKIE_password_value: "Qww3okei"
    ```

* `token` parametresi `Cookie` istek başlığında geçirilir

    ```
    modify:
        - HEADER_COOKIE_COOKIE_token_value: "fl49qam93mfu0uhgh00gilssj2"
    ```