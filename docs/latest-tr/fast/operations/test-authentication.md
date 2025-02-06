# Test Çalıştırmalarının Kimlik Doğrulamasının Yapılandırılması

Uygulamanıza yapılan isteklere kimlik doğrulaması gerekiyorsa, güvenlik testlerinde de kimlik doğrulaması gerekmektedir. Bu talimat, test çalıştırmalarının başarılı bir şekilde kimlik doğrulaması için kimlik bilgilerini geçme yöntemini sağlar.

## Test Çalıştırması Kimlik Doğrulamasını Yapılandırma Yöntemi

Test çalıştırması kimlik doğrulaması için kimlik bilgilerini geçirmek amacıyla, FAST node Docker konteynerini [dağıtmadan](../qsg/deployment.md#4-deploy-the-fast-node-docker-container) önce aşağıdaki adımları izleyin:

1. `.yml` veya `.yaml` uzantılı bir yerel dosya oluşturun. Örnek: `auth_dsl.yaml`.
2. Oluşturulan dosyada, [FAST DSL](../dsl/intro.md) sözdizimi kullanılarak kimlik doğrulama parametrelerini tanımlayın:
    1. Dosyaya [`modify`](../dsl/phase-modify.md) bölümünü ekleyin.
    2. `modify` bölümünde, kimlik doğrulama parametrelerinin iletildiği istek bölümünü belirtin. İstek bölümü, [point](../dsl/points/basics.md) formatında belirtilmelidir.

        !!! info "Token parametresi için point örneği"
            Eğer istek kimlik doğrulaması için bir token kullanılıyorsa ve değeri `Cookie` istek başlığındaki `token` parametresinde geçiliyorsa, point `HEADER_COOKIE_COOKIE_token_value` şeklinde olabilir.
    
    3. Kimlik doğrulama parametrelerinin değerlerini aşağıdaki şekilde belirtin:
        
        ```
        modify:
            - HEADER_COOKIE_COOKIE_token_value:  "fl49qam93mfu0uhgh00gilssj2"
        ```

        Kullanılan kimlik doğrulama parametrelerinin sayısı sınırlı değildir.
3. `.yml`/`.yaml` dosyasının bulunduğu dizini, konteyneri dağıtırken `-v {path_to_folder}:/opt/dsl_auths` seçeneğini kullanarak FAST node Docker konteynerine monte edin. Örnek:
    ```
    docker run --name fast-proxy -e WALLARM_API_TOKEN='dfjyt8C79DxZptWwQS3/0RHiuJLNFrqTdgCIzPPZq' -v /home/username/dsl_auth:/opt/dsl_auths -p 8080:8080 wallarm/fast
    ```

    !!! warning "Monte Edilen Dizindeki Dosyalar"
        Lütfen monte edilen dizinin yalnızca kimlik bilgilerini içeren dosyayı barındırdığından emin olun.

## Tanımlanmış Kimlik Doğrulama Parametrelerine Sahip .yml/.yaml Dosyalarına Örnekler

`.yml`/`.yaml` dosyasında tanımlanan parametre seti, uygulamanızda kullanılan kimlik doğrulama yöntemine bağlıdır.

Aşağıda API isteklerinin en yaygın kullanılan kimlik doğrulama yöntemlerini tanımlayan örnekler verilmiştir:

* `username` ve `password` parametreleri, `Cookie` istek başlığında iletilir

    ```
    modify:
        - HEADER_Cookie_COOKIE_username_value: "test_account"
        - HEADER_Cookie_COOKIE_password_value: "Qww3okei"
    ```

* `token` parametresi, `Cookie` istek başlığında iletilir

    ```
    modify:
        - HEADER_COOKIE_COOKIE_token_value: "fl49qam93mfu0uhgh00gilssj2"
    ```