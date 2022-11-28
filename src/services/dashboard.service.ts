import orderModel from "../models/order.model";
import productModel from "../models/product.model";
import userModel from "../models/user.model";
import productService from "./product.service";

const getDashboardInfo = async () => {
  let sales = null;
  const product = await productModel.find();
  const customer = await userModel.find();
  const orders = await orderModel.find();

  const ordersSales = await orderModel.find({ status: 2 });

  const newList = [];

  if (ordersSales) {
    for (let order of ordersSales) {
      const newproducts = order.products.map(async (i: any) => {
        let newProduct = null;
        await productService.getProductById(i.productId).then((data) => {
          newProduct = data;
        });
        const curr = JSON.parse(JSON.stringify(i));
        const newData = {
          ...curr,
          productDetail: newProduct,
        };
        return newData;
      });
      const currOrder = JSON.parse(JSON.stringify(order));

      const data = await Promise.all(newproducts);

      const newOrder = {
        ...currOrder,
        products: data,
      };
      newList.push(newOrder);
    }
  }

  const totalPrice = newList.map((i) => {
    return i.products.reduce(
      (pre, cur) => pre + cur.quantity * cur.productDetail.price,
      0
    );
  });

  sales = totalPrice.reduce((pre, cur) => pre + cur, 0);

  const mounth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const order = [];
  for (let i = 0; i < mounth.length; i++) {
    const data = ordersSales.map((v) => {
      if (v.createdAt.getMonth() === mounth[i]) {
        return v.products;
      }
    });
    order.push(data);
  }

  const products = [];

  console.log("order", order);

  for (let j of order) {
    const newProduct = j.map(async (i: any) => {
      let product = null;

      // await productService.getProductById(i.productId).then((data) => {
      //   product = data;
      // });
    });
    // const data = await Promise.all(newProduct);
    // console.log("data", data);
  }
  // for (let order of orders) {
  //   const newproducts = order.products.map(async (i: any) => {
  //     let newProduct = null;
  //     await productService.getProductById(i.productId).then((data) => {
  //       newProduct = data;
  //     });
  //     const curr = JSON.parse(JSON.stringify(i));
  //     const newData = {
  //       ...curr,
  //       productDetail: newProduct,
  //     };
  //     return newData;
  //   });
  //   const currOrder = JSON.parse(JSON.stringify(order));

  //   const data = await Promise.all(newproducts);

  //   const newOrder = {
  //     ...currOrder,
  //     products: data,
  //   };
  //   products.push(newOrder);
  // }
  // console.log("products", products);

  const data = {
    product: product.length || 0,
    customer: customer.length || 0,
    orders: orders.length || 0,
    sales: sales,
  };
  return data;
};

export default {
  getDashboardInfo,
};
