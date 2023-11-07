[link-trial-account]:   https://fast.wallarm.com/signup/

# Lista de Nuvens Wallarm

O FAST depende de duas nuvens para o seu funcionamento. Essas nuvens são divididas com base na localização geográfica. Elas são:
* Nuvem Americana (também conhecida como *Nuvem US*).
* Nuvem Europeia (também conhecida como *Nuvem EU*).

Durante seu funcionamento, o FAST interage com o portal Wallarm e o servidor API que estão localizados em uma das nuvens:
* Nuvem US:
    * Portal Wallarm: <https://us1.my.wallarm.com>
    * Servidor API Wallarm: `us1.api.wallarm.com`
* Nuvem EU:
    * Portal Wallarm: <https://my.wallarm.com>
    * Servidor API Wallarm: `api.wallarm.com`

!!! warning "Por favor, preste atenção"
    **Regras de interação com as nuvens Wallarm:**
        
    * Você só pode interagir com um portal Wallarm e um servidor API que estão localizados na mesma nuvem.
    * Se você criar uma [conta de teste Wallarm][link-trial-account], ela estará vinculada à nuvem americana.
        
    **Nuvens Wallarm e documentação FAST:** 

    * Por uma questão de simplicidade, assume-se em toda a documentação que o FAST interage com a nuvem Wallarm americana.
    * Todas as informações da documentação são igualmente aplicáveis a todas as nuvens disponíveis, a menos que afirmado o contrário.  
    * Se você interagir com a nuvem europeia, utilize os endereços correspondentes do portal Wallarm e do servidor API ao trabalhar com o FAST e a documentação.
