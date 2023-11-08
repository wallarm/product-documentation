# Configurando um Método de Falha de Segurança

Implementar um nó de filtro como um [proxy reverso](../glossary-en.md#reverse-proxy) requer que o nó de filtro esteja altamente disponível. A falha do nó de filtro, por exemplo, devido a uma queda de energia, limita a operação da aplicação web. Para garantir a alta disponibilidade do Wallarm, recomenda-se o uso de um dos métodos de falha de segurança descritos nesta seção.

Um método de falha de segurança introduz nós adicionais para os quais o tráfego é automaticamente encaminhado se o nó de filtro principal falhar.

## Falha de Segurança do Centro de Dados

Se a aplicação web e os nós de filtro estão em um centro de dados, use o serviço "IP de Falha de Segurança" do centro de dados.

## VRRP ou CARP 

Em cada nó de filtro, inicie um daemon `keepalived` ou `ucarp` que monitora a disponibilidade dos nós e começa a encaminhar o tráfego se os nós caírem. Este é um método padrão de alta disponibilidade que também pode ser usado para balanceamento de carga de tráfego, iniciando um IP de falha de segurança em cada nó e distribuindo o tráfego com balanceamento DNS.

!!! info "Trabalhando com NGINX Plus"
    O Wallarm pode ser configurado para trabalhar com o [NGINX Plus](https://www.nginx.com/products/nginx/) com um wrapper personalizado VRRP.

    A maioria das distribuições Linux, incluindo CentOS e Debian, possuem pacotes personalizados que podem instalar esta construção.
    
    Para saber sobre a instalação do Wallarm com NGINX Plus, veja as instruções detalhadas na página [«Instalação com NGINX Plus»](../installation/nginx-plus.md).

## Balanceador de Carga de Hardware L3 ou L4

Um balanceador de carga de camada 3 ou 4 é uma boa solução de alta disponibilidade.

## Balanceamento de Carga de DNS

Especifique vários endereços IP nas configurações de DNS. Embora este método tenha como alvo o balanceamento de carga, você também pode considerá-lo útil como método de alta disponibilidade.