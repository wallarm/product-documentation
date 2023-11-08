[link-markers]:         markers.md

[img-oob]:              ../../../images/fast/dsl/en/phases/detect/oob.png
[img-response]:         ../../../images/fast/dsl/en/phases/detect/response.png
[img-http-status]:      ../../../images/fast/dsl/en/phases/detect/http-status.png
[img-headers]:          ../../../images/fast/dsl/en/phases/detect/headers.png
[img-body]:             ../../../images/fast/dsl/en/phases/detect/body.png
[img-html]:             ../../../images/fast/dsl/en/phases/detect/html.png

[anchor1]:      #oob

#   Descrição dos Parâmetros da Fase de Detecção

!!! warning "Detectando uma vulnerabilidade na fase de detecção"
    Para detectar uma vulnerabilidade na fase de Detecção usando a resposta de um servidor, é necessário que a resposta contenha um dos elementos de resposta descritos no parâmetro `response` ou que um dos marcadores Out-of-Band DNS descritos no parâmetro `oob` seja acionado (veja as informações detalhadas sobre marcadores out-of-band [abaixo][anchor1]). Caso contrário, será considerado que nenhuma vulnerabilidade foi encontrada.

!!! info "Lógica de operação dos marcadores"
    Se a fase de Detecção detecta um marcador de qualquer payload na resposta do servidor, então o ataque é bem-sucedido, o que significa que a vulnerabilidade foi explorada com sucesso. Para ver informações detalhadas sobre a fase de Detecção operando com marcadores, prossiga para este [link][link-markers].

##  OOB

O parâmetro `oob` verifica a ativação dos marcadores Out-Of-Band pelo pedido de teste. 

![Estrutura do parâmetro `oob`][img-oob]

!!! info "Detectando o marcador OOB na resposta do servidor"
    Se o marcador OOB é detectado na resposta do servidor, então será considerado que a vulnerabilidade foi encontrada na aplicação alvo. 

* Se apenas `oob` é especificado, é esperado pelo menos um dos disparos dos marcadores Out-of-Band.
    
    ```
    - oob 
    ```

* Você também pode especificar o tipo exato de marcador Out-of-Band para verificar seu disparo.
    
    É esperado pelo menos um dos disparos dos marcadores `DNS_MARKER`:
    
    ```
    - oob:
      - dns
    ```

    !!! info "Marcadores OOB disponíveis"
        Atualmente, apenas um marcador Out-of-Band está disponível: `DNS_MARKER`.

!!! info "Mecanismo de ataque Out-of-Band"
    O mecanismo de ataque Out-of-Band (carregamento de recursos) corresponde totalmente ao seu nome. Ao realizar o ataque, o malfeitante força o servidor a baixar conteúdo malicioso da fonte externa.
    
    Por exemplo, ao realizar um ataque OOB DNS, o malfeitoante pode incorporar o nome de domínio na tag `<img>` da seguinte maneira: `<img src=http://vulnerable.example.com>`.
    
    Ao receber o pedido malicioso, o servidor resolve o nome de domínio usando DNS e acessa o recurso controlado pelo malfeitoante.

##  Resposta

Este parâmetro verifica se os elementos necessários estão presentes na resposta do servidor a um pedido de teste. Se pelo menos um desses elementos for encontrado, então será considerado que uma vulnerabilidade foi detectada.

![Estrutura do parâmetro `response`][img-response]

* A resposta deve conter qualquer marcador.
    
    ```
    - response
    ```

### Verificando os Status HTTP

![Estrutura do parâmetro `Status HTTP`][img-http-status]

* A resposta deve conter um determinado status HTTP.
    ```
    - response:
      - status: valor
    ```
    
    ??? info "Exemplo"
        `- status: 500` — o status deve ter o valor de `500`.
            
        `- status: '5\d\d'` — esta expressão regular abrange todos os status `5xx`.

* A resposta deve conter qualquer um dos status HTTP da lista.
    
    ```
    - response:
      - status:
        - valor 1
        - …
        - valor S
    ```
    
    ??? info "Exemplo"
        O status HTTP deve conter um dos seguintes valores: `500`, `404`, qualquer um dos status `2xx`.
            
        ```
            - response:
              - status:
                - '500'
                - '404'
                - '2\d\d'
        ```    

