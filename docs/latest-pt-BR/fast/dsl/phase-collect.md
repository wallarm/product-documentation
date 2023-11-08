[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-ext-logic]:       logic.md

[img-collect-uniq]:    ../../images/fast/dsl/en/phases/collect-uniq.png

# A Fase de Coleta

!!! info "Escopo da fase"
    Esta fase é usada em uma extensão modificadora e é opcional para sua operação (a seção `collect` pode estar ausente ou presente no arquivo YAML).
    
    Além disso, essa fase é implicitamente usada por uma extensão não modificadora porque esse tipo de extensão faz uso da condição de unicidade.
    
    Leia sobre os tipos de extensão em detalhes [aqui][link-ext-logic].

!!! info "Sintaxe de descrição dos elementos do pedido"
    Ao criar uma extensão FAST, você precisa entender a estrutura do pedido HTTP enviado para a aplicação e a do pedido HTTP recebido da aplicação para poder descrever corretamente os elementos do pedido que você precisa trabalhar com os pontos.
    
    Para ver informações detalhadas, prossiga para este [link][link-points].

Esta fase coleta todas as solicitações de linha de base que satisfazem a condição especificada. Para tomar a decisão sobre a coleta do pedido, a fase usa a informação sobre os pedidos que já foram coletados durante a execução do teste.

O procedimento de coleta de pedidos de linha de base acontece em tempo real. Cada um dos pedidos será processado na ordem em que o nó FAST escreve os pedidos de linha de base. Não há necessidade de esperar até que o processo de escrita do pedido seja concluído para que os pedidos sejam processados e coletados pela Fase de Coleta.

## A Condição de Unicidade

A condição de unicidade não permite que aqueles pedidos de linha de base que não são únicos de acordo com os critérios especificados prossigam para processamento nas fases restantes. Nenhum pedido de teste é gerado para estas solicitações filtradas. Isso pode ser útil para redução de carga da aplicação alvo no caso que ela receba múltiplas solicitações de linha de base do mesmo tipo.

A unicidade de cada uma das solicitações recebidas é determinada com base nos dados dos pedidos que foram recebidos anteriormente.

![A Fase de Coleta com a condição de unicidade][img-collect-uniq]

A lista de elementos em um pedido que devem ser usados para determinar a unicidade do pedido de linha de base é definida na condição de unicidade.

Ao receber o pedido de linha de base, a extensão na Fase de Coleta executa as seguintes ações para cada um dos elementos do pedido na lista:
1. Se não há tal elemento no pedido de linha de base, prossiga para o próximo elemento na lista.
2. Se há tal elemento no pedido de linha de base e os dados deste elemento são únicos (em outras palavras, não correspondem a nenhum dos pedidos de linha de base recebidos anteriormente), trate este pedido de linha de base como único e transfira-o para as próximas fases. Lembre-se dos dados deste elemento do pedido.
3. Se há tal elemento no pedido de linha de base e os dados deste elemento não são únicos (em outras palavras, correspondem a um pedido de linha de base recebido anteriormente), descarte este pedido de linha de base porque ele não satisfaz a condição de unicidade. A extensão não será executada para o pedido dado.
4. Se o final da lista for alcançado e nenhum elemento do pedido que possa ser verificado para unicidade for encontrado, descarte este pedido de linha de base. A extensão não será executada para este pedido.

Você pode descrever a condição de unicidade na seção `collect` do arquivo YAML da extensão usando a lista `uniq` que contém os elementos pelos quais a unicidade do pedido de linha de base será definida.

```
collect:
  - uniq:
    - [elemento do pedido]
    - [elemento do pedido 1, elemento do pedido 2, …, elemento do pedido N]
    - testrun
```  

O elemento do pedido na lista pode conter [expressões regulares no formato de expressão regular Ruby][link-ruby-regexp].

A condição de unicidade `uniq` compreende o array dos elementos do pedido que contêm os dados que são usados para verificar a unicidade do pedido de linha de base. O parâmetro `testrun` pode ser usado também.

Os parâmetros da condição de unicidade são os seguintes:

