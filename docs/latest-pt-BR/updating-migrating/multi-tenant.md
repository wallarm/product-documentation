[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png

# Atualizando o nó multilocatário

Estas instruções descrevem os passos para atualizar o nó multilocatário 4.x até 4.8.

Para atualizar o nó multilocatário fim-de-vida (3.6 ou inferior), por favor, use as [instruções diferentes](older-versions/multi-tenant.md).

## Requisitos

* Execução de comandos adicionais pelo usuário com a função **Administrador Global** adicionada sob a [conta de inquilino técnico](../installation/multi-tenant/configure-accounts.md#tenant-account-structure)
* Acesso a `https://us1.api.wallarm.com` se trabalhando com Wallarm Cloud nos EUA ou `https://api.wallarm.com` se trabalhando com Wallarm Cloud na UE. Por favor, assegure-se de que o acesso não esteja bloqueado por um firewall

## Siga o procedimento padrão de atualização

Os procedimentos padrão são para:

* [Atualizar os módulos Wallarm NGINX](nginx-modules.md)
* [Atualizar o módulo pós-análise](separate-postanalytics.md)
* [Atualizar a imagem NGINX- ou Envoy-baseada em Docker do Wallarm](docker-container.md)
* [Atualizar o controlador de entrada NGINX com módulos Wallarm integrados](ingress-controller.md)
* [Atualizar a imagem do nó na nuvem](cloud-image.md)

!!! aviso "Criando o nó multilocatário"
    Durante a criação do nó Wallarm, por favor, selecione a opção **Nó Multilocatário**:

    ![Criação de nó multilocatário](../images/user-guides/nodes/create-multi-tenant-node.png)