[link-points]:          points/intro.md
[link-detect]:          detect/phase-detect.md
[link-collect]:         phase-collect.md
[link-match]:           phase-match.md
[link-modify]:          phase-modify.md
[link-send]:            phase-send.md
[link-generate]:        phase-generate.md
[link-extensions]:      using-extension.md
[link-ext-logic]:       logic.md
[link-vuln-list]:       ../vuln-list.md

[img-vulns]:            ../../images/fast/dsl/en/create-extension/vulnerabilities.png
[img-vuln-details]:     ../../images/fast/dsl/en/create-extension/vuln_details.png

[anchor-meta-info]:     #structure-of-the-meta-info-section

# A Criação de Extensões FAST 

!!! info "Sintaxe da descrição de elementos do pedido"
    Ao criar uma extensão FAST, é preciso entender a estrutura da solicitação HTTP enviada para a aplicação e a do retorno HTTP recebido da aplicação para poder descrever corretamente os elementos da solicitação com os quais você precisa trabalhar usando os pontos. 

    Para ver informações detalhadas, prossiga para este [link][link-points].

As extensões FAST são criadas descrevendo todas as seções necessárias para a operação da extensão no arquivo YAML correspondente. Extensões de um tipo diferente usam seus próprios conjuntos de seções ([informações detalhadas sobre os tipos de extensão][link-ext-logic]).

## As Seções em Uso

### Extensão de Modificação

Este tipo de extensão faz uso das seguintes seções:
* As seções obrigatórias:
    * `meta-info`— contém informações sobre a vulnerabilidade que deve ser descoberta pela extensão. A estrutura desta seção é descrita [abaixo][anchor-meta-info].
    * `detect` — contém uma descrição da fase Obrigatória de Detectar. Para ver informações detalhadas sobre esta fase e a estrutura da seção correspondente, prossiga para este [link][link-detect].
* As seções opcionais (podem estar ausentes):
    * `collect` — contém uma descrição da fase opcional Coletar. Para ver informações detalhadas sobre esta fase e a estrutura da seção correspondente, prossiga para este [link][link-collect].
    * `match` — contém uma descrição da fase opcional Combinar. Para ver informações detalhadas sobre esta fase e a estrutura da seção correspondente, prossiga para este [link][link-match].
    * `modify` — contém uma descrição da fase opcional Modificar. Para ver informações detalhadas sobre esta fase e a estrutura da seção correspondente, prossiga para este [link][link-modify].
    * `generate` — contém uma descrição da fase opcional Gerar. Para ver informações detalhadas sobre esta fase e a estrutura da seção correspondente, prossiga para este [link][link-generate].


### Extensão Sem Modificações

Este tipo de extensão faz uso das seguintes seções obrigatórias:
* `meta-info`— contém informações sobre a vulnerabilidade que deve ser descoberta pela extensão. A estrutura desta seção é descrita [abaixo][anchor-meta-info].
* `send` — contém solicitações de teste pré-definidas para serem enviadas a um host que está listado em uma solicitação de linha de base. Para ver informações detalhadas sobre esta fase e a estrutura da seção correspondente, prossiga para este [link][link-send].
* `detect` — contém uma descrição da fase Obrigatória de Detectar. Para ver informações detalhadas sobre esta fase e a estrutura da seção correspondente, prossiga para este [link][link-detect].

## Estrutura da seção `meta-info`

A seção informativa `meta-info` tem a seguinte estrutura:

```
meta-info:
  - title:
  - type:
  - threat:
  - description:
```

* `title` — uma string de título opcional que descreve uma vulnerabilidade. O valor especificado será mostrado na lista das vulnerabilidades detectadas na interface da web do Wallarm na coluna "Título". Pode ser usado para identificar a vulnerabilidade ou a extensão específica que detectou a vulnerabilidade.

    ??? info "Exemplo"
        `title: "Vulnerabilidade de exemplo"`

* `type` — um parâmetro obrigatório que descreve o tipo de vulnerabilidade que a extensão está tentando explorar. O valor especificado será mostrado na coluna "Tipo" da lista de vulnerabilidades detectadas na interface da web do Wallarm. O parâmetro pode assumir um dos valores que são descritos [aqui][link-vuln-list].
   
    ??? info "Exemplo"
        `type: sqli`    

* `threat` — parâmetro opcional que define o nível de ameaça da vulnerabilidade. O valor especificado será exibido graficamente na lista de vulnerabilidades detectadas na interface da web do Wallarm na coluna "Risco". O parâmetro pode ser atribuído um valor inteiro em uma faixa de 1 a 100. Quanto maior o valor, maior o nível de ameaça da vulnerabilidade. 

    ??? info "Exemplo"
        `threat: 20`
    
    ![A lista das vulnerabilidades encontradas][img-vulns]

* `description` — parâmetro de string opcional que contém a descrição da vulnerabilidade que a extensão detecta. Essa informação será mostrada na descrição detalhada da vulnerabilidade.
    
    ??? info "Exemplo"
        `description: "Uma vulnerabilidade demonstracional"`    
    
    ![Descrição detalhada da vulnerabilidade na interface da web do Wallarm][img-vuln-details]
    
!!! info "Incorporando extensões FAST"
    Para incorporar uma extensão ao FAST, você precisa montar o diretório que contém o arquivo YAML da extensão no contêiner Docker do nó FAST. Para ver informações detalhadas sobre o procedimento de montagem, navegue até este [link][link-extensions].