### Verificando os Cabeçalhos HTTP

![Estrutura do parâmetro `headers`][img-headers]

* Os cabeçalhos da resposta devem conter qualquer marcador.
    
    ```
    - response:
      - headers
    ```

* Os cabeçalhos da resposta devem conter certos dados (o `value` pode ser uma expressão regular).
    
    ```
    - response:
      - headers: valor
    ```
    
    ??? info "Exemplo"
        * Pelo menos um dos cabeçalhos HTTP deve conter `qwerty` como uma substring.
                
            ```
                - response:
                  - headers: "qwerty"
            ```
            
        * Esta expressão regular abrange qualquer cabeçalho que tem um valor numérico.
                
            ```
                - response:
                  - headers: '\d+'
            ```    
    
* O cabeçalho de resposta certo deve conter certos dados (o `header_#` e o `header_#_value` pode ser uma expressão regular).
    
    ```
    - response:
      - headers:
        - cabeçalho_1: valor_cabeçalho_1
        - …
        - cabeçalho_N: valor_cabeçalho_N
    ```
    
    ??? info "Exemplo"
        O cabeçalho `Cookie` deve conter o dado `uid=123`. Todos os cabeçalhos começando com `X-` não devem conter nenhum dado.
          
        ```
            - response:
              - headers: 
                - "Cookie": "uid=123"
                - 'X-': ""
        ```    
    
* Os cabeçalhos de resposta certos devem conter dados da lista especificada (o `header_#` e o `header_#_value_#` pode ser uma expressão regular).

    ```
    - response:
      - headers:
        - cabeçalho_1:
          - valor_cabeçalho_1_1
          - …
          - valor_cabeçalho_1_K
        - …
        - cabeçalho_N: 
          - valor_cabeçalho_N_1
          - …
          - valor_cabeçalho_N_K
    ```
    
    ??? info "Exemplo"
        O cabeçalho `Cookie` deve conter uma das seguintes opções de dados: `"test=qwerty"`, `"uid=123"`. Todos os cabeçalhos começando com `X-` não devem conter nenhum dado.
            
        ```
            - response:
              - headers: 
                - "Cookie": 
                  - "uid=123"
                  - "test=qwerty"
                - 'X-': "" 
        ```
    
* A fase de Detecção também pode verificar se um determinado cabeçalho está ausente da resposta do servidor. Para fazer isso, atribua `null` ao valor do determinado cabeçalho.
    
    ```
    - response:
      - headers:
        - cabeçalho_X: null
    ```

### Verificando o Corpo da Resposta HTTP

![Estrutura do parâmetro `body`][img-body]

* O corpo da resposta deve conter qualquer marcador.
    
    ```
    - response:
      - body
    ```

* O corpo da resposta deve conter certos dados (o `value` pode ser uma expressão regular).
    
    ```
    - response:
      - body: valor
    ```
    
    ??? info "Exemplo"
        O corpo da resposta deve conter a substring `STR_MARKER` ou `demo_string`.
            
        ```
            - response:
              - body: 'STR_MARKER'
              - body: 'demo_string'
        ```

### Verificando a marcação HTML

![Estrutura do parâmetro `html`][img-html]

* A marcação HTML deve conter o `STR_MARKER`.
    
    ```
    - response:
      - body:
        - html
    ```

* A tag HTML na resposta deve conter o `STR_MARKER`.
    
    ```
    - response:
      - body:
        - html:
          - tag
    ```

* A tag HTML na resposta deve conter certos dados (o `value` pode ser uma expressão regular).
    
    ```
    - response:
      - body:
        - html:
          - tag: valor
    ```
    
    ??? info "Exemplo"
        A marcação HTML da resposta deve conter a tag `a`.
            
        ```
            - response:
              - body:
                - html:
                  - tag: 'a'
        ```

