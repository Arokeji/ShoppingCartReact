import React from 'react';
import './ShoppingCart.scss';

const initValue = {
    products: [],
    lastTask: 0
}

const reducer = (state, action) => {
    const newState = {...state};

    switch (action.type) {
        case "ADDING":
            const newProduct = {
                id: state.lastTask + 1,
                name: action.limboProduct.name,
                price: action.limboProduct.price
            }
            newState.products = [...newState.products, newProduct]
            newState.lastTask = newProduct.id;
            break;
        case "DELETING":
            newState.products = newState.products.filter((product) => product.id !== action.limboProduct.id);
            break;
        default:
            console.error("La accion no esta registrada");
    }

    return newState;
}

export const ShoppingCart = () => {

    const [state, dispatch] = React.useReducer(reducer, initValue);

    const nameRef = React.useRef();
    const priceRef = React.useRef();

    const formAddProduct = React.useCallback((event) => {
        event.preventDefault();
        const limboProduct = {
            name: nameRef.current.value,
            price: priceRef.current.value
        }
        dispatch({type: "ADDING", limboProduct: limboProduct})

        nameRef.current.value = "";
        priceRef.current.value = "";
    }, [])

    const deleteProduct = React.useCallback((event, productId) => {
        event.preventDefault();
        console.log(productId);
        const limboProduct = {
            id: productId
        }
        dispatch({type: "DELETING", limboProduct: limboProduct})
    }, [])

    const getTotal = React.useMemo(() => {
        return state.products.reduce((acc, product) => acc + parseFloat(product.price), 0);
    }, [state.products]);

    return (
        <div>
            <form onSubmit={ formAddProduct }>
                <label><h1>Carrito:</h1>
                    <input 
                        ref={ nameRef }
                        type='text'
                        placeholder='Producto'
                    />
                    <input 
                        ref={ priceRef } 
                        type='number'
                        placeholder='Precio'
                    />
                    <button 
                        type='submit'
                    >Añadir</button>
                </label>
            </form>
            <div>
                <h2>Productos:</h2>
                <ul>
                    {state.products.map((product) =>
                    <li key={product.id}>
                        {product.name} | Precio: {product.price} €
                        <button onClick={(event) => deleteProduct(event, product.id)}>Eliminar</button>
                    </li>
                    )}
                </ul>
                <p>Total: { getTotal } €</p>
            </div>
        </div>   
    );
}