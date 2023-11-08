O nó de filtragem da Wallarm interage com o Wallarm Cloud. Você precisa conectar o nó à Nuvem.

Ao conectar o nó à Nuvem, você pode definir o nome do nó, sob o qual ele será exibido na interface do usuário da Console Wallarm e colocar o nó no **grupo de nó** apropriado (usado para organizar logicamente os nós na interface do usuário).

![Nós agrupados][img-grouped-nodes]

Para conectar o nó à Nuvem, use um token Wallarm do [tipo apropriado][wallarm-token-types]:

=== "Token de API"

    1. Abra Wallarm Console → **Configurações** → **Tokens de API** na [Nuvem US](https://us1.my.wallarm.com/settings/api-tokens) ou [Nuvem EU](https://my.wallarm.com/settings/api-tokens).
    1. Encontre ou crie um token de API com o papel de origem `Deploy`.
    1. Copie este token.
    1. Execute o script `register-node` em uma máquina onde você instala o nó de filtragem:

        === "Nuvem US"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
            ```
        === "Nuvem EU"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
            ```
        
        * `<TOKEN>` é o valor copiado do token de API com o papel `Deploy`.
        * `--labels 'group=<GROUP>'` o parâmetro coloca seu nó no grupo de nó `<GROUP>` (existente ou, se não existir, será criado). Se você está instalando módulos de filtragem e pós-analytics [separadamente][install-postanalytics-instr], recomenda-se colocá-los no mesmo grupo.

=== "Token de nó"

    1. Abra Wallarm Console → **Nós** na [Nuvem US](https://us1.my.wallarm.com/nodes) ou [Nuvem EU](https://my.wallarm.com/nodes).
    1. Faça uma das seguintes ações: 
        * Crie o nó do tipo **Nó Wallarm** e copie o token gerado.
        * Use o grupo de nó existente - copie o token usando o menu do nó → **Copiar token**.
    1. Execute o script `register-node` em uma máquina onde você instala o nó de filtragem:

        === "Nuvem US"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "Nuvem EU"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>` é o valor copiado do token do nó. Se você está instalando módulos de filtragem e pós-analytica [separadamente][install-postanalytics-instr], recomenda-se colocá-los no mesmo grupo usando o mesmo token de nó.

* Você pode adicionar o parâmetro `-n <HOST_NAME>` para definir um nome personalizado para sua instância de nó. O nome final da instância será: `HOST_NAME_NodeUUID`.