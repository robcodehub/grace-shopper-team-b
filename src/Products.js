import React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

/*
const Products = () => {
  return (
    <div>
      <h1> Products coming soon...</h1>
    </div>
  )
}

*/


class _Products extends Component {
  constructor() {
    super()
  }

  render() {
    const { products } = this.props;

    return (
      <div>
        {products.map(product => <div key={product.id}> <br/>
          Product Name: {product.productName} <br />
          Description: {product.description} <br />
          Price: ${product.price} <br />
          Amount In Stock: {product.inventory} <br/>
          Product Image: <br /> <img height="200" width="200" src={product.imageURL} /> <br />
          </div>
          )
          }
      </div>
    )

  }

}


const Products = connect(({products}) => {
  return {
    products
  }
})(_Products)



export default Products;
