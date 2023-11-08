# Amazon S3

Você pode configurar o Wallarm para enviar arquivos com informações sobre os hits detectados para o seu bucket Amazon S3. As informações serão enviadas em arquivos no formato JSON a cada 10 minutos.

Campos de dados para cada hit:

* `time` - data e hora da detecção do hit no formato Unix Timestamp
* `request_id`
* `ip` - IP do atacante
* Tipo de fonte do hit: `datacenter`, `tor`, `remote_country`
* `application_id`
* `domain`
* `method`
* `uri`
* `protocol`
* `status_code`
* `attack_type`
* `block_status`
* `payload`
* `point`
* `tags`

Os arquivos serão salvos em seu bucket S3 usando a convenção de nomes `wallarm_hits_{timestamp}.json` ou `wallarm_hits_{timestamp}.jsonl`. O formato, seja Array JSON ou Delimitado por Nova Linha JSON (NDJSON), dependerá da sua escolha durante a configuração da integração.

## Configurando a integração

Ao configurar a integração com o Amazon S3, você precisa decidir qual método de autorização irá usar:

* **Via role ARN (recomendado)** - usando funções com a opção de ID externo para conceder acesso aos recursos é [recomendado](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html?icmpid=docs_iam_console) pela AWS como método que aumenta a segurança e previne ataques do tipo "delegado confuso". O Wallarm fornece tal ID único para sua conta de organização.
* **Via chave de acesso secreta** - método mais comum, mais simples, que requer a chave de [acesso compartilhada](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html) do seu usuário AWS IAM. Se você escolher este método, é recomendado usar a chave de acesso de um usuário IAM separado, com apenas permissão de gravação no bucket S3 usado na integração.

Para configurar uma integração com o Amazon S3:

