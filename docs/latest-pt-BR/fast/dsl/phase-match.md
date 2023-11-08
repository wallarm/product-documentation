[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-ext-logic]:       logic.md

# A Fase de Correspondência

!!! info "Escopo da fase"  
    Esta fase é usada em uma extensão de modificação e é opcional para a sua operação (a seção `match` pode estar ausente ou presente no arquivo YAML).

    Esta fase deve estar ausente do arquivo YAML da extensão de não modificação.
    
    Leia sobre os tipos de extensões em detalhes [aqui][link-ext-logic].

!!! info "Sintaxe de descrição do elemento de solicitação"
     Ao criar uma extensão FAST, você precisa entender a estrutura da solicitação HTTP enviada para o aplicativo e da resposta HTTP recebida do aplicativo para descrever corretamente os elementos da solicitação com os quais precisa trabalhar, usando os pontos. 
    
    Para ver informações detalhadas, prossiga para este [link][link-points].

 Esta fase verifica se uma solicitação de linha de base recebida corresponde aos critérios especificados.

A seção `match` no arquivo YAML da extensão contém um array de pares `<chave: valor>`. Cada par descreve um certo elemento da solicitação (a chave) e os dados desse elemento (o valor). A chave e o valor podem conter expressões regulares no [formato de expressão regular Ruby][link-ruby-regexp].

A fase de Correspondência procura por correspondências para todos os pares `<chave: valor>` dados na solicitação de linha de base.
* A solicitação é verificada contra a presença dos elementos exigidos (por exemplo, o valor do caminho na URL, o parâmetro GET ou o cabeçalho HTTP) com os dados exigidos. 
    
    ??? info "Exemplo 1"
        `'GET_a_value': '^\d+$'` — o parâmetro GET chamado `a` com um valor contendo apenas dígitos deve estar presente na solicitação.
    
    ??? info "Exemplo 2"
        `'GET_b*_value': '.*'` — o parâmetro GET com o nome iniciado com `b`, com qualquer valor (incluindo o valor vazio), deve estar presente na solicitação.
    
* Se o valor for definido como `null` para uma determinada chave, então a ausência do elemento correspondente é verificada na solicitação.
    
    ??? info "Exemplo"
        `'GET_a': null` — o parâmetro GET chamado `a` deve estar ausente da solicitação.

Para que a solicitação de linha de base passe pela Fase de Correspondência, é necessário que a solicitação satisfaça todos os pares `<chave: valor>` na seção `match`. Se nenhuma correspondência para qualquer dos pares `<chave: valor>` descritos na seção `match` for encontrada na solicitação de linha de base, então a solicitação será descartada.

??? info "Exemplo"
   A seção `match` mostrada abaixo contém a lista dos pares `<chave: valores>`. Para que a solicitação de linha de base passe pela Fase de Correspondência, ela precisa satisfazer todos esses pares.

    ```
    match:
    - 'HEADER_HOST_value': 'example.com'
    - 'GET_password_value': '^\d+$'
    - 'HEADER_CONTENT-TYPE_value': null
    ```

    1. A solicitação de linha de base deve conter o cabeçalho HTTP chamado `Header`, com o valor contendo `example.com` como uma substring.
    2. O valor do parâmetro GET `password` deve conter apenas dígitos.
    3. O cabeçalho `Content-Type` deve estar ausente.
