import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Cart({ cartItems, setCartItems }) {
  const [complete, setComplete] = useState(false);

  const increaseQty = (item) => {
    if (item.product.stock == item.qty) {
      return;
    }
    const updateItems = cartItems.map((i) => {
      if (i.product._id == item.product._id) {
        i.qty++;
      }
      return i;
    });
    setCartItems(updateItems);
  };

  const decreaseQty = (item) => {
    if (item.qty > 1) {
      const updatedItems = cartItems.map((i) => {
        if (i.product._id == item.product._id) {
          i.qty--;
        }
        return i;
      });
      setCartItems(updatedItems);
    }
  };

  const removeItem = (item) => {
    const updateItems = cartItems.filter((i) => {
      if (i.product._id !== item.product._id) {
        return true;
      }
    });
    setCartItems(updateItems);
  };

  const placeOrerHandler = () => {
    fetch(import.meta.env.VITE_API_KEY + '/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartItems),
    }).then(() => {
      setCartItems([]);
      setComplete(true);
      toast.success('Order Success!');
    });
  };

  return cartItems.length > 0 ? (
    <Fragment>
      <div className='container container-fluid'>
        <h2 className='mt-5'>
          Your Cart: <b>{cartItems.length} items</b>
        </h2>

        <div className='row d-flex justify-content-between'>
          <div className='col-12 col-lg-8'>
            {cartItems.map((item) => (
              <Fragment>
                <hr />
                <div className='cart-item'>
                  <div className='row'>
                    <div className='col-4 col-lg-3'>
                      <img
                        src={item.product.images[0].image}
                        alt={item.product.name}
                        height='90'
                        width='115'
                      />
                    </div>

                    <div className='col-5 col-lg-3'>
                      <Link to={'/product/' + item.product._id}>
                        {item.product.name}
                      </Link>
                    </div>

                    <div className='col-4 col-lg-2 mt-4 mt-lg-0'>
                      <p id='card_item_price'>{item.product.price}</p>
                    </div>

                    <div className='col-4 col-lg-3 mt-4 mt-lg-0'>
                      <div className='stockCounter d-inline'>
                        <span
                          onClick={() => decreaseQty(item)}
                          className='btn btn-danger minus'
                        >
                          -
                        </span>
                        <input
                          type='number'
                          className='form-control count d-inline'
                          value={item.qty}
                          readOnly
                        />

                        <span
                          onClick={() => increaseQty(item)}
                          className='btn btn-primary plus'
                        >
                          +
                        </span>
                      </div>
                    </div>

                    <div className='col-4 col-lg-1 mt-4 mt-lg-0'>
                      <i
                        id='delete_cart_item'
                        className='fa fa-trash btn btn-danger'
                        onClick={() => removeItem(item)}
                      ></i>
                    </div>
                  </div>
                </div>
              </Fragment>
            ))}
            <hr />
          </div>

          <div className='col-12 col-lg-3 my-4'>
            <div id='order_summary'>
              <h4>Order Summary</h4>
              <hr />
              <p>
                Subtotal:{' '}
                <span className='order-summary-values'>
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)} (Units)
                </span>
              </p>
              <p>
                Est. total:{' '}
                <span className='order-summary-values'>
                  ₹
                  {cartItems
                    .reduce(
                      (acc, item) => acc + item.product.price * item.qty,
                      0
                    )
                    .toFixed(2)}
                </span>
              </p>

              <hr />
              <button
                onClick={placeOrerHandler}
                id='checkout_btn'
                className='btn btn-primary btn-block'
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  ) : !complete ? (
    <h2 className='mt-5'>Your Cart is Empty!</h2>
  ) : (
    <Fragment>
      {' '}
      <h2 className='mt-5'>Order Complete!</h2>
      <p>Your order has been placed succesfully.</p>
    </Fragment>
  );
}
