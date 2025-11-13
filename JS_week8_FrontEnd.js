/** 購物車相關api、監聽器與函式(& 相關Class名稱) ✅ ⏳
 * 產品列表
 * 
 * 【商品】products
 * api：取得產品列表(get)，會返還產品物件陣列  ✅apiGetProduct()
 *      執行 ## 函式：渲染前端商品清單 ✅ renderProductList(inputProductData)
 *      執行 ## 函式：渲染前端商品類別下拉選單 ✅ renderProductCategory(inputProductData)
 * 函式：渲染前端商品清單<樣板>(只需傳入.data，不需加入.product) ✅ renderProductList(inputProductData)
 * 函式：渲染前端商品類別下拉選單 ✅ renderProductCategory(inputProductData)
 * 函式：根據指定的類別，更新選中的商品清單，並渲染在前端 ✅ switchProductList(apiProductData, selectedProductCategory)
 *      執行 ## 函式：渲染前端商品清單 (根據選中的品類別) ✅
 * 監聽：切換「商品類別」✅changeProductCategory()
 *      
 * 
 * 
 * 
 * 【購物車】carts
 * api：取得購物車列表(get)，會返還<當前的>購物車物件陣列> data.carts ✅apiGetCartList()，返還 response.data 
 *      (⚠️不會主動渲染購物車!)
 * api：加入購物車(post，"productId"，"quantity")，會返還<更新後的>購物車物件陣列，並合併同商品>  ✅apiPostAddToCart(productId, quantity)，返還response.data
 *      執行 ## 函式：渲染前端購物車清單 ✅
 * api：編輯購物車產品數量(patch，購物車"id"，"quantity")，會返還<更新後的>購物車物件陣列>  ✅apiPatchProductQuantity(cartId, quantity)，返還response.data
 *      執行 ## 函式：渲染前端購物車清單
 * api：刪除購物車內全部產品(Delete)，會返還<清空後的>購物車物件陣列> ✅apiDeleteAllCart()，返還response.data (會是空陣列)
 *      執行 ## 函式：渲染前端購物車清單✅
 * api：刪除購物車內特定產品(Delete，在url後方直接加入購物車id)，會返還<更新後的>購物車物件陣列>   ✅apiDeleteCertainProduct(productId)，返還response.data
 *      執行 ## 函式：渲染前端購物車清單 ✅
 * 
 * 函式：渲染前端購物車清單<樣板> ✅ renderCartList(inputCartData)，(需input response.data)
 * 函式：購物車為空時，將清空購物車按鈕disable ✅toggleDeleteAllCart(latestCartData)
 * 函式：確認視窗 ✅showConfirmWindows(title, text, confirmText = "確認", icon = "info")
 * 監聽：點擊「加入購物車」 ✅ clickAddToCart()
 *      執行 ## api：加入購物車：✅
 *        - 已經在購物車：
 *          從當前購物車清單取得{當前數量}
 *          數量 = {當前數量} + 1 
 *        - 尚未在購物車：數量 = 1
 * 
 * 
 * 購物車內按鈕集體監聽事件：共同綁定 .shoppingCart： ✅ clickShoppingCartAction()
 * ==>{  
 * 監聽：點擊「刪除所有品項」(清空購物車) ✅ 
 *      執行 ## api：刪除購物車內全部產品 ✅
 * 監聽：點擊「刪除一筆商品」✅
 *      執行 ## api：刪除購物車內特定產品 ✅
 * 監聽：點擊「數量加減」，✅
 *      執行 ## api：編輯購物車內商品數量✅
 *      當數量為1時：執行 ## api：刪除購物車內特定產品✅
 * } 共同綁定 shoppingCart <==
 * 
 * 【訂單資訊】orders
 * api：送出購買訂單(post，傳送 user{} 物件) ✅apiPostOrder(orderName, orderTel, orderEmail, orderAddress, orderPayment)
 *      -- 購物車列表會自動清空
 *      執行 ## api：取得購物車列表(get) ✅
 *      執行 ## 函式：渲染前端購物車清單<樣板> ✅
 *      執行 ## 函式：購物車為空時，將清空購物車按鈕設為disable ✅ 
 * 監聽：送出預訂資料 (要同時 ## 清除購物車內全部產品) ✅ submitOrderFormData()
 *     先驗證購物車內是否有商品✅
 *     加入等待spinner動畫✅
 *     執行 api：送出購買訂單 ✅
 *     清除前端訂單input欄位 ✅
 */

