# AWS'ye Wallarm Docker İmajının Dağıtımı

Bu hızlı kılavuz, [NGINX tabanlı Wallarm düğümünün Docker imajını](https://hub.docker.com/r/wallarm/node) [Amazon Elastik Konteyner Hizmeti (Amazon ECS)](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/) kullanarak Amazon bulut platformuna nasıl dağıtacağınızın adımlarını sağlar.

!!! warning "Talimatların kısıtlamaları"
    Bu talimatlar yük dengelemeyi ve düğüm otomatik ölçeklemeyi kapsamaz. Bu bileşenleri kendiniz ayarlıyorsanız, [AWS talimatlarının](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/) uygun bölümünü incelemenizi öneririz.

## Kullanım durumları

--8<-- "../include-tr/waf/installation/cloud-platforms/aws-ecs-use-cases.md"

## Gereklilikler

* **Admin** izinlerine sahip AWS hesabı ve kullanıcı
* AWS CLI 1 veya AWS CLI 2 düzgün bir şekilde [kurulu](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) ve [yapılandırılmış](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
* İki faktörlü doğrulamanın Wallarm Konsolu'nda devre dışı bırakıldığı **Yönetici** rolüne sahip hesaba erişim [ABD Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/) için

## Wallarm düğüm Docker konteynerinin yapılandırma seçenekleri

--8<-- "../include-tr/waf/installation/docker-running-options.md"

## Ortam değişkenleri aracılığıyla yapılandırılmış Wallarm düğüm Docker konteynerinin dağıtımı

Ortam değişkenleri aracılığıyla sadece yapılandırılmış konteynırlı Wallarm filtreleme düğümünü dağıtmak için AWS Yönetim Konsolu ve AWS CLI kullanılır.

--8<-- "../include-tr/waf/installation/get-api-or-node-token.md"

1. [AWS Yönetim Konsoluna](https://console.aws.amazon.com/console/home) oturum açın → **Hizmetler** listesi → **Elastic Container Service**.
1. **Cluster Oluştur** düğmesiyle küme oluşturmaya geçin:
      1. Şablonu **EC2 Linux + Networking** seçin.
      2. Küme adını belirtin, örnek: `wallarm-cluster`.
      3. Gerekirse, diğer ayarları [AWS talimatlarına](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create_cluster.html) göre ayarlayın.
      4. Kümeyi kaydedin.
1. Wallarm Buluta bağlanmak için gereken hassas verileri (düğüm belirteci) [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) veya [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html) kullanarak şifreleyin.

    Bu talimatlarda, hassas veriler AWS Secrets Manager'da saklanmaktadır.

    !!! warning "Hassas veri deposuna erişim"
        Docker konteynerin şifreli hassas verileri okumasına izin vermek için lütfen AWS ayarlarının aşağıdaki gereksinimleri karşıladığından emin olun:
        
        * Hassas veriler, Docker konteynerinin çalıştırıldığı bölgede saklanır.
        * Görev tanımının `executionRoleArn` parametresinde belirtilen kullanıcıya IAM politikası **SecretsManagerReadWrite** eklenmiştir. [IAM politikalarının ayarlanması hakkında daha fazla bilgi →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. Aşağıdaki yerel JSON dosyasını, [görev tanımı](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) ile oluşturun (görev tanımı, Docker konteynerin işletim senaryosunu belirler):

    === "Wallarm US Cloud'u kullanıyorsanız"
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
                        "value": "<WALLARM_ILE_KORUNACAK_HOST>"
                    }
                ],
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:4.8.0-1"
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```
    === "Wallarm EU Cloud'u kullanıyorsanız"
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
                        "value": "<WALLARM_ILE_KORUNACAK_HOST>"
                    }
                ],
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:4.8.0-1"
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```

    * `<AWS_ACCOUNT_ID>`: [AWS hesap kimliğiniz](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html).
    * `Environment` nesnesi, Docker konteynere metin formatında iletilmesi gereken ortam değişkenlerini ayarlar. Available environment variables set is described in the table below. `WALLARM_API_TOKEN` değişkenini `secrets` nesnesine iletmek önerilir.
    * `Secret` nesnesi, Docker konteynere hassas veri deposuna linkler olarak iletilmesi gereken ortam değişkenlerini ayarlar. Value format depends on the selected storage (referans bilgisi için dökümantasyonlara bakınız [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) veya [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)).

        `WALLARM_API_TOKEN` değişkenini `secrets` nesnesine iletmek önerilir.

        --8<-- "../include-tr/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * Tüm konfigürasyon dosya parametreleri, [AWS belgelerinde](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html) açıklanmıştır.
1. Görev tanımını, JSON konfigürasyon dosyasına dayalı olarak, [`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html) komutunu kullanarak kaydedin:

    ```bash
    aws ecs register-task-definition --cli-input-json file://<JSON_DOSYASINA_YOL>/<JSON_DOSYASI_ADı>
    ```

    * `<JSON_DOSYASINA_YOL>`: Lokal makinada görev tanımıyla olan JSON dosyasına yol.
    * `<JSON_DOSYASI_ADı>`: Görev tanımıyla olan JSON dosyasının adı ve uzantısı.
1. Görevi clusterda çalıştırın, [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html) komutunu kullanarak:

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: İlk adımda oluşturulan clusterin ismi. Örnek olarak, `wallarm-cluster`.
    * `<FAMILY_PARAM_VALUE>`: Oluşturulan görev tanımının ismi. Değer, görev tanımıyla olan JSON dosyasında belirtilen `family` parametresinin değerine karşılık gelmelidir. Örnek olarak, `wallarm-api-security-node`.
1. AWS Management Console → **Elastic Container Service** → çalışan görevli cluster → **Tasks** açın ve listede görevin gösterildiğinden emin olun.
1. [Filtreleme düğümünün işlemlerini test edin](#filtreleme-dugum-islemlerini-test-etme).

## Dağıtılacak Wallarm düğüm Docker konteynerin monte edilmiş dosya aracılığıyla yapılandırması

Ortam değişkenleri ve monte edilmiş dosya aracılığıyla yapılandırılan konteynırlı Wallarm filtreleme düğümünü dağıtmak için AWS Yönetim Konsolu ve AWS CLI kullanılır.

Bu talimatlarda, konfigürasyon dosyası [AWS EFS](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html) dosya sisteminden monte edilir. Dosyanın nasıl monte edileceği hakkında diğer yöntemler için [AWS belgelerini](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html) inceleyebilirsiniz.

Ortam değişkenleriyle ve AWS EFS'den monte edilmiş konfigürasyon dosyasıyla konteyneri dağıtmak için:

--8<-- "../include-tr/waf/installation/get-api-or-node-token.md"

1. [AWS Yönetim Konsoluna](https://console.aws.amazon.com/console/home) oturum açın → **Hizmetler** listesi → **Elastic Container Service**.
1. **Cluster Oluştur** düğmesi ile küme oluşturmaya geçin:

    * **Template**: `EC2 Linux + Networking`.
    * **Cluster name**: `wallarm-cluster` (örnek).
    * **Provisioning Model**: `On-Demand Instance`.
    * **EC2 instance type**: `t2.micro`.
    * **Number of instances**: `1`.
    * **EC2 AMI ID**: `Amazon Linux 2 Amazon ECS-optimized AMI`.
    * **Key pair**: Instance'ye SSH bağlantısı için [anahtar çifti](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html). Depoya konfigürasyon dosyasını yüklemek için instance'a SSH ile bağlanmanız gerekecektir.
   * Diğer ayarlar varsayılan olarak bırakılabilir. Diğer ayarları değiştirirken, [AWS EFS kurulum talimatlarını](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html) takip etmeniz önerilir.
1. AWS EFS depolamasını, [AWS talimatlarının](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html) 2-4 adımlarını takip ederek yapılandırın.
1. AWS talimatlarının 4. adımında, `default` adlı konfigürasyon dosyasını oluşturun ve dosyanın monte edileceği varsayılan klasöre yerleştirin. Dosya `default`, filtreleme düğümü konfigürasyonunu kapsamalıdır. Minimal ayarlarla dosya örneği:

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

    [Konfigürasyon dosyasında belirtilebilecek filtreleme düğümü direktiflerinin kümesi →][nginx-waf-directives]
1. Wallarm Buluta bağlanmak için gerekli olan hassas verileri (düğüm belirteci) [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) veya [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html) kullanarak şifreleyin.

    Bu talimatlarda, hassas veriler AWS Secrets Manager'da saklanmaktadır.

    !!! warning "Hassas veri deposuna erişim"
        Docker konteynerin şifreli hassas verileri okumasına izin vermek için lütfen AWS ayarlarının aşağıdaki gereksinimleri karşıladığından emin olun:
        
        * Hassas veriler, Docker konteynerinin çalıştırıldığı bölgede saklanır.
        * Görev tanımının `executionRoleArn` parametresinde belirtilen kullanıcıya IAM politikası **SecretsManagerReadWrite** eklenmiştir. [IAM politikalarının ayarlanması hakkında daha fazla bilgi →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. Aşağıdaki yerel JSON dosyasını oluşturun, [görev tanımı](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) (görev tanımı Docker konteynerin işletim senaryosunu sunar):

    === "Wallarm US Cloud'u kullanıyorsanız"
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
                        "containerPath": "<MOUNTED_CONFIG_FOR_PATH>",
                        "sourceVolume": "<NAME_FROM_VOLUMES_OBJECT>"
                    }
                ],
                "environment": [
                    {
                        "name": "WALLARM_API_HOST",
                        "value": "us1.api.wallarm.com"
                    }
                ],
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:4.8.0-1"
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
    === "Wallarm EU Cloud'u kullanıyorsanız"
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
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:4.8.0-1"
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

    * `<AWS_ACCOUNT_ID>`: [AWS hesap kimliğiniz](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html).
    * `<MOUNTED_CONFIG_FOR_PATH>`: Konfigürasyon dosyasının monte edileceği contaner dizini. Configuration files can be mounted to the following container directories used by NGINX:

        * `/etc/nginx/conf.d` — genel ayarlar
        * `/etc/nginx/sites-enabled` — sanal host ayarları
        * `/var/www/html` — statik dosyalar

        Filtreleme düğümü direktifleri `/etc/nginx/sites-enabled/default` dosyasında tanımlanmalıdır.

    * `<NAME_FROM_VOLUMES_OBJECT>`: Monte edilen dosyanın AWS EFS depolama konfigürasyonunu içeren `volumes` nesnesinin adı (değer `<VOLUME_NAME>` ile aynı olmalıdır).
    * `<VOLUME_NAME>`: Monte edilen dosyanın AWS EFS depolama konfigürasyonunu içeren `volumes` nesnesinin adı.
    * `<EFS_FILE_SYSTEM_ID>`: Containere monte edilmesi gereken dosyayı içeren AWS EFS dosya sisteminin ID'si. Kimlik, AWS Yönetim Konsolu → **Services** → **EFS** → **File systems**'de görüntülenir.
    * `Environment` nesnesi, Docker konteynere metin formatında iletilmesi gereken ortam değişkenlerini ayarlar. Ortam değişkenleri kümesi aşağıdaki tabloda açıklanmıştır. It is recommended to pass the variable `WALLARM_API_TOKEN` in the `secrets` object.
    * `Secret` nesnesi, Docker konteynere hassas veri deposuna linkler olarak iletilmesi gereken ortam değişkenlerini ayarlar. Value format depends on the selected storage (daha fazla bilgi için dökümantasyonlara bakınız [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) veya [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)).

        `WALLARM_API_TOKEN` değişkenini `secrets` nesnesinden geçirmek önerilir.

        --8<-- "../include-tr/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * Tüm konfigürasyon dosya parametreleri, [AWS belgelerinde](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html) açıklanmıştır.
1. Görev tanımını, JSON konfigürasyon dosyasına dayalı olarak [`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html) komutunu kullanarak kaydedin:

    ```bash
    aws ecs register-task-definition --cli-input-json file://<JSON_DOSYASINA_YOL>/<JSON_DOSYASI_ADı>
    ```

    * `<JSON_DOSYASINA_YOL>`: Lokal makinada görev tanımıyla olan JSON dosyasına yol.
    * `<JSON_DOSYASI_ADı>`: Görev tanımıyla olan JSON dosyasının adı ve uzantısı.
1. Görevi clusterda çalıştırın [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html) komutunu kullanarak:

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: İlk adımda oluşturulan clusterin ismi. Örnek olarak, `wallarm-cluster`.
    * `<FAMILY_PARAM_VALUE>`: Oluşturulan görev tanımının ismi. Değer, görev tanımıyla olan JSON dosyasında belirtilen `family` parametresinin değerine karşılık gelmelidir. Örnek olarak, `wallarm-api-security-node`.
1. AWS Management Console → **Elastic Container Service** → çalışan görevli cluster → **Tasks** açın ve listede görevin gösterildiğinden emin olun.
1. [Filtreleme düğümünün işlemlerini test edin](#filtreleme-dugum-islemlerini-test-etme).

## Filtreleme Düğüm İşlemlerini Test Etme

1. AWS Yönetim Konsolu'nda, çalışan görevi açın ve **External Link** alanından konteyner IP adresini kopyalayın.

    ![Settig up container instance][aws-copy-container-ip-img]

    Eğer IP adresi boşsa, lütfen konteynerin **RUNNING** durumunda olduğundan emin olun.

2. Kopyalanan adrese test [Path Traversal][ptrav-attack-docs] saldırısı ile talep gönderin:

    ```
    curl http://<KOPIED_IP>/etc/passwd
    ```
3. Wallarm Console → **Events**'i [ABD Cloud](https://us1.my.wallarm.com/search) veya [AB Cloud](https://my.wallarm.com/search)'da açın ve saldırının listede gösterildiğinden emin olun.
    ![Attacks in UI][attacks-in-ui-image]

Konteyner dağıtımı sırasında meydana gelen hataların detayları AWS Yönetim Konsolu'ndaki görev detaylarında gösterilir. Eğer konteyner erişilemezse, lütfen doğru değerlerle gerekli filtreleme düğümü parametrelerinin konteynere iletilip iletilmediğini kontrol edin.