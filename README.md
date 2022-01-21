MyToken "MTN" (ERC20)

Токен стандарта ERC20 

- Функционал согласно стандарта EIP-20
- Добалены функции mint и burn
- Написаны  тесты ко всем функция контракта
- Сформирован скрипт деплоя
- Контрат задеплоен в сеть Rinkeby
- Написаны таски на transfer, transferFrom, approve 
- Контракт верифицироваг

Сформированные tasks:

- npx hardhat transfer --address <address> --amount <amount of tokens>
- npx hardhat approve --address <address> --amount <amount of tokens> 
- npx hardhat transferFrom --signernumber <number from 0 to 20> --spendernumber <number from 0 to 20> --approve <amount of money> --amount <approving of amount of money>

Верифицированный контракт - https://rinkeby.etherscan.io/address/0x25389935557D78C2891FaDA1cC16F79fF03aeDF4