/** 主邏輯運行順序(初始化函式)
 * 載入商品列表(預設Type為全部)，顯示商品列表於前端
 *     執行 ## api：取得產品列表 
 * 根據商品列表，顯示商品Type下拉選單內容
 * 載入當前購物車清單，顯示購物車清單於
 *     執行 ## api：取得購物車列表
 * 開啟各種監聽器函式
*/

/**練習
 * async、await
 * sweetalert2 toast 取代 console.log(error)
 * 返還的陣列利用 map 取代 forEach 直接承接樣板結果(記得join(''))
 * 加入 spinner 元件，呈現loading，避免使用者再次去觸發api
 */


/**========{全域變數}開始========== */
// api相關
// ⭐最新的api產品資訊陣列
let apiProductData; // 已經是response.data.products 商品列表形式

// ⭐最新的api購物車資訊陣列
let apiCartData; // 仍是 response.data 原始形式

const apiDomain = 'https://livejs-api.hexschool.io/api/livejs/v1/'
const apiPath = 'brice'

// 錯誤訊息吐司參數
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

// DOM相關(共用)
const productWrap =  document.querySelector('.productWrap'); // 商品列表 ul 
const productSelect =  document.querySelector('.productSelect'); // 商品類別下拉選單 select
const shoppingCartTable =  document.querySelector('.shoppingCart-table'); // 購物車表格


/**========{全域變數}結束========== */



// api：取得產品列表(get)，會返還產品物件陣列 
// 返還後已整理為 response.data.products
async function apiGetProduct(){
  const apiUrl = `${apiDomain}customer/${apiPath}/products`;

  try {
    const response = await axios.get(apiUrl);
    apiProductData = response.data.products;

    // 執行函式：渲染前端商品清單<樣板> 
    renderProductList(apiProductData); 
    renderProductCategory(apiProductData)
    return apiProductData;

  } catch (error) {

    let errorMessage = '發生未預期的錯誤';

    // 檢查是否有伺服器回傳的錯誤響應
    if (error.response) {
      // 伺服器有回傳的話，嘗試取出 error.response.data.message
      errorMessage = error.response.data.message || `API 錯誤 (狀態碼: ${error.response.status})`;
    } else if (error.request) {
      // 請求已發出但沒有收到回應 (例如：網路中斷)
      errorMessage = '網路錯誤或伺服器無回應';
    } else {
      // 發生了在設定請求時觸發的錯誤
      errorMessage = error.message;
    }

    Toast.fire({
      icon: "error",
      title: '取得產品列表失敗',
      text: errorMessage
    });
    throw error;
  }
}; // end of apiGetProduct()



// 函式：渲染前端商品清單<樣板> (傳入的形式須為response.data.products)
function renderProductList(inputProductData){ 
  productWrap.innerHTML = ''
  let productCardLiItem = '';

  inputProductData.forEach(element => {
    const {
      title,
      description,
      category,
      origin_price,
      price,
      images,
      id: productId,
    } = element;

    let newCard = `<li class="productCard">
              <h4 class="productType">新品</h4>
              <img src= ${images} alt="">
              <a href="#shoppingCart" class="addCardBtn" id = ${productId}>加入購物車</a>
              <h3>${title}</h3>
              <del class="originPrice">NT$ ${Number(origin_price).toLocaleString('en-US')}</del>
              <p class="nowPrice">NT$ ${Number(price).toLocaleString('en-US')}</p>
          </li>`
    
          productCardLiItem += newCard;
  });

  productWrap.insertAdjacentHTML('beforeend', productCardLiItem);
}; // end of renderProductList

