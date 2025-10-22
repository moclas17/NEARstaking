# NEAR Staking App - frutero.pool.near

Aplicación web simple para hacer staking en el nodo validador **frutero.pool.near** de NEAR Protocol.

## Características

- Conexión de wallet usando NEAR Connector
- Visualización de balances y recompensas
- Hacer staking (deposit and stake)
- Retirar staking (unstake)
- Retirar fondos disponibles (withdraw)
- Interfaz responsive y fácil de usar

## Requisitos Previos

- Node.js 16+ instalado
- Una wallet de NEAR (MyNearWallet, Meteor, etc.)
- Fondos en NEAR para hacer staking

## Instalación

1. Instala las dependencias:

```bash
npm install
```

## Uso

1. Inicia el servidor de desarrollo:

```bash
npm run dev
```

2. Abre tu navegador en la URL que muestra Vite (generalmente `http://localhost:5173`)

3. Conecta tu wallet NEAR haciendo clic en "Conectar Wallet"

4. Una vez conectado, podrás:
   - Ver tu balance disponible
   - Ver tus tokens en staking
   - Ver tus recompensas acumuladas
   - Depositar tokens para hacer staking
   - Retirar tokens del staking
   - Retirar fondos disponibles después del unstaking

## Configuración

### Cambiar de Mainnet a Testnet

Si quieres probar en testnet primero, edita el archivo `main.js`:

```javascript
const NETWORK = 'testnet'; // Cambiar de 'mainnet' a 'testnet'
```

Para testnet, usa el pool de prueba: `pool.pool.f863973.m0` o cualquier otro pool de testnet.

### Cambiar el Pool

Para usar un pool diferente, edita la constante en `main.js`:

```javascript
const POOL_ID = 'tu-pool.pool.near';
```

## Cómo Funciona el Staking

1. **Depositar y Hacer Staking**: Tus tokens se depositan en el pool y se ponen en staking automáticamente.

2. **Recompensas**: Las recompensas se acumulan automáticamente cada epoch (~12 horas) y se componen.

3. **Unstake**: Cuando quieres retirar, primero debes hacer "unstake". Los fondos estarán bloqueados durante 2-3 epochs (52-78 horas aprox.).

4. **Retirar**: Después del periodo de espera, puedes retirar tus fondos a tu wallet.

## Métodos del Pool de Staking

La aplicación usa estos métodos del contrato de staking pool:

- `deposit_and_stake()`: Deposita y hace staking de NEAR
- `unstake(amount)`: Inicia el proceso de unstaking
- `withdraw_all()`: Retira todos los fondos disponibles
- `get_account_staked_balance()`: Consulta el balance en staking
- `get_account_total_balance()`: Consulta el balance total (staking + recompensas)

## Estructura del Proyecto

```
nearstaking/
├── index.html          # Estructura HTML de la aplicación
├── main.js             # Lógica de la aplicación y conexión NEAR
├── style.css           # Estilos de la aplicación
├── package.json        # Dependencias y scripts
└── README.md           # Este archivo
```

## Seguridad

- Todas las transacciones requieren aprobación explícita en tu wallet
- Los tokens nunca salen de tu control, solo se delegan al pool
- Puedes retirar tus fondos en cualquier momento (después del periodo de unstaking)

## Recursos

- [NEAR Connector Documentation](https://docs.near.org/web3-apps/tutorials/web-login/near-connector)
- [NEAR Staking Guide](https://docs.near.org/concepts/basics/stake)
- [NEAR Pool Contract](https://github.com/near/core-contracts/tree/master/staking-pool)

## Solución de Problemas

### No se conecta la wallet

- Asegúrate de tener una wallet compatible instalada
- Verifica que estás en la red correcta (mainnet/testnet)
- Limpia el cache del navegador y vuelve a intentar

### Error al hacer staking

- Verifica que tienes suficiente balance (mínimo 1 NEAR + gas)
- Asegúrate de que el monto es mayor al mínimo requerido
- Revisa que el pool esté activo

### No puedo retirar fondos

- Los fondos unstaked requieren 2-3 epochs para estar disponibles
- Verifica que el proceso de unstake se haya completado
- Intenta usar el botón "Retirar Fondos Disponibles"

## Build para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/` y podrás desplegarlos en cualquier servicio de hosting estático.

## Licencia

MIT
