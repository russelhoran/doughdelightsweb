"use server";


export async function register(prevState, queryData) {
  console.log(queryData,'queryData');
  const username = queryData.get('username');
  const password = queryData.get('password');
  if (username === "1") {
    return "Added to cart";
  } else {
    // Add a fake delay to make waiting noticeable.
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return "Couldn't add to cart: the item is sold out.";
  }
}