// 函式：渲染前端商品類別下拉選單  (傳入的形式須為response.data.products)
function renderProductCategory(apiProductData){
  productSelect.innerHTML = ''
  let productSelectItems = `<option value="全部" selected>全部</option>`;
  
  // 取得產品類別的唯一值，並返還陣列 uniqueCategory
  const uniqueCategory = apiProductData.reduce((categoryList, item) => {
    if (!(categoryList.includes(item['category']))){
      categoryList.push(item['category'])
    }
    return categoryList;
  }, []);
  
  uniqueCategory.forEach(item => {
    productSelectItems += `<option value=${String(item)} >${String(item) }</option>`;
  })

  productSelect.insertAdjacentHTML('beforeend', productSelectItems); 

}; // end of  renderProductCategory(inputProductData)

// 函式：根據指定的類別，更新選中的商品清單，並渲染在前端 (傳入的形式須為response.data.products) 
function switchProductList(apiProductData, selectedProductCategory){
  let selectedProductList = [];
  if (selectedProductCategory === '全部'){
    renderProductList(apiProductData);
  } else {
    selectedProductList = apiProductData.filter(item => { 
      return item['category'] === selectedProductCategory;
    });
    renderProductList(selectedProductList);
  };  
};

// 監聽：切換「商品類別」
function changeProductCategory(){
  productSelect.addEventListener('change', event => {
    const selectedProductCategory = event.target.value;
    switchProductList(apiProductData, selectedProductCategory)
    
  })
};


// 函式：確認視窗 
async function showConfirmWindows(title, text, confirmText = "確認", icon = "info"){
    // 因為Swal.fire()是非同步，因此必須使用async

    const confirmWindow = await Swal.fire({
        title: title, // 確認視窗標題
        text: text, // 確認視窗文字
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: "brown",
        cancelButtonColor: "gray",
        confirmButtonText: confirmText,
        cancelButtonText: "取消",

        // 自定義的屬性
        customClass: {
            // 為確認按鈕附加一個自訂的 CSS 類別
            confirmButton: 'custom-confirm-button'
        }
    });
    return confirmWindow.isConfirmed;


}


// 函式：渲染前端購物車清單<樣板> (需input response.data)

function renderCartList(inputCartData){
  // 購物車列表 - 表頭
  shoppingCartTable.innerHTML = `
    <tr>
        <th width="40%">品項</th>
        <th width="15%">單價</th>
        <th width="15%">數量</th>
        <th width="15%">金額</th>
        <th width="15%"></th>
    </tr>
    `
  
  let shoppingCartList = ''

  inputCartData['carts'].forEach(item => {
    // 一個 const 可以解構內外層物件
    const {  // 解構外層屬性
      id: cartId, // 購物車資料 ID (運用別名)
      quantity,
      product: {
        title, //品項
        description,
        category,
        origin_price, 
        price, //單價
        images, // 圖片
        id: productId // 商品 ID (運用別名)
        
      }
    } = item;

    // 購物車表格 - 商品明細
    let newShoppingCartStr = `
      <tr>
        <td>
            <div class="cardItem-title ">
                <img src=${images} alt="${title}">
                <p>${title}</p>
            </div>
        </td>
        <td>NT$ ${Number(price).toLocaleString('en-US')}</td>
        <td class='cartAmount'>
          <a href="#shoppingCart"><span class="material-icons cartAmount-icon amountRemove" data-num="${quantity - 1}" id="${cartId}">-</span></a>
          <span>${Number(quantity).toLocaleString('en-US')} </span>
          <a href="#shoppingCart"><span class="material-icons cartAmount-icon amountAdd" data-num="${quantity + 1}" id="${cartId}">+</span></a>
        </td>
        <td>NT$ ${Number(price * quantity).toLocaleString('en-US')} </td>
        <td class="discardBtn">
            <a href="#" class="material-icons discardThisBtn" id = ${cartId}>
                clear
            </a>
        </td>
      </tr>
    `
    shoppingCartList  += newShoppingCartStr;

  })

  // 購物車表格 - 總價
  let shoppingCartListTotal = `
      <tr>
          <td>
              <a href="#shoppingCart" class="discardAllBtn">刪除所有品項</a>
          </td>
          <td></td>
          <td></td>
          <td>
              <p>總金額</p>
          </td>
          <td>NT$ ${Number(inputCartData['finalTotal']).toLocaleString('en-US')} </td>
      </tr>
      `
  shoppingCartList  += shoppingCartListTotal;
  shoppingCartTable.insertAdjacentHTML('beforeend', shoppingCartList );

}; //end of renderCartList(inputCartData)