* A tag HTML na resposta deve conter qualquer dado da lista especificada (o `value_#` pode ser uma expressão regular).
    
    ```
    - response:
      - body:
        - html:
          - tag: 
            - valor_1
            - …
            - valor_R
    ```
    
    ??? info "Exemplo"
        A marcação HTML da resposta deve conter uma das seguintes tags: `a`, `img`, ou `tr`.
            
        ```
            - response:
              - body:
                - html:
                  - tag:
                    - 'a'
                    - 'img'
                    - 'tr'
        ```    
    
* O atributo HTML da resposta deve conter o `STR_MARKER`.
    
    ```
    - response:
      - body:
        - html:
          - attribute
    ```

* O atributo HTML deve conter certos dados (o `value` pode ser uma expressão regular).
    
    ```
    - response:
      - body:
        - html:
          - attribute: valor
    ```
    
    ??? info "Exemplo"
        O atributo HTML da resposta deve conter `abc` como uma substring ou o marcador de cálculo.
            
        ```
            - response:
              - body:
                - html:
                  - attribute: '(abc|CALC_MARKER)'
        ```    

* O atributo HTML da resposta deve conter qualquer um dos dados da lista especificada (o `value_#` pode ser uma expressão regular):
    
    ```
    - response:
      - body:
        - html:
          - attribute: 
            - valor_1
            - …
            - valor_F
    ```
    
    ??? info "Exemplo"
        A marcação HTML deve conter um dos seguintes atributos: `src`, `id`, ou `style`.
            
        ```
            - response:
              - body:
                - html:
                  - attribute:
                    - 'src'
                    - 'id'
                    - 'style'
        ```    

!!! info "A versão abreviada do parâmetro `attribute`"
    Em vez de usar o parâmetro `attribute`, você pode usar a versão abreviada — `attr`.

* O link HREF da resposta deve conter o `STR_MARKER`.
    
    ```
    - response:
      - body:
        - html:
          - href
    ```

* O link HREF da resposta deve conter certos dados (o `value` pode ser uma expressão regular).
    
    ```
    - response:
      - body:
        - html:
          - href: valor
    ```
    
    ??? info "Exemplo"
        O link HREF deve conter o marcador DNS.
            
        ```
            - response:
              - body:
                - html:
                  - href: 'DNS_MARKER'
        ```    
    
* O link HREF da resposta deve conter qualquer dado da lista especificada (o `value_#` pode ser uma expressão regular).
    
    ```
    - response:
      - body:
        - html:
          - href: 
            - valor_1
            - …
            - valor_J
    ```
    
    ??? info "Exemplo"
        O link HREF da resposta deve conter `google` ou `cloudflare` como uma substring.
            
        ```
            - response:
              - body:
                - html:
                  - href:
                    - 'google'
                    - 'cloudflare'
        ```

* Os tokens JavaScript da resposta devem conter o `STR_MARKER`.
    
    ```
    - response:
      - body:
        - html:
          - js
    ```
    
    !!! info "Tokens JavaScript"
        O token JavaScript é qualquer script de código JavaScript que está dentro das tags `<script>` e `</script>`.
        
        Por exemplo, o seguinte script contém um token com o valor `wlrm`:
        
        ```
        <body>
            <script>
            s='123'; 
            wlrm=1;
            </script>
        </body>
        ```

* Os tokens JavaScript da resposta devem conter certos dados (o valor pode ser uma expressão regular).
    
    ```
    - response:
      - body:
        - html:
          - js: valor
    ```
    
    ??? info "Exemplo"
        O token JavaScript deve conter o valor `wlrm`.
            
        ```
            - response:
              - body:
                - html:
                  - js: 'wlrm'
        ```

* Os tokens JavaScript da resposta devem conter qualquer dado da lista especificada (o `value_#` pode ser uma expressão regular).
    
    ```
    - response:
      - body:
        - html:
          - js: 
            - valor_1
            - …
            - valor_H
    ```
    
    ??? info "Exemplo"
        O token JavaScript deve conter o valor `wlrm` ou `test`.
            
        ```
            - response:
              - body:
                - html:
                  - js:
                    - 'wlrm'
                    - 'test'
        ```