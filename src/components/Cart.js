import React from 'react';
import { connect } from 'react-redux';
import {
  deleteOrderProductsThunk,
  updateOrderProductThunk,
  setOrderProductsThunk,
  setOrdersThunk,
  setProductsThunk,
  setUsersThunk
} from '../redux/store';
import axios from 'axios';
import { updateOrderThunk } from '../redux/thunks';
import { Link } from 'react-router-dom'

class _Cart extends React.Component {
  constructor(props) {
    super();
    this.state = {
      id: '',
      userId: '',
      status:'',
      total:'',
      items:[]
    };
    this.deleteItem = this.deleteItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    // this.updateOrder = this.updateOrder.bind(this);
  }
  async componentDidMount(props) {
    const order = (await axios.get(`api/orders/${this.props.match.params.id}/cart`)).data;
    this.setState({
      id: order.id,
      userId: order.userId,
      status: order.status,
      total: order.total,
      items: order.items
    });
  }
  deleteItem(id) {
    this.props.deleteItem(id);
    this.setState({
      items: this.state.items.filter(item => item.id !== id)
    })
  }
  updateItem(item) {
    this.props.updateItem(item);
  }
  completeOrder(total){

    this.props.completeOrder({...this.state, total: total, status: 'completed'})
  }
  render() {
    const { id, items } = this.state;
    const { auth, orders } = this.props;
    console.log('orders', orders)
    if (id === undefined) {
      return (
        <div>
          You have no active cart at this time. If you wish to continue to shop, take a look at our {<Link to='/products'>Products</Link>}
        </div>);
    }
    const totalItems = items.reduce((sum, item) => sum + Number(item.quantity),0 );
    const itemsCount = total => {
      if (total === 1) {
        return '1 item';
      }
      if (total) {
        return `${total} items`;
      } else return '0 items';
    };
    const totalPrice = items
      .reduce((sum, item) => sum + Number(item.subTotal), 0)
      .toFixed(2);
    return id === 'undefined' ? (
      'Cart is unavailable at this time.')
    : (
      <div>
        <h1>{auth.firstName}'s Shopping Cart</h1>
        <br />
        <div id="cart">
          <div>
            Order # {id} <br />
            Order Status: In Progress...
          </div>
          <div id="cartProducts">
            {items.map(item => {
                return (
                  <div key={item.id} id="cartProduct">
                    <div>
                      <img height="150" width="150" src={item.product.imageURL} />
                    </div>
                    <div>
                      Product Name: {item.product.productName} <br />
                      Description: {item.product.description} <br />
                      Price: ${item.product.price}
                      <br />
                      Quantity {item.quantity}
                      <br />
                      {/* Change Quantity{' '}
                      <select>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                      <br /> */}
                      {item.product.inventory < 6
                        ? `Only ${item.product.inventory} left in stock - order soon`
                        : ''}
                      <br />
                      <button className="btn btn-outline-success" onClick={() => this.deleteItem(item.id)}>
                        Delete Item{' '}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div id="total">
          <div>
            Total ({itemsCount(totalItems)}
            ): ${totalPrice}
          </div>
          <button className="btn btn-outline-success" onClick={()=> this.completeOrder(totalPrice)}>
              Proceed to Checkout
          </button>
        </div>
      </div>
      );
  }
}

const mapStateToProps = ({ auth, orders }) => {
  return {
    auth,
    orders
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteItem: id => dispatch(deleteOrderProductsThunk(id)),
    updateItem:  item => dispatch(updateOrderProductThunk(item)),
    completeOrder: (order) => dispatch(updateOrderThunk(order))
  };
};

const Cart = connect(
  mapStateToProps,
  mapDispatchToProps
)(_Cart);

export default Cart;