// api：取得購物車列表(get)，會返還<當前的>購物車物件陣列> data.carts 
async function apiGetCartList(){
  const apiUrl = `${apiDomain}customer/${apiPath}/carts`; 
  try{
    const response = await axios.get(apiUrl);
    apiCartData = response.data;
    // renderCartList(inputCartData); // 執行渲染購物車
    return apiCartData ;


  } catch (error) {

    let errorMessage = '發生未預期的錯誤';

    // 檢查是否有伺服器回傳的錯誤響應
    if (error.response) {
      // 伺服器有回傳的話，嘗試取出 error.response.data.message
      errorMessage = error.response.data.message || `API 錯誤 (狀態碼: ${error.response.status})`;
    } else if (error.request) {
      // 請求已發出但沒有收到回應 (例如：網路中斷)
      errorMessage = '網路錯誤或伺服器無回應';
    } else {
      // 發生了在設定請求時觸發的錯誤
      errorMessage = error.message;
    }

    Toast.fire({
      icon: "error",
      title: '取得購物車列表失敗',
      text: errorMessage
    });
    throw error;
  }
}; // end of apiGetCartList()


// api：加入購物車(post，"productId"，"quantity")，會返還<更新後的>購物車物件陣列，並合併同商品> data.carts⏳
async function apiPostAddToCart(productId, quantity) {
  const apiUrl = `${apiDomain}customer/${apiPath}/carts`;
  let postData = {
    "data": {
      "productId": productId,
      "quantity": quantity
    }
  }

  if (!quantity){
    postData = {
      "data": {   
        "productId": productId,
        "quantity": 1
      }
    }
  }
  try{
    
    const response = await axios.post (apiUrl, postData);
    apiCartData = response.data;

    const productNameArray = apiProductData.find(item => item.id === productId);
    const productName = productNameArray.title;
    await renderCartList(apiCartData);
    Toast.fire({
      icon: "success",
      title: '已將下列商品加入購物車',
      text: productName
    });

    return apiCartData;
  } catch (error) {

    let errorMessage = '發生未預期的錯誤';

    // 檢查是否有伺服器回傳的錯誤響應
    if (error.response) {
      // 伺服器有回傳的話，嘗試取出 error.response.data.message
      errorMessage = error.response.data.message || `API 錯誤 (狀態碼: ${error.response.status})`;
    } else if (error.request) {
      // 請求已發出但沒有收到回應 (例如：網路中斷)
      errorMessage = '網路錯誤或伺服器無回應';
    } else {
      // 發生了在設定請求時觸發的錯誤
      errorMessage = error.message;
    }

    Toast.fire({
      icon: "error",
      title: '加入購物車失敗',
      text: errorMessage
    });
    throw error;
  }
};

// 監聽：點擊「加入購物車」 
  
function clickAddToCart(){
  // const addCardBtn = document.querySelector('.addCardBtn');
  productWrap.addEventListener('click', async event =>{
    event.preventDefault();
    const clickedElement = event.target;

    if (clickedElement.classList.contains('addCardBtn')){
      const getBtnID = clickedElement.id; // 本次商品id

      // 利用商品id查詢當前的購物車該商品數量
      const thisProduct = apiCartData["carts"].find(item => {
        return item["product"]["id"] === getBtnID;
      });
      
      if (!thisProduct){ // 未在購物車
        apiPostAddToCart(getBtnID, 1); //執行 ## api：加入購物車，數量設定1
        
      } else { // 已在購物車：從當前購物車清單取得 {當前數量}
        const currentQuantity = Number(thisProduct["quantity"]);
        apiPostAddToCart(getBtnID, currentQuantity + 1 ); // 執行 ## api：加入購物車 {當前數量} + 1
      }

    }

  })

};

