import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import "@near-wallet-selector/modal-ui/styles.css";
import { providers, utils } from "near-api-js";

// Configuración
const POOL_ID = 'frutero.pool.near';
const NETWORK = 'mainnet'; // Cambia a 'testnet' para pruebas
const MIN_STAKE_AMOUNT = '1'; // NEAR

// Estado global
let selector;
let modal;
let accountId = null;
let provider;

// Inicializar la aplicación
async function init() {
    try {
        // Configurar el provider de NEAR
        provider = new providers.JsonRpcProvider({
            url: NETWORK === 'mainnet'
                ? 'https://rpc.mainnet.near.org'
                : 'https://rpc.testnet.near.org'
        });

        // Inicializar NEAR Wallet Selector
        selector = await setupWalletSelector({
            network: NETWORK,
            modules: [
                setupMyNearWallet(),
                setupMeteorWallet(),
                setupHereWallet()
            ],
        });

        // Configurar el modal UI
        modal = setupModal(selector, {
            contractId: POOL_ID,
        });

        // Actualizar UI con la red
        document.getElementById('network-name').textContent = NETWORK;

        // Configurar event listeners
        setupEventListeners();

        // Verificar si ya hay una wallet conectada
        const state = selector.store.getState();
        if (state.accounts.length > 0) {
            accountId = state.accounts[0].accountId;
            await updateUIAfterConnection();
        }

        // Suscribirse a cambios de estado
        selector.store.observable.subscribe(async (state) => {
            if (state.accounts.length > 0) {
                accountId = state.accounts[0].accountId;
                await updateUIAfterConnection();
            } else {
                accountId = null;
                updateUIAfterDisconnection();
            }
        });

        showMessage('Aplicación iniciada correctamente', 'success');
    } catch (error) {
        console.error('Error al inicializar:', error);
        showMessage('Error al inicializar la aplicación: ' + error.message, 'error');
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Botones de conexión
    document.getElementById('connect-btn').addEventListener('click', connectWallet);
    document.getElementById('disconnect-btn').addEventListener('click', disconnectWallet);

    // Botones de staking
    document.getElementById('stake-btn').addEventListener('click', stakeTokens);
    document.getElementById('unstake-btn').addEventListener('click', unstakeTokens);
    document.getElementById('withdraw-btn').addEventListener('click', withdrawTokens);
}

// Conectar wallet
async function connectWallet() {
    try {
        modal.show();
    } catch (error) {
        console.error('Error al conectar:', error);
        showMessage('Error al conectar wallet: ' + error.message, 'error');
    }
}

// Desconectar wallet
async function disconnectWallet() {
    try {
        const wallet = await selector.wallet();
        await wallet.signOut();
        accountId = null;
        updateUIAfterDisconnection();
        showMessage('Desconectado exitosamente', 'info');
    } catch (error) {
        console.error('Error al desconectar:', error);
        showMessage('Error al desconectar: ' + error.message, 'error');
    }
}

// Actualizar UI después de conectar
async function updateUIAfterConnection() {
    // Actualizar header
    document.getElementById('header-disconnected').style.display = 'none';
    document.getElementById('header-connected').style.display = 'flex';
    document.getElementById('header-account-id').textContent = accountId;

    // Mostrar formularios
    document.getElementById('account-info').style.display = 'block';
    document.getElementById('staking-form').style.display = 'block';
    document.getElementById('unstaking-form').style.display = 'block';

    // Cargar balances
    await loadAccountInfo();
}

// Actualizar UI después de desconectar
function updateUIAfterDisconnection() {
    // Actualizar header
    document.getElementById('header-disconnected').style.display = 'block';
    document.getElementById('header-connected').style.display = 'none';

    // Ocultar formularios
    document.getElementById('account-info').style.display = 'none';
    document.getElementById('staking-form').style.display = 'none';
    document.getElementById('unstaking-form').style.display = 'none';
}

// Cargar información de la cuenta
async function loadAccountInfo() {
    try {
        if (!accountId) {
            showMessage('Cuenta no disponible', 'error');
            return;
        }

        // Obtener balance de la cuenta con retry limitado
        try {
            const account = await provider.query({
                request_type: 'view_account',
                finality: 'optimistic',
                account_id: accountId
            });

            const availableBalance = utils.format.formatNearAmount(account.amount);
            document.getElementById('available-balance').textContent = parseFloat(availableBalance).toFixed(2) + ' NEAR';
        } catch (e) {
            console.warn('Error obteniendo balance principal:', e);
            document.getElementById('available-balance').textContent = '-- NEAR';
        }

        // Obtener balance en staking
        const stakedBalance = await getStakedBalance();
        document.getElementById('staked-balance').textContent = stakedBalance + ' NEAR';

        // Calcular recompensas
        const rewards = await getRewards();
        document.getElementById('rewards').textContent = rewards + ' NEAR';

    } catch (error) {
        console.error('Error al cargar información:', error);
        // Mostrar valores por defecto si hay error
        document.getElementById('staked-balance').textContent = '0 NEAR';
        document.getElementById('rewards').textContent = '0 NEAR';
    }
}

// Obtener balance en staking
async function getStakedBalance() {
    try {
        if (!accountId) return '0';

        const result = await provider.query({
            request_type: 'call_function',
            finality: 'optimistic',
            account_id: POOL_ID,
            method_name: 'get_account_staked_balance',
            args_base64: btoa(JSON.stringify({ account_id: accountId }))
        });

        // Decodificar resultado
        const balance = JSON.parse(new TextDecoder().decode(new Uint8Array(result.result)));
        return parseFloat(utils.format.formatNearAmount(balance)).toFixed(2);
    } catch (error) {
        console.error('Error al obtener balance en staking:', error);
        return '0';
    }
}

// Obtener recompensas
async function getRewards() {
    try {
        if (!accountId) return '0';

        const totalBalanceResult = await provider.query({
            request_type: 'call_function',
            finality: 'optimistic',
            account_id: POOL_ID,
            method_name: 'get_account_total_balance',
            args_base64: btoa(JSON.stringify({ account_id: accountId }))
        });

        const stakedBalanceResult = await provider.query({
            request_type: 'call_function',
            finality: 'optimistic',
            account_id: POOL_ID,
            method_name: 'get_account_staked_balance',
            args_base64: btoa(JSON.stringify({ account_id: accountId }))
        });

        const totalBalance = JSON.parse(new TextDecoder().decode(new Uint8Array(totalBalanceResult.result)));
        const stakedBalance = JSON.parse(new TextDecoder().decode(new Uint8Array(stakedBalanceResult.result)));

        const rewards = BigInt(totalBalance) - BigInt(stakedBalance);
        return parseFloat(utils.format.formatNearAmount(rewards.toString())).toFixed(2);
    } catch (error) {
        console.error('Error al obtener recompensas:', error);
        return '0';
    }
}

// Hacer staking
async function stakeTokens() {
    try {
        const amount = document.getElementById('stake-amount').value;

        if (!amount || parseFloat(amount) < parseFloat(MIN_STAKE_AMOUNT)) {
            showMessage(`Mínimo ${MIN_STAKE_AMOUNT} NEAR para hacer staking`, 'error');
            return;
        }

        if (!accountId) {
            showMessage('Wallet no conectada', 'error');
            return;
        }

        showMessage('Procesando transacción...', 'info');

        const wallet = await selector.wallet();

        const result = await wallet.signAndSendTransaction({
            signerId: accountId,
            receiverId: POOL_ID,
            actions: [
                {
                    type: 'FunctionCall',
                    params: {
                        methodName: 'deposit_and_stake',
                        args: {},
                        gas: '50000000000000',
                        deposit: utils.format.parseNearAmount(amount)
                    }
                }
            ]
        });

        if (result) {
            showMessage('Staking realizado exitosamente!', 'success');
            document.getElementById('stake-amount').value = '';
            await loadAccountInfo();
        }
    } catch (error) {
        console.error('Error al hacer staking:', error);
        showMessage('Error al hacer staking: ' + error.message, 'error');
    }
}

// Retirar staking (unstake)
async function unstakeTokens() {
    try {
        const amount = document.getElementById('unstake-amount').value;

        if (!amount || parseFloat(amount) <= 0) {
            showMessage('Ingresa una cantidad válida', 'error');
            return;
        }

        if (!accountId) {
            showMessage('Wallet no conectada', 'error');
            return;
        }

        showMessage('Procesando transacción...', 'info');

        const wallet = await selector.wallet();

        // Convertir el monto a yoctoNEAR (string)
        const amountInYocto = utils.format.parseNearAmount(amount);

        const result = await wallet.signAndSendTransactions({
            transactions: [
                {
                    signerId: accountId,
                    receiverId: POOL_ID,
                    actions: [
                        {
                            type: 'FunctionCall',
                            params: {
                                methodName: 'unstake',
                                args: { amount: amountInYocto },
                                gas: '50000000000000',
                                deposit: '0'
                            }
                        }
                    ]
                }
            ]
        });

        if (result) {
            showMessage('Unstake iniciado. Los fondos estarán disponibles en 2-3 epochs (~52-78 horas)', 'success');
            document.getElementById('unstake-amount').value = '';
            await loadAccountInfo();
        }
    } catch (error) {
        console.error('Error al hacer unstake:', error);
        showMessage('Error al hacer unstake: ' + error.message, 'error');
    }
}

// Retirar fondos
async function withdrawTokens() {
    try {
        if (!accountId) {
            showMessage('Wallet no conectada', 'error');
            return;
        }

        showMessage('Procesando retiro...', 'info');

        const wallet = await selector.wallet();

        const result = await wallet.signAndSendTransactions({
            transactions: [
                {
                    signerId: accountId,
                    receiverId: POOL_ID,
                    actions: [
                        {
                            type: 'FunctionCall',
                            params: {
                                methodName: 'withdraw_all',
                                args: {},
                                gas: '50000000000000',
                                deposit: '0'
                            }
                        }
                    ]
                }
            ]
        });

        if (result) {
            showMessage('Retiro exitoso!', 'success');
            setTimeout(() => loadAccountInfo(), 3000);
        }
    } catch (error) {
        console.error('Error al retirar:', error);
        showMessage('Error al retirar fondos: ' + error.message, 'error');
    }
}

// Mostrar mensajes
function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = 'message message-' + type;
    messageEl.style.display = 'block';

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// Iniciar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
