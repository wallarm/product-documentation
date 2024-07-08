[link-request-processing]:      request-processing.md
[link-rules-compiling]:         rules.md


# Regras do Perfil de Aplicação

Na guia *Regras*, você pode revisar e alterar as regras de manipulação de solicitações ativadas para o perfil de aplicação atual.

O perfil de aplicação é uma coleta de informações conhecidas sobre as aplicações protegidas. É usado para ajustar o comportamento do sistema durante a análise de solicitações e seu processamento adicional no módulo pós-análise, bem como na nuvem.

Para um melhor entendimento de como as regras de processamento de tráfego são aplicadas, é aconselhável aprender como o nó de filtro [analisa as solicitações][link-request-processing].

Um ponto importante sobre fazer alterações nas regras é que essas mudanças não entram em vigor imediatamente. Pode levar algum tempo para [compilar as regras][link-rules-compiling] e baixá-las nos nós de filtro.

## Terminologia

#### Ponto

Um ponto é um parâmetro de solicitação HTTP. Um parâmetro pode ser descrito com uma sequência de filtros aplicados para o processamento de solicitação, por exemplo, cabeçalhos, corpo, URL, Base64, etc. Essa sequência também é chamada de *ponto*.

Os filtros de processamento de solicitações também são chamados de analisadores.


#### Ramo de Regra

O conjunto de parâmetros de solicitação HTTP e suas condições é chamado de *ramo*. Se as condições forem cumpridas, as regras relacionadas a este ramo serão aplicadas.

Por exemplo, o ramo de regra `example.com/**/*.*` descreve as condições correspondentes a todas as solicitações para qualquer URL do domínio `example.com`.


#### Endpoint (Ramo Endpoint)
Um ramo sem ramos de regra aninhados é chamado de *ramo endpoint*. Idealmente, um endpoint de aplicação corresponde a uma função de negócios da aplicação protegida. Por exemplo, tal função de negócios como autorização pode ser um ramo de regra de endpoint de `example.com/login.php`.


#### Regra
Uma configuração de processamento de solicitações para o nó de filtro, o módulo de pós-análise, ou a nuvem é chamada de *regra*.

As regras de processamento estão ligadas aos ramos ou endpoints. Uma regra é aplicada a uma solicitação somente se a solicitação atender a todas as condições descritas no ramo.