// 函式：購物車為空時，將清空購物車按鈕disable 
function toggleDeleteAllCart(latestCartData){
  const discardAllBtn = document.querySelector('.discardAllBtn');
  if (!discardAllBtn) return; // 安全檢查，確保元素存在

  if (latestCartData["carts"] && latestCartData["carts"].length === 0){
    discardAllBtn.classList.add('disabled-element'); // 利用 css pointer-events: none來控制
  } else {
    discardAllBtn.classList.remove('disabled-element');
  }
};

// api：刪除購物車內全部產品(Delete)，會返還<清空後的>購物車物件陣列>，返還response.data 
async function apiDeleteAllCart(){
  const apiUrl = `${apiDomain}customer/${apiPath}/carts`;
  try{
    const response = await axios.delete(apiUrl );
    apiCartData = response.data;

    renderCartList(apiCartData); // 執行 ## 函式：渲染前端購物車清單 
    toggleDeleteAllCart(apiCartData); // 執行 ## 函式：購物車為空時，將清空購物車按鈕設為disable 
    return apiCartData;

  } catch (error) {

    let errorMessage = '發生未預期的錯誤';

    // 檢查是否有伺服器回傳的錯誤響應
    if (error.response) {
      // 伺服器有回傳的話，嘗試取出 error.response.data.message
      errorMessage = error.response.data.message || `API 錯誤 (狀態碼: ${error.response.status})`;
    } else if (error.request) {
      // 請求已發出但沒有收到回應 (例如：網路中斷)
      errorMessage = '網路錯誤或伺服器無回應';
    } else {
      // 發生了在設定請求時觸發的錯誤
      errorMessage = error.message;
    }

    Toast.fire({
      icon: "error",
      title: '刪除購物車內全部產品失敗',
      text: errorMessage
    });
    throw error;
  }
  
};

//  * api：刪除購物車內特定產品(Delete，在url後方直接加入購物車id)，會返還<更新後的>購物車物件陣列>，返還response.data
async function apiDeleteCertainProduct(cartId) {
  const apiUrl = `${apiDomain}customer/${apiPath}/carts/${cartId}`;
  try{
    const deletedCartArray = apiCartData["carts"].find(item => item["id"] === cartId);
    const deletedProductName = deletedCartArray["product"]["title"];

    const response = await axios.delete(apiUrl );
    apiCartData = response.data;

    renderCartList(apiCartData); // 執行 ## 函式：渲染前端購物車清單 
    toggleDeleteAllCart(apiCartData); // 執行 ## 函式：購物車為空時，將清空購物車按鈕設為disable 
    Toast.fire({
        icon: "success",
        title: '已成功刪除下列商品',
        text: deletedProductName
      });
    return apiCartData;

  } catch (error) {

    let errorMessage = '發生未預期的錯誤';

    // 檢查是否有伺服器回傳的錯誤響應
    if (error.response) {
      // 伺服器有回傳的話，嘗試取出 error.response.data.message
      errorMessage = error.response.data.message || `API 錯誤 (狀態碼: ${error.response.status})`;
    } else if (error.request) {
      // 請求已發出但沒有收到回應 (例如：網路中斷)
      errorMessage = '網路錯誤或伺服器無回應';
    } else {
      // 發生了在設定請求時觸發的錯誤
      errorMessage = error.message;
    }

    Toast.fire({
      icon: "error",
      title: '刪除購物車內特定產品失敗',
      text: errorMessage
    });
    throw error;
  }
  

};

