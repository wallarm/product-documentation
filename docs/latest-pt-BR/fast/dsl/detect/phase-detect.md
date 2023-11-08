[link-points]:      ../points/intro.md
[link-ext-logic]:   ../logic.md

[anchor1]:      parameters.md#oob
[anchor2]:      parameters.md#response
[anchor3]:      parameters.md#checking-the-http-statuses
[anchor4]:      parameters.md#checking-the-http-headers
[anchor5]:      parameters.md#checking-the-body-of-the-http-response
[anchor6]:      parameters.md#checking-the-html-markup


# A Fase de Detecção

!!! info "Abrangência da fase"
    Esta fase é obrigatória para qualquer tipo de extensão FAST operar (o arquivo YAML deve conter a seção `detect`).
  
    Leia sobre os tipos de extensões em detalhes [aqui][link-ext-logic].

!!! info "Sintaxe de descrição dos elementos da solicitação"
    Ao criar uma extensão FAST, você precisa entender a estrutura da solicitação HTTP enviada para a aplicação e a da resposta HTTP recebida da aplicação para descrever corretamente os elementos da solicitação com os quais deseja trabalhar usando os pontos. 

    Para ver informações detalhadas, vá para este [link][link-points].

Esta fase especifica os parâmetros a serem procurados na resposta do servidor para fazer uma conclusão sobre se uma vulnerabilidade foi explorada com sucesso por uma solicitação de teste.

A seção `detect` possui a seguinte estrutura:

```
detect:
  - oob:
    - dns
  - response:
    - status:
      - value 1
      - …
      - value S
    - headers:
      - header 1: 
        - value 1
        - …
        - value T
      - header …
      - header N:
        - value 1
        - …
        - value U
    - body:
      - html:
        - tag:
          - value 1
          - …
          - value V
        - attr:
          - value 1
          - …
          - value W
        - attribute:
          - value 1
          - …
          - value X
        - js:
          - value 1
          - …
          - value Y
        - href:
          - value 1
          - …
          - value Z
```

Esta seção contém o conjunto de parâmetros. Cada um dos parâmetros descreve um único elemento da resposta. Alguns dos parâmetros podem conter uma matriz de outros parâmetros como valor, criando uma hierarquia.

O parâmetro pode ter as seguintes características:
* Ser opcional (o parâmetro pode estar presente ou ausente da solicitação). Todos os parâmetros na seção `detect` satisfazem essa característica.
 
    !!! warning "Nota sobre os parâmetros que são obrigatórios na seção `detect`"
        Apesar do fato de que os parâmetros `oob` e `response` são opcionais, um deles deve estar presente na seção `detect`. Caso contrário, a fase de Detecção não poderá operar. A seção `detect` também pode conter esses dois parâmetros.

* Não ter um valor atribuído.  
    
    ??? info "Exemplo"
        ```
        - response
        ```    

* Ter um único valor especificado como string ou número.
    
    ??? info "Exemplo"
        ```
        - status: 500
        ```

* Ter um dos múltiplos valores atribuídos que são especificados como uma matriz de strings ou números. 
    
    ??? info "Exemplo"
        ```
            - status: 
                - 404
                - 500
        ```

* Contém outros parâmetros como valor (os parâmetros são especificados como uma matriz).
    
    ??? info "Exemplo"
        ```
            - headers: 
                - "Cookie": "example"
                - "User-Agent":
                    - "Mozilla"
                    - "Chrome"
        ```

Os valores aceitáveis para os parâmetros da seção de detecção são descritos nas seguintes seções:
* [oob][anchor1],
* [response][anchor2],
    * [status][anchor3],
    * [headers][anchor4],
    * [body][anchor5],
        * [html][anchor6],
            * attr,
            * attribute,
            * href,
            * js,
            * tag.