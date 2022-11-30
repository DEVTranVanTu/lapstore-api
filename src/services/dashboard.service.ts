import notificationModel from "../models/notification.model";
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
      (pre: any, cur: any) =>
        pre +
        cur.quantity *
          (cur.productDetail.price -
            (cur.productDetail.price * cur.productDetail.discount) / 100),
      0
    );
  });

  sales = totalPrice.reduce((pre, cur) => pre + cur, 0);

  const mounth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const order = [];
  for (let i = 0; i < mounth.length; i++) {
    const data = newList.map((v) => {
      const date = new Date(v.createdAt);
      if (date.getMonth() + 1 === mounth[i]) {
        return v.products;
      }
    });
    const products = data.reduce((pre, cur) => pre.concat(cur), []);

    const sale = products.map((i: any) => {
      return i?.quantity * (i?.productDetail.price - i?.productDetail.discount);
    });

    const value = sale.reduce((pre: any, cur: any) => pre + (cur ? cur : 0), 0);

    order.push({
      mounth: mounth[i],
      value: value,
    });
  }

  let notification = [];
  await notificationModel.find().then((data) => {
    notification = data;
  });

  const data = {
    product: product.length || 0,
    customer: customer.length || 0,
    orders: orders.length || 0,
    sales: sales,
    chart: order,
    notification: notification,
  };
  return data;
};

export default {
  getDashboardInfo,
};