1. Crie um bucket Amazon S3 para o Wallarm, seguindo as [instruções](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html).
1. Execute diferentes passos de acordo com o método de autorização selecionado.

    === "Role ARN"

        1. No UI da AWS, navegue até S3 → seu bucket → guia **Properties** e copie o código da **Region AWS** e o **Nome do Recurso da Amazon (ARN)** do seu bucket.

            Por exemplo, `us-west-1` como uma região e `arn:aws:s3:::test-bucket-json` como ARN.

        1. No UI do Console Wallarm, abra a seção **Integrations**.
        1. Clique no bloco **AWS S3** ou clique no botão **Add integration** e escolha **AWS S3**.
        1. Digite um nome para a integração.
        1. Digite o código da região AWS do seu bucket S3 que você copiou anteriormente.
        1. Digite o nome do seu bucket S3.
        1. Copie o ID da conta Wallarm fornecido.
        1. Copie o ID externo fornecido.
        1. No UI da AWS, inicie a criação de uma [nova função](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) em IAM → **Access Management** → **Roles**.
        1. Selecione **AWS account** → **Another AWS Account** como tipo de entidade confiável.
        1. Cole o **Account ID** do Wallarm.
        1. Selecione **Require external ID** e cole o ID externo fornecido pelo Wallarm.
        1. Clique em **Next** e crie uma política para a sua função:

            ```json
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "VisualEditor0",
                        "Effect": "Allow",
                        "Action": "s3:PutObject",
                        "Resource": "<YOUR_S3_BUCKET_ARN>/*"
                    }
                ]
            }
            ```
        1. Complete a criação da função e copie o ARN da função.
        1. No UI do Console Wallarm, no diálogo de criação da sua integração, na guia **Role ARN**, cole o ARN da sua função.

            ![Amazon S3 integration](../../../images/user-guides/settings/integrations/add-amazon-s3-integration.png)

    === "Secret access key"

        1. No UI da AWS, navegue até S3 → seu bucket → guia **Properties** e copie o código da **Region AWS**, por exemplo` us-west-1`.
        1. Navegue até IAM → Dashboard → seção **Manage access keys** → **Access keys**.
        1. Obtenha o ID da chave de acesso que você armazena em algum lugar ou crie uma nova chave/recupere a chave perdida como descrito [aqui](https://aws.amazon.com/ru/blogs/security/wheres-my-secret-access-key/). De qualquer forma, você precisará da sua chave ativa e do seu ID.
        1. No UI do Console Wallarm, abra a seção **Integrations**.
        1. Clique no bloco **AWS S3** ou clique no botão **Add integration** e escolha **AWS S3**.
        1. Digite um nome para a integração.
        1. Digite o código da região AWS do seu bucket S3 que você copiou anteriormente.
        1. Digite o nome do seu bucket S3.
        1. Na guia **Secret access key**, digite o ID da chave de acesso e a própria chave.

1. Selecione o formato para os dados do Wallarm: ou um Array JSON ou um Novo Delimitado por Nova Linha JSON (NDJSON).
1. Na seção **Regular notifications**, certifique-se de que os hits nos últimos 10 minutos são selecionados para serem enviados. Se não forem escolhidos, os dados não serão enviados para o bucket S3.
1. Clique em **Test integration** para verificar a correção da configuração, a disponibilidade do Wallarm Cloud e o formato da notificação.

    Para o Amazon S3, o teste de integração envia o arquivo JSON com dados para o seu bucket. Aqui está um exemplo do arquivo JSON com os dados sobre os hits detectados nos últimos 10 minutos:

    === "JSON Array"
        ```json
        [
        {
            "time":"1687241470",
            "request_id":"d2a900a6efac7a7c893a00903205071a",
            "ip":"127.0.0.1",
            "datacenter":"unknown",
            "tor":"none",
            "remote_country":null,
            "application_id":[
                -1
            ],
            "domain":"localhost",
            "method":"GET",
            "uri":"/etc/passwd",
            "protocol":"none",
            "status_code":499,
            "attack_type":"ptrav",
            "block_status":"monitored",
            "payload":[
                "/etc/passwd"
            ],
            "point":[
                "uri"
            ],
            "tags":{
                "lom_id":7,
                "libproton_version":"4.4.11",
                "brute_counter":"c188cd2baa2cefb3f3688cb4008a649e",
                "wallarm_mode":"monitoring",
                "final_wallarm_mode":"monitoring"
            }
        },
        {
            "time":"1687241475",
            "request_id":"b457fccec9c66cdb07eab7228b34eca6",
            "ip":"127.0.0.1",
            "datacenter":"unknown",
            "tor":"none",
            "remote_country":null,
            "application_id":[
                -1
            ],
            "domain":"localhost",
            "method":"GET",
            "uri":"/etc/passwd",
            "protocol":"none",
            "status_code":499,
            "attack_type":"ptrav",
            "block_status":"monitored",
            "payload":[
                "/etc/passwd"
            ],
            "point":[
                "uri"
            ],
            "tags":{
                "lom_id":7,
                "libproton_version":"4.4.11",
                "brute_counter":"c188cd2baa2cefb3f3688cb4008a649e",
                "wallarm_mode":"monitoring",
                "final_wallarm_mode":"monitoring"
            }
        }
        ]
        ```
    === "New Line Delimited JSON (NDJSON)"
        ```json
        {"time":"1687241470","request_id":"d2a900a6efac7a7c893a00903205071a","ip":"127.0.0.1","datacenter":"unknown","tor":"none","remote_country":null,"application_id":[-1],"domain":"localhost","method":"GET","uri":"/etc/passwd","protocol":"none","status_code":499,"attack_type":"ptrav","block_status":"monitored","payload":["/etc/passwd"],"point":["uri"],"tags":{"lom_id":7,"libproton_version":"4.4.11","brute_counter":"c188cd2baa2cefb3f3688cb4008a649e","wallarm_mode":"monitoring","final_wallarm_mode":"monitoring"}}
        {"time":"1687241475","request_id":"b457fccec9c66cdb07eab7228b34eca6","ip":"127.0.0.1","datacenter":"unknown","tor":"none","remote_country":null,"application_id":[-1],"domain":"localhost","method":"GET","uri":"/etc/passwd","protocol":"none","status_code":499,"attack_type":"ptrav","block_status":"monitored","payload":["/etc/passwd"],"point":["uri"],"tags":{"lom_id":7,"libproton_version":"4.4.11","brute_counter":"c188cd2baa2cefb3f3688cb4008a649e","wallarm_mode":"monitoring","final_wallarm_mode":"monitoring"}}
        ```
1. Clique em **Add integration**.

Para controlar a quantidade de dados armazenados, é recomendado configurar a exclusão automática de objetos antigos do seu bucket Amazon S3, conforme descrito [aqui](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html).

## Desabilitando e excluindo uma integração

--8<-- "../include-pt-BR/integrations/integrations-disable-delete.md"

## Indisponibilidade do sistema e parâmetros incorretos de integração

--8<-- "../include-pt-BR/integrations/integration-not-working.md"