* **`- [elemento do pedido]`**
    
    O pedido deve conter dados únicos no elemento do pedido para que o pedido seja tratado como único.
    
    ??? info "Exemplo"
        `- [GET_uid_value]` — a unicidade do pedido é definida pelos dados do parâmetro `uid` GET (em outras palavras, a extensão deve ser executada para cada um dos pedidos de linha de base com um valor único do parâmetro `uid` GET).

        * `example.com/exemplo/app.php?uid=1` é um pedido único.
        * `example.com/demo/app.php?uid=1` não é um pedido único.
        * `example.com/demo/app.php?uid=` é um pedido único.
        * `example.org/billing.php?uid=1` não é um pedido único.
        * `example.org/billing.php?uid=abc` é um pedido único.

* **`- [elemento do pedido 1, elemento do pedido 2, …, elemento do pedido N]`**
    
    O pedido deve conter o conjunto de N elementos, e os dados do elemento do pedido em cada um destes conjuntos devem ser únicos para que o pedido seja tratado como único.
    
    ??? info "Exemplo 1"
        `- [GET_uid_value, HEADER_COOKIE_value]` — a unicidade do pedido é determinada pelos dados do parâmetro `uid` GET e pelos dados do cabeçalho HTTP `Cookie` (em outras palavras, a extensão deve ser executada para cada um dos pedidos de linha de base com o valor único do parâmetro `uid` GET e do cabeçalho `Cookie`).

        * `example.org/billing.php?uid=1, Cookie: client=john` é um pedido único.
        * `example.org/billing.php?uid=1, Cookie: client=ann` é um pedido único.
        * `example.com/billing.aspx?uid=1, Cookie: client=john` não é um pedido único.
    
    ??? info "Exemplo 2"
        `- [PATH_0_value, PATH_1_value]` — defina a unicidade do pedido pelo par de primeiros e segundos elementos do caminho (em outras palavras, execute a extensão para cada um dos pedidos de linha de base com o valor único do par contendo os parâmetros `PATH_0` e `PATH_1`).
            
        Wallarm realiza a análise dos elementos do pedido durante o processamento do elemento. Para cada um dos caminhos URI na forma de `/en-us/apps/banking/`, o Path parser coloca cada um dos elementos do caminho no array PATH.
            
        Você pode acessar cada um dos valores do elemento do array usando seu índice. Para o caminho `/en-us/apps/banking/` mencionado anteriormente, o analisador fornece os seguintes dados:

        * `"PATH_0_value": "en-us"`
        * `"PATH_1_value": "apps"`
        * `"PATH_2_value": "banking"`
            
        Assim, a condição de unicidade para o `[PATH_0_value, PATH_1_value]` será satisfeita por qualquer pedido que contenha valores diferentes no primeiro e no segundo elemento do caminho.

        * `example.com/en-us/apps/banking/charge.php` é um pedido único.
        * `example.com/en-us/apps/banking/vip/charge.php` não é um pedido único.
        * `example.com/de-de/apps/banking/vip/charge.php` é um pedido único.
    
* **`- testrun`**
    
    A extensão será executada uma vez em uma execução de teste se o pedido de teste for criado com sucesso (em outras palavras, se todas as outras fases forem passadas).
    
    Por exemplo, se nenhum pedido de teste pode ser gerado com base no pedido de linha de base recebido devido aos pedidos de linha de base serem descartados na fase Match, então a extensão na fase Coleta continua a coletar os pedidos de linha de base até que um deles seja processado através da fase Match e então os pedidos de teste para a aplicação alvo são criados a partir dele.
    
    Usar qualquer um dos elementos do pedido na lista `uniq` não é permitido se você já está usando o parâmetro `testrun`. A condição de unicidade `uniq` conterá um único elemento.
    
    ```
    collect:
      - uniq:
        - testrun 
    ```
    
    Se há múltiplos elementos na lista `uniq`, então é necessário o pedido ter pelo menos um parâmetro único da lista `uniq` para definir o pedido de linha de base como único. 



!!! info "Parâmetros de fase de coleta"
    Atualmente, apenas a condição de unicidade para os pedidos de linha de base recebidos é suportada na fase de Coleta. No futuro, as funcionalidades desta fase podem ser expandidas.
    