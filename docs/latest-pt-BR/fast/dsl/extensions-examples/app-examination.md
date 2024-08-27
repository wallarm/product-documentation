[img-login]:                ../../../images/fast/dsl/common/extension-examples/ojs_broken.png
[img-wireshark]:            ../../../images/fast/dsl/common/extension-examples/wireshark.png

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-ojs-install-manual]:  https://pwning.owasp-juice.shop/companion-guide/latest/part1/running.html

#   Exame da Aplicação de Amostra

!!! info "Algumas palavras sobre a aplicação"
    Este guia usa a vulnerável aplicação [OWASP Juice Shop][link-juice-shop] para demonstrar as capacidades do mecanismo de extensão FAST.
    
    Supõe-se que uma instância dessa aplicação seja acessível pelo nome de domínio `ojs.example.local`. Se um nome de domínio diferente for atribuído à aplicação implantada (veja as [instruções de instalação][link-ojs-install-manual]), por favor substitua `ojs.example.local` pelo nome de domínio apropriado.
 Para construir com sucesso uma extensão FAST, é necessário entender o mecanismo de operação da aplicação web ou API que você precisa testar quanto a vulnerabilidades (a arquitetura interna da aplicação ou API, formato de solicitação e resposta, a lógica de tratamento de exceções, etc).

Vamos fazer uma inspeção da aplicação OWASP Juice Shop para encontrar algumas maneiras potenciais de explorar vulnerabilidades.

Para fazer isso, vá para a página de login (`http://ojs.example.local/#/login`) usando um navegador, insira o símbolo `'` no campo “Email” e a senha `12345` no campo “Senha” e pressione o botão “Entrar”. Com a ajuda das ferramentas de desenvolvimento do navegador ou do software de captura de tráfego Wireshark, podemos descobrir que o uso do símbolo de apóstrofe no campo “Email” causa um erro interno no servidor.

Após analisar todas as informações da solicitação ao servidor, podemos chegar às seguintes conclusões:
* O método REST API `POST /rest/user/login` é acionado quando um usuário está tentando fazer login.
* As credenciais para o login são transferidas para este método API em formato JSON conforme mostrado abaixo.
    
    ```
    {
        "email": "'",
        "password": "12345"
    }
    ```
    
Após analisar todas as informações da resposta do servidor, podemos concluir que os valores `email` e `password` são usados na seguinte consulta SQL:

```
SELECT * FROM Users WHERE email = ''' AND password = '827ccb0eea8a706c4c34a16891f84e7b'
```
  
Portanto, podemos supor que a OWASP Juice Shop poderia ser vulnerável a ataques de injeção de SQL (SQLi) através do formulário de login.

![O formulário de login da aplicação OWASP Juice Shop][img-login]

!!! info "Explorando a vulnerabilidade"
    A vulnerabilidade explorável: SQLi.
    
    A documentação oficial explora a vulnerabilidade SQLi passando o email `'or 1=1 -- ` e qualquer senha para o formulário de login.
    
    Após este ataque, você estará logado como o administrador da aplicação web.
    
    Alternativamente, você pode usar a carga útil que contém o email do administrador existente como o valor do campo `email` (o campo `password` pode conter qualquer valor).
    
    ```
    {
        "email": "admin@juice-sh.op'--",
        "password": "12345"
    }
    ```
Para entender como detectar o caso de uma exploração de vulnerabilidade bem-sucedida, faça login no site como administrador usando os valores de email e senha mencionados acima. Intercepte a resposta do servidor API usando o aplicativo Wireshark:
* O status HTTP da resposta: `200 OK` (se houver algum problema durante o login, então o servidor responderá com o status `401 Unauthorized`). 
* A resposta do servidor em formato JSON que informa sobre uma autenticação bem-sucedida:

    ```
    {
        "authentication": {
            "token": "some long token",     # valor do token não é importante
            "bid": 1,                       # identificador do carrinho de compras do usuário
            "umail": "admin@juice-sh.op"    # o endereço de email do usuário é armazenado no parâmetro umail
        }
    }
    ```

![Interceptando a resposta do servidor API usando o aplicativo Wireshark][img-wireshark]