# Visão Geral de Multitenancy

O recurso de **multitenancy** permite o uso do Wallarm para proteger várias infraestruturas de empresas independentes ou ambientes isolados simultaneamente.

**Tenant** ([**conta de tenant**](#tenant-accounts)) representa as seguintes entidades:

* Uma empresa independente (**client**) se integrando ao Wallarm como parceiro.
* Um ambiente isolado se integrando ao Wallarm como cliente.

--8<-- "../include-pt-BR/waf/features/multi-tenancy/partner-client-term.md"

## Problemas abordados pelo multitenancy

O recurso multitenant está a resolver os seguintes problemas:

* **Tornar-se um parceiro da Wallarm**. O parceiro é uma organização que instala um nó de filtragem dentro de sua infraestrutura de sistema para fornecer aos seus clientes a mitigação de ataques.

    Cada cliente terá uma conta separada no Console Wallarm, para que todos os dados da conta sejam isolados e acessíveis apenas para usuários selecionados.
* **Isolar os dados em ambientes protegidos um do outro**. Um ambiente pode ser um aplicativo separado, um data center, API, ambiente de produção ou de teste, etc.

    Exemplos de problemas relacionados:

    * O nó Wallarm filtra solicitações enviadas para ambientes de produção e teste gerenciados por equipes isoladas. A exigência é garantir que apenas as equipes que gerenciam um determinado ambiente tenham acesso aos seus dados.
    * Os nós Wallarm são implantados em vários data centers gerenciados por equipes isoladas e localizados em diferentes regiões, um na Europa e outro na Ásia. A exigência é garantir que apenas os usuários que gerenciam um determinado data center tenham acesso aos seus dados.

    Cada cliente terá uma conta separada no Console Wallarm, para que todos os dados da conta sejam isolados e acessíveis apenas para usuários selecionados.

## Personalização de componentes Wallarm

Wallarm permite a personalização do Wallarm Console e de outros componentes. Se estiver usando multitenancy, as seguintes opções de personalização podem ser úteis:

* Marca do Console Wallarm 
* Hospedar Wallarm Console em um domínio personalizado
* Definir o endereço de e-mail para o suporte técnico receber mensagens de clientes ou colegas

## Contas de tenant

As contas de tenant são caracterizadas pelo seguinte:

* Para agrupar corretamente as contas de tenant no Wallarm Console, cada conta de tenant está ligada à conta global, indicando um parceiro ou um cliente com ambientes isolados.
* É fornecido acesso aos usuários de cada conta de tenant separadamente.
* Os dados de cada conta de tenant são isolados e acessíveis apenas aos usuários adicionados à conta.
* Os usuários com [funções](../../user-guides/settings/users.md#user-roles) **globais** podem criar novas contas de tenant e visualizar e editar todos os dados das contas de tenant.

As contas de tenant são criadas de acordo com a seguinte estrutura:

![!Estrutura de conta de locatário](../../images/partner-waf-node/accounts-scheme.png)

* A **conta global** é usada apenas para agrupar contas de tenant por um parceiro ou cliente.
* A **conta de tenant técnico** é usada para adicionar [usuários globais](../../user-guides/settings/users.md#user-roles) fornecendo-lhes acesso às contas de tenant. Usuários globais são normalmente funcionários de empresas parceiras da Wallarm ou clientes Wallarm usando multitenancy para ambientes isolados.
* As **contas de tenant** são usadas para:

    * Fornecer aos inquilinos acesso aos dados sobre ataques detectados e às configurações de filtragem de tráfego.
    * Fornecer aos usuários acesso aos dados de uma determinada conta de tenant.

[Os usuários globais](../../user-guides/settings/users.md#user-roles) podem: 

* Alternar entre contas no Console Wallarm.
* Monitorar [assinaturas e quotas](../../about-wallarm/subscription-plans.md) dos inquilinos.

![!Seletor de locatário no Console Wallarm](../../images/partner-waf-node/clients-selector-in-console.png)

* `Locatário técnico` é uma conta de locatário técnico
* `Locatário 1` e `Locatário 2` são contas de locatários

## Configuração do multitenancy

O recurso multitenancy está inativo por padrão. Para habilitar e configurar o recurso:

1. Envie a solicitação para [sales@wallarm.com](mailto:sales@wallarm.com) para adicionar o recurso **Sistema Multi-inquilino** ao seu plano de assinatura.
2. [Configure](configure-accounts.md) as contas de tenant no Console Wallarm.
3. [Implante e configure](deploy-multi-tenant-node.md) o nó Wallarm multi-inquilino.