//   api：編輯購物車產品數量(patch，購物車"id"，"quantity")，會返還<更新後的>購物車物件陣列> ，返還response.data
async function apiPatchProductQuantity(cartId, quantity) {
  const apiUrl = `${apiDomain}customer/${apiPath}/carts`;
  const apiData = {
    "data": {
      "id": cartId,
      "quantity": Number(quantity)
    }
  };
  try {
    console.log('正在執行編輯購物車api;')
    const response = await axios.patch(apiUrl, apiData);
    apiCartData = response.data;
    console.log('apiCartData = ', apiCartData)
    renderCartList(apiCartData); // 執行 ## 函式：渲染前端購物車清單 
    toggleDeleteAllCart(apiCartData); // 執行 ## 函式：購物車為空時，將清空購物車按鈕設為disable 
    
    return apiCartData;

  }catch (error) {

    let errorMessage = '發生未預期的錯誤';

    // 檢查是否有伺服器回傳的錯誤響應
    if (error.response) {
      // 伺服器有回傳的話，嘗試取出 error.response.data.message
      errorMessage = error.response.data.message || `API 錯誤 (狀態碼: ${error.response.status})`;
    } else if (error.request) {
      // 請求已發出但沒有收到回應 (例如：網路中斷)
      errorMessage = '網路錯誤或伺服器無回應';
    } else {
      // 發生了在設定請求時觸發的錯誤
      errorMessage = error.message;
    }

    Toast.fire({
      icon: "error",
      title: '編輯購物車產品數量失敗',
      text: errorMessage
    });
    throw error;
  }
  
};

// 購物車內按鈕集體監聽事件
  
function clickShoppingCartAction(){
  // 不直接綁定a標籤為監聽對象，因為他是透過渲染而來，有可能來不及監聽
  // 敢為綁定父元素shoppingCartTable，搭配事件委派
  
  shoppingCartTable.addEventListener('click', async event =>{
    event.preventDefault(); // 阻止a標籤的跳轉行為
    const clickedElement = event.target;

    // 監聽：點擊「刪除所有品項」(清空購物車)
    if (clickedElement.classList.contains('discardAllBtn')) {

      const isConfirmed  = await showConfirmWindows(
                '請確是否清刪除所有品項',
                `將會清空購物車所有商品，且無法復原! `,
                '確認刪除', // 點此才會讓isConfirmed成立
                'warning'
            );
      if (isConfirmed ){
        await apiDeleteAllCart(); // api：刪除購物車內全部產品(Delete)
        Toast.fire({
          icon: "success",
          title: '已清空購物車',
        });
        return; // 刪除完畢後結束函式

      }

      
    }

    // 監聽：點擊「刪除一筆商品」
    if (clickedElement.classList.contains('discardThisBtn')) {
      const cartId = clickedElement.id;

      console.log(apiCartData["carts"])

      await apiDeleteCertainProduct(cartId); // api：刪除購物車內特定產品
      return;

    }
    
    // 監聽：點擊「數量加減」，
    if (clickedElement.classList.contains('cartAmount-icon')){
      const patchQuantity = clickedElement.dataset.num;
      const cartId = clickedElement.id;

      if (Number(patchQuantity) === 0) { //     當數量為即將變為0時：執行 ## api：刪除購物車內特定產品
        apiDeleteCertainProduct(cartId);
        return;
      } else { //      執行 ## api：編輯購物車內商品數量
        apiPatchProductQuantity(cartId, patchQuantity); 
        return;
      }
    }


  })
}; // end of clickShoppingCartAction()

//  api：送出購買訂單(post，傳送 user{} 物件) 
async function apiPostOrder(orderName, orderTel, orderEmail, orderAddress, orderPayment) {
  const apiUrl = `${apiDomain}customer/${apiPath}/orders`;
  const apiData = {
    "data": {
      "user": {
        "name": orderName,
        "tel": orderTel,
        "email": orderEmail,
        "address": orderAddress,
        "payment": orderPayment
      }
    }
  };
  try {
    await axios.post(apiUrl, apiData);
    await apiGetCartList(); // 取得購物車列表(get)，會返還產品物件陣列(data)，(不會主動渲染購物車!)
    renderCartList(apiCartData); // 函式：渲染前端購物車清單<樣板>   
    toggleDeleteAllCart(apiCartData); //函式：購物車為空時，將清空購物車按鈕設為disable 
  } catch (error) {

    let errorMessage = '發生未預期的錯誤';

    // 檢查是否有伺服器回傳的錯誤響應
    if (error.response) {
      // 伺服器有回傳的話，嘗試取出 error.response.data.message
      errorMessage = error.response.data.message || `API 錯誤 (狀態碼: ${error.response.status})`;
    } else if (error.request) {
      // 請求已發出但沒有收到回應 (例如：網路中斷)
      errorMessage = '網路錯誤或伺服器無回應';
    } else {
      // 發生了在設定請求時觸發的錯誤
      errorMessage = error.message;
    }

    Toast.fire({
      icon: "error",
      title: '送出購買訂單失敗',
      text: errorMessage
    });
    throw error;
  }

}; // end of  function apiPostOrder

//  監聽：送出預訂資料 (要同時 ## 清除購物車內全部產品)  
function submitOrderFormData(){
  const orderInfoForm = document.querySelector('.orderInfo-form'); // 提交訂單表格，作為監聽對象

  orderInfoForm.addEventListener('submit', async event => {
    event.preventDefault(); // 阻止表單預設提交

    if (apiCartData["carts"].length === 0){
      Toast.fire({
          icon: "warning",
          title: '請先將產品加入購物車!',
        });
      return;
    }

    

    // 確保在事件監聽器內部取得 Spinner 元素
    const spinner = document.querySelector('.spinner-border');

    // 1. 使用 FormData 獲取訂單表格中，所有具備 name 屬性的欄位
    const formValue = new FormData(orderInfoForm); // FormData不是陣列，而是一種特殊的迭代器 (Iterator)，專為鍵/值對儲存設計

    // 2. 將 FormData 轉換為 JSON 物件
    const formValueJson = Object.fromEntries(formValue); // 會將 FormData 轉為物件型態儲存(name屬性: value值)
    
    // 解構formValueJson 
    const {
      name: orderName, 
      tel: orderTel, 
      email: orderEmail, 
      address: orderAddress, 
      payment: orderPayment
    } = formValueJson;

    if (spinner){
      spinner.style.display = 'block';
    }

    try{

      await apiPostOrder(orderName, orderTel, orderEmail, orderAddress, orderPayment); //呼叫api傳送訂單資訊

      Toast.fire({
          icon: "success",
          title: '已成功送出訂單',
        });
      // 清空訂單輸入表單
      orderInfoForm.reset();
    } finally {
      // 隱藏 Spinner
      if (spinner) {
        spinner.style.display = 'none'; // 送出後要隱藏spinner
      }
    };
    

    return;


  })

}; // end of submitOrderFormData()




/** =====主程式 + 初始化======= */
(async function() {
  // api：取得產品列表(get)
  await apiGetProduct() // 取得產品列表(get)，會返還產品物件陣列(data.product)，包含：渲染前端商品清單、渲染前端商品類別下拉選單、
  
  changeProductCategory();  // 監聽：切換「商品類別」

  await apiGetCartList(); // 取得購物車列表(get)，會返還產品物件陣列(data)，(不會主動渲染購物車!)
  
  renderCartList(apiCartData); // 利用初始呼叫購物車的結果渲染購物車

  toggleDeleteAllCart(apiCartData); // 如果初始購物車結果為空，disabled 清空購物車按鈕

  clickShoppingCartAction() // 共同綁定事件：1.監聽：點擊「刪除所有品項」(清空購物車) 2.監聽：點擊「刪除一筆商品」 3. 監聽：點擊「數量加減」，

  clickAddToCart(); // 監聽：增減購物車新增商品監聽函式

  submitOrderFormData(); //  監聽：送出預訂資料

  


})();