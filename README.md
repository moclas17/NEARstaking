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

1. Clona el repositorio:

```bash
git clone https://github.com/moclas17/NEARstaking.git
cd NEARstaking
```

2. Instala las dependencias:

```bash
npm install
```

3. Copia el archivo de configuración de ejemplo:

```bash
cp .env.example .env
```

4. (Opcional) Edita el archivo `.env` para personalizar la configuración:

```env
# NEAR Network Configuration
VITE_NETWORK=mainnet
VITE_RPC_URL=https://rpc.mainnet.near.org

# Pool Configuration
VITE_POOL_ID=frutero.pool.near
VITE_MIN_STAKE_AMOUNT=1
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

Todas las configuraciones se manejan a través del archivo `.env`:

### Variables de Entorno

- **VITE_NETWORK**: Red de NEAR (`mainnet` o `testnet`)
- **VITE_RPC_URL**: URL del nodo RPC de NEAR
- **VITE_POOL_ID**: ID del pool de staking (ej: `frutero.pool.near`)
- **VITE_MIN_STAKE_AMOUNT**: Cantidad mínima para hacer staking

### Cambiar de Mainnet a Testnet

Edita el archivo `.env`:

```env
VITE_NETWORK=testnet
VITE_RPC_URL=https://rpc.testnet.near.org
VITE_POOL_ID=pool.pool.f863973.m0
```

### Cambiar el Pool

Edita el archivo `.env`:

```env
VITE_POOL_ID=tu-pool.pool.near
```

### Usar un RPC Personalizado

Puedes usar cualquier proveedor RPC (como dRPC, Infura, etc.):

```env
VITE_RPC_URL=https://tu-rpc-provider.com/near
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
├── vite.config.js      # Configuración de Vite
├── package.json        # Dependencias y scripts
├── .env                # Variables de configuración (no versionado)
├── .env.example        # Template de configuración
├── .gitignore          # Archivos ignorados por git
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
