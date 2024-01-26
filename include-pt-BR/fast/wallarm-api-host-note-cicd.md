!!! aviso "Conectando o nó FAST a uma das nuvens Wallarm"
    Um nó FAST interage com uma das [nuvens disponíveis da Wallarm](../../cloud-list.md). Por padrão, um nó FAST trabalha com o servidor API Wallarm localizado na nuvem americana.
    
    Para instruir um nó FAST a usar o servidor API de outra nuvem, passe para o contêiner do nó a variável de ambiente `WALLARM_API_HOST` que aponta para o endereço do servidor Wallarm API necessário.
    
    Exemplo (para um nó FAST usando o servidor API localizado na nuvem européia da Wallarm):

    ```
    WALLARM_API_HOST=api.wallarm.com      
    ```