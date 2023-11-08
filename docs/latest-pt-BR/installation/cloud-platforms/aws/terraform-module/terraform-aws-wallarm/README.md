# Módulo Terraform AWS Wallarm

[Wallarm](https://www.wallarm.com/) é a plataforma escolhida pelas equipes de desenvolvimento, segurança e operações para criar APIs nativas de nuvem de forma segura, monitorá-las contra ameaças modernas e ser alertadas quando ameaças surgirem. Se você protege alguns dos aplicativos legados ou novas APIs nativas de nuvem, a Wallarm fornece componentes-chave para proteger seu negócio contra ameaças emergentes.

Este repositório contém o módulo para implantar o Wallarm no [AWS](https://aws.amazon.com/) usando o Terraform.

![Esquema do proxy Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Ao implementar o módulo Terraform da Wallarm, fornecemos a solução que permite duas opções principais de implantação da Wallarm: soluções de segurança de proxy e espelho. A opção de implantação é facilmente controlada pela variável de módulo `preset` da Wallarm. Você pode experimentar ambas as opções implantando [os exemplos fornecidos](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples) ou configurando o próprio módulo.

## Requisitos

* Terraform 1.0.5 ou superior [instalado localmente](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* Acesso à conta com a função de **Administrador** no Console Wallarm na [Nuvem da UE](https://my.wallarm.com/) ou na [Nuvem dos EUA](https://us1.my.wallarm.com/)
* Acesso para `https://api.wallarm.com` se estiver trabalhando com a Nuvem Wallarm da UE ou para `https://us1.api.wallarm.com` se estiver trabalhando com a Nuvem Wallarm dos EUA. Certifique-se de que o acesso não esteja bloqueado por um firewall

## Como usar este Módulo?

Este repositório tem a seguinte estrutura de pastas:

* [`módulos`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/modules): Esta pasta contém submódulos necessários para implantar o módulo Wallarm.
* [`exemplos`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples): Esta pasta mostra exemplos de diferentes maneiras de usar o módulo da pasta `módulos` para implantar a Wallarm.

Para implantar o Wallarm para produção usando este repositório:

1. Inscreva-se para o Console Wallarm na [Nuvem da UE](https://my.wallarm.com/signup) ou na [Nuvem dos EUA](https://us1.my.wallarm.com/signup).
1. Abra o Console Wallarm → **Nós** e crie o nó do tipo **Nó Wallarm**.
1. Copie o token de nó gerado.
1. Adicione o código do módulo `wallarm` à sua configuração Terraform:

    ```conf
    module "wallarm" {
      source = "wallarm/wallarm/aws"

      vpc_id     = "..."

      preset     = "proxy"
      proxy_pass = "https://..."

      host       = "api.wallarm.com" # ou "us1.api.wallarm.com"
      token      = "..."

      instance_type = "..."

      ...
    }
    ```
1. Especifique o token do nó copiado na variável `token` e configure as outras variáveis necessárias.

## Como este Módulo é mantido?

O Módulo AWS Wallarm é mantido pelo [Time Wallarm](https://www.wallarm.com/).

Se você tiver perguntas ou solicitações de recursos relacionadas ao Módulo AWS Wallarm, não hesite em enviar um email para [support@wallarm.com](mailto:support@wallarm.com?Subject=Terraform%20Module%20Question).

## Licença

Este código é liberado sob a [Licença MIT](https://github.com/wallarm/terraform-aws-wallarm/tree/main/LICENSE).

Direitos autorais &copy; 2022 Wallarm, Inc.