# AWS'e Wallarm Docker Görüntüsünün Dağıtımı

Bu hızlı rehber, [NGINX tabanlı Wallarm node'un Docker görüntüsünü](https://hub.docker.com/r/wallarm/node) [Amazon Elastic Container Service (Amazon ECS)](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/) kullanarak Amazon bulut platformuna dağıtmak için gerekli adımları sağlar.

!!! warning "The instructions limitations"
    Bu talimatlar, yük dengeleme ve node otomatik ölçeklendirmesinin yapılandırılmasını kapsamaz. Bu bileşenleri kendiniz kuruyorsanız, [AWS instructions](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/) uygun bölümünü gözden geçirmenizi tavsiye ederiz.

## Kullanım Senaryoları

--8<-- "../include/waf/installation/cloud-platforms/aws-ecs-use-cases.md"

## Gereksinimler

* **admin** yetkilerine sahip AWS hesabı ve kullanıcısı
* Doğru bir şekilde [kurulmuş](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) ve [yapılandırılmış](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) AWS CLI 1 veya AWS CLI 2
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da iki faktörlü kimlik doğrulaması kapalı olan **Administrator** rolüne sahip hesaba erişim
* Saldırı tespit kuralları ve [API specifications][api-policy-enf-docs] güncellemelerini indirmek; ayrıca [allowlisted, denylisted, or graylisted][graylist-docs] ülkeler, bölgeler veya veri merkezleri için hassas IP'leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"

## Wallarm node Docker Konteyner Yapılandırımı için Seçenekler

--8<-- "../include/waf/installation/docker-running-options.md"

## Ortam Değişkenleriyle Yapılandırılan Wallarm node Docker Konteynerinin Dağıtımı

Sadece ortam değişkenleriyle yapılandırılan kapsayıcı Wallarm filtreleme node'unu dağıtmak için AWS Management Console ve AWS CLI kullanılır.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [AWS Management Console](https://console.aws.amazon.com/console/home)'a giriş yapın → **Services** listesinden → **Elastic Container Service**'i seçin.
2. **Create Cluster** butonuna basarak küme oluşturma işlemine başlayın:
      1. **EC2 Linux + Networking** şablonunu seçin.
      2. Küme adını belirtin, örneğin: `wallarm-cluster`.
      3. Gerekirse, diğer ayarları [AWS instructions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create_cluster.html) yönergelerine göre yapılandırın.
      4. Küme kaydedin.
3. Wallarm Cloud'a bağlanmak için gerekli hassas verileri (node token) [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) veya [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html) kullanarak şifreleyin.

    Bu talimatlarda, hassas veriler AWS Secrets Manager'de saklanır.

    !!! warning "Access to the sensitive data storage"
        Docker konteynerinin şifrelenmiş hassas verilere erişebilmesi için, lütfen AWS ayarlarının aşağıdaki gereksinimleri karşıladığından emin olun:
        
        * Hassas veriler, Docker konteynerinin çalıştığı bölgede saklanmalıdır.
        * `executionRoleArn` parametresinde belirtilen kullanıcıya **SecretsManagerReadWrite** IAM politikası eklenmiş olmalıdır. [IAM policies setup hakkında daha fazla detay →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
4. Aşağıdaki yerel JSON dosyasını [task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) ile oluşturun (task definition, Docker konteynerinin çalışma senaryosunu belirler):

    === "If you use the Wallarm US Cloud"
         ```json
         {
             "executionRoleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole",
             "containerDefinitions": [
                 {
                     "memory": 128,
                     "portMappings": [
                        {
                            "hostPort": 80,
                            "containerPort": 80,
                            "protocol": "tcp"
                        }
                     ],
                     "essential": true,
                     "environment": [
                        {
                            "name": "WALLARM_API_HOST",
                            "value": "us1.api.wallarm.com"
                        },
                        {
                            "name": "NGINX_BACKEND",
                            "value": "<HOST_TO_PROTECT_WITH_WALLARM>"
                        },
                        {
                            "name": "WALLARM_LABELS",
                            "value": "group=<GROUP>"
                        }
                     ],
                     "secrets": [
                        {
                            "name": "WALLARM_API_TOKEN",
                            "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                        }
                     ],
                     "name": "wallarm-container",
                     "image": "registry-1.docker.io/wallarm/node:5.3.0"
                 }
             ],
             "family": "wallarm-api-security-node"
         }
         ```
    === "If you use the Wallarm EU Cloud"
         ```json
         {
             "executionRoleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole",
             "containerDefinitions": [
                 {
                     "memory": 128,
                     "portMappings": [
                        {
                            "hostPort": 80,
                            "containerPort": 80,
                            "protocol": "tcp"
                        }
                     ],
                     "essential": true,
                     "environment": [
                        {
                            "name": "NGINX_BACKEND",
                            "value": "<HOST_TO_PROTECT_WITH_WALLARM>"
                        },
                        {
                            "name": "WALLARM_LABELS",
                            "value": "group=<GROUP>"
                        }
                     ],
                     "secrets": [
                        {
                            "name": "WALLARM_API_TOKEN",
                            "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                        }
                     ],
                     "name": "wallarm-container",
                     "image": "registry-1.docker.io/wallarm/node:5.3.0"
                 }
             ],
             "family": "wallarm-api-security-node"
         }
         ```

    * `<AWS_ACCOUNT_ID>`: [AWS hesap ID'niz](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html).
    * `environment` nesnesi, Docker konteynerine metin formatında iletilmesi gereken ortam değişkenlerini ayarlar. Kullanılabilir ortam değişkenlerinin seti aşağıdaki tabloda açıklanmıştır. `WALLARM_API_TOKEN` değişkeninin `secrets` nesnesinde iletilmesi önerilir.
    * `secret` nesnesi, Docker konteynerine hassas veri deposuna yapılan bağlantılar şeklinde iletilmesi gereken ortam değişkenlerini ayarlar. Değerlerin formatı, seçilen depoya bağlıdır (daha fazla detay için [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) veya [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html) dökümantasyonuna bakınız).

        `WALLARM_API_TOKEN` değişkeninin `secrets` nesnesinde iletilmesi önerilir.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * Tüm yapılandırma dosyası parametreleri [AWS dökümantasyonunda](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html) açıklanmıştır.
5. JSON yapılandırma dosyasına dayanarak [`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html) komutunu kullanarak task definition'ı kaydedin:

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: JSON dosyasının yerel makinedeki yolu.
    * `<JSON_FILE_NAME>`: JSON dosyasının adı ve uzantısı.
6. `aws ecs run-task` komutunu kullanarak görevi kümede çalıştırın:

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: İlk adımda oluşturulan kümenin adı. Örneğin, `wallarm-cluster`.
    * `<FAMILY_PARAM_VALUE>`: Oluşturulan task definition'ın adı. Bu değer, JSON dosyasında belirtilen `family` parametresiyle aynı olmalıdır. Örneğin, `wallarm-api-security-node`.
7. AWS Management Console → **Elastic Container Service** → çalışan görevin bulunduğu küme → **Tasks** kısmını açın ve görevin listede görüntülendiğinden emin olun.
8. [Filtreleme node operasyonunu test edin](#testing-the-filtering-node-operation).

## Ayarlanmış Dosya ile Yapılandırılan Wallarm node Docker Konteynerinin Dağıtımı

Ortam değişkenleriyle yapılandırılan ve ayarlanmış dosya ile yapılandırılan kapsayıcı Wallarm filtreleme node'unu dağıtmak için AWS Management Console ve AWS CLI kullanılır.

Bu talimatlarda, yapılandırma dosyası [AWS EFS](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html) dosya sisteminden monte edilmiştir. Dosya montajı için diğer yöntemleri [AWS dökümantasyonunda](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html) inceleyebilirsiniz.

Ortam değişkenleriyle birlikte ve AWS EFS'den monte edilmiş yapılandırma dosyası ile konteyneri dağıtmak için:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [AWS Management Console](https://console.aws.amazon.com/console/home)'a giriş yapın → **Services** listesinden → **Elastic Container Service**'i seçin.
2. **Create Cluster** butonuna basarak küme oluşturma işlemine başlayın:

    * **Template**: `EC2 Linux + Networking`.
    * **Cluster name**: örneğin, `wallarm-cluster`.
    * **Provisioning Model**: `On-Demand Instance`.
    * **EC2 instance type**: `t2.micro`.
    * **Number of instances**: `1`.
    * **EC2 AMI ID**: `Amazon Linux 2 Amazon ECS-optimized AMI`.
    * **Key pair**: SSH bağlantısı için [key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html). Yapılandırma dosyasını depolamaya yüklemek için instance’a SSH ile bağlanmanız gerekecektir.
    * Diğer ayarlar varsayılan bırakılabilir. Ek ayarları değiştirirken, [AWS EFS kurulumu talimatlarını](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html) izlemeniz önerilir.
3. AWS EFS depolamasını, AWS talimatlarının 2-4. adımlarını izleyerek yapılandırın.
4. AWS talimatlarının 4. adımında, `default` adlı yapılandırma dosyasını oluşturun ve dosyayı varsayılan olarak monte edilen dosyaların bulunduğu dizine yerleştirin. `default` dosyası, filtreleme node yapılandırmasını içermelidir. Minimal ayarlarla dosya örneği:

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        #listen 443 ssl;

        server_name localhost;

        #ssl_certificate cert.pem;
        #ssl_certificate_key cert.key;

        root /usr/share/nginx/html;

        index index.html index.htm;

        wallarm_mode monitoring;
        # wallarm_application 1;

        location / {
                proxy_pass http://example.com;
                include proxy_params;
        }
    }
    ```

    [Filtreleme node yönergeleri için monte edilebilecek direktifler →][nginx-waf-directives]
5. Wallarm Cloud'a bağlanmak için gerekli hassas verileri (node token) [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) veya [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html) kullanarak şifreleyin.

    Bu talimatlarda, hassas veriler AWS Secrets Manager'de saklanır.

    !!! warning "Access to the sensitive data storage"
        Docker konteynerinin şifrelenmiş hassas verilere erişebilmesi için, lütfen AWS ayarlarının aşağıdaki gereksinimleri karşıladığından emin olun:
        
        * Hassas veriler, Docker konteynerinin çalıştığı bölgede saklanmalıdır.
        * `executionRoleArn` parametresinde belirtilen kullanıcıya **SecretsManagerReadWrite** IAM politikası eklenmiş olmalıdır. [IAM policies setup hakkında daha fazla detay →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
6. Aşağıdaki yerel JSON dosyasını [task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) ile oluşturun (task definition, Docker konteynerinin çalışma senaryosunu belirler):

    === "If you use the Wallarm US Cloud"
         ```json
         {
             "executionRoleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole",
             "containerDefinitions": [
                 {
                     "memory": 128,
                     "portMappings": [
                        {
                            "hostPort": 80,
                            "containerPort": 80,
                            "protocol": "tcp"
                        }
                     ],
                     "essential": true,
                     "mountPoints": [
                        {
                            "containerPath": "<PATH_FOR_MOUNTED_CONFIG>",
                            "sourceVolume": "<NAME_FROM_VOLUMES_OBJECT>"
                        }
                     ],
                     "environment": [
                        {
                            "name": "WALLARM_API_HOST",
                            "value": "us1.api.wallarm.com"
                        },
                        {
                            "name": "WALLARM_LABELS",
                            "value": "group=<GROUP>"
                        }
                     ],
                     "secrets": [
                        {
                            "name": "WALLARM_API_TOKEN",
                            "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                        }
                     ],
                     "name": "wallarm-container",
                     "image": "registry-1.docker.io/wallarm/node:5.3.0"
                 }
             ],
             "volumes": [
                 {
                     "name": "<VOLUME_NAME>",
                     "efsVolumeConfiguration": {
                         "fileSystemId": "<EFS_FILE_SYSTEM_ID>",
                         "transitEncryption": "ENABLED"
                     }
                 }
             ],
             "family": "wallarm-api-security-node"
         }
         ```
    === "If you use the Wallarm EU Cloud"
         ```json
         {
             "executionRoleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole",
             "containerDefinitions": [
                 {
                     "memory": 128,
                     "portMappings": [
                        {
                            "hostPort": 80,
                            "containerPort": 80,
                            "protocol": "tcp"
                        }
                     ],
                     "essential": true,
                     "mountPoints": [
                        {
                            "containerPath": "/etc/nginx/sites-enabled",
                            "sourceVolume": "default"
                        }
                     ],
                     "environment": [
                        {
                            "name": "WALLARM_LABELS",
                            "value": "group=<GROUP>"
                        }
                     ],
                     "secrets": [
                        {
                            "name": "WALLARM_API_TOKEN",
                            "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                        }
                     ],
                     "name": "wallarm-container",
                     "image": "registry-1.docker.io/wallarm/node:5.3.0"
                 }
             ],
             "volumes": [
                 {
                     "name": "default",
                     "efsVolumeConfiguration": {
                         "fileSystemId": "<EFS_FILE_SYSTEM_ID>",
                         "transitEncryption": "ENABLED"
                     }
                 }
             ],
             "family": "wallarm-api-security-node"
         }
         ```

    * `<AWS_ACCOUNT_ID>`: [AWS hesap ID'niz](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html).
    * `<PATH_FOR_MOUNTED_CONFIG>`: Yapılandırma dosyasının konteynere monte edileceği dizin. Yapılandırma dosyaları, NGINX tarafından aşağıdaki dizinlere monte edilebilir:
        * `/etc/nginx/conf.d` — ortak ayarlar
        * `/etc/nginx/sites-enabled` — sanal ana bilgisayar ayarları
        * `/var/www/html` — statik dosyalar

        Filtreleme node yönergeleri, `/etc/nginx/sites-enabled/default` dosyasında belirtilmelidir.
    * `<NAME_FROM_VOLUMES_OBJECT>`: AWS EFS depolamasından monte edilen yapılandırma dosyasını içeren `volumes` nesnesinin adı (değer, `<VOLUME_NAME>` ile aynı olmalıdır).
    * `<VOLUME_NAME>`: AWS EFS depolamasından monte edilen yapılandırma dosyasının yapılandırmasını içeren `volumes` nesnesinin adı.
    * `<EFS_FILE_SYSTEM_ID>`: Konteynere monte edilmesi gereken dosyayı içeren AWS EFS dosya sisteminin ID'si. ID, AWS Management Console → **Services** → **EFS** → **File systems** bölümünde görüntülenir.
    * `environment` nesnesi, Docker konteynerine metin formatında iletilmesi gereken ortam değişkenlerini ayarlar. Kullanılabilir ortam değişkenlerinin seti aşağıdaki tabloda açıklanmıştır. `WALLARM_API_TOKEN` değişkeninin `secrets` nesnesinde iletilmesi önerilir.
    * `secret` nesnesi, Docker konteynerine hassas veri deposuna bağlantılar şeklinde iletilmesi gereken ortam değişkenlerini ayarlar. Değerlerin formatı, seçilen depoya bağlıdır (daha fazla detay için [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) veya [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html) dökümantasyonuna bakınız).

        `WALLARM_API_TOKEN` değişkeninin `secrets` nesnesinde iletilmesi önerilir.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * Tüm yapılandırma dosyası parametreleri [AWS dökümantasyonunda](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html) açıklanmıştır.
7. JSON yapılandırma dosyasına dayanarak [`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html) komutunu kullanarak task definition'ı kaydedin:

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: JSON dosyasının yerel makinedeki yolu.
    * `<JSON_FILE_NAME>`: JSON dosyasının adı ve uzantısı.
8. `aws ecs run-task` komutunu kullanarak görevi kümede çalıştırın:

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: İlk adımda oluşturulan kümenin adı. Örneğin, `wallarm-cluster`.
    * `<FAMILY_PARAM_VALUE>`: Oluşturulan task definition'ın adı. Bu değer, JSON dosyasında belirtilen `family` parametresiyle aynı olmalıdır. Örneğin, `wallarm-api-security-node`.
9. AWS Management Console → **Elastic Container Service** → çalışan görevin bulunduğu küme → **Tasks** kısmını açın ve görevin listede görüntülendiğinden emin olun.
10. [Filtreleme node operasyonunu test edin](#testing-the-filtering-node-operation).

## Filtreleme Node Operasyonunun Test Edilmesi

1. AWS Management Console'da, çalışan görevi açın ve **External Link** alanından konteynerin IP adresini kopyalayın.

    ![Settig up container instance][aws-copy-container-ip-img]

    Eğer IP adresi boşsa, lütfen konteynerin **RUNNING** durumunda olduğundan emin olun.
2. Kopyalanmış adrese, test [Path Traversal][ptrav-attack-docs] saldırısını içeren isteği gönderin:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinden açın ve saldırının listede görüntülendiğinden emin olun.
    ![Attacks in UI][attacks-in-ui-image]

Konteyner dağıtımı sırasında meydana gelen hatalara ilişkin detaylar, AWS Management Console'daki görev detaylarında görüntülenir. Eğer konteyner erişilemez durumdaysa, lütfen konteynere doğru değerlerle iletilmesi gereken filtreleme node parametrelerinin sağlandığından emin olun.