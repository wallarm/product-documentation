# Wallarm Docker İmajının AWS'ye Dağıtımı

Bu hızlı kılavuz, [NGINX tabanlı Wallarm düğümünün Docker imajını](https://hub.docker.com/r/wallarm/node), [Amazon Elastic Container Service (Amazon ECS)](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/) kullanarak Amazon bulut platformuna dağıtma adımlarını sağlar.

!!! warning "Talimatların sınırlamaları"
    Bu talimatlar, yük dengeleme ve düğüm otomatik ölçeklendirme yapılandırmasını kapsamaz. Bu bileşenleri kendiniz kuracaksanız, [AWS talimatlarının](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/) ilgili bölümünü incelemenizi öneririz.

!!! info "Güvenlik notu"
    Bu çözüm, AWS güvenlik en iyi uygulamalarını takip edecek şekilde tasarlanmıştır. Dağıtım için AWS kök hesabını kullanmaktan kaçınmanızı öneririz. Bunun yerine, sadece gerekli izinlere sahip IAM kullanıcılarını veya rolleri kullanın.

    Dağıtım süreci, Wallarm bileşenlerini sağlamak ve işletmek için yalnızca asgari erişimin verildiği en az ayrıcalık ilkesini varsayar.

Bu dağıtım için AWS altyapı maliyetlerini tahmin etmeye yönelik rehberlik için [AWS'de Wallarm Dağıtımı İçin Maliyet Rehberi][aws-costs] sayfasına bakın.

## Kullanım senaryoları

--8<-- "../include/waf/installation/cloud-platforms/aws-ecs-use-cases.md"

## Gereksinimler

* **admin** izinlerine sahip AWS hesabı ve kullanıcısı
* AWS CLI 1 veya AWS CLI 2'nin doğru şekilde [kurulmuş](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) ve [yapılandırılmış](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) olması
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüne sahip hesaba erişim
* Saldırı tespit kurallarına ve [API spesifikasyonlarına][api-policy-enf-docs] güncellemeleri indirmek ve ayrıca [allowlist'e, denylist'e veya graylist'e][graylist-docs] alınmış ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP'leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"

## Wallarm düğümü Docker konteyneri yapılandırma seçenekleri

--8<-- "../include/waf/installation/docker-running-options.md"

## Ortam değişkenleriyle yapılandırılmış Wallarm düğümü Docker konteynerinin dağıtımı

Yalnızca ortam değişkenleriyle yapılandırılan konteynerleştirilmiş Wallarm filtreleme düğümünü dağıtmak için AWS Management Console ve AWS CLI kullanılır.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [AWS Management Console](https://console.aws.amazon.com/console/home) → **Services** listesi → **Elastic Container Service** bölümüne giriş yapın.
1. **Create Cluster** düğmesi ile küme oluşturma işlemine ilerleyin:
      1. Şablon olarak **EC2 Linux + Networking** seçin.
      2. Küme adını belirtin, örneğin: `wallarm-cluster`.
      3. Gerekirse, diğer ayarları [AWS talimatlarını](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create_cluster.html) izleyerek yapın.
      4. Kümeyi kaydedin.
1. Wallarm Cloud’a bağlanmak için gereken hassas verileri (düğüm belirteci) [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) veya [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html) kullanarak şifreleyin.

    Bu talimatlarda, hassas veriler AWS Secrets Manager’da saklanır.

    !!! warning "Hassas veri deposuna erişim"
        Docker konteynerinin şifrelenmiş hassas verileri okuyabilmesi için AWS ayarlarının aşağıdaki gereksinimleri karşıladığından emin olun:
        
        * Hassas veriler, Docker konteynerinin çalıştırıldığı bölgedeki depoda saklanır.
        * **SecretsManagerReadWrite** IAM politikası, görev tanımındaki `executionRoleArn` parametresinde belirtilen kullanıcıya iliştirilmiştir. [IAM politikaları kurulumu hakkında daha fazla bilgi →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. Aşağıdaki yerel JSON dosyasını [task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) ile oluşturun (task definition, Docker konteynerinin çalışma senaryosunu belirler):

    === "Wallarm US Cloud kullanıyorsanız"
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
                "image": "registry-1.docker.io/wallarm/node:6.5.1"
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```
    === "Wallarm EU Cloud kullanıyorsanız"
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
                "image": "registry-1.docker.io/wallarm/node:6.5.1"
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```

    * `<AWS_ACCOUNT_ID>`: [AWS hesap kimliğiniz](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html).
    * `environment` nesnesi, Docker konteynerine metin formatında iletilmesi gereken ortam değişkenlerini ayarlar. Kullanılabilir ortam değişkenlerinin kümesi aşağıdaki tabloda açıklanmıştır. `WALLARM_API_TOKEN` değişkeninin `secrets` nesnesi içinde iletilmesi önerilir.
    * `secret` nesnesi, ortam değişkenlerinin hassas veri deposuna bağlantılar olarak Docker konteynerine iletilmesini ayarlar. Değerlerin formatı seçilen depoya bağlıdır (daha fazla bilgi için [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) veya [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html) belgelerine bakın).

        `WALLARM_API_TOKEN` değişkeninin `secrets` nesnesi içinde iletilmesi önerilir.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * Tüm yapılandırma dosyası parametreleri [AWS belgelerinde](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html) açıklanmıştır.
1. JSON yapılandırma dosyasına dayalı görev tanımını [`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html) komutunu kullanarak kaydedin:

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: yerel makinedeki görev tanımı JSON dosyasının yolu.
    * `<JSON_FILE_NAME>`: görev tanımı JSON dosyasının adı ve uzantısı.
1. Kümede görevi [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html) komutunu kullanarak çalıştırın:

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: ilk adımda oluşturulan kümenin adı. Örneğin, `wallarm-cluster`.
    * `<FAMILY_PARAM_VALUE>`: oluşturulan görev tanımının adı. Değer, görev tanımı JSON dosyasında belirtilen `family` parametresi değeriyle aynı olmalıdır. Örneğin, `wallarm-api-security-node`.
1. AWS Management Console → **Elastic Container Service** → çalışan göreve sahip küme → **Tasks** bölümünü açın ve görevin listede görüntülendiğinden emin olun.
1. [Filtreleme düğümünün çalışmasını test edin](#testing-the-filtering-node-operation).

## Bağlanmış dosya ile yapılandırılmış Wallarm düğümü Docker konteynerinin dağıtımı

Ortam değişkenleri ve bağlanmış dosya ile yapılandırılmış konteynerleştirilmiş Wallarm filtreleme düğümünü dağıtmak için AWS Management Console ve AWS CLI kullanılır.

Bu talimatlarda, yapılandırma dosyası [AWS EFS](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html) dosya sisteminden bağlanır. Dosyayı bağlamanın diğer yöntemlerini [AWS belgelerinde](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html) inceleyebilirsiniz.

AWS EFS'den bağlanmış yapılandırma dosyası ve ortam değişkenleri ile konteyneri dağıtmak için:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [AWS Management Console](https://console.aws.amazon.com/console/home) → **Services** listesi → **Elastic Container Service** bölümüne giriş yapın.
1. **Create Cluster** düğmesi ile küme oluşturma işlemine ilerleyin:

    * **Template**: `EC2 Linux + Networking`.
    * **Cluster name**: `wallarm-cluster` (örnek olarak).
    * **Provisioning Model**: `On-Demand Instance`.
    * **EC2 instance type**: `t2.micro`.
    * **Number of instances**: `1`.
    * **EC2 AMI ID**: `Amazon Linux 2 Amazon ECS-optimized AMI`.
    * **Key pair**: örnekteki için SSH bağlantısı için [key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html). Yapılandırma dosyasını depoya yüklemek için örneğe SSH ile bağlanmanız gerekecektir.
   * Diğer ayarlar varsayılan olarak bırakılabilir. Diğer ayarları değiştirirken, [AWS EFS kurulumu talimatlarının](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html) izlenmesi önerilir.
1. AWS EFS depolamayı [AWS talimatlarının](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html) 2-4. adımlarını izleyerek yapılandırın.
1. AWS talimatlarının 4. adımında, `default` adlı yapılandırma dosyasını oluşturun ve dosyayı varsayılan olarak bağlama için kullanılan dosyaları depolayan dizine yerleştirin. `default` dosyası filtreleme düğümü yapılandırmasını kapsamalıdır. Asgari ayarlara sahip dosya örneği:

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

    [Yapılandırma dosyasında belirtilebilecek filtreleme düğümü direktifleri kümesi →][nginx-waf-directives]
1. Wallarm Cloud’a bağlanmak için gereken hassas verileri (düğüm belirteci) [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) veya [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html) kullanarak şifreleyin.

    Bu talimatlarda, hassas veriler AWS Secrets Manager’da saklanır.

    !!! warning "Hassas veri deposuna erişim"
        Docker konteynerinin şifrelenmiş hassas verileri okuyabilmesi için AWS ayarlarının aşağıdaki gereksinimleri karşıladığından emin olun:
        
        * Hassas veriler, Docker konteynerinin çalıştırıldığı bölgedeki depoda saklanır.
        * **SecretsManagerReadWrite** IAM politikası, görev tanımındaki `executionRoleArn` parametresinde belirtilen kullanıcıya iliştirilmiştir. [IAM politikaları kurulumu hakkında daha fazla bilgi →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. Aşağıdaki yerel JSON dosyasını [task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) ile oluşturun (task definition, Docker konteynerinin çalışma senaryosunu belirler):

    === "Wallarm US Cloud kullanıyorsanız"
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
                "image": "registry-1.docker.io/wallarm/node:6.5.1"
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
    === "Wallarm EU Cloud kullanıyorsanız"
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
                        "containerPath": "/etc/nginx/http.d",
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
                "image": "registry-1.docker.io/wallarm/node:6.5.1"
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
    * `<PATH_FOR_MOUNTED_CONFIG>`: yapılandırma dosyasının bağlanacağı konteyner dizini. Yapılandırma dosyaları, NGINX tarafından kullanılan aşağıdaki konteyner dizinlerine bağlanabilir:

        * `/etc/nginx/conf.d` — ortak ayarlar
        * `/etc/nginx/http.d` — sanal ana bilgisayar ayarları
        * `/var/www/html` — statik dosyalar

        Filtreleme düğümü direktifleri `/etc/nginx/http.d/default.conf` dosyasında tanımlanmalıdır.
    
    * `<NAME_FROM_VOLUMES_OBJECT>`: bağlanan dosyanın AWS EFS depolama yapılandırmasını içeren `volumes` nesnesinin adı (`<VOLUME_NAME>` ile aynı olmalıdır).
    * `<VOLUME_NAME>`: bağlanan dosyanın AWS EFS depolama yapılandırmasını içeren `volumes` nesnesinin adı.
    * `<EFS_FILE_SYSTEM_ID>`: konteynere bağlanması gereken dosyayı içeren AWS EFS dosya sisteminin kimliği. Kimlik, AWS Management Console → **Services** → **EFS** → **File systems** bölümünde görüntülenir.
    * `environment` nesnesi, Docker konteynerine metin formatında iletilmesi gereken ortam değişkenlerini ayarlar. Kullanılabilir ortam değişkenlerinin kümesi aşağıdaki tabloda açıklanmıştır. `WALLARM_API_TOKEN` değişkeninin `secrets` nesnesi içinde iletilmesi önerilir.
    * `secret` nesnesi, ortam değişkenlerinin hassas veri deposuna bağlantılar olarak Docker konteynerine iletilmesini ayarlar. Değerlerin formatı seçilen depoya bağlıdır (daha fazla bilgi için [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) veya [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html) belgelerine bakın).

        `WALLARM_API_TOKEN` değişkeninin `secrets` nesnesi içinde iletilmesi önerilir.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * Tüm yapılandırma dosyası parametreleri [AWS belgelerinde](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html) açıklanmıştır.
1. JSON yapılandırma dosyasına dayalı görev tanımını [`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html) komutunu kullanarak kaydedin:

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: yerel makinedeki görev tanımı JSON dosyasının yolu.
    * `<JSON_FILE_NAME>`: görev tanımı JSON dosyasının adı ve uzantısı.
1. Kümede görevi [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html) komutunu kullanarak çalıştırın:

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: ilk adımda oluşturulan kümenin adı. Örneğin, `wallarm-cluster`.
    * `<FAMILY_PARAM_VALUE>`: oluşturulan görev tanımının adı. Değer, görev tanımı JSON dosyasında belirtilen `family` parametresi değeriyle aynı olmalıdır. Örneğin, `wallarm-api-security-node`.
1. AWS Management Console → **Elastic Container Service** → çalışan göreve sahip küme → **Tasks** bölümünü açın ve görevin listede görüntülendiğinden emin olun.
1. [Filtreleme düğümünün çalışmasını test edin](#testing-the-filtering-node-operation).

## Filtreleme düğümünün çalışmasının test edilmesi

1. AWS Management Console’da, çalışan görevi açın ve konteynerin IP adresini **External Link** alanından kopyalayın.

    ![Konteyner örneğini ayarlama][aws-copy-container-ip-img]

    IP adresi boşsa, lütfen konteynerin **RUNNING** durumunda olduğundan emin olun.

2. Kopyalanan adrese test [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) ortamında açın ve saldırının listede görüntülendiğinden emin olun.
    ![Arayüzde Attacks][attacks-in-ui-image]
1. İsteğe bağlı olarak, düğümün diğer çalışma yönlerini [test edin][link-docs-check-operation].

Konteyner dağıtımı sırasında oluşan hatalara ilişkin ayrıntılar, AWS Management Console’daki görev ayrıntılarında görüntülenir. Konteyner erişilemezse, gerekli filtreleme düğümü parametrelerinin doğru değerlerle konteynere iletildiğinden emin olun.