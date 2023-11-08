# Módulo Terraform AWS Wallarm

[Wallarm](https://www.wallarm.com/) é a plataforma de escolha das equipes Dev, Sec e Ops para a construção segura de APIs nativas na nuvem, monitorando as ameaças modernas e recebendo alertas quando ocorrem ameaças. Seja protegendo aplicativos existentes ou novas APIs nativas em nuvem, a Wallarm oferece os principais elementos necessários para proteger seu negócio das ameaças emergentes.

Este repositório contém módulos para implantar o Wallarm na [AWS](https://aws.amazon.com/) usando o Terraform.

![Esquema de proxy do Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Ao implementar os módulos Terraform da Wallarm, oferecemos uma solução que permite duas opções de implantação principais da Wallarm: proxy e espelho. As opções de implantação podem ser facilmente controladas pela variável `preset` do módulo Wallarm. Você pode experimentar ambas as opções, implantando os [exemplos fornecidos](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples) ou configurando o próprio módulo.

## Requisitos

* Terraform 1.0.5 ou superior [instalado localmente](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* Acesso a uma conta com a função **administrador** no console Wallarm e que exista na [nuvem da UE](https://my.wallarm.com/) ou na [nuvem dos EUA](https://us1.my.wallarm.com/)
* Acesso a `https://api.wallarm.com` se estiver usando o Wallarm Cloud da UE, ou `https://us1.api.wallarm.com` se estiver usando o Wallarm Cloud dos EUA. Verifique se o acesso não é bloqueado por um firewall

## Como usar este módulo?

Este repositório possui a seguinte estrutura de diretórios:

* [`modules`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/modules): Esta pasta contém os submódulos necessários para implantar o módulo Wallarm. 
* [`examples`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples): Esta pasta contém exemplos de várias maneiras de usar os módulos na pasta `modules` para implantar o Wallarm.

Para usar este repositório e implantar o Wallarm em um ambiente produção:

1. Faça login no console Wallarm na [nuvem UE](https://my.wallarm.com/signup) ou na [nuvem EUA](https://us1.my.wallarm.com/signup).
1. Abra o console Wallarm e crie um nó do tipo **Nó Wallarm** em **Nós**.
1. Copie o token do nó gerado.
1. Adicione o código do módulo `wallarm` à sua configuração do Terraform como este:

    ```conf
    module "wallarm" {
      source = "wallarm/wallarm/aws"

      vpc_id     = "..."

      preset     = "proxy"
      proxy_pass = "https://..."

      host       = "api.wallarm.com" # or "us1.api.wallarm.com"
      token      = "..."

      instance_type = "..."

      ...
    }
    ```
1. Especifique o token do nó que você copiou para a variável `token` e configure as outras variáveis necessárias.

## Como este módulo é mantido?

O módulo AWS da Wallarm é mantido pela [equipe da Wallarm](https://www.wallarm.com/).

Se você tiver perguntas ou solicitações de recursos relacionados ao módulo AWS Wallarm, sinta-se à vontade para enviar um email para [support@wallarm.com](mailto:support@wallarm.com?Subject=Terraform%20Module%20Question).

## Licença

Este código é lançado sob a [licença MIT](https://github.com/wallarm/terraform-aws-wallarm/tree/main/LICENSE).

Copyright © 2022 Wallarm, Inc.
