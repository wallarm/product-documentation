O nó de filtragem da Wallarm interage com a Wallarm Cloud. Você precisa conectar o nó à Cloud.

Ao conectar o nó à Cloud, você pode definir o nome do nó, sob o qual ele será exibido na UI do Console Wallarm e inserir o nó no **grupo de nós** adequado (usado para organizar logicamente os nós na UI).

![Nós agrupados][img-grouped-nodes]

Para conectar o nó à Cloud, use um token Wallarm do [tipo apropriado][wallarm-token-types]:

=== "Token API"
  
    1. Abra o Console Wallarm → **Configurações** → **Tokens API** na [Cloud US](https://us1.my.wallarm.com/settings/api-tokens) ou [Cloud EU](https://my.wallarm.com/settings/api-tokens).
    1. Encontre ou crie um token API com a função de origem `Deploy`.
    1. Copie este token.
    1. Execute o script `register-node` em uma máquina onde você instalará o nó de filtragem:

        === "Cloud US"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
            ```
        === "Cloud EU"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
            ```

        * `<TOKEN>` é o valor copiado do token API com a função `Deploy`.
        * O parâmetro `--labels 'group=<GROUP>'` coloca o seu nó no grupo de nós `<GROUP>` (existente, ou, caso não exista, ele será criado).

=== "Token do nó"

    1. Abra o Console Wallarm → **Nós** na [Cloud US](https://us1.my.wallarm.com/nodes) ou [Cloud EU](https://my.wallarm.com/nodes).
    1. Faça uma das seguintes coisas: 
        * Crie o nó do tipo **Nó Wallarm** e copie o token gerado.
        * Utilizar grupo de nós existente - copie o token usando o menu do nó → **Copiar token**.
    1. Execute o script `register-node` em uma máquina onde você instalará o nó de filtragem:

        === "Cloud US"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "Cloud EU"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>` é o valor copiado do token do nó.

* Você pode adicionar o parâmetro `-n <HOST_NAME>` para definir um nome personalizado para a sua instância de nó. O nome final da instância será: `HOST_NAME_NodeUUID`.