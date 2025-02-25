# Implantando o Wallarm na AWS usando Terraform

O Wallarm fornece o [módulo do Terraform](https://registry.terraform.io/modules/wallarm/wallarm/aws/) para implantar o nó na [AWS](https://aws.amazon.com/) a partir do ambiente compatível com o Terraform. Use estas instruções para explorar o módulo e tentar os exemplos de implantação fornecidos.

Ao implementar o módulo Wallarm Terraform, fornecemos a solução que permite duas opções principais de implantação do Wallarm: **[no modo inline](../../../inline/overview.md) (que é proxy neste método de implantação)** e as soluções de segurança [**Out-of-band (espelho)**](../../../oob/overview.md). A opção de implantação é facilmente controlada pela variável `preset` do módulo Wallarm.

## Casos de uso

Entre todas as opções suportadas de [implantação do Wallarm](../../../supported-deployment-options.md), o módulo Terraform é recomendado para a implantação do Wallarm nestes **casos de uso**:

* Sua infraestrutura existente reside na AWS.
* Você aproveita a prática de Infraestrutura como Código (IaC). O módulo Terraform do Wallarm permite o gerenciamento automatizado e provisionamento do nó Wallarm na AWS, aumentando a eficiência e consistência.

## Requisitos

* Terraform 1.0.5 ou superior [instalado localmente](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* Acesso à conta com a função de **Administrador** [role](../../../../user-guides/settings/users.md#user-roles) no Console Wallarm na Nuvem dos EUA ou da UE [Cloud](../../../../about-wallarm/overview.md#cloud)
* Acesso a `https://us1.api.wallarm.com` se estiver trabalhando com a nuvem Wallarm US ou a `https://api.wallarm.com` se estiver trabalhando com a nuvem Wallarm EU. Verifique se o acesso não está bloqueado por um firewall

Este tópico não inclui instruções para criar todos os recursos da AWS necessários para implantar o Wallarm, como um cluster VPC. Para detalhes, consulte o [guia Terraform](https://learn.hashicorp.com/tutorials/terraform/module-use) relevante.

## Como usar o Módulo Terraform AWS Wallarm?

Para implantar o Wallarm para produção usando o módulo Terraform da AWS:

1. Inscreva-se para o Console Wallarm na [Cloud EUA](https://us1.my.wallarm.com/signup) or [Cloud EU](https://my.wallarm.com/signup).
1. Abra o Console Wallarm → **Nós** e crie o nó do tipo **Wallarm node**.
   
   ![Criando um nó Wallarm](../../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. Copie o token de nó gerado.
1. Adicione o código do módulo `wallarm` à sua configuração Terraform:

   ```conf
   module "wallarm" {
     source = "wallarm/wallarm/aws"

     instance_type = "..."

     vpc_id     = "..."

     preset     = "proxy"
     proxy_pass = "https://..."
     token      = "..."

     ...
   }
   ```
1. Definir valores de variáveis na configuração do módulo `wallarm`:

| Variável  | Descrição | Tipo | Obrigatório? |
| --------- | ----------- | --------- | --------- |
| `instance_type` | [Tipo de instância Amazon EC2](https://aws.amazon.com/ec2/instance-types/) a ser usada para a implantação do Wallarm, por exemplo: `t3.small`. | string | Sim
| `vpc_id` | [ID do Virtual Private Cloud da AWS](https://docs.aws.amazon.com/managedservices/latest/userguide/find-vpc.html) para implantar a instância EC2 do Wallarm.| string | Sim
| `token` | [Token de nó Wallarm](../../../../user-guides/nodes/nodes.md#creating-a-node) copiado da interface do usuário do Wallarm Console.<br><div class="admonition info"> <p class="admonition-title">Usando um token para várias instalações</p> <p>Você pode usar um token em várias instalações, independentemente da [plataforma](../../../../installation/supported-deployment-options.md) selecionada. Ele permite o agrupamento lógico de instâncias de nó na interface do usuário do Console Wallarm. Exemplo: você implanta vários nós Wallarm em um ambiente de desenvolvimento, cada nó está em sua própria máquina de um determinado desenvolvedor.</p></div> | string | Sim
| **Variáveis específicas do Wallarm** | | | |
| `host` | [Servidor de API Wallarm](../../../../about-wallarm/overview.md#cloud). Valores possíveis:<ul><li>`us1.api.wallarm.com` para a Cloud EUA</li><li>`api.wallarm.com` para a Cloud EU</li></ul>Por padrão, `api.wallarm.com`. | string | Não
`upstream` | A [versão do nó Wallarm](../../../../updating-migrating/versioning-policy.md#version-list) a ser implantada. A versão mínima suportada é `4.0`.<br><br>Por padrão, `4.6`. | string | Não
| `preset` | Esquema de implantação do Wallarm. Valores possíveis:<ul><li>`proxy`</li><li>`mirror`</li></ul>Por padrão, `proxy`. | string | Não
| `proxy_pass` | Protocolo do servidor proxy e endereço. O nó Wallarm processará as solicitações enviadas para o endereço especificado e as proxy para as legítimas. Como protocolo, 'http' ou 'https' podem ser especificados. O endereço pode ser especificado como um nome de domínio ou endereço IP, e uma porta opcional. | string | Sim, if `preset` is `proxy`
| `mode` | [Modo de filtração de tráfego](../../../../admin-en/configure-wallarm-mode.md). Valores possíveis: `off`, `monitoring`, `safe_blocking`, `block`.<br><br>Por padrão, `monitoring`. | string | Não
|`libdetection` | Esteja para [usar a biblioteca libdetection](../../../../about-wallarm/protecting-against-attacks.md#library-libdetection) durante a análise de tráfego.<br><br>Por padrão, `true`. | bool | Não
|`global_snippet` | Configuração personalizada a ser adicionada à configuração global do NGINX. Você pode colocar o arquivo com a configuração no diretório de código do Terraform e especificar o caminho para este arquivo nesta variável.<br><br>Você encontrará o exemplo de configuração da variável no [exemplo de implantação da solução proxy avançada](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L17). | string | Não
|`http_snippet` | Configuração personalizada a ser adicionada ao bloco de configuração `http` do NGINX. Você pode colocar o arquivo com a configuração no diretório de código do Terraform e especificar o caminho para este arquivo nesta variável.<br><br>Você encontrará o exemplo de configuração da variável no [exemplo de implantação da solução proxy avançada](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L18). | string | Não
|`server_snippet` | Configuração personalizada a ser adicionada ao bloco de configuração `server` do NGINX. Você pode colocar o arquivo com a configuração no diretório de código do Terraform e especificar o caminho para este arquivo nesta variável.<br><br>Você encontrará o exemplo de configuração da variável no [exemplo de implantação da solução proxy avançada](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L19). | string | Não
|`post_script` | Script personalizado a ser executado após o [script de inicialização do nó Wallarm (`cloud-init.py`)](../../cloud-init.md). Você pode colocar o arquivo com qualquer script no diretório de código do Terraform e especificar o caminho para este arquivo nesta variável.<br><br>Você encontrará o exemplo de configuração da variável no [exemplo de implantação da solução proxy avançada](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L34). | string | Não
| **Configuração de implantação da AWS** | | | |
| `app_name` | Prefixo para os nomes dos recursos da AWS que o módulo Wallarm irá criar.<br><br>Por padrão, `wallarm`. | string | Não
| `app_name_no_template` | Se usar letras maiúsculas, números e caracteres especiais nos nomes dos recursos da AWS que o módulo Wallarm irá criar. Se `false`, os nomes dos recursos incluirão apenas letras minúsculas.<br><br>Por padrão, `false`. | bool | Não
| `lb_subnet_ids` | [Lista de IDs de sub-redes do Virtual Private Cloud da AWS](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html) para implantar um Balanceador de Carga de Aplicativos. O valor recomendado são sub-redes públicas associadas a uma tabela de roteamento que tem uma rota para um gateway da internet. | list(string) | Não
| `instance_subnet_ids` | [Lista de IDs de sub-redes do Virtual Private Cloud da AWS](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html) para implantar instâncias EC2 Wallarm. O valor recomendado são sub-redes privadas configuradas para conexões somente de saída. | list(string) | Não
| `lb_enabled` | Se criar um Balanceador de Carga de Aplicativos AWS. Um grupo de destino será criado com qualquer valor passado nesta variável, a menos que um grupo de destino personalizado seja especificado na variável `custom_target_group`.<br><br>Por padrão, `true`. | bool | Não
| `lb_internal` | Se fazer um Balanceador de Carga de Aplicativos um [balanceador de carga interno](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-internal-load-balancers.html). Por padrão, um ALB tem o tipo voltado para a internet. Se usar a abordagem assíncrona para lidar com as conexões, o valor recomendado é `true`.<br><br>Por padrão, `false`. | bool | Não
| `lb_deletion_protection` | Se habilitar proteção para um [Balanceador de Carga de Aplicações ser impossibilitado de ser excluído acidentalmente](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#deletion-protection). Para implantações de produção, o valor recomendado é `true`.<br><br>Por padrão, `true`. | bool | Não
| `lb_ssl_enabled` | Se [negociar conexões SSL](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies) entre um cliente e um Balanceador de Carga de Aplicativos. Se `true`, as variáveis `lb_ssl_policy` e `lb_certificate_arn` são obrigatórias. Recomendado para implantações de produção.<br><br>Por padrão, `false`. | bool | Não
| `lb_ssl_policy` | [Política de segurança para um Balanceador de Carga de Aplicativos](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies). | string | Sim, se `lb_ssl_enabled` for `true`
| `lb_certificate_arn` | [Nome do Recurso da Amazon (ARN)](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html) de um certificado do Gerenciador de Certificados AWS (ACM). | string | Sim, se `lb_ssl_enabled` for `true`
| `custom_target_group` | Nome do grupo de destino existente para [anexar ao grupo Auto Scaling criado](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html). Por padrão, um novo grupo de destino será criado e anexado. Se o valor for não padrão, a criação da ALB AWS será desabilitada. | string | Não
| `inbound_allowed_ip_ranges` | Lista de IPs e redes de origem para permitir conexões de entrada para instâncias Wallarm. Lembre-se de que a AWS mascara o tráfego do balanceador de carga, mesmo que seja originado de sub-redes públicas.<br><br>Por padrão:<ul><li>`"10.0.0.0/8",`</li><li>`"172.16.0.0/12",`</li><li>`"192.168.0.0/16"`</li></ul> | list(string) | Não
| `outbound_allowed_ip_ranges` | Lista de IPs e redes de origem para permitir conexões externas da instância Wallarm.<br><br>Por padrão: `"0.0.0.0/0"`. | list(string) | Não
| `extra_ports` | Lista de portas extras de rede interna para permitir conexões de entrada para instâncias Wallarm. A configuração será aplicada a um grupo de segurança. | list(number) | Não
| `extra_public_ports` | Lista de portas extras de rede pública para permitir conexões de entrada para instâncias Wallarm.| list(number) | Não
| `extra_policies` | Políticas IAM AWS a serem associadas à pilha Wallarm. Pode ser útil usar junto com a variável `post_script` executando o script que solicita dados do Amazon S3. | list(string) | Não
| `source_ranges` | Lista de IPs e redes de origem para permitir tráfego do Balanceador de Carga de Aplicativos AWS.<br><br>Por padrão, `"0.0.0.0/0"`. | list(string) | Não
| `https_redirect_code` | Código para redirecionamento de solicitação HTTP para HTTPS. Valores possíveis: <ul><li>`0` - redirecionamento desativado</li><li>`301` - redirecionamento permanente</li><li>`302` - redirecionamento temporário</li></ul>Por padrão, `0`. | number | Não
| `asg_enabled` | Se criar um [grupo Auto Scaling AWS](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html).<br><br>Por padrão, `true` | bool | Não
| `min_size` | Número mínimo de instâncias no grupo Auto Scaling AWS criado.<br><br>Por padrão, `1`.| number | Não
| `max_size` | Número máximo de instâncias no grupo Auto Scaling AWS criado.<br><br>Por padrão, `3`.| number | Não
| `desired_capacity` | Número inicial de instâncias no grupo Auto Scaling AWS criado. Deve ser maior ou igual a `min_size` e menor ou igual a `max_size`.<br><br>Por padrão, `1`.| number | Não
| `autoscaling_enabled` | Se habilitar [Auto Scaling da Amazon EC2](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html) para o cluster Wallarm.<br><br>Por padrão, `false`. | bool | Não
| `autoscaling_cpu_target` | Porcentagem média de utilização da CPU para manter o grupo Auto Scaling AWS. Por padrão, `70.0`. | string | Não
| `ami_id` | [ID da Imagem de Máquina Amazon](https://docs.aws.amazon.com/managedservices/latest/userguide/find-ami.html) a ser usada para a implantação da instância Wallarm. Por padrão (string vazia), a imagem mais recente do upstream é usada. Você é bem-vindo para criar o AMI personalizado baseado no nó Wallarm. | string | Não
| `key_name` | Nome do [par de chaves AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) a ser usado para se conectar às instâncias Wallarm via SSH. Por padrão, a conexão SSH está desativada. | string | Não
| `tags` | Tags para os recursos AWS que o módulo Wallarm vai criar.| map(string) | Não

## Experimentando o Módulo Terraform Wallarm com exemplos

Preparamos exemplos de diferentes maneiras de usar o módulo Wallarm, para que você possa experimentá-lo antes de implantá-lo na produção:

* [Proxy na VPC AWS](proxy-in-aws-vpc.md)
* [Proxy para Amazon API Gateway](proxy-for-aws-api-gateway.md)

## Mais informações sobre Wallarm e Terraform

O Terraform suporta uma série de integrações (**provedores**) e configurações prontas para uso (**módulos**) disponíveis para os usuários através do registro público [registry](https://www.terraform.io/registry#navigating-the-registry), populado por vários fornecedores.

Para este registro, o Wallarm publicou:

* O [módulo Wallarm](https://registry.terraform.io/modules/wallarm/wallarm/aws/) para implantar o nó na AWS a partir do ambiente compatível com Terraform. Descrito neste artigo.
* O [provedor Wallarm](../../../../admin-en/managing/terraform-provider.md) para gerenciamento do Wallarm via Terraform.

Estes dois são elementos independentes usados para diferentes propósitos, não exigem um ao outro.