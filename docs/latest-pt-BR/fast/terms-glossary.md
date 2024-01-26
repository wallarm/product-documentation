[doc-points]:       dsl/points/intro.md
[doc-internals]:    operations/internals.md
[doc-policies]:     operations/test-policy/overview.md
[doc-vuln-list]:    vuln-list.md

[vuln-anomaly]:     vuln-list.md#anomaly

#   Glossário

## Vulnerabilidade

Uma vulnerabilidade é um erro cometido por negligência ou informações inadequadas ao construir ou implementar uma aplicação web que pode levar a um risco de segurança da informação.

Os riscos de segurança da informação são:

* Acesso não autorizado de dados; por exemplo, acesso para ler e modificar dados do usuário.
* Negação de serviço.
* Corrupção de dados e outros.

A vulnerabilidade não é uma característica da Internet. A vulnerabilidade é uma característica do seu sistema. A existência ou não de vulnerabilidades não depende do seu tráfego de Internet. No entanto, o tráfego da Internet pode ser usado para detectar vulnerabilidades, que é uma das funções que a Wallarm desempenha.

## Anomalia

Um [tipo][vuln-anomaly] de vulnerabilidade.

## Aplicação Alvo

Uma aplicação alvo é uma aplicação web ou uma API que deve ser testada quanto a vulnerabilidades usando o FAST.

**Veja também:** [relações entre componentes FAST][doc-internals].

##  Fonte de Requisição 

Uma fonte de requisições é uma ferramenta que testará a aplicação alvo usando solicitações HTTP e HTTPS. O FAST pode criar o conjunto de testes de segurança com base nestas requisições (veja "requisições de base").

## Conjunto de Testes de Segurança

Um conjunto de testes de segurança permite revelar vulnerabilidades na aplicação alvo.
Cada teste de segurança é composto de uma ou mais solicitações de teste.

## Solicitações de Teste

As solicitações de teste são solicitações HTTP e HTTPS a serem enviadas para a aplicação alvo. As solicitações construídas têm alta probabilidade de disparar uma vulnerabilidade.

Tais solicitações são criadas pelo FAST com base em solicitações de base que atendem à política de teste.

## Nó FAST

O nó FAST é um dos componentes do FAST.

O nó faz o proxy das solicitações HTTP e HTTPS e cria testes de segurança baseados nas solicitações de base.

Além disso, o nó FAST executa os testes de segurança. Em outras palavras, o nó envia solicitações de teste para a aplicação alvo para verificar a resposta da aplicação e determinar se existem vulnerabilidades de segurança na aplicação.

## Cloud Wallarm

O Cloud Wallarm é um dos componentes do FAST.
O cloud fornece ao usuário uma interface para criar políticas de teste, gerenciar o processo de execução do teste e observar os resultados dos testes.

**Veja também:**
* [relações entre componentes FAST][doc-internals],
* [trabalhando com políticas de teste][doc-policies].

## Solicitações de Base

As solicitações de base são solicitações HTTP e HTTPS que são direcionadas da fonte de requisições para a aplicação alvo.
O FAST cria os testes de segurança com base nessas solicitações.

Todas as solicitações não básicas, que são encaminhadas através do nó FAST, não serão usadas como fonte no processo de criação do conjunto de testes.

##  Rodada de Testes

Uma rodada de testes descreve uma única iteração do processo de teste de vulnerabilidade usando o FAST.

A rodada de testes passa uma política de testes para um nó FAST. A política define quais solicitações de base servirão como base para os testes de segurança.

Cada rodada de testes é intimamente ligada a um único nó FAST através do token.

##  Política de Teste

Uma política de teste é um conjunto de regras, segundo as quais o processo de detecção de vulnerabilidade é conduzido. Em particular, é possível selecionar os tipos de vulnerabilidade para os quais a aplicação deve ser testada. Além disso, a política determina quais parâmetros na solicitação de base são elegíveis para serem modificados durante a criação de um conjunto de testes de segurança. Esses dados são utilizados pelo nó FAST para criar solicitações de teste que serão usadas para descobrir se a aplicação alvo é explorável.

**Veja também:**
* [relações entre componentes FAST][doc-internals],
* [trabalhando com políticas de teste][doc-policies].

##  Elemento de Requisição de Base

Um elemento de requisição é uma parte de uma requisição de base.
Alguns exemplos de elementos:

* Cabeçalho HTTP, 
* Corpo da resposta HTTP, 
* Parâmetros GET, 
* Parâmetros POST.

##  Ponto

Um ponto é uma string que aponta para o elemento da requisição de base. Esta string é composta por uma sequência dos nomes dos analisadores e filtros que devem ser aplicados à requisição de base para obter os dados necessários.

Os pontos são descritos em mais detalhes [aqui][doc-points].

##  Token

Um token é o identificador secreto único que serve para os seguintes propósitos:
* Vincular uma rodada de testes com o nó FAST.
* Criar e gerenciar uma rodada de testes.

O token é uma das propriedades essenciais do nó FAST.

**Veja também:** [relações entre componentes FAST][